'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Route, Headphones, BookCheck, Gamepad2, GraduationCap, User, PenTool } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useThemeStore } from '@/stores/useThemeStore';

export default function MobileNav() {
  const pathname = usePathname();
  const { targetLanguage } = useLanguageStore();
  const { theme } = useThemeStore();
  const isChinese = targetLanguage === 'zh';
  const isLight = theme === 'light';

  const englishNavItems = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Lộ trình', href: '/roadmap', icon: Route },
    { name: 'Dictation', href: '/dictation-shadowing', icon: Headphones },
    { name: 'Từ vựng', href: '/vocabulary', icon: BookCheck },
    { name: 'Luyện thi', href: '/kho-de', icon: GraduationCap },
    { name: 'Tài khoản', href: '/tai-khoan', icon: User },
  ];

  const chineseNavItems = [
    { name: 'HSK Chủ', href: '/', icon: Home },
    { name: 'Lộ trình', href: '/roadmap', icon: Route },
    { name: 'Shadowing', href: '/dictation-shadowing', icon: Headphones },
    { name: 'Từ vựng', href: '/vocabulary', icon: BookCheck },
    { name: 'Tập viết', href: '/practice/hanzi-writer', icon: PenTool },
    { name: 'Thi HSK', href: '/kho-de', icon: GraduationCap },
  ];

  const navItems = isChinese ? chineseNavItems : englishNavItems;

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 px-1 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] ${
      isLight ? 'bg-[#fffdf9] border-stone-800 text-stone-900' : 'bg-[#181513] border-stone-700 text-stone-100'
    }`}>
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl font-cartoon text-[11px] transition-all ${
                isActive
                  ? isChinese
                    ? 'bg-[#c53428] text-white font-bold border border-stone-800 shadow-[1px_1px_0px_#292524]'
                    : 'bg-amber-300 text-stone-900 font-bold border border-stone-800 shadow-[1px_1px_0px_#292524]'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[56px] leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
