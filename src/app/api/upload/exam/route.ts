import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Max document file size: 50MB
const MAX_DOC_SIZE = 50 * 1024 * 1024;
const ALLOWED_EXTS = ['.pdf', '.docx', '.doc', '.txt'];

function sanitizeDocFilename(originalName: string): string | null {
  if (!originalName || typeof originalName !== 'string') return null;

  const cleanBase = originalName.replace(/[\x00-\x1f\x7f\/\\]/g, '').trim();
  const dotIndex = cleanBase.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const ext = cleanBase.slice(dotIndex).toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) return null;

  const namePart = cleanBase.slice(0, dotIndex).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
  const randomSuffix = crypto.randomBytes(6).toString('hex');

  return `exam_${Date.now()}_${namePart || 'doc'}_${randomSuffix}${ext}`;
}

function verifyDocMagicBytes(buffer: Buffer, ext: string): boolean {
  if (!buffer || buffer.length < 8) return false;

  // PDF starts with %PDF- (0x25 0x50 0x44 0x46)
  if (ext === '.pdf') {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  // DOCX is a zip archive, starts with PK (0x50 0x4B 0x03 0x04)
  if (ext === '.docx') {
    return buffer[0] === 0x50 && buffer[1] === 0x4b;
  }

  // DOC legacy CFBF header starts with 0xD0 0xCF 0x11 0xE0
  if (ext === '.doc') {
    return (buffer[0] === 0xd0 && buffer[1] === 0xcf) || (buffer[0] === 0x50 && buffer[1] === 0x4b);
  }

  // TXT is plain text
  if (ext === '.txt') {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn một file PDF hoặc Word (.docx) để tải lên.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_DOC_SIZE) {
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

    const originalName = file.name || 'exam_document.pdf';
    const safeFilename = sanitizeDocFilename(originalName);

    if (!safeFilename) {
      return NextResponse.json(
        {
          success: false,
          error: 'Định dạng tài liệu không được hỗ trợ. Vui lòng tải lên file: .pdf, .docx, .doc hoặc .txt.',
        },
        { status: 400 }
      );
    }

    const ext = path.extname(safeFilename).toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify magic bytes
    if (!verifyDocMagicBytes(buffer, ext)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nội dung file không khớp với định dạng tài liệu hợp lệ. Yêu cầu tải lên file PDF hoặc Word thật.',
        },
        { status: 400 }
      );
    }

    // Storage path
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

    await fs.promises.writeFile(destinationPath, buffer);

    const fileUrl = `/uploads/exams/${safeFilename}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: path.basename(originalName),
      storedFileName: safeFilename,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      message: 'Tài liệu đề thi đã được lưu trữ thành công trực tiếp trên website.',
    });
  } catch (error: any) {
    console.error('Lỗi upload file đề thi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra sự cố trong quá trình lưu trữ file đề thi.',
      },
      { status: 500 }
    );
  }
}
