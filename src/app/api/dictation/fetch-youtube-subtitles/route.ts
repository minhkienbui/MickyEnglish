import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeDualSubtitles } from '@/lib/youtubeCaptionFetcher';
import { extractYoutubeId } from '@/lib/videoAutoSegmenter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { videoUrl } = body;

    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng cung cấp link video YouTube hoặc ID video.',
          downsubUrl: 'https://downsub.com/lang/vi',
        },
        { status: 400 }
      );
    }

    const videoId = extractYoutubeId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Link YouTube không đúng định dạng. Vui lòng kiểm tra lại.',
          downsubUrl: 'https://downsub.com/lang/vi',
        },
        { status: 400 }
      );
    }

    const result = await fetchYouTubeDualSubtitles(videoId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching YouTube subtitles API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi khi tự động tải phụ đề YouTube.',
        downsubUrl: 'https://downsub.com/lang/vi',
      },
      { status: 500 }
    );
  }
}
