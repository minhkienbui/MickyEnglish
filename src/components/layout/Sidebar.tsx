'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import PremiumModal from '@/components/common/PremiumModal';
import {
  Home,
  Route,
  Headphones,
  BookCheck,
  Dumbbell,
  GraduationCap,
  Gamepad2,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Gem,
  Crown,
  Trophy,
  PenTool,
  BookOpen,
  Languages,
  Video,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, isSidebarCollapsed, toggleSidebar } = useThemeStore();
  const { targetLanguage, setTargetLanguage } = useLanguageStore();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const isChinese = targetLanguage === 'zh';
  const isLight = theme === 'light';
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');

  const englishNavItems = [
    { name: 'Trang chủ', href: '/', icon: Home, badge: null },
    { name: 'Lộ trình học', href: '/roadmap', icon: Route, badge: 'HOT' },
    { name: 'Nghe chép (Dictation)', href: '/dictation-shadowing?mode=dictation', icon: Headphones, badge: null },
    { name: 'Nhại giọng (Shadowing)', href: '/dictation-shadowing?mode=shadowing', icon: Languages, badge: null },
    { name: 'Xếp từ & Phản xạ', href: '/tro-choi', icon: Gamepad2, badge: 'NEW' },
    { name: 'Từ điển 100K+', href: '/vocabulary', icon: BookCheck, badge: null },
    { name: 'Luyện thi (TOEIC/IELTS)', href: '/kho-de', icon: GraduationCap, badge: null },
    { name: 'Kho bài học (4.400+)', href: '/dictation-shadowing', icon: Video, badge: null },
    { name: 'Bảng xếp hạng', href: '/bang-xep-hang', icon: Trophy, badge: null },
    { name: 'Cài đặt', href: '/cai-dat', icon: Settings, badge: null },
  ];

  const chineseNavItems = [
    { name: 'Trang chủ HSK', href: '/', icon: Home, badge: null },
    { name: 'Lộ trình HSK 1–6', href: '/roadmap', icon: Route, badge: 'CHUẨN' },
    { name: 'Shadowing Tiếng Trung', href: '/dictation-shadowing', icon: Headphones, badge: null },
    { name: 'Từ vựng HSK 1 - 6', href: '/vocabulary', icon: BookCheck, badge: '5.4K' },
    { name: 'Tập viết chữ Hán', href: '/practice/hanzi-writer', icon: PenTool, badge: 'A4' },
    { name: 'Pinyin & 214 Bộ Thủ', href: '/practice/pinyin-radicals', icon: BookOpen, badge: null },
    { name: 'Bài khoá HSK Reading', href: '/practice/chinese-reading', icon: Languages, badge: null },
    { name: 'Trò chơi chữ Hán', href: '/tro-choi', icon: Gamepad2, badge: 'HOT' },
    { name: 'Thi thử HSK & HSKK', href: '/kho-de', icon: GraduationCap, badge: null },
    { name: 'Bảng xếp hạng HSK', href: '/bang-xep-hang', icon: Trophy, badge: null },
    { name: 'Cài đặt', href: '/cai-dat', icon: Settings, badge: null },
  ];

  const mainNavItems = isChinese ? chineseNavItems : englishNavItems;

  return (
    <>
      <aside
        className={`hidden md:flex flex-col justify-between fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 border-r-2 ${
          isLight
            ? 'bg-[#fdfbf7] border-stone-800 text-stone-800'
            : 'bg-[#181513] border-stone-700 text-stone-100'
        } ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-none">
          {/* App Brand Logo Header */}
          <div className={`h-20 px-4 flex items-center gap-3 border-b-2 shrink-0 ${
            isLight ? 'border-stone-800 bg-[#fffdf9]' : 'border-stone-700 bg-[#1e1a17]'
          }`}>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#292524] shrink-0">
                🐼
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-cartoon text-lg font-bold text-stone-900 dark:text-white tracking-tight leading-none truncate">
                    Micky {isChinese ? 'Chinese' : 'English'}
                  </span>
                  <span className="font-hand text-xs text-stone-600 dark:text-amber-300/80 leading-tight mt-1 truncate">
                    {isChinese ? 'Học HSK chuẩn NhaiHSK ✨' : 'Sổ tay nhại giọng vui vẻ ✨'}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Daily Target Small Notebook Widget */}
          {!isSidebarCollapsed && (
            <div className="p-3">
              <div className={`p-3 rounded-xl border-2 box-sketch-sm ${
                isLight ? 'bg-[#fff9ea] border-stone-800' : 'bg-[#221c17] border-stone-700'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-cartoon text-xs font-bold text-stone-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <span>🎯</span> Mục tiêu hôm nay
                  </span>
                  <span className="font-cartoon text-xs font-extrabold text-[#c53428] bg-amber-200 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-stone-800">
                    80%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-800 overflow-hidden p-0.5">
                  <div className="h-full bg-amber-400 rounded-full border-r border-stone-800" style={{ width: '80%' }} />
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold mt-1.5 text-right font-hand">
                  Đã học: 16/20 phút 👏
                </div>
              </div>
            </div>
          )}

          {/* Quick Dual Language Switcher in Sidebar */}
          {!isSidebarCollapsed ? (
            <div className="px-3 pb-2">
              <div className={`p-1 rounded-xl border-2 flex items-center justify-between gap-1 shadow-[2px_2px_0px_#292524] ${
                isLight ? 'bg-[#ede4d3] border-stone-800' : 'bg-stone-800 border-stone-700'
              }`}>
                <button
                  type="button"
                  onClick={() => setTargetLanguage('en')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-cartoon font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    !isChinese
                      ? 'bg-amber-300 text-stone-900 border border-stone-800 shadow-[1px_1px_0px_#292524]'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>Tiếng Anh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetLanguage('zh')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-cartoon font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isChinese
                      ? 'bg-[#c53428] text-white border border-stone-800 shadow-[1px_1px_0px_#292524]'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <span>🇨🇳</span>
                  <span>Tiếng Trung</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="px-2 py-2">
              <button
                type="button"
                onClick={() => setTargetLanguage(isChinese ? 'en' : 'zh')}
                className="w-full py-2 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer border-2 border-stone-800 shadow-[2px_2px_0px_#292524] bg-amber-300"
                title={isChinese ? 'Chuyển sang Tiếng Anh' : 'Chuyển sang Tiếng Trung'}
              >
                {isChinese ? '🇨🇳' : '🇬🇧'}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-2 py-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href.split('?')[0]);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-cartoon transition-all text-xs ${
                    isActive
                      ? isChinese
                        ? 'bg-[#c53428] text-white font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524]'
                        : 'bg-amber-300 text-stone-900 font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524]'
                      : isLight
                      ? 'text-stone-700 hover:bg-[#faebd7] hover:text-stone-900 border-2 border-transparent hover:border-stone-800'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white border-2 border-transparent hover:border-stone-700'
                  } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-black border border-stone-800 ${
                      item.badge === 'HOT'
                        ? 'bg-rose-400 text-white'
                        : 'bg-amber-400 text-stone-900'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Account / Membership Box */}
          <div className="mt-auto p-3">
            <div className={`p-3 rounded-xl border-2 flex items-center justify-between shadow-[2px_2px_0px_#292524] ${
              isLight ? 'bg-[#fff2db] border-stone-800 text-stone-800' : 'bg-[#241c14] border-stone-700 text-stone-100'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-400 border border-stone-800 flex items-center justify-center font-cartoon font-bold text-stone-900 text-xs shrink-0">
                  {isAuthenticated && user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    '🏆'
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="font-cartoon text-xs font-bold truncate">
                      {isAuthenticated ? user?.fullName || user?.username : 'Khách học tập'}
                    </span>
                    <span className="font-hand text-[11px] text-stone-600 dark:text-stone-400 truncate">
                      {isAuthenticated ? `Cấp ${Math.floor((user?.wordsLearned || 0) / 10) + 1} • Học viên` : 'Đăng nhập để lưu XP'}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                title={isSidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  );
}
