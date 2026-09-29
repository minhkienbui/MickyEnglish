import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations/auth.schema';
import { validatePassword } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { token, newPassword } = parsed.data;

    // Kiểm tra độ mạnh mật khẩu
    const passCheck = validatePassword(newPassword);
    if (!passCheck.isValid) {
      return NextResponse.json(
        { success: false, error: passCheck.message },
        { status: 400 }
      );
    }

    // Tìm token trong database
    const resetRecord = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    }).catch(() => null);

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Mã đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại.' },
        { status: 400 }
      );
    }

    // Băm mật khẩu an toàn với bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu và hủy toàn bộ token reset của người dùng
    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.userId },
        data: {
          hashedPassword,
          lastActive: new Date(),
        },
      }),
      db.passwordResetToken.deleteMany({
        where: { userId: resetRecord.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu đã được cập nhật thành công an toàn. Vui lòng đăng nhập lại.',
    });
  } catch (error: any) {
    console.error('Lỗi bảo mật reset-password:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể đặt lại mật khẩu lúc này. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
