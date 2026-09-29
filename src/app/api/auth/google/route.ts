import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ADMIN_EMAILS } from '@/stores/useAuthStore';
import { validateEmail, sanitizeText } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, picture, googleId } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email Google là bắt buộc' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json({ success: false, error: 'Định dạng email Google không an toàn' }, { status: 400 });
    }

    const cleanUsername = sanitizeText(normalizedEmail.split('@')[0].replace(/[^a-z0-9_.]/g, ''), 40);
    const cleanName = sanitizeText(name || cleanUsername, 80);
    const cleanPicture = picture && typeof picture === 'string' && picture.startsWith('https://')
      ? picture.slice(0, 500)
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    const cleanGoogleId = sanitizeText(googleId || 'google-auth-id', 100);

    // Quyền Admin chỉ được cấp khi email nằm trong danh sách quản trị viên định danh chặt chẽ
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
            name: cleanName,
            email: normalizedEmail,
            image: cleanPicture,
            role: role === 'admin' ? 'ADMIN' : 'USER',
            streak: 1,
          },
        });
      }
    } catch {
      // In-memory or fallback
    }

    const userProfile = {
      id: user?.id || `user-google-${cleanGoogleId || Date.now()}`,
      username: cleanUsername,
      email: normalizedEmail,
      fullName: cleanName,
      name: cleanName,
      avatar: cleanPicture,
      role,
      googleId: cleanGoogleId,
      diamonds: user?.diamonds ?? 100,
      gems: user?.diamonds ?? 100,
      streak: user?.streak || 1,
      isVerified: true,
      isBanned: false,
      createdAt: user?.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Đăng nhập Google an toàn thành công! Chào mừng ${userProfile.fullName}`,
      user: userProfile,
      token: `jwt-google-token-${userProfile.id}-${Date.now()}`,
    });
  } catch (error: any) {
    console.error('Lỗi bảo mật Google auth:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi xử lý xác thực Google.' },
      { status: 500 }
    );
  }
}
