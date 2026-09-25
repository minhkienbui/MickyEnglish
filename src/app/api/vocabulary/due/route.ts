import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const now = new Date();

    if (!userId) {
      // For guest users, return default 10 words for demonstration
      const sampleWords = await db.vocabularyWord.findMany({
        take: 10,
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json({
        success: true,
        dueCount: sampleWords.length,
        words: sampleWords.map((w) => ({
          ...w,
          progress: {
            id: 'temp-' + w.id,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReviewDate: now,
          },
        })),
      });
    }

    // 1. Get words with review due today (nextReviewDate <= now)
    const dueProgresses = await db.userWordProgress.findMany({
      where: {
        userId,
        nextReviewDate: { lte: now },
      },
      include: {
        word: true,
      },
      orderBy: { nextReviewDate: 'asc' },
      take: 30,
    });

    let dueWords = dueProgresses.map((p) => ({
      ...p.word,
      progress: {
        id: p.id,
        easeFactor: p.easeFactor,
        interval: p.interval,
        repetitions: p.repetitions,
        nextReviewDate: p.nextReviewDate,
      },
    }));

    // 2. If user has fewer than 10 due words, include unstarted words from vocabulary sets
    if (dueWords.length < 10) {
      const existingWordIds = await db.userWordProgress.findMany({
        where: { userId },
        select: { wordId: true },
      });
      const excludedIds = existingWordIds.map((p) => p.wordId);

      const newWords = await db.vocabularyWord.findMany({
        where: {
          id: { notIn: excludedIds },
        },
        take: 10 - dueWords.length,
        orderBy: { createdAt: 'asc' },
      });

      const formattedNewWords = newWords.map((w) => ({
        ...w,
        progress: {
          id: 'temp-' + w.id,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: now,
        },
      }));

      dueWords = [...dueWords, ...formattedNewWords];
    }

    return NextResponse.json({
      success: true,
      dueCount: dueWords.length,
      words: dueWords,
    });
  } catch (error: any) {
    console.error('Error fetching due words:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể lấy danh sách từ cần ôn tập' },
      { status: 500 }
    );
  }
}
