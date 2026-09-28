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
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import MickyMascot from '@/components/common/MickyMascot';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme, isSidebarCollapsed } = useThemeStore();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');
  const isLight = theme === 'light';

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
      className={`sticky top-0 z-30 w-full transition-all backdrop-blur-md ${
        isLight
          ? 'bg-white/95 border-b border-slate-200 text-slate-800 shadow-xs'
          : 'bg-[#0b0f17]/90 border-b border-[#1e2d42] text-slate-100'
      } ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Mobile Logo Brand */}
        <div className="flex md:hidden items-center gap-2">
          <MickyMascot size={36} />
          <Link href="/" className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Micky<span className="text-emerald-500">English</span>
          </Link>
        </div>

        {/* Desktop Quick Search Bar */}
        <div className={`hidden md:flex items-center gap-2 border px-3.5 py-1.5 rounded-full w-80 text-xs focus-within:border-emerald-500 transition-colors ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-[#121b28] border-[#1e2d42] text-slate-400'
        }`}>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tra cứu từ vựng hoặc bài học bất kỳ..."
            className={`bg-transparent border-none outline-none w-full text-xs font-medium ${
              isLight ? 'text-slate-900 placeholder-slate-400' : 'text-slate-200 placeholder-slate-500'
            }`}
          />
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Shortcut Button (Chỉ Admin mới thấy) */}
          {isAdmin && (
            <Link
              href="/admin/videos"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 hover:text-white text-xs font-black transition-all shadow-sm"
              title="Trang quản lý video bài học (Admin)"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Admin Video</span>
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-xs'
                : 'bg-[#121b28] border-[#1e2d42] text-slate-300 hover:text-white'
            }`}
            title="Đổi giao diện Sáng / Tối"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Diamonds & Streak Display (Chỉ hiển thị khi đã đăng nhập) */}
          {isAuthenticated && user && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800 text-xs font-black shadow-xs">
                <Gem className="w-3.5 h-3.5 fill-cyan-400" />
                <span>{user.diamonds ?? 100}</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-black shadow-xs">
                <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
                <span>{user.streak ?? 1} ngày</span>
              </div>
            </>
          )}

          {/* Phần tài khoản góc phải (Người dùng / Admin / Khách) */}
          {isAuthenticated && user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className={`flex items-center gap-2 p-1.5 rounded-2xl border transition-all cursor-pointer ${
                  showAccountMenu
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-[#121c2b]'
                    : isLight
                    ? 'border-slate-200 hover:bg-slate-100'
                    : 'border-[#1e2d42] hover:bg-[#121c2b]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-md overflow-hidden border border-emerald-400/40 shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(user.fullName || user.username || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="hidden sm:flex flex-col items-start text-left leading-tight pr-1">
                  <span className={`font-black text-xs truncate max-w-[100px] ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {user.fullName || user.username}
                  </span>
                  <span className={`text-[10px] font-bold ${isAdmin ? 'text-purple-400' : 'text-emerald-500'}`}>
                    {isAdmin ? 'Quản trị viên' : 'Học viên'}
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showAccountMenu ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>

              {/* DROPDOWN MENU TÀI KHOẢN */}
              {showAccountMenu && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-3xl border shadow-2xl p-2.5 space-y-1.5 animate-fade-in z-50 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-[#111a28] border-[#1e2d42] text-slate-100'
                  }`}
                >
                  {/* User Profile Header */}
                  <div className={`p-3 rounded-2xl border ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#142033] border-[#1e2d42]'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md overflow-hidden border border-emerald-400/40 shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{(user.fullName || user.username || 'U').charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className={`font-black text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {user.fullName || user.username}
                          </p>
                          {isAdmin && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[9px] font-black border border-purple-500/40">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{user.email || 'hocvien@mickyenglish.com'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-0.5 pt-1">
                    <Link
                      href="/tai-khoan"
                      onClick={() => setShowAccountMenu(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#16253c] text-slate-200'
                      }`}
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>Thông tin tài khoản</span>
                    </Link>

                    <Link
                      href="/cai-dat"
                      onClick={() => setShowAccountMenu(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#16253c] text-slate-200'
                      }`}
                    >
                      <Settings className="w-4 h-4 text-blue-400" />
                      <span>Cài đặt giao diện & học tập</span>
                    </Link>

                    {/* Admin Portal Shortcut */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowAccountMenu(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-400 transition-colors ${
                          isLight ? 'hover:bg-purple-50' : 'hover:bg-purple-950/30'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Trang Quản trị Hệ thống</span>
                      </Link>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={`border-t my-1 ${isLight ? 'border-slate-200' : 'border-[#1e2d42]'}`} />

                  {/* Logout Action Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Khách (Guest) - Các nút Đăng nhập & Đăng ký */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="btn-micky-primary text-xs px-3.5 py-2 font-black rounded-xl shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>

              <Link
                href="/register"
                className={`hidden sm:inline-flex text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                  isLight
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    : 'border-[#1e2d42] hover:bg-[#121c2b] text-slate-300'
                }`}
              >
                <span>Đăng ký</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
