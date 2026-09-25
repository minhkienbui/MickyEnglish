import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createVocabularyWordSchema } from '@/lib/validations/vocabulary.schema';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const setId = searchParams.get('setId');
    const search = searchParams.get('search');

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const words = await db.vocabularyWord.findMany({
      where: {
        ...(setId ? { setId } : {}),
        ...(search
          ? {
              OR: [
                { word: { contains: search, mode: 'insensitive' } },
                { meaning: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        progresses: userId
          ? {
              where: { userId },
            }
          : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, words });
  } catch (error: any) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách từ vựng' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createVocabularyWordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { setId, word, meaning, phonetic, example, audioUrl } = parsed.data;

    const newWord = await db.vocabularyWord.create({
      data: {
        setId,
        word: word.trim(),
        meaning: meaning.trim(),
        phonetic: phonetic?.trim() || null,
        example: example?.trim() || null,
        audioUrl: audioUrl || null,
      },
    });

    return NextResponse.json({ success: true, word: newWord }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating word:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể thêm từ mới' },
      { status: 500 }
    );
  }
}
