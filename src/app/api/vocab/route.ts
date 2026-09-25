import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mockPresetWords } from '@/data/mockVocab';

export async function GET() {
  try {
    const words = await db.vocabularyWord.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (words.length > 0) {
      return NextResponse.json({ success: true, words });
    }
    return NextResponse.json({ success: true, words: mockPresetWords });
  } catch (error) {
    return NextResponse.json({ success: true, words: mockPresetWords });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, phonetic, meaning, exampleEn, exampleVi, topic, setId } = body;

    if (!word || !meaning) {
      return NextResponse.json({ error: 'Từ và Nghĩa là bắt buộc' }, { status: 400 });
    }

    let targetSetId = setId;
    if (!targetSetId) {
      const defaultSet = await db.vocabularySet.findFirst();
      if (defaultSet) {
        targetSetId = defaultSet.id;
      }
    }

    if (!targetSetId) {
      return NextResponse.json({ success: true, word: body });
    }

    const newWord = await db.vocabularyWord.create({
      data: {
        setId: targetSetId,
        word,
        phonetic: phonetic || '/.../',
        meaning,
        example: exampleEn || 'Example sentence.',
      },
    });

    return NextResponse.json({ success: true, word: newWord });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm từ vựng mới' }, { status: 500 });
  }
}
