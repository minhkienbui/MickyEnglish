import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { ADMIN_EMAILS } from '@/stores/useAuthStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, fullName, name, password, avatar } = body;

    const finalFullName = (fullName || name || username || '').trim();
    const normalizedEmail = (email || '').toLowerCase().trim();
    const cleanUsername = (username || '').toLowerCase().trim();

    if (!finalFullName) {
      return NextResponse.json({ success: false, error: 'Họ và tên là bắt buộc' }, { status: 400 });
    }
    if (!cleanUsername) {
      return NextResponse.json({ success: false, error: 'Tên đăng nhập là bắt buộc' }, { status: 400 });
    }
    if (!normalizedEmail) {
      return NextResponse.json({ success: false, error: 'Email là bắt buộc' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Mật khẩu phải có tối thiểu 6 ký tự' }, { status: 400 });
    }

    // Role check: Nếu email nằm trong ADMIN_EMAILS -> gán role admin
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
    const role = isAdmin ? 'admin' : 'user';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let createdUser: any = null;

    try {
      // Check existing email
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
          image: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
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
        message: `Chào mừng ${finalFullName}! Tài khoản đã được tạo`,
        user: userProfile,
        token: `jwt-token-${userProfile.id}-${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Đã có lỗi xảy ra khi tạo tài khoản' },
      { status: 500 }
    );
  }
}
