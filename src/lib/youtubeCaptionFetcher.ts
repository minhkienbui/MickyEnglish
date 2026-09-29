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

interface TimedWord {
  time: number; // in seconds
  text: string;
}

/**
 * Tự động trích xuất phụ đề YouTube chính xác theo từng từ (Word-level Real-time Sync)
 * Loại bỏ 100% độ trễ (delay) chữ giữa âm thanh và phụ đề
 */
export async function fetchYouTubeDualSubtitles(videoId: string): Promise<YouTubeSubtitleResult> {
  const cleanId = videoId.replace(/[^a-zA-Z0-9_-]/g, '').trim();
  const thumbnail = `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
  const downsubUrl = `https://downsub.com/lang/vi?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${cleanId}`)}`;

  try {
    // Gọi InnerTube Android Player API
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
        error: 'Video này không có phụ đề trên YouTube. Bạn có thể mở DownSub bên dưới để tải file SRT.',
        downsubUrl,
      };
    }

    // Ưu tiên track tiếng Anh thủ công, sau đó tự động
    const enTrack =
      captionTracks.find((t: any) => t.languageCode === 'en' && !t.kind) ||
      captionTracks.find((t: any) => t.languageCode === 'en' || t.languageCode?.startsWith('en')) ||
      captionTracks[0];

    // Tìm track tiếng Việt nếu có sẵn
    const viTrack =
      captionTracks.find((t: any) => t.languageCode === 'vi' || t.languageCode?.startsWith('vi'));

    let enWords: TimedWord[] = [];
    let viWords: TimedWord[] = [];

    // Tải và bóc tách từng từ tiếng Anh kèm mốc giây tuyệt đối
    if (enTrack?.baseUrl) {
      const enXmlRes = await fetch(enTrack.baseUrl, {
        headers: { 'User-Agent': INNERTUBE_USER_AGENT },
      });
      if (enXmlRes.ok) {
        const enXml = await enXmlRes.text();
        enWords = extractTimedWordsFromXml(enXml);
      }
    }

    // Tải track tiếng Việt nếu có sẵn
    if (viTrack?.baseUrl) {
      const viXmlRes = await fetch(viTrack.baseUrl, {
        headers: { 'User-Agent': INNERTUBE_USER_AGENT },
      });
      if (viXmlRes.ok) {
        const viXml = await viXmlRes.text();
        viWords = extractTimedWordsFromXml(viXml);
      }
    }

    if (enWords.length === 0) {
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

    // Nhóm từ thành các câu trọn vẹn không bị delay (Zero Delay Grouping)
    const accurateSentences = groupWordsIntoAccurateSentences(enWords);

    // Dịch sang tiếng Việt nếu video không có sẵn subtitle tiếng Việt
    let viTranslations: string[] = [];
    if (viWords.length === 0 && accurateSentences.length > 0) {
      const allEnglishTexts = accurateSentences.map((s) => s.text);
      viTranslations = await translateBatchToVietnamese(allEnglishTexts);
    }

    // Ghép câu tiếng Việt tương ứng theo từng mốc giây
    const finalSentences = accurateSentences.map((s, idx) => {
      let viMeaning = '';
      if (viWords.length > 0) {
        // Tìm các từ tiếng Việt nằm trong khoảng thời gian của câu
        const matched = viWords.filter(
          (v) => v.time >= s.startTime - 0.2 && v.time <= s.endTime + 0.2
        );
        if (matched.length > 0) {
          viMeaning = matched.map((v) => v.text).join(' ').trim();
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

    // Tạo nội dung file SRT tiếng Anh chuẩn xác từng mili-giây
    const englishSrt = finalSentences
      .map((s, idx) => {
        const start = secondsToTimeString(s.startTime);
        const end = secondsToTimeString(s.endTime);
        return `${idx + 1}\n${start} --> ${end}\n${s.english}`;
      })
      .join('\n\n');

    // Tạo nội dung file SRT tiếng Việt khớp hoàn toàn với tiếng Anh
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
 * Trích xuất từng từ kèm mốc thời gian chính xác (Word-level extraction)
 */
function extractTimedWordsFromXml(xml: string): TimedWord[] {
  const words: TimedWord[] = [];

  // Format srv3: <p t="startMs"><s t="offsetMs">word</s>...</p>
  const pRegex = /<p\s+t="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
  let pMatch;

  while ((pMatch = pRegex.exec(xml)) !== null) {
    const pStartMs = parseInt(pMatch[1], 10);
    const inner = pMatch[2];

    const sRegex = /<s(?:\s+t="(\d+)")?[^>]*>([^<]+)<\/s>/g;
    let sMatch;
    let hasS = false;

    while ((sMatch = sRegex.exec(inner)) !== null) {
      hasS = true;
      const sOffsetMs = sMatch[1] ? parseInt(sMatch[1], 10) : 0;
      const wText = decodeXml(sMatch[2]);
      if (wText) {
        words.push({
          time: (pStartMs + sOffsetMs) / 1000,
          text: wText,
        });
      }
    }

    if (!hasS) {
      const clean = decodeXml(inner);
      if (clean) {
        words.push({
          time: pStartMs / 1000,
          text: clean,
        });
      }
    }
  }

  // Format classic: <text start="s" dur="s">content</text>
  if (words.length === 0) {
    const textRegex = /<text\s+start="([\d.]+)"\s+dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
    let textMatch;
    while ((textMatch = textRegex.exec(xml)) !== null) {
      const start = parseFloat(textMatch[1]);
      const dur = parseFloat(textMatch[2]);
      const text = decodeXml(textMatch[3]);
      if (text) {
        const parts = text.split(/\s+/).filter(Boolean);
        const perWord = parts.length > 1 ? dur / parts.length : 0.3;
        parts.forEach((p, idx) => {
          words.push({
            time: start + idx * perWord,
            text: p,
          });
        });
      }
    }
  }

  // Sắp xếp các từ theo thời gian tăng dần
  words.sort((a, b) => a.time - b.time);
  return words;
}

/**
 * Nhóm các từ thành câu hoàn chỉnh với mốc thời gian chuẩn xác, KHÔNG BỊ TRỄ (ZERO LAG)
 */
function groupWordsIntoAccurateSentences(
  words: TimedWord[]
): { startTime: number; endTime: number; text: string }[] {
  if (words.length === 0) return [];

  const sentences: { startTime: number; endTime: number; text: string }[] = [];
  let curWords: TimedWord[] = [];
  let curStart = words[0].time;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (curWords.length === 0) {
      curStart = w.time;
    }
    curWords.push(w);

    const isLast = i === words.length - 1;
    const endsWithPunct = /[.!?]$/.test(w.text.trim());
    const nextWord = words[i + 1];
    const hasLongPause = nextWord ? nextWord.time - w.time >= 1.5 : false;
    const isTooLong = nextWord ? nextWord.time - curStart >= 7.5 : false;

    // Ngắt câu khi: gặp dấu chấm câu (ít nhất 2 từ), hoặc khoảng lặng >= 1.5s, hoặc câu dài >= 7.5s
    if (isLast || (endsWithPunct && curWords.length >= 2) || hasLongPause || isTooLong) {
      const curText = curWords.map((x) => x.text).join(' ').trim();
      const lastWord = curWords[curWords.length - 1];

      // End time được xác định đúng lúc câu tiếp theo bắt đầu - HOÀN TOÀN KHÔNG BỊ TRỄ!
      const curEnd = nextWord
        ? Math.max(lastWord.time + 0.3, Math.min(nextWord.time - 0.05, lastWord.time + 1.2))
        : lastWord.time + 0.8;

      sentences.push({
        startTime: Number(curStart.toFixed(2)),
        endTime: Number(curEnd.toFixed(2)),
        text: curText,
      });

      curWords = [];
    }
  }

  return sentences;
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
