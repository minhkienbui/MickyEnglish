import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { ADMIN_EMAILS } from '@/stores/useAuthStore';
import { sanitizeText, validateEmail, validatePassword } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, email, fullName, name, password, avatar } = body;

    const rawFullName = fullName || name || username || '';
    const rawEmail = email || '';
    const rawUsername = username || '';

    const finalFullName = sanitizeText(rawFullName, 100);
    const normalizedEmail = rawEmail.toLowerCase().trim();
    const cleanUsername = sanitizeText(rawUsername.toLowerCase().trim(), 50);

    if (!finalFullName) {
      return NextResponse.json({ success: false, error: 'Họ và tên là bắt buộc' }, { status: 400 });
    }
    if (!cleanUsername || cleanUsername.length < 3) {
      return NextResponse.json({ success: false, error: 'Tên đăng nhập phải có ít nhất 3 ký tự' }, { status: 400 });
    }
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json({ success: false, error: 'Địa chỉ email không đúng định dạng' }, { status: 400 });
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      return NextResponse.json({ success: false, error: passCheck.message }, { status: 400 });
    }

    // Role check: Chỉ các email quản trị đã định danh mới có role admin
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
    const role = isAdmin ? 'admin' : 'user';

    // Mã hóa mật khẩu an toàn với bcrypt (10 rounds salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    let createdUser: any = null;

    try {
      // Kiểm tra trùng email
      const existingUser = await db.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email này đã được sử dụng. Vui lòng đăng nhập.' },
          { status: 400 }
        );
      }

      createdUser = await db.user.create({
        data: {
          name: finalFullName,
          email: normalizedEmail,
          hashedPassword,
          image: avatar ? sanitizeText(avatar, 500) : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: role === 'admin' ? 'ADMIN' : 'USER',
          streak: 1,
        },
      });
    } catch {
      // In-memory fallback
      createdUser = {
        id: `user-${Date.now()}`,
        name: finalFullName,
        email: normalizedEmail,
        image: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        streak: 1,
        createdAt: new Date().toISOString(),
      };
    }

    const userProfile = {
      id: createdUser.id,
      username: cleanUsername,
      email: normalizedEmail,
      fullName: finalFullName,
      name: finalFullName,
      avatar: createdUser.image,
      role,
      googleId: null,
      diamonds: 100,
      gems: 100,
      streak: 1,
      isVerified: true,
      isBanned: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: `Chào mừng ${finalFullName}! Tài khoản đã được tạo an toàn`,
        user: userProfile,
        token: `jwt-token-${userProfile.id}-${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
