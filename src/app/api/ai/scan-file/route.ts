import { NextResponse } from 'next/server';
import { parseDocxWithColorDetection, parsePdfDocument } from '@/lib/fileDocumentParser';
import { parseRawExamText } from '@/lib/aiExamParser';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as 'TOEIC' | 'IELTS' | 'VSTEP') || 'TOEIC';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn file PDF, Word (.docx) hoặc file Text (.txt).' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();

    let extractedRawText = '';
    let hasColoredAnswers = false;
    let coloredKeywordsCount = 0;

    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const docResult = await parseDocxWithColorDetection(buffer);
      extractedRawText = docResult.rawText;
      hasColoredAnswers = docResult.hasColoredAnswers;
      coloredKeywordsCount = docResult.coloredKeywordsCount;
    } else if (fileName.endsWith('.pdf')) {
      const pdfResult = await parsePdfDocument(buffer);
      extractedRawText = pdfResult.rawText;
    } else if (fileName.endsWith('.txt')) {
      extractedRawText = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { success: false, error: 'Định dạng file không được hỗ trợ. Vui lòng tải file .docx, .pdf hoặc .txt' },
        { status: 400 }
      );
    }

    if (!extractedRawText || !extractedRawText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Không thể đọc nội dung văn bản từ file tải lên.' },
        { status: 400 }
      );
    }

    // Parse into structured exam
    const parsedExam = parseRawExamText(extractedRawText, type);

    // If filename has a good title, use it if not extracted
    if (parsedExam.title === 'Đề thi tự động quét bằng AI' && file.name) {
      parsedExam.title = file.name.replace(/\.[^/.]+$/, '');
    }

    const totalQuestions = parsedExam.sections.reduce((sum, s) => sum + s.questions.length, 0);

    return NextResponse.json({
      success: true,
      message: `Đã quét và bóc tách thành công ${totalQuestions} câu hỏi từ file "${file.name}"!`,
      fileName: file.name,
      fileSize: file.size,
      hasColoredAnswers: hasColoredAnswers || (parsedExam.coloredAnswersCount ?? 0) > 0,
      coloredAnswersCount: parsedExam.coloredAnswersCount || coloredKeywordsCount,
      rawText: extractedRawText,
      exam: parsedExam,
      totalQuestions,
    });
  } catch (error: any) {
    console.error('Error scanning exam file:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi xử lý file tài liệu' },
      { status: 500 }
    );
  }
}
