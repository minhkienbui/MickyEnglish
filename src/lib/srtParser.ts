/**
 * Custom Pure Client-side SRT, VTT, and TXT Subtitle Parser
 * Không sử dụng thư viện ngoài, xử lý hoàn toàn trên Client qua FileReader
 */

export interface ParsedSentence {
  id: string | number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  english: string;
  vietnamese?: string;
  words?: string[];
  hasTimestamp?: boolean;
}

/**
 * Chuyển đổi chuỗi thời gian SRT/VTT (ví dụ "00:00:05,200" hoặc "00:00:05.200") thành số giây
 */
export function timeStringToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().replace(',', '.');
  const parts = clean.split(':');

  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60 + seconds;
  }

  return parseFloat(clean) || 0;
}

/**
 * Format số giây thành chuỗi thời gian "00:00:05,200"
 */
export function secondsToTimeString(seconds: number): string {
  const sec = Math.max(0, seconds || 0);
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = Math.floor(sec % 60);
  const millis = Math.floor((sec % 1) * 1000);

  const pad = (n: number, size = 2) => String(n).padStart(size, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(millis, 3)}`;
}

/**
 * Làm sạch văn bản subtitle (xóa thẻ HTML, font, v.v.)
 */
export function cleanSubtitleText(text: string): string {
  return (text || '')
    .replace(/<[^>]*>/g, '') // xóa thẻ HTML <font>, <b>, <i>, ...
    .replace(/\{[^}]*\}/g, '') // xóa thẻ ass/ssa style
    .replace(/\r/g, '')
    .trim();
}

/**
 * Parse nội dung file SRT thành danh sách câu
 */
export function parseSRT(content: string): ParsedSentence[] {
  if (!content || !content.trim()) return [];

  // Tách các khối subtitle bằng dòng trống
  const blocks = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n\n+/);
  const sentences: ParsedSentence[] = [];

  let autoId = 1;

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) continue;

    // Tìm dòng chứa timestamp "00:00:01,000 --> 00:00:04,000"
    let timeLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        timeLineIndex = i;
        break;
      }
    }

    if (timeLineIndex === -1) continue;

    const timeLine = lines[timeLineIndex];
    const [startRaw, endRaw] = timeLine.split('-->').map((t) => t.trim());
    const startTime = timeStringToSeconds(startRaw);
    const endTime = timeStringToSeconds(endRaw);

    // Nội dung văn bản là tất cả các dòng sau dòng timestamp
    const textLines = lines.slice(timeLineIndex + 1);
    const englishText = cleanSubtitleText(textLines.join(' '));

    if (!englishText) continue;

    const words = englishText.split(/\s+/).filter(Boolean);

    sentences.push({
      id: autoId++,
      startTime: Number(startTime.toFixed(2)),
      endTime: Number(endTime.toFixed(2)),
      english: englishText,
      vietnamese: '',
      words,
      hasTimestamp: true,
    });
  }

  return sentences;
}

/**
 * Parse nội dung file VTT
 */
export function parseVTT(content: string): ParsedSentence[] {
  if (!content) return [];
  // Bỏ qua header "WEBVTT"
  const cleanContent = content.replace(/^WEBVTT[^\n]*\n+/i, '');
  return parseSRT(cleanContent);
}

/**
 * Parse nội dung file TXT thuần túy (mỗi dòng = 1 câu, không có timestamp)
 */
export function parseTXT(content: string): ParsedSentence[] {
  if (!content || !content.trim()) return [];

  const lines = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('[') && !l.startsWith('('));

  let time = 0;
  return lines.map((line, idx) => {
    const wordCount = line.split(/\s+/).length;
    const dur = Math.max(3.5, Math.min(8, Math.round(wordCount * 0.55)));
    const start = time;
    const end = time + dur;
    time = end;

    return {
      id: idx + 1,
      startTime: Number(start.toFixed(2)),
      endTime: Number(end.toFixed(2)),
      english: cleanSubtitleText(line),
      vietnamese: '',
      words: line.split(/\s+/).filter(Boolean),
      hasTimestamp: false,
    };
  });
}

/**
 * Tự động nhận diện định dạng file và parse
 */
export function parseSubtitleFile(
  content: string,
  filename = 'transcript.srt'
): { sentences: ParsedSentence[]; warning?: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (ext === 'vtt') {
    return { sentences: parseVTT(content) };
  }

  if (ext === 'txt') {
    return {
      sentences: parseTXT(content),
      warning:
        'File TXT không có sẵn timestamp mốc giây, hệ thống đã ước lượng mốc thời gian cơ bản. Bạn có thể điều chỉnh lại mốc giây ở bước tiếp theo.',
    };
  }

  // Mặc định hoặc file .srt
  const parsed = parseSRT(content);
  if (parsed.length > 0) {
    return { sentences: parsed };
  }

  // Fallback sang parse theo dòng nếu SRT không đúng cấu trúc
  return {
    sentences: parseTXT(content),
    warning:
      'Cấu trúc SRT không chuẩn, hệ thống đã chuyển sang chế độ đọc từng dòng văn bản.',
  };
}

/**
 * Ghép bản dịch tiếng Việt vào danh sách câu tiếng Anh
 */
export function mergeTranslations(
  enSentences: ParsedSentence[],
  viContent: string,
  viFilename = 'vietnamese.srt'
): { merged: ParsedSentence[]; warning?: string } {
  if (!viContent || !viContent.trim()) {
    return { merged: enSentences };
  }

  const { sentences: viParsed } = parseSubtitleFile(viContent, viFilename);
  let warning: string | undefined;

  if (viParsed.length !== enSentences.length) {
    warning = `Số câu không khớp hoàn toàn: Tiếng Anh có ${enSentences.length} câu / Bản dịch tiếng Việt có ${viParsed.length} câu.`;
  }

  const merged = enSentences.map((enSentence, idx) => {
    const viSentence = viParsed[idx];
    return {
      ...enSentence,
      vietnamese: viSentence?.english || '', // viParsed chứa văn bản tiếng Việt trong thuộc tính english
    };
  });

  return { merged, warning };
}

/**
 * Tạo prompt dịch AI chuẩn SRT để người dùng dán vào ChatGPT / Claude
 */
export function generateAIDranslatePrompt(sentences: ParsedSentence[]): string {
  const srtBody = sentences
    .map((s, idx) => {
      const startTimeStr = secondsToTimeString(s.startTime);
      const endTimeStr = secondsToTimeString(s.endTime);
      return `${idx + 1}\n${startTimeStr} --> ${endTimeStr}\n${s.english}`;
    })
    .join('\n\n');

  return `Dịch các câu sau sang tiếng Việt, giữ nguyên format SRT (số thứ tự + timestamp + bản dịch tiếng Việt), dịch tự nhiên, không dịch máy móc từng từ:\n\n${srtBody}`;
}
