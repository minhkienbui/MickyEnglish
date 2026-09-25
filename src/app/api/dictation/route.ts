import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { compareText } from '@/lib/diffEngine';
import { mockDictationLessons } from '@/data/mockDictation';

export async function GET() {
  try {
    const lessons = await db.listeningLesson.findMany();
    if (lessons.length > 0) {
      return NextResponse.json({ success: true, lessons });
    }
    return NextResponse.json({ success: true, lessons: mockDictationLessons });
  } catch (error) {
    return NextResponse.json({ success: true, lessons: mockDictationLessons });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { originalText, userInput } = body;

    if (!originalText || userInput === undefined) {
      return NextResponse.json({ error: 'Văn bản gốc và bài gõ là bắt buộc' }, { status: 400 });
    }

    const diffResult = compareText(originalText, userInput);
    return NextResponse.json({ success: true, result: diffResult });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi so sánh chép chính tả' }, { status: 500 });
  }
}
