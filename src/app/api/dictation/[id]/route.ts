import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lesson = await db.listeningLesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài học' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lesson });
  } catch (error: any) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải chi tiết bài học' },
      { status: 500 }
    );
  }
}
