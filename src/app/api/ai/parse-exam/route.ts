import { NextResponse } from 'next/server';
import { parseRawExamText } from '@/lib/aiExamParser';

export async function POST(req: Request) {
  try {
    const { rawText, type = 'TOEIC' } = await req.json();

    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng dán nội dung văn bản đề thi cần quét.' },
        { status: 400 }
      );
    }

    const result = parseRawExamText(rawText, type);

    return NextResponse.json({
      success: true,
      message: 'Quét và bóc tách cấu trúc đề thi thành công!',
      exam: result,
      totalQuestions: result.sections.reduce((sum, s) => sum + s.questions.length, 0),
    });
  } catch (error: any) {
    console.error('Error parsing exam text:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể phân tích văn bản đề thi' },
      { status: 500 }
    );
  }
}
