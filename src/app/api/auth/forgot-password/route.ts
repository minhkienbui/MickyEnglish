import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { forgotPasswordSchema } from '@/lib/validations/auth.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Don't leak user existence for security, return positive response
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi.',
      });
    }

    // Generate reset token valid for 1 hour
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mã đặt lại mật khẩu đã được tạo thành công.',
      resetToken: token, // Returned for dev / email integration
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể xử lý yêu cầu lúc này.' },
      { status: 500 }
    );
  }
}
