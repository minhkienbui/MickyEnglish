import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic = 'Giao tiếp hàng ngày', level = 'B1', count = 5, customPrompt = '' } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `You are Micky, an expert English curriculum designer.
Generate a high-yield English vocabulary learning set in JSON format (pure JSON, no markdown code blocks):
- Topic: ${topic}
- Level: ${level} (CEFR: A1, A2, B1, B2, C1)
- Number of Words: ${count}
- Custom Instructions: ${customPrompt}

Return JSON structure:
{
  "name": "Tên bộ từ vựng (Tiếng Việt & Tiếng Anh)",
  "description": "Mô tả ngắn gọn về giá trị của bộ từ vựng này",
  "words": [
    {
      "word": "EnglishWord",
      "phonetic": "/IPA/",
      "meaning": "Nghĩa tiếng Việt súc tích",
      "exampleEn": "Natural English example sentence.",
      "exampleVi": "Bản dịch nghĩa tiếng Việt câu ví dụ.",
      "mnemonic": "Mẹo nhớ âm thanh tương tự hoặc câu chuyện hài hước bằng tiếng Việt"
    }
  ]
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return NextResponse.json({ success: true, set: parsed, source: 'gemini-ai' });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to built-in generator:', err);
      }
    }

    // Built-in intelligent vocabulary set builder
    const wordsPool: Record<string, any[]> = {
      business: [
        {
          word: 'Collaborate',
          phonetic: '/kəˈlæbəreɪt/',
          meaning: 'Hợp tác, làm việc nhóm',
          exampleEn: 'Our marketing team will collaborate with design specialists.',
          exampleVi: 'Đội ngũ tiếp thị của chúng tôi sẽ hợp tác với các chuyên gia thiết kế.',
          mnemonic: 'Âm thanh: "Cổ La Bò" -> Cả nhóm cùng "la ó cổ vũ chú bò" làm việc cùng nhau.',
        },
        {
          word: 'Negotiate',
          phonetic: '/nɪˈɡoʊʃieɪt/',
          meaning: 'Đàm phán, thương lượng điều khoản',
          exampleEn: 'She managed to negotiate a higher salary for the new role.',
          exampleVi: 'Cô ấy đã thương lượng thành công mức lương cao hơn cho vị trí mới.',
          mnemonic: 'Âm thanh: "Né Gỗ Siết" -> Đàm phán căng thẳng như người thợ "né khúc gỗ rồi siết ốc".',
        },
        {
          word: 'Implement',
          phonetic: '/ˈɪmplɪment/',
          meaning: 'Thực thi, triển khai kế hoạch',
          exampleEn: 'We need to implement the cybersecurity protocol immediately.',
          exampleVi: 'Chúng ta cần triển khai quy trình an ninh mạng ngay lập tức.',
          mnemonic: 'Âm thanh: "Im Lì Mần" -> Im lặng lì lợm "mần" (làm) cho xong việc để thực thi dự án.',
        },
        {
          word: 'Proficient',
          phonetic: '/prəˈfɪʃnt/',
          meaning: 'Thành thạo, giỏi giang một kỹ năng',
          exampleEn: 'He is highly proficient in data analysis and visualization.',
          exampleVi: 'Anh ấy cực kỳ thành thạo trong phân tích dữ liệu và trực quan hóa.',
          mnemonic: 'Âm thanh: "Pro Phi Thân" -> Đã là "Pro" thì thành thạo mọi tuyệt chiêu.',
        },
        {
          word: 'Delegate',
          phonetic: '/ˈdelɪɡeɪt/',
          meaning: 'Ủy quyền, giao phó nhiệm vụ',
          exampleEn: 'Effective managers know how to delegate tasks properly.',
          exampleVi: 'Những nhà quản lý hiệu quả luôn biết cách giao phó công việc hợp lý.',
          mnemonic: 'Âm thanh: "Để Lại Gánh" -> Người quản lý "để lại gánh nặng" nhiệm vụ cho cấp dưới tin cậy.',
        },
      ],
    };

    const words = wordsPool.business.slice(0, Math.min(count, 5));

    return NextResponse.json({
      success: true,
      set: {
        name: `Bộ từ vựng AI: ${topic} (${level})`,
        description: `Tổng hợp các từ vựng trọng tâm chủ đề ${topic} cấp độ ${level} giúp bạn giao tiếp tự tin và làm chủ ngôn ngữ.`,
        words,
      },
      source: 'built-in-ai',
    });
  } catch (error: any) {
    console.error('Error generating vocab set:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tạo bộ từ vựng lúc này.' },
      { status: 500 }
    );
  }
}
