import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { calculateSM2, ratingToQuality } from '@/lib/sm2';
import { reviewWordSchema } from '@/lib/validations/vocabulary.schema';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const parsed = reviewWordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { wordId, rating } = parsed.data;
    const quality = ratingToQuality(rating as any);

    if (!userId) {
      // Guest calculation response
      const sm2 = calculateSM2({
        quality,
        repetitions: 0,
        previousInterval: 0,
        previousEaseFactor: 2.5,
      });
      return NextResponse.json({
        success: true,
        message: 'Đã tính toán độ nhớ (Khách)',
        result: sm2,
      });
    }

    // Get current progress or default
    const currentProgress = await db.userWordProgress.findUnique({
      where: {
        userId_wordId: { userId, wordId },
      },
    });

    const previousEaseFactor = currentProgress?.easeFactor || 2.5;
    const previousInterval = currentProgress?.interval || 0;
    const previousRepetitions = currentProgress?.repetitions || 0;

    const sm2Result = calculateSM2({
      quality,
      repetitions: previousRepetitions,
      previousInterval,
      previousEaseFactor,
    });

    // Upsert user word progress
    const updatedProgress = await db.userWordProgress.upsert({
      where: {
        userId_wordId: { userId, wordId },
      },
      create: {
        userId,
        wordId,
        easeFactor: sm2Result.easeFactor,
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        nextReviewDate: sm2Result.nextReviewDate,
        lastReviewedAt: new Date(),
      },
      update: {
        easeFactor: sm2Result.easeFactor,
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        nextReviewDate: sm2Result.nextReviewDate,
        lastReviewedAt: new Date(),
      },
    });

    // If first time memorized, increment wordsLearned
    if (quality >= 3 && previousRepetitions === 0) {
      await db.user.update({
        where: { id: userId },
        data: {
          wordsLearned: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật tiến độ học từ vựng thành công',
      progress: updatedProgress,
      sm2: sm2Result,
    });
  } catch (error: any) {
    console.error('Error in review submission:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật kết quả ôn tập' },
      { status: 500 }
    );
  }
}
