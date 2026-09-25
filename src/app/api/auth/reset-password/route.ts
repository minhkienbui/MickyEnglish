import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations/auth.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;

    const resetRecord = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Mã đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and remove reset token
    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.userId },
        data: { hashedPassword },
      }),
      db.passwordResetToken.delete({
        where: { id: resetRecord.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu đã được cập nhật thành công. Vui lòng đăng nhập lại.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể đặt lại mật khẩu. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
