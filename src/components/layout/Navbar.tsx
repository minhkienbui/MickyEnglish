'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Flame, User, Moon, Sun, Gem, ShieldAlert, Video } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import MickyMascot from '@/components/common/MickyMascot';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme, isSidebarCollapsed } = useThemeStore();

  const isAdmin = user?.role === 'admin';
  const isLight = theme === 'light';

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
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Shortcut Button */}
          {isAdmin && (
            <Link
              href="/admin/videos"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 hover:text-white text-xs font-black transition-all shadow-sm"
              title="Trang quản lý video bài học"
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

          {/* Diamonds & Streak Display */}
          {isAuthenticated && user && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800 text-xs font-black shadow-xs">
                <Gem className="w-3.5 h-3.5 fill-cyan-400" />
                <span>{user.diamonds ?? 100}</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-black shadow-xs">
                <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
                <span>{user.streak} ngày</span>
              </div>
            </>
          )}

          {/* Profile / Login */}
          {isAuthenticated && user ? (
            <Link
              href="/tai-khoan"
              className="flex items-center gap-2 p-1 rounded-xl text-xs font-bold text-white hover:bg-[#121b28] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-md overflow-hidden border border-emerald-400/40">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user.fullName || user.username || 'U').charAt(0)}</span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs text-slate-200">
                {user.fullName || user.username}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-micky-primary text-xs px-3.5 py-2">
                <User className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
