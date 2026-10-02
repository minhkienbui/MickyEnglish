import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeSafeFilename, verifyVideoMagicBytes } from '@/lib/security';

// Max video upload size: 250MB
const MAX_VIDEO_SIZE = 250 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov', '.mkv'];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn một file video để tải lên.' },
        { status: 400 }
      );
    }

    // [1] Kiểm tra kích thước file
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Kích thước file vượt quá giới hạn an toàn tối đa cho phép (250MB).' },
        { status: 400 }
      );
    }

    if (file.size < 100) {
      return NextResponse.json(
        { success: false, error: 'File tải lên không hợp lệ hoặc bị rỗng.' },
        { status: 400 }
      );
    }

    // [2] Kiểm tra tên file & đuôi mở rộng (Chống Path Traversal & Shell Upload)
    const rawOriginalName = file.name || 'uploaded_video.mp4';
    const safeFilename = sanitizeSafeFilename(rawOriginalName, ALLOWED_EXTENSIONS, 'video');

    if (!safeFilename) {
      return NextResponse.json(
        {
          success: false,
          error: 'Định dạng video không an toàn hoặc không được hỗ trợ. Vui lòng chỉ tải lên: .mp4, .webm, .mov, .mkv.',
        },
        { status: 400 }
      );
    }

    // [3] Đọc buffer và kiểm tra Magic Bytes (Chống mã độc giả mạo video)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isGenuineVideo = verifyVideoMagicBytes(buffer);
    if (!isGenuineVideo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nội dung file không khớp với định dạng video hợp lệ. Yêu cầu tải lên file video thật.',
        },
        { status: 400 }
      );
    }

    // [4] Đảm bảo thư mục lưu trữ an toàn nằm trong phạm vi dự án
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const destinationPath = path.resolve(uploadDir, safeFilename);

    // Xác minh đường dẫn đích tuyệt đối không được thoát khỏi uploadDir
    if (!destinationPath.startsWith(uploadDir)) {
      return NextResponse.json(
        { success: false, error: 'Phát hiện hành vi can thiệp đường dẫn không an toàn.' },
        { status: 403 }
      );
    }

    // Ghi file trực tiếp
    await fs.promises.writeFile(destinationPath, buffer);

    // URL video an toàn truy cập từ website
    const videoUrl = `/uploads/videos/${safeFilename}`;

    return NextResponse.json({
      success: true,
      videoUrl,
      fileName: path.basename(rawOriginalName),
      storedFileName: safeFilename,
      size: file.size,
      mimeType: file.type || 'video/mp4',
      message: 'Video đã được xác thực an toàn và lưu trữ thành công trên website.',
    });
  } catch (error: any) {
    console.error('Lỗi bảo mật upload video:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra sự cố trong quá trình xử lý và mã hóa lưu trữ video.',
      },
      { status: 500 }
    );
  }
}

// GET: Danh sách video an toàn
export async function GET() {
  try {
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ success: true, videos: [] });
    }

    const files = await fs.promises.readdir(uploadDir);
    const validVideos = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext);
      })
      .map((file) => ({
        name: file,
        url: `/uploads/videos/${file}`,
      }));

    return NextResponse.json({ success: true, count: validVideos.length, videos: validVideos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Không thể truy vấn danh sách video.' }, { status: 500 });
  }
}
