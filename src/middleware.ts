import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const response = NextResponse.next();

    // Security Response Headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Strict Admin Protection: Chỉ tài khoản có role admin mới được vào /admin
    if (path.startsWith('/admin')) {
      const userRole = (token as any)?.role || (token as any)?.user?.role;
      const isAdmin = userRole?.toLowerCase() === 'admin';
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(path), req.url));
      }
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Route bảo vệ nghiêm ngặt: /admin cần token
        if (path.startsWith('/admin')) {
          return !!token;
        }

        // Route bảo vệ tài khoản cá nhân: /tai-khoan, /api/user
        if (path.startsWith('/tai-khoan') || path.startsWith('/api/user')) {
          return !!token;
        }

        // Mặc định các trang khác cho phép khách truy cập
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/tai-khoan/:path*', '/api/user/:path*'],
};
