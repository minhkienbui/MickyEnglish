'use client';

import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme, isSidebarCollapsed } = useThemeStore();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/dang-nhap' ||
    pathname === '/register' ||
    pathname === '/dang-ky' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isImmersiveStudio =
    pathname?.startsWith('/practice/see-write') ||
    pathname?.startsWith('/practice/reading') ||
    pathname?.startsWith('/practice/error-find') ||
    (pathname?.startsWith('/practice/bilingual-news/') && pathname !== '/practice/bilingual-news');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Yêu cầu đăng nhập chỉ đối với các trang cá nhân và cài đặt riêng
  useEffect(() => {
    if (!isHydrated) return;
    const isStrictProtected =
      pathname?.startsWith('/tai-khoan') ||
      pathname?.startsWith('/cai-dat');

    if (!isAuthenticated && isStrictProtected) {
      const redirectParam = pathname ? `?redirect=${encodeURIComponent(pathname)}` : '';
      router.push(`/login${redirectParam}`);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  const bgWrapper = theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0f17] text-slate-100';
  const mainBg = theme === 'light' ? 'bg-[#f8fafc]' : 'bg-[#0b0f17]';

  // Chờ đọc trạng thái đăng nhập đã lưu trong máy
  if (!isHydrated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgWrapper}`}>
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Các trang đăng nhập / đăng ký
  if (isAuthPage) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${bgWrapper} ${theme}`}>
        {children}
      </div>
    );
  }

  // Chế độ luyện tập chuyên sâu
  if (isImmersiveStudio) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${bgWrapper} ${theme}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-colors duration-200 ${bgWrapper} ${theme}`}>
      <Sidebar />
      <Navbar />
      <div
        className={`flex-grow ${mainBg} transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <main className={`min-h-[85vh] ${mainBg}`}>{children}</main>
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}
