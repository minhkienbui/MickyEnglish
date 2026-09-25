import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const level = searchParams.get('level');

    const lessons = await db.listeningLesson.findMany({
      where: {
        ...(topic && topic !== 'All' ? { topic } : {}),
        ...(level && level !== 'All' ? { level } : {}),
      },
      select: {
        id: true,
        title: true,
        topic: true,
        level: true,
        audioUrl: true,
        duration: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, lessons });
  } catch (error: any) {
    console.error('Error fetching dictation lessons:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách bài luyện nghe' },
      { status: 500 }
    );
  }
}
