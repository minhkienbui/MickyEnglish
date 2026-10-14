'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Flame,
  User,
  Moon,
  Sun,
  Gem,
  Video,
  LogOut,
  Settings,
  ChevronDown,
  Shield,
  BookOpen,
  Route,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLanguageStore } from '@/stores/useLanguageStore';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme, isSidebarCollapsed } = useThemeStore();
  const { targetLanguage, setTargetLanguage } = useLanguageStore();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');
  const isLight = theme === 'light';
  const isChinese = targetLanguage === 'zh';

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }

    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountMenu]);

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    router.push('/');
    window.location.reload();
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all backdrop-blur-md border-b-2 ${
        isLight
          ? 'bg-[#faf6ee]/90 border-stone-800 text-stone-900 shadow-xs'
          : 'bg-[#12100e]/90 border-stone-700 text-stone-100'
      } ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
        {/* Mobile Logo Brand */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-xl shadow-[2px_2px_0px_#292524] shrink-0">
            🐼
          </div>
          <Link href="/" className="font-cartoon text-lg font-bold tracking-tight text-stone-900 dark:text-white">
            Micky <span className={isChinese ? 'text-[#c53428]' : 'text-amber-500'}>{isChinese ? 'Chinese' : 'English'}</span>
          </Link>
        </div>

        {/* Desktop Quick Search Bar */}
        <div className={`hidden md:flex items-center gap-2 border-2 px-3.5 py-1.5 rounded-xl w-72 text-xs focus-within:border-stone-800 shadow-[2px_2px_0px_#292524] transition-colors ${
          isLight ? 'bg-[#fffdf9] border-stone-800 text-stone-800' : 'bg-[#1e1a17] border-stone-700 text-stone-300'
        }`}>
          <Search className="w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder={isChinese ? "Tra cứu chữ Hán, Pinyin, HSK..." : "Tra cứu từ vựng hoặc bài học..."}
            className={`bg-transparent border-none outline-none w-full text-xs font-semibold ${
              isLight ? 'text-stone-900 placeholder-stone-400' : 'text-stone-100 placeholder-stone-500'
            }`}
          />
        </div>

        {/* Dual Language Switcher Pill (NhaiHSK Style) */}
        <div className="hidden sm:flex items-center">
          <div className={`inline-flex p-1 rounded-xl border-2 shadow-[2px_2px_0px_#292524] gap-1 ${
            isLight ? 'bg-[#ede4d3] border-stone-800' : 'bg-stone-800 border-stone-700'
          }`}>
            <button
              type="button"
              onClick={() => setTargetLanguage('en')}
              className={`px-3 py-1 rounded-lg font-cartoon font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                !isChinese
                  ? 'bg-amber-300 border border-stone-800 text-stone-900 shadow-[1px_1px_0px_#292524]'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <span>🇬🇧</span>
              <span>Tiếng Anh (EN)</span>
            </button>

            <button
              type="button"
              onClick={() => setTargetLanguage('zh')}
              className={`px-3 py-1 rounded-lg font-cartoon font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isChinese
                  ? 'bg-[#c53428] border border-stone-800 text-white shadow-[1px_1px_0px_#292524]'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <span>🇨🇳</span>
              <span>Tiếng Trung (ZH)</span>
            </button>
          </div>
        </div>

        {/* Right Action Icons & Gamification */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 border-2 border-stone-800 dark:border-stone-600 shadow-[2px_2px_0px_#292524]">
            <span className="text-xs">🔥</span>
            <span className="font-cartoon text-xs font-extrabold text-[#c53428] dark:text-red-400">
              {user?.streak ?? 7} ngày
            </span>
          </div>

          {/* XP pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-950/60 border-2 border-stone-800 dark:border-stone-600 shadow-[2px_2px_0px_#292524]">
            <span className="text-xs">⚡</span>
            <span className="font-cartoon text-xs font-extrabold text-amber-900 dark:text-amber-300">
              {(user?.diamonds ?? 100) * 10} XP
            </span>
          </div>

          {/* Admin shortcut */}
          {isAdmin && (
            <Link
              href="/admin/videos"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-200 dark:bg-purple-950 border-2 border-stone-800 text-purple-950 dark:text-purple-200 text-xs font-cartoon font-bold shadow-[2px_2px_0px_#292524]"
              title="Admin Panel"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer shadow-[2px_2px_0px_#292524] btn-press ${
              isLight
                ? 'bg-[#fffdf9] border-stone-800 text-stone-800 hover:bg-amber-100'
                : 'bg-[#1e1a17] border-stone-700 text-amber-300 hover:bg-stone-800'
            }`}
            title="Đổi giao diện Sáng / Tối"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* User Account / Login Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-stone-800 bg-amber-300 shadow-[2px_2px_0px_#292524] btn-press transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center font-cartoon font-bold text-xs overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(user.fullName || user.username || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="hidden sm:flex flex-col items-start text-left leading-tight pr-1">
                  <span className="font-cartoon font-bold text-xs text-stone-900 truncate max-w-[90px]">
                    {user.fullName || user.username}
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-stone-900 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU TÀI KHOẢN */}
              {showAccountMenu && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_#292524] p-3 space-y-2 animate-fade-in z-50 ${
                    isLight
                      ? 'bg-[#fffdf9] text-stone-900'
                      : 'bg-[#1e1a17] text-stone-100'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border-2 border-stone-800 ${
                    isLight ? 'bg-amber-100/60' : 'bg-stone-800/80'
                  }`}>
                    <p className="font-cartoon font-bold text-xs truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="font-hand text-xs text-stone-600 dark:text-stone-400 truncate">
                      {user.email || 'hocvien@mickyenglish.com'}
                    </p>
                  </div>

                  <div className="space-y-1 font-cartoon text-xs">
                    <Link
                      href="/tai-khoan"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-amber-600" />
                      <span>Thông tin tài khoản</span>
                    </Link>

                    <Link
                      href="/roadmap"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Route className="w-4 h-4 text-teal-600" />
                      <span>Lộ trình học tập</span>
                    </Link>

                    <Link
                      href="/cai-dat"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>Cài đặt hệ thống</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#c53428] hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-xl bg-stone-900 text-amber-200 font-cartoon font-bold text-xs hover:bg-[#c53428] border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
