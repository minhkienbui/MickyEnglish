import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ADMIN_EMAILS } from '@/stores/useAuthStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, picture, googleId } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email Google là bắt buộc' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanUsername = normalizedEmail.split('@')[0].replace(/[^a-z0-9_.]/g, '');
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
    const role = isAdmin ? 'admin' : 'user';

    let user: any = null;
    try {
      user = await db.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        user = await db.user.create({
          data: {
            name: name || cleanUsername,
            email: normalizedEmail,
            image: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            streak: 1,
          },
        });
      }
    } catch {
      // Fallback in demo mode
    }

    const userProfile = {
      id: user?.id || `user-google-${googleId || Date.now()}`,
      username: cleanUsername,
      email: normalizedEmail,
      fullName: name || cleanUsername,
      name: name || cleanUsername,
      avatar: picture || user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role,
      googleId: googleId || 'google-auth-id',
      diamonds: 100,
      gems: 100,
      streak: user?.streak || 1,
      isVerified: true,
      isBanned: false,
      createdAt: user?.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Đăng nhập Google thành công! Chào mừng ${userProfile.fullName}`,
      user: userProfile,
      token: `jwt-google-token-${userProfile.id}-${Date.now()}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý đăng nhập Google' },
      { status: 500 }
    );
  }
}
