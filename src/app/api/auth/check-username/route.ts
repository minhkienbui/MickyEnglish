import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { available: false, message: 'Tên đăng nhập không được để trống' },
        { status: 400 }
      );
    }

    const clean = username.toLowerCase().trim();

    // Validate regex: a-z, 0-9, _, . (3 - 20 ký tự)
    const regex = /^[a-z0-9_.]{3,20}$/;
    if (!regex.test(clean)) {
      return NextResponse.json({
        available: false,
        message: 'Tên đăng nhập chỉ gồm 3-20 ký tự: a-z, 0-9, dấu _ và .',
      });
    }

    // Check reserved / existing usernames
    const reservedUsernames = ['admin', 'root', 'micky', 'bibung', 'system'];
    if (reservedUsernames.includes(clean)) {
      return NextResponse.json({
        available: false,
        message: 'Tên đăng nhập này đã được bảo lưu bởi hệ thống.',
      });
    }

    try {
      const existing = await db.user.findFirst({
        where: {
          OR: [{ name: clean }, { email: `${clean}@mickyenglish.com` }],
        },
      });

      if (existing) {
        return NextResponse.json({
          available: false,
          message: 'Tên đăng nhập này đã có người sử dụng ❌',
        });
      }
    } catch {
      // Fallback in local/mock mode
    }

    return NextResponse.json({
      available: true,
      message: 'Tên đăng nhập hợp lệ và còn trống ✅',
    });
  } catch (err: any) {
    return NextResponse.json(
      { available: false, message: err.message || 'Lỗi kiểm tra tên đăng nhập' },
      { status: 500 }
    );
  }
}
