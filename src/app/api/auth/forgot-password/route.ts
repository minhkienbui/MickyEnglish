import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { forgotPasswordSchema } from '@/lib/validations/auth.schema';
import { validateEmail, sanitizeText } from '@/lib/security';

// Rate limiting tracker for forgot-password: max 5 requests per IP / 15 minutes
const forgotPasswordAttempts: Record<string, { count: number; resetAt: number }> = {};

export async function POST(req: Request) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();

    const tracker = forgotPasswordAttempts[clientIp];
    if (tracker && tracker.resetAt > now) {
      if (tracker.count >= 5) {
        return NextResponse.json(
          {
            success: false,
            error: 'Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 15 phút.',
          },
          { status: 429 }
        );
      }
      tracker.count++;
    } else {
      forgotPasswordAttempts[clientIp] = { count: 1, resetAt: now + 15 * 60 * 1000 };
    }

    const body = await req.json().catch(() => ({}));
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    const email = sanitizeText(parsed.data.email.toLowerCase().trim(), 100);
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Email không đúng định dạng an toàn' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    }).catch(() => null);

    // [BẢO MẬT CHỐNG ENUMERATION & ACCOUNT TAKEOVER]:
    // Luôn trả về thông báo đồng nhất dù email có tồn tại hay không,
    // và TUYỆT ĐỐI KHÔNG gửi token bí mật về cho client!
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được xử lý an toàn.',
      });
    }

    // Xóa các token reset cũ chưa dùng của người này để tránh rác và chống tấn công dò token
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    }).catch(() => null);

    // Tạo token bảo mật ngẫu nhiên 64 ký tự hex (256-bit entropy)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Chỉ trả token trong môi trường development để phục vụ test cục bộ
    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json({
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được xử lý an toàn.',
      ...(isDev ? { resetToken: token } : {}),
    });
  } catch (error: any) {
    console.error('Lỗi bảo mật forgot-password:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
