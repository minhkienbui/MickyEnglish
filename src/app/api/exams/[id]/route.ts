import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đề thi yêu cầu' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, exam });
  } catch (error: any) {
    console.error('Error fetching exam detail:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải chi tiết đề thi' },
      { status: 500 }
    );
  }
}
