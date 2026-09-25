'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import MickyMascot from '@/components/common/MickyMascot';
import PremiumModal from '@/components/common/PremiumModal';
import {
  Home,
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
  FileText,
  Monitor,
  Bell,
  Crown,
  Video,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, isSidebarCollapsed, toggleTheme, toggleSidebar } = useThemeStore();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const mainNavItems = [
    { name: 'Trang chủ', href: '/', icon: Home, badge: null },
    { name: 'Dictation & Shadowing', href: '/dictation-shadowing', icon: Headphones, badge: null },
    { name: 'Từ vựng', href: '/vocabulary', icon: BookCheck, badge: null },
    { name: 'Luyện tập', href: '/practice', icon: Dumbbell, badge: null },
    { name: 'Trò chơi', href: '/tro-choi', icon: Gamepad2, badge: 'NEW' },
    { name: 'Luyện thi', href: '/kho-de', icon: GraduationCap, badge: null },
  ];

  const isAdmin = user?.role === 'admin';
  const isLight = theme === 'light';

  return (
    <>
      <aside
        className={`hidden md:flex flex-col justify-between fixed top-0 left-0 bottom-0 z-40 p-4 transition-all duration-300 ${
          isLight
            ? 'bg-white border-r border-slate-200 text-slate-800 shadow-sm'
            : 'bg-[#0d131d] border-r border-[#1e2d42] text-slate-100'
        } ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="space-y-4">
          {/* Top Brand Logo Header */}
          <Link href="/" className="flex items-center gap-3 group px-2 py-1">
            <MickyMascot size={38} />
            {!isSidebarCollapsed && (
              <span className={`text-xl font-black tracking-tight group-hover:text-emerald-500 transition-colors ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Bibung<span className="text-emerald-500">English</span>
              </span>
            )}
          </Link>

          {/* User Card Info Box */}
          <div className={`rounded-2xl p-3 space-y-2.5 transition-colors ${
            isLight
              ? 'bg-slate-50 border border-slate-200 shadow-xs'
              : 'bg-[#131d2b] border border-[#1e2d42] shadow-inner'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0 overflow-hidden border border-emerald-400/40">
                  {isAuthenticated && user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{isAuthenticated && user ? (user.fullName || user.username || user.name || 'K').charAt(0) : 'K'}</span>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="leading-tight min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={`text-[11px] font-semibold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Xin chào</span>
                      {isAdmin && (
                        <span className="px-1.5 py-0.2 rounded-sm bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[9px] font-black border border-purple-500/40">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-black truncate max-w-[110px] block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {isAuthenticated && user ? user.fullName || user.username : 'Khách'}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={toggleSidebar}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isSidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Nút Premium Vàng Cam */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 fill-slate-950" /> Premium
                </span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-950/70" />
              </button>
            )}

            {/* 5 Biểu tượng chỉ số Gamification chuẩn Bibung: 💎, 🔥, 📝, 🖥️, 🔔 */}
            {!isSidebarCollapsed && (
              <div className={`flex items-center justify-between pt-2 border-t text-[11px] font-black ${
                isLight ? 'border-slate-200 text-slate-600' : 'border-[#1e2d42] text-slate-300'
              }`}>
                <span className="flex items-center gap-1 text-cyan-500 dark:text-cyan-400" title="Kim cương">
                  <Gem className="w-3.5 h-3.5 fill-cyan-500 dark:fill-cyan-400" /> {user?.diamonds ?? 0}
                </span>
                <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400" title="Chuỗi ngày streak">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" /> {user?.streak ?? 0}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400" title="Sổ từ vựng">
                  <FileText className="w-3.5 h-3.5" /> {user?.wordsLearned ?? 0}
                </span>
                <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400" title="Thời gian học">
                  <Monitor className="w-3.5 h-3.5" /> {user?.dictationMinutes ?? 0}
                </span>
                <button
                  onClick={() => alert('Bạn không có thông báo mới.')}
                  className={`relative p-0.5 rounded transition-colors cursor-pointer ${
                    isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Thông báo"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ${
                    isLight ? 'bg-emerald-500 ring-white' : 'bg-white ring-[#131d2b]'
                  }`} />
                </button>
              </div>
            )}
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? isLight
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                        : 'bg-[#152e25] text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#131d2b]'
                  }`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? isLight ? 'text-emerald-600' : 'text-emerald-400'
                        : isLight ? 'text-slate-500' : 'text-slate-400'
                    }`} />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && (
                    <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-md tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Admin Video Manager Link */}
            {isAdmin && (
              <Link
                href="/admin/videos"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  pathname.startsWith('/admin')
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-purple-400 hover:text-purple-200 hover:bg-[#131d2b]'
                }`}
                title={isSidebarCollapsed ? 'Quản lý Video (Admin)' : undefined}
              >
                <Video className="w-4 h-4 shrink-0 text-purple-400" />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Quản lý Video</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/30 text-[9px] font-black text-purple-300">
                      ADMIN
                    </span>
                  </div>
                )}
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom Account & Settings Links */}
        <div className={`space-y-1 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-[#1e2d42]'}`}>
          <Link
            href={isAuthenticated ? '/tai-khoan' : '/login'}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              pathname === '/tai-khoan'
                ? isLight
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-slate-100 hover:bg-[#131d2b]'
            }`}
          >
            <User className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            {!isSidebarCollapsed && <span>{isAuthenticated ? 'Tài khoản' : 'Đăng nhập'}</span>}
          </Link>

          <Link
            href="/cai-dat"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              pathname === '/cai-dat'
                ? isLight
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-slate-100 hover:bg-[#131d2b]'
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            {!isSidebarCollapsed && <span>Cài đặt</span>}
          </Link>
        </div>
      </aside>

      {/* Modal Nâng Cấp VIP */}
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  );
}

