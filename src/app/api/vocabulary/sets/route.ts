import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createVocabularySetSchema } from '@/lib/validations/vocabulary.schema';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Get all public sets plus user's custom sets
    const sets = await db.vocabularySet.findMany({
      where: {
        OR: [
          { isPublic: true },
          ...(userId ? [{ userId }] : []),
        ],
      },
      include: {
        _count: {
          select: { words: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, sets });
  } catch (error: any) {
    console.error('Error fetching vocabulary sets:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách bộ từ vựng' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const parsed = createVocabularySetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { name, description, isPublic } = parsed.data;

    const newSet = await db.vocabularySet.create({
      data: {
        name,
        description,
        isPublic,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true, set: newSet }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vocabulary set:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tạo bộ từ vựng' },
      { status: 500 }
    );
  }
}
