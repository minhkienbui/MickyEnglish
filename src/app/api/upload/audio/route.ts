import { NextResponse } from 'next/server';
import { uploadAudioBuffer } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn file audio cần tải lên' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const audioUrl = await uploadAudioBuffer(buffer, 'micky-audio');

    return NextResponse.json({
      success: true,
      audioUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Error uploading audio:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể upload file audio' },
      { status: 500 }
    );
  }
}
