import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { compareText } from '@/lib/diffEngine';
import { submitDictationSchema } from '@/lib/validations/dictation.schema';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const parsed = submitDictationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { lessonId, userText, timeSpent } = parsed.data;

    const lesson = await db.listeningLesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài học tương ứng' },
        { status: 404 }
      );
    }

    // Run word diff comparison algorithm
    const diff = compareText(lesson.transcript, userText);

    let savedResult = null;

    if (userId) {
      // Save result and increment user listening minutes
      const listeningMinutes = Math.max(1, Math.round((timeSpent || lesson.duration) / 60));

      const [result] = await db.$transaction([
        db.userDictationResult.create({
          data: {
            userId,
            lessonId,
            userText,
            accuracy: diff.accuracy,
            errorDetails: {
              tokens: diff.tokens,
              summary: diff.summary,
              errorTaxonomy: diff.errorTaxonomy,
            } as any,
            timeSpent: timeSpent || lesson.duration,
          },
        }),
        db.user.update({
          where: { id: userId },
          data: {
            dictationMinutes: { increment: listeningMinutes },
          },
        }),
      ]);

      savedResult = result;
    }

    return NextResponse.json({
      success: true,
      accuracy: diff.accuracy,
      diff,
      savedResult,
    });
  } catch (error: any) {
    console.error('Error submitting dictation:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể nộp bài nghe chép chính tả' },
      { status: 500 }
    );
  }
}
