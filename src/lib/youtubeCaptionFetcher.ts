import { DictationSentence } from './types';
import { secondsToTimeString } from './srtParser';

const INNERTUBE_CLIENT_VERSION = '20.10.38';
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'ANDROID',
    clientVersion: INNERTUBE_CLIENT_VERSION,
  },
};
const INNERTUBE_USER_AGENT = `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`;

export interface YouTubeSubtitleResult {
  success: boolean;
  videoId: string;
  title: string;
  thumbnail: string;
  englishSrt: string;
  vietnameseSrt: string;
  sentences: {
    id: number;
    startTime: number;
    endTime: number;
    english: string;
    vietnamese: string;
    words: string[];
  }[];
  hasEnglish: boolean;
  hasVietnamese: boolean;
  error?: string;
  downsubUrl?: string;
}

interface RawSegment {
  start: number;
  duration: number;
  text: string;
}

/**
 * Fetches real YouTube captions using YouTube's internal InnerTube Android API.
 * Returns both English and Vietnamese subtitles if available.
 */
export async function fetchYouTubeDualSubtitles(videoId: string): Promise<YouTubeSubtitleResult> {
  const cleanId = videoId.replace(/[^a-zA-Z0-9_-]/g, '').trim();
  const thumbnail = `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
  const downsubUrl = `https://downsub.com/lang/vi?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${cleanId}`)}`;

  try {
    // Step 1: Call InnerTube player API
    const resp = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': INNERTUBE_USER_AGENT,
      },
      body: JSON.stringify({
        context: INNERTUBE_CONTEXT,
        videoId: cleanId,
      }),
    });

    if (!resp.ok) {
      return {
        success: false,
        videoId: cleanId,
        title: `YouTube Video (${cleanId})`,
        thumbnail,
        englishSrt: '',
        vietnameseSrt: '',
        sentences: [],
        hasEnglish: false,
        hasVietnamese: false,
        error: `Không thể kết nối đến máy chủ YouTube (HTTP ${resp.status}).`,
        downsubUrl,
      };
    }

    const data = await resp.json();
    const title = data?.videoDetails?.title || `YouTube Video (${cleanId})`;
    const captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
      return {
        success: false,
        videoId: cleanId,
        title,
        thumbnail,
        englishSrt: '',
        vietnameseSrt: '',
        sentences: [],
        hasEnglish: false,
        hasVietnamese: false,
        error: 'Video này không có phụ đề trên YouTube.',
        downsubUrl,
      };
    }

    // Step 2: Tìm track tiếng Anh (ưu tiên thủ công, sau đó auto)
    const enTrack =
      captionTracks.find((t: any) => t.languageCode === 'en' && !t.kind) ||
      captionTracks.find((t: any) => t.languageCode === 'en' || t.languageCode?.startsWith('en')) ||
      captionTracks[0];

    // Tìm track tiếng Việt nếu có sẵn
    const viTrack =
      captionTracks.find((t: any) => t.languageCode === 'vi' || t.languageCode?.startsWith('vi'));

    let enSegments: RawSegment[] = [];
    let viSegments: RawSegment[] = [];

    // Tải track tiếng Anh
    if (enTrack?.baseUrl) {
      const enXmlRes = await fetch(enTrack.baseUrl, {
        headers: { 'User-Agent': INNERTUBE_USER_AGENT },
      });
      if (enXmlRes.ok) {
        const enXml = await enXmlRes.text();
        enSegments = parseAnyCaptionXml(enXml);
      }
    }

    // Tải track tiếng Việt nếu có
    if (viTrack?.baseUrl) {
      const viXmlRes = await fetch(viTrack.baseUrl, {
        headers: { 'User-Agent': INNERTUBE_USER_AGENT },
      });
      if (viXmlRes.ok) {
        const viXml = await viXmlRes.text();
        viSegments = parseAnyCaptionXml(viXml);
      }
    }

    if (enSegments.length === 0) {
      return {
        success: false,
        videoId: cleanId,
        title,
        thumbnail,
        englishSrt: '',
        vietnameseSrt: '',
        sentences: [],
        hasEnglish: false,
        hasVietnamese: false,
        error: 'Không tìm thấy nội dung phụ đề tiếng Anh hợp lệ.',
        downsubUrl,
      };
    }

    // Ghép segments tiếng Anh thành câu tự nhiên
    const mergedSentences = mergeSegmentsIntoSentences(enSegments);

    // Tự động dịch sang tiếng Việt nếu video không có sẵn subtitle tiếng Việt
    let viTranslations: string[] = [];
    if (viSegments.length === 0 && mergedSentences.length > 0) {
      const allEnglishTexts = mergedSentences.map((s) => s.text);
      viTranslations = await translateBatchToVietnamese(allEnglishTexts);
    }

    // Ghép câu tiếng Việt tương ứng
    const finalSentences = mergedSentences.map((s, idx) => {
      let viMeaning = '';
      if (viSegments.length > 0) {
        // Tìm segment tiếng Việt có timestamp gần nhất từ YouTube
        const matchedVi = viSegments.filter(
          (v) => (v.start >= s.startTime - 0.5 && v.start <= s.endTime) ||
                 (v.start + v.duration >= s.startTime && v.start <= s.endTime)
        );
        if (matchedVi.length > 0) {
          viMeaning = matchedVi.map((v) => v.text).join(' ').trim();
        }
      } else if (viTranslations[idx]) {
        viMeaning = viTranslations[idx];
      }

      return {
        id: idx + 1,
        startTime: s.startTime,
        endTime: s.endTime,
        english: s.text,
        vietnamese: viMeaning,
        words: s.text.split(/\s+/).filter(Boolean),
      };
    });

    // Tạo nội dung file SRT tiếng Anh
    const englishSrt = finalSentences
      .map((s, idx) => {
        const start = secondsToTimeString(s.startTime);
        const end = secondsToTimeString(s.endTime);
        return `${idx + 1}\n${start} --> ${end}\n${s.english}`;
      })
      .join('\n\n');

    // Tạo nội dung file SRT tiếng Việt nếu có
    const hasVietnamese = finalSentences.some((s) => s.vietnamese && s.vietnamese.length > 0);
    const vietnameseSrt = hasVietnamese
      ? finalSentences
          .map((s, idx) => {
            const start = secondsToTimeString(s.startTime);
            const end = secondsToTimeString(s.endTime);
            return `${idx + 1}\n${start} --> ${end}\n${s.vietnamese || s.english}`;
          })
          .join('\n\n')
      : '';

    return {
      success: true,
      videoId: cleanId,
      title,
      thumbnail,
      englishSrt,
      vietnameseSrt,
      sentences: finalSentences,
      hasEnglish: true,
      hasVietnamese,
      downsubUrl,
    };
  } catch (error: any) {
    console.error('[YouTubeSubtitles] Lỗi:', error);
    return {
      success: false,
      videoId: cleanId,
      title: `YouTube Video (${cleanId})`,
      thumbnail,
      englishSrt: '',
      vietnameseSrt: '',
      sentences: [],
      hasEnglish: false,
      hasVietnamese: false,
      error: error.message || 'Lỗi khi tải phụ đề từ YouTube',
      downsubUrl,
    };
  }
}

/**
 * Tương thích ngược: gọi fetchYouTubeCaptions trả về DictationSentence[]
 */
export async function fetchYouTubeCaptions(videoId: string): Promise<DictationSentence[]> {
  const res = await fetchYouTubeDualSubtitles(videoId);
  if (!res.success) return [];
  return res.sentences.map((s) => ({
    id: `s-${s.id}`,
    startTime: s.startTime,
    endTime: s.endTime,
    text: s.english,
    phonetic: '',
    vietnameseMeaning: s.vietnamese,
  }));
}

/**
 * Parse cả định dạng srv3 (<p t="..." d="...">) và classic (<text start="..." dur="...">)
 */
function parseAnyCaptionXml(xml: string): RawSegment[] {
  const segments: RawSegment[] = [];

  // Format 1: srv3 (<p t="160" d="5719">...<s>text</s>...</p>)
  const pRegex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
  let pMatch;
  while ((pMatch = pRegex.exec(xml)) !== null) {
    const startMs = parseInt(pMatch[1], 10);
    const durMs = parseInt(pMatch[2], 10);
    const inner = pMatch[3];

    let text = inner.replace(/<s[^>]*>/g, '').replace(/<\/s>/g, '').replace(/<[^>]+>/g, '');
    text = decodeXml(text);

    if (text) {
      segments.push({
        start: startMs / 1000,
        duration: durMs / 1000,
        text,
      });
    }
  }

  if (segments.length > 0) return segments;

  // Format 2: classic (<text start="0.16" dur="5.71">content</text>)
  const textRegex = /<text\s+start="([\d.]+)"\s+dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
  let textMatch;
  while ((textMatch = textRegex.exec(xml)) !== null) {
    const start = parseFloat(textMatch[1]);
    const duration = parseFloat(textMatch[2]);
    const text = decodeXml(textMatch[3]);

    if (text) {
      segments.push({ start, duration, text });
    }
  }

  return segments;
}

function decodeXml(str: string): string {
  return (str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, ' ')
    .trim();
}

/**
 * Ghép các cụm phụ đề ngắn thành câu trọn vẹn (khoảng 4-8 giây/câu)
 */
function mergeSegmentsIntoSentences(segments: RawSegment[]): { startTime: number; endTime: number; text: string }[] {
  if (segments.length === 0) return [];

  const sentences: { startTime: number; endTime: number; text: string }[] = [];
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
      const isTooLong = mergedDuration > 8;

      if ((endsWithSentenceBreak && mergedDuration >= 3.5) || isTooLong) {
        sentences.push({
          startTime: Math.round(currentStart * 100) / 100,
          endTime: Math.round(currentEnd * 100) / 100,
          text: currentText.trim(),
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

  if (currentText.trim()) {
    sentences.push({
      startTime: Math.round(currentStart * 100) / 100,
      endTime: Math.round(currentEnd * 100) / 100,
      text: currentText.trim(),
    });
  }

  return sentences;
}

/**
 * Tự động dịch danh sách câu tiếng Anh sang tiếng Việt theo từng đợt (Batch translation)
 */
async function translateBatchToVietnamese(texts: string[]): Promise<string[]> {
  const chunkSize = 25;
  const results: string[] = [];

  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunk = texts.slice(i, i + chunkSize);
    try {
      const joined = chunk.join('\n');
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(joined)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (res.ok) {
        const data = await res.json();
        const fullTranslated = (data[0] || []).map((item: any) => item[0] || '').join('');
        const lines = fullTranslated.split('\n');
        for (let j = 0; j < chunk.length; j++) {
          results.push(lines[j]?.trim() || '');
        }
      } else {
        for (let j = 0; j < chunk.length; j++) results.push('');
      }
    } catch {
      for (let j = 0; j < chunk.length; j++) results.push('');
    }
  }

  return results;
}

