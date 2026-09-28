import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const configured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id'
  );
  return NextResponse.json({ configured });
}

export async function POST(req: Request) {
  try {
    const { clientId, clientSecret } = await req.json();

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp cả Google Client ID và Client Secret' },
        { status: 400 }
      );
    }

    const envPath = path.join(process.cwd(), '.env');
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    // Update or append GOOGLE_CLIENT_ID
    if (content.includes('GOOGLE_CLIENT_ID=')) {
      content = content.replace(/GOOGLE_CLIENT_ID=.*/g, `GOOGLE_CLIENT_ID="${clientId.trim()}"`);
    } else {
      content += `\nGOOGLE_CLIENT_ID="${clientId.trim()}"`;
    }

    // Update or append GOOGLE_CLIENT_SECRET
    if (content.includes('GOOGLE_CLIENT_SECRET=')) {
      content = content.replace(/GOOGLE_CLIENT_SECRET=.*/g, `GOOGLE_CLIENT_SECRET="${clientSecret.trim()}"`);
    } else {
      content += `\nGOOGLE_CLIENT_SECRET="${clientSecret.trim()}"`;
    }

    fs.writeFileSync(envPath, content, 'utf8');

    // Also update current process.env in memory
    process.env.GOOGLE_CLIENT_ID = clientId.trim();
    process.env.GOOGLE_CLIENT_SECRET = clientSecret.trim();

    return NextResponse.json({
      success: true,
      message: 'Đã lưu cấu hình Google OAuth thành công vào file .env!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
