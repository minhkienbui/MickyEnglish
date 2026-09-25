import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { submitExamSchema } from '@/lib/validations/exam.schema';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const parsed = submitExamSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu nộp bài không hợp lệ' },
        { status: 400 }
      );
    }

    const { examId, answers, startedAt } = parsed.data;

    // Fetch exam with questions to evaluate
    const exam = await db.exam.findUnique({
      where: { id: examId },
      include: {
        sections: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đề thi tương ứng' },
        { status: 404 }
      );
    }

    // Flatten all questions
    const allQuestions = exam.sections.flatMap((s) => s.questions);
    const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

    let correctCount = 0;
    const evaluatedAnswers = answers.map((ans) => {
      const question = questionMap.get(ans.questionId);
      const isCorrect = question ? question.correctAnswer === ans.userAnswer : false;
      if (isCorrect) correctCount++;

      return {
        questionId: ans.questionId,
        userAnswer: ans.userAnswer,
        correctAnswer: question ? question.correctAnswer : 0,
        isCorrect,
        questionText: question?.questionText,
        options: question?.options,
        explanation: question?.explanation,
      };
    });

    const totalQuestions = allQuestions.length || answers.length;
    const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

    let savedAttempt = null;

    if (userId) {
      // Save exam attempt and answer details
      savedAttempt = await db.userExamAttempt.create({
        data: {
          userId,
          examId,
          score: scorePercentage,
          correctCount,
          totalQuestions,
          startedAt: startedAt ? new Date(startedAt) : new Date(),
          submittedAt: new Date(),
          answers: {
            create: evaluatedAnswers.map((ans) => ({
              questionId: ans.questionId,
              userAnswer: ans.userAnswer,
              isCorrect: ans.isCorrect,
            })),
          },
        },
      });

      // Increment user exams completed
      await db.user.update({
        where: { id: userId },
        data: {
          examsCompleted: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      score: scorePercentage,
      correctCount,
      totalQuestions,
      answers: evaluatedAnswers,
      attemptId: savedAttempt?.id || null,
    });
  } catch (error: any) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể chấm điểm bài thi lúc này' },
      { status: 500 }
    );
  }
}
