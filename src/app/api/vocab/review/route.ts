import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateNextReview, Rating } from '@/lib/spacedRepetition';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wordId, rating } = body as { wordId: string; rating: Rating };

    const wordItem = await db.vocabularyWord.findUnique({
      where: { id: wordId },
    });

    if (!wordItem) {
      return NextResponse.json({ error: 'Không tìm thấy từ vựng' }, { status: 404 });
    }

    const { newLevel, nextReviewDate } = calculateNextReview(0, rating);

    return NextResponse.json({ success: true, word: wordItem, newLevel, nextReviewDate });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật Leitner Spaced Repetition' }, { status: 500 });
  }
}
