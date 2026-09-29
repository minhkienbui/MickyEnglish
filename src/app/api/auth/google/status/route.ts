import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const configured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' &&
    process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret'
  );
  return NextResponse.json({ configured });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { clientId, clientSecret } = body;

    if (!clientId || !clientSecret || typeof clientId !== 'string' || typeof clientSecret !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp cả Google Client ID và Client Secret hợp lệ.' },
        { status: 400 }
      );
    }

    const cleanClientId = clientId.trim();
    const cleanClientSecret = clientSecret.trim();

    // Kiểm tra định dạng bảo mật chống chèn mã độc vào file .env (Env Injection Attack Prevention)
    const safeClientIdRegex = /^[a-zA-Z0-9\-_.]+\.apps\.googleusercontent\.com$/;
    const safeGenericIdRegex = /^[a-zA-Z0-9\-_.]{10,120}$/;
    const safeSecretRegex = /^[a-zA-Z0-9\-_]{10,80}$/;

    if (!safeClientIdRegex.test(cleanClientId) && !safeGenericIdRegex.test(cleanClientId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Client ID không đúng định dạng an toàn (chỉ chứa chữ cái, số, dấu gạch nối và đuôi .apps.googleusercontent.com).',
        },
        { status: 400 }
      );
    }

    if (!safeSecretRegex.test(cleanClientSecret)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Client Secret không đúng định dạng an toàn (chỉ chứa chữ cái, số và dấu gạch ngang/dưới).',
        },
        { status: 400 }
      );
    }

    const envPath = path.resolve(process.cwd(), '.env');
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    // Ghi an toàn
    if (content.includes('GOOGLE_CLIENT_ID=')) {
      content = content.replace(/GOOGLE_CLIENT_ID=.*/g, `GOOGLE_CLIENT_ID="${cleanClientId}"`);
    } else {
      content += `\nGOOGLE_CLIENT_ID="${cleanClientId}"`;
    }

    if (content.includes('GOOGLE_CLIENT_SECRET=')) {
      content = content.replace(/GOOGLE_CLIENT_SECRET=.*/g, `GOOGLE_CLIENT_SECRET="${cleanClientSecret}"`);
    } else {
      content += `\nGOOGLE_CLIENT_SECRET="${cleanClientSecret}"`;
    }

    fs.writeFileSync(envPath, content, 'utf8');

    // Cập nhật bộ nhớ tiến trình
    process.env.GOOGLE_CLIENT_ID = cleanClientId;
    process.env.GOOGLE_CLIENT_SECRET = cleanClientSecret;

    return NextResponse.json({
      success: true,
      message: 'Đã mã hóa và lưu cấu hình Google OAuth an toàn thành công!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lưu cấu hình Google OAuth.' },
      { status: 500 }
    );
  }
}
