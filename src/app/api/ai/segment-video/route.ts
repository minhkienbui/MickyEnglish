import { NextRequest, NextResponse } from 'next/server';
import { autoSegmentVideo } from '@/lib/videoAutoSegmenter';

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch (parseErr) {
      console.error('Failed to parse request body:', parseErr);
      return NextResponse.json(
        { success: false, message: 'Dữ liệu gửi lên không hợp lệ (JSON parse error).' },
        { status: 400 }
      );
    }

    const { videoUrl, customTitle, customLyricsOrText, apiKey } = body;

    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp đường dẫn video YouTube hoặc ID video.' },
        { status: 400 }
      );
    }

    const lesson = await autoSegmentVideo(videoUrl, customTitle, customLyricsOrText, apiKey);

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (error: any) {
    console.error('Error auto-segmenting video:', error?.message, error?.stack);
    return NextResponse.json(
      { success: false, message: error?.message || 'Đã có lỗi khi phân đoạn video.' },
      { status: 500 }
    );
  }
}
