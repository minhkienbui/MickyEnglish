import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Max video upload size: 250MB
const MAX_VIDEO_SIZE = 250 * 1024 * 1024;

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

    // Check file size
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Kích thước file vượt quá giới hạn tối đa cho phép (250MB).' },
        { status: 400 }
      );
    }

    // Check extension / type
    const originalName = file.name || 'uploaded_video.mp4';
    const ext = path.extname(originalName).toLowerCase() || '.mp4';
    const allowedExts = ['.mp4', '.webm', '.ogg', '.mov', '.mkv', '.avi'];

    if (!allowedExts.includes(ext) && !file.type.startsWith('video/')) {
      return NextResponse.json(
        {
          success: false,
          error: `Định dạng video không được hỗ trợ (${ext}). Vui lòng tải lên file: MP4, WebM, MOV hoặc MKV.`,
        },
        { status: 400 }
      );
    }

    // Ensure storage directory exists on website
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate clean, collision-free filename
    const sanitizedBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const safeFilename = `video_${Date.now()}_${sanitizedBase || 'clip'}${ext}`;
    const destinationPath = path.join(uploadDir, safeFilename);

    // Write file directly into public/uploads/videos
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(destinationPath, buffer);

    // Direct URL accessible on website
    const videoUrl = `/uploads/videos/${safeFilename}`;

    return NextResponse.json({
      success: true,
      videoUrl,
      fileName: originalName,
      storedFileName: safeFilename,
      size: file.size,
      mimeType: file.type || 'video/mp4',
      message: 'Video đã được lưu trữ thành công trực tiếp trên website.',
    });
  } catch (error: any) {
    console.error('Lỗi upload video:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi hệ thống khi lưu trữ video lên website.',
      },
      { status: 500 }
    );
  }
}

// GET route to list existing uploaded videos if needed
export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ success: true, videos: [] });
    }

    const files = await fs.promises.readdir(uploadDir);
    const videos = files.map((file) => ({
      name: file,
      url: `/uploads/videos/${file}`,
    }));

    return NextResponse.json({ success: true, count: videos.length, videos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
