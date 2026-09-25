import { DictationSentence } from './types';

/**
 * Fetches real YouTube captions/subtitles using YouTube's internal InnerTube API.
 * This works server-side without any API key.
 */
export async function fetchYouTubeCaptions(videoId: string): Promise<DictationSentence[]> {
  try {
    // Step 1: Get video page HTML to extract the initial player response
    const pageHtml = await fetchVideoPage(videoId);
    if (!pageHtml) return [];

    // Step 2: Extract caption tracks from the initial player response
    const captionUrl = extractCaptionUrl(pageHtml);
    if (!captionUrl) {
      console.warn('[CaptionFetcher] No captions found in video page');
      return [];
    }

    // Step 3: Fetch the raw caption XML
    const captionXml = await fetchCaptionXml(captionUrl);
    if (!captionXml) return [];

    // Step 4: Parse XML into segments
    const segments = parseCaptionXml(captionXml);
    if (segments.length === 0) return [];

    // Step 5: Merge short segments into natural sentences
    return mergeSegmentsIntoSentences(segments);
  } catch (error) {
    console.error('[CaptionFetcher] Error:', error);
    return [];
  }
}

/**
 * Fetches YouTube video page HTML using a browser-like request
 */
async function fetchVideoPage(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
      },
    });

    if (!res.ok) {
      console.warn(`[CaptionFetcher] Video page fetch failed: ${res.status}`);
      return null;
    }

    return await res.text();
  } catch (error) {
    console.warn('[CaptionFetcher] Failed to fetch video page:', error);
    return null;
  }
}

/**
 * Extracts caption base URL from the YouTube video page HTML
 */
function extractCaptionUrl(html: string): string | null {
  // Try to find captionTracks in the player response
  const patterns = [
    /"captionTracks"\s*:\s*(\[[\s\S]*?\])/,
    /captionTracks\\?":\s*(\[[\s\S]*?\])/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      try {
        // Clean escaped quotes if needed
        let jsonStr = match[1];
        if (jsonStr.includes('\\u0026')) {
          jsonStr = jsonStr.replace(/\\u0026/g, '&');
        }
        if (jsonStr.includes('\\"')) {
          jsonStr = jsonStr.replace(/\\"/g, '"');
        }

        const tracks = JSON.parse(jsonStr);
        if (Array.isArray(tracks) && tracks.length > 0) {
          // Prefer English manual captions, then auto-generated, then first available
          const englishManual = tracks.find((t: any) => t.languageCode === 'en' && !t.kind);
          const englishAuto = tracks.find((t: any) => t.languageCode === 'en');
          const anyTrack = tracks[0];

          const track = englishManual || englishAuto || anyTrack;
          if (track?.baseUrl) {
            let url = track.baseUrl;
            // Unescape URL
            url = url.replace(/\\u0026/g, '&').replace(/\\\//g, '/');
            return url;
          }
        }
      } catch (e) {
        console.warn('[CaptionFetcher] JSON parse error:', e);
      }
    }
  }

  // Alternative: try to find timedtext URL directly
  const timedtextMatch = html.match(/"(https?:\/\/www\.youtube\.com\/api\/timedtext[^"]+)"/);
  if (timedtextMatch) {
    let url = timedtextMatch[1];
    url = url.replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    return url;
  }

  return null;
}

/**
 * Fetches the caption XML from the given URL
 */
async function fetchCaptionXml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/xml, application/xml, */*',
      },
    });

    if (!res.ok) {
      console.warn(`[CaptionFetcher] Caption XML fetch failed: ${res.status}`);
      return null;
    }

    return await res.text();
  } catch (error) {
    console.warn('[CaptionFetcher] Failed to fetch caption XML:', error);
    return null;
  }
}

interface RawSegment {
  start: number;
  duration: number;
  text: string;
}

/**
 * Parses YouTube caption XML format into raw segments
 */
function parseCaptionXml(xml: string): RawSegment[] {
  const segments: RawSegment[] = [];

  // Handle both standard XML and JSON formats
  if (xml.trim().startsWith('{') || xml.trim().startsWith('[')) {
    // JSON format (timedtext API v3)
    try {
      const data = JSON.parse(xml);
      const events = data.events || [];
      for (const event of events) {
        if (event.segs && event.tStartMs !== undefined) {
          const text = event.segs.map((s: any) => s.utf8 || '').join('').trim();
          if (text && text !== '\n') {
            segments.push({
              start: (event.tStartMs || 0) / 1000,
              duration: (event.dDurationMs || 2000) / 1000,
              text,
            });
          }
        }
      }
    } catch {
      console.warn('[CaptionFetcher] JSON caption parse failed');
    }
    return segments;
  }

  // Standard XML format
  const regex = /<text\s+start="([\d.]+)"\s+dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const start = parseFloat(match[1]);
    const duration = parseFloat(match[2]);
    let text = match[3]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]*>/g, '') // Strip nested HTML tags
      .replace(/\n/g, ' ')
      .trim();

    if (text) {
      segments.push({ start, duration, text });
    }
  }

  return segments;
}

/**
 * Merges short caption segments into natural sentence-length blocks.
 * Target: 4-10 seconds per sentence, breaks at punctuation.
 */
function mergeSegmentsIntoSentences(segments: RawSegment[]): DictationSentence[] {
  if (segments.length === 0) return [];

  const sentences: DictationSentence[] = [];
  let currentText = '';
  let currentStart = segments[0].start;
  let currentEnd = segments[0].start + segments[0].duration;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segEnd = seg.start + seg.duration;

    if (currentText === '') {
      currentText = seg.text;
      currentStart = seg.start;
      currentEnd = segEnd;
    } else {
      const mergedDuration = segEnd - currentStart;
      const endsWithSentenceBreak = /[.!?]$/.test(currentText.trim());
      const isTooLong = mergedDuration > 10;

      if ((endsWithSentenceBreak && mergedDuration >= 3) || isTooLong) {
        sentences.push({
          id: `s-${sentences.length + 1}`,
          startTime: Math.round(currentStart * 10) / 10,
          endTime: Math.round(currentEnd * 10) / 10,
          text: currentText.trim(),
          phonetic: '',
          vietnameseMeaning: '',
        });
        currentText = seg.text;
        currentStart = seg.start;
        currentEnd = segEnd;
      } else {
        currentText += ' ' + seg.text;
        currentEnd = segEnd;
      }
    }
  }

  // Don't forget the last sentence
  if (currentText.trim()) {
    sentences.push({
      id: `s-${sentences.length + 1}`,
      startTime: Math.round(currentStart * 10) / 10,
      endTime: Math.round(currentEnd * 10) / 10,
      text: currentText.trim(),
      phonetic: '',
      vietnameseMeaning: '',
    });
  }

  return sentences;
}
