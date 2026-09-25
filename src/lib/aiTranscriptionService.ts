import { DictationLesson, DictationSentence } from './types';

export interface AIProviderConfig {
  provider: 'gemini' | 'groq' | 'browser' | 'auto';
  apiKey?: string;
  modelName?: string;
}

/**
 * Transcribe & segment YouTube video speech using Google Gemini AI (Free Tier)
 * // [SỬA] Đổi sang model 'gemini-3.6-flash' vì Google đã deprecate model cũ 'gemini-2.0-flash' (bị lỗi 404)
 */
export async function transcribeWithGemini(
  youtubeId: string,
  videoTitle: string,
  apiKey: string
): Promise<DictationSentence[]> {
  const prompt = `You are an expert English speech transcription and language teaching AI.
Analyze the following YouTube video:
- YouTube ID: "${youtubeId}"
- Video Title / Topic: "${videoTitle}"

Task:
1. Transcribe the exact English speech spoken by people in this video (or lyrics if it is a song).
2. Segment the speech naturally into sequential timed sentences of 4 to 8 seconds each.
3. For each sentence, provide:
   - startTime (in seconds, starting from 0)
   - endTime (in seconds)
   - text (the exact English sentence spoken in the video)
   - phonetic (IPA transcription)
   - vietnameseMeaning (accurate, natural Vietnamese translation)

Output pure JSON format only (no markdown, no backticks):
{
  "sentences": [
    {
      "id": "s-1",
      "startTime": 0,
      "endTime": 5,
      "text": "Exact English sentence spoken...",
      "phonetic": "ɪɡˈzækt ˈɪŋɡlɪʃ ˈsentəns...",
      "vietnameseMeaning": "Nghĩa tiếng Việt chuẩn xác..."
    }
  ]
}`;

  // [SỬA] Sử dụng gemini-3.6-flash với fallback dự phòng
  const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`Model ${model} failed with status ${res.status}:`, errorText);
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      if (parsed.sentences && Array.isArray(parsed.sentences) && parsed.sentences.length > 0) {
        return parsed.sentences.map((s: any, idx: number) => ({
          id: `s-ai-${idx + 1}`,
          startTime: Number(s.startTime) || idx * 5,
          endTime: Number(s.endTime) || (idx + 1) * 5,
          text: s.text,
          phonetic: s.phonetic || '',
          vietnameseMeaning: s.vietnameseMeaning || '',
        }));
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message || 'Không thể trích xuất âm thanh từ video bằng Google Gemini AI.'
  );
}
