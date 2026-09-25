import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const exams = await db.exam.findMany({
      where: {
        ...(type && type !== 'ALL' ? { type } : {}),
      },
      include: {
        sections: {
          select: {
            _count: {
              select: { questions: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedExams = exams.map((exam) => {
      const totalQuestions = exam.sections.reduce(
        (sum, sec) => sum + sec._count.questions,
        0
      );
      return {
        id: exam.id,
        title: exam.title,
        type: exam.type,
        description: exam.description,
        duration: exam.duration,
        totalQuestions,
        createdAt: exam.createdAt,
      };
    });

    return NextResponse.json({ success: true, exams: formattedExams });
  } catch (error: any) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách đề thi' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type, description, duration, sections } = body;

    if (!title || !type || !sections || !Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ tiêu đề, loại đề thi và ít nhất 1 phần thi.' },
        { status: 400 }
      );
    }

    // Create Exam with nested sections and questions in Prisma transaction
    const newExam = await db.exam.create({
      data: {
        title: title.trim(),
        type: type.toUpperCase().trim(),
        description: description?.trim() || null,
        duration: Number(duration) || 30,
        sections: {
          create: sections.map((sec: any, secIdx: number) => ({
            name: sec.name || `Phần ${secIdx + 1}`,
            order: sec.order || secIdx + 1,
            passage: sec.passage?.trim() || null,
            audioUrl: sec.audioUrl?.trim() || null,
            questions: {
              create: (sec.questions || []).map((q: any, qIdx: number) => ({
                order: q.order || qIdx + 1,
                questionText: q.questionText?.trim() || `Câu hỏi ${qIdx + 1}`,
                options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
                correctAnswer: Number(q.correctAnswer) || 0,
                explanation: q.explanation?.trim() || 'Chưa có giải thích chi tiết.',
              })),
            },
          })),
        },
      },
      include: {
        sections: {
          include: {
            questions: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tạo đề thi mới thành công!',
        exam: newExam,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating exam:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Không thể tạo đề thi mới' },
      { status: 500 }
    );
  }
}
