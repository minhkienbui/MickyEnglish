import { NextResponse } from 'next/server';
import { uploadAudioBuffer } from '@/lib/storage';
import path from 'path';

const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.webm', '.m4a', '.aac'];

function verifyAudioSignature(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 12) return false;

  // 1. MP3 with ID3 header: 0x49, 0x44, 0x33 ("ID3")
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return true;
  }

  // 2. MP3 frame sync word: starts with 0xFF followed by 0xFB, 0xF3, 0xF2, 0xFA, 0xE0-0xFF
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) {
    return true;
  }

  // 3. WAV: starts with 'RIFF' and has 'WAVE' at offset 8
  if (
    buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
    buffer.slice(8, 12).toString('ascii') === 'WAVE'
  ) {
    return true;
  }

  // 4. OGG: starts with 'OggS'
  if (buffer.slice(0, 4).toString('ascii') === 'OggS') {
    return true;
  }

  // 5. WebM Audio: EBML header 0x1A 0x45 0xDF 0xA3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return true;
  }

  // 6. M4A / AAC: contains 'ftyp' at offset 4
  const ftypCheck = buffer.slice(4, 8).toString('ascii');
  if (ftypCheck === 'ftyp') {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn file audio cần tải lên.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Kích thước file audio vượt quá giới hạn an toàn cho phép (50MB).' },
        { status: 400 }
      );
    }

    if (file.size < 50) {
      return NextResponse.json(
        { success: false, error: 'File tải lên không hợp lệ hoặc bị rỗng.' },
        { status: 400 }
      );
    }

    // Kiểm tra đuôi file an toàn
    const originalName = file.name || 'audio.mp3';
    const cleanExt = path.extname(originalName).toLowerCase();
    if (!ALLOWED_AUDIO_EXTENSIONS.includes(cleanExt) && !file.type.startsWith('audio/')) {
      return NextResponse.json(
        { success: false, error: 'Định dạng file không được hỗ trợ. Vui lòng tải file: MP3, WAV, OGG, WEBM, M4A.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Xác minh chữ ký nhị phân thực tế của audio
    const isGenuineAudio = verifyAudioSignature(buffer);
    if (!isGenuineAudio) {
      return NextResponse.json(
        { success: false, error: 'Nội dung file không khớp với định dạng âm thanh chuẩn. Tải lên bị từ chối.' },
        { status: 400 }
      );
    }

    const audioUrl = await uploadAudioBuffer(buffer, 'micky-audio');

    return NextResponse.json({
      success: true,
      audioUrl,
      fileName: path.basename(originalName),
      size: file.size,
    });
  } catch (error: any) {
    console.error('Lỗi bảo mật upload audio:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể upload file audio lúc này.' },
      { status: 500 }
    );
  }
}
