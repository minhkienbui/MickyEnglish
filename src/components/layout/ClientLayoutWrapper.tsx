'use client';

import { useThemeStore } from '@/stores/useThemeStore';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme, isSidebarCollapsed } = useThemeStore();
  const pathname = usePathname();
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

  const bgWrapper = theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0f17] text-slate-100';
  const mainBg = theme === 'light' ? 'bg-[#f8fafc]' : 'bg-[#0b0f17]';

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
