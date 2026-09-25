'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Headphones, BookCheck, Dumbbell, Gamepad2, GraduationCap, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Dictation', href: '/dictation-shadowing', icon: Headphones },
    { name: 'Từ vựng', href: '/vocabulary', icon: BookCheck },
    { name: 'Luyện tập', href: '/practice', icon: Dumbbell },
    { name: 'Trò chơi', href: '/tro-choi', icon: Gamepad2 },
    { name: 'Luyện thi', href: '/kho-de', icon: GraduationCap },
    { name: 'Tài khoản', href: '/tai-khoan', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d131d] border-t border-[#1e2d42] px-1 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href)) ||
            (item.href === '/vocabulary' && pathname.startsWith('/tuvung')) ||
            (item.href === '/practice' && pathname.startsWith('/ky-nang'));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                isActive ? 'text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'}`} />
              <span className="truncate max-w-[48px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

