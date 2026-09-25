import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { available: false, message: 'Email không được để trống' },
        { status: 400 }
      );
    }

    const clean = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clean)) {
      return NextResponse.json({
        available: false,
        message: 'Định dạng email không hợp lệ',
      });
    }

    try {
      const existing = await db.user.findUnique({
        where: { email: clean },
      });

      if (existing) {
        return NextResponse.json({
          available: false,
          message: 'Email này đã được đăng ký tài khoản ❌',
        });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      available: true,
      message: 'Email hợp lệ và có thể đăng ký ✅',
    });
  } catch (err: any) {
    return NextResponse.json(
      { available: false, message: err.message || 'Lỗi kiểm tra email' },
      { status: 500 }
    );
  }
}
