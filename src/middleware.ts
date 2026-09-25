import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Public pages that don't need auth
        if (
          path === '/' ||
          path.startsWith('/dang-nhap') ||
          path.startsWith('/dictation-shadowing') ||
          path.startsWith('/tuvung') ||
          path.startsWith('/ky-nang') ||
          path.startsWith('/kho-de') ||
          path.startsWith('/tinh-nang') ||
          path.startsWith('/huong-dan') ||
          path.startsWith('/about') ||
          path.startsWith('/contact') ||
          path.startsWith('/privacy') ||
          path.startsWith('/terms') ||
          path.startsWith('/api/auth') ||
          path.startsWith('/api/dictation/lessons') ||
          path.startsWith('/api/vocabulary/sets') ||
          path.startsWith('/api/exams')
        ) {
          return true;
        }
        // Protected paths require token
        return !!token;
      },
    },
    pages: {
      signIn: '/dang-nhap',
    },
  }
);

export const config = {
  matcher: ['/tai-khoan/:path*', '/api/user/:path*'],
};
