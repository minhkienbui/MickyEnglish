import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeSafeFilename, verifyDocumentMagicBytes } from '@/lib/security';
import { parseDocxWithColorDetection, parsePdfDocument } from '@/lib/fileDocumentParser';
import { parseRawExamText } from '@/lib/aiExamParser';

const MAX_EXAM_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'TOEIC';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn một file PDF, Word (.docx) hoặc file văn bản (.txt) để tải lên.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_EXAM_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Kích thước file vượt quá giới hạn an toàn tối đa cho phép (50MB).' },
        { status: 400 }
      );
    }

    if (file.size < 20) {
      return NextResponse.json(
        { success: false, error: 'File tải lên không hợp lệ hoặc bị rỗng.' },
        { status: 400 }
      );
    }

    const rawOriginalName = file.name || 'exam_document.pdf';
    const safeFilename = sanitizeSafeFilename(rawOriginalName, ALLOWED_EXTENSIONS, 'exam');

    if (!safeFilename) {
      return NextResponse.json(
        {
          success: false,
          error: 'Định dạng file không an toàn hoặc không được hỗ trợ. Vui lòng chỉ tải lên: .pdf, .docx, .doc, .txt.',
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(rawOriginalName).toLowerCase();

    // Xác minh chữ ký nhị phân thực tế (Magic bytes)
    const isGenuineDoc = verifyDocumentMagicBytes(buffer, ext);
    if (!isGenuineDoc) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nội dung file không đúng với định dạng tài liệu hợp lệ. Yêu cầu tải lên file PDF hoặc Word thật.',
        },
        { status: 400 }
      );
    }

    // Đảm bảo thư mục lưu trữ an toàn nằm trong phạm vi dự án
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'exams');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const destinationPath = path.resolve(uploadDir, safeFilename);

    if (!destinationPath.startsWith(uploadDir)) {
      return NextResponse.json(
        { success: false, error: 'Phát hiện hành vi can thiệp đường dẫn không an toàn.' },
        { status: 403 }
      );
    }

    // Ghi file trực tiếp và lưu trữ vĩnh viễn trên website
    await fs.promises.writeFile(destinationPath, buffer);
    const fileUrl = `/uploads/exams/${safeFilename}`;

    // Trích xuất văn bản & nhận diện định dạng đề thi
    let extractedRawText = '';
    let hasColoredAnswers = false;
    let coloredKeywordsCount = 0;

    if (ext === '.docx' || ext === '.doc') {
      try {
        const docResult = await parseDocxWithColorDetection(buffer);
        extractedRawText = docResult.rawText;
        hasColoredAnswers = docResult.hasColoredAnswers;
        coloredKeywordsCount = docResult.coloredKeywordsCount;
      } catch (err: any) {
        console.warn('DOCX color parser fallback:', err);
        extractedRawText = buffer.toString('utf-8');
      }
    } else if (ext === '.pdf') {
      try {
        const pdfResult = await parsePdfDocument(buffer);
        extractedRawText = pdfResult.rawText;
      } catch (err: any) {
        console.warn('PDF parser error:', err);
      }
    } else {
      extractedRawText = buffer.toString('utf-8');
    }

    if (!extractedRawText || !extractedRawText.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không thể trích xuất văn bản từ file. Nếu là file PDF scan dạng ảnh, vui lòng chuyển sang file Word hoặc PDF dạng chữ.',
        },
        { status: 400 }
      );
    }

    // AI Parser phân tích cấu trúc câu hỏi, options, đáp án đúng và bảng đáp án cuối trang
    const parsedExam = parseRawExamText(extractedRawText, type);

    // Lấy tiêu đề từ tên file nếu chưa có tiêu đề rõ ràng
    if (parsedExam.title === 'Đề thi tự động quét bằng AI' && rawOriginalName) {
      parsedExam.title = rawOriginalName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    }

    const totalQuestions = parsedExam.sections.reduce((sum, s) => sum + s.questions.length, 0);

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: rawOriginalName,
      storedFileName: safeFilename,
      size: file.size,
      exam: parsedExam,
      totalQuestions,
      detectedAnswersCount: parsedExam.detectedAnswersCount || 0,
      hasColoredAnswers: hasColoredAnswers || (parsedExam.coloredAnswersCount ?? 0) > 0,
      coloredAnswersCount: parsedExam.coloredAnswersCount || coloredKeywordsCount,
      message: `Đã lưu trữ file lên website và AI phân tách thành công ${totalQuestions} câu hỏi!`,
    });
  } catch (error: any) {
    console.error('Lỗi upload và quét đề thi:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi hệ thống khi tải và nhận diện file đề thi.',
      },
      { status: 500 }
    );
  }
}
