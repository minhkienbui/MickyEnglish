'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, comments } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Breadcrumb Title
  const getBreadcrumbName = (path: string) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/videos')) return 'Quản lý Video';
    if (path.startsWith('/admin/users')) return 'Quản lý Người dùng';
    if (path.startsWith('/admin/diamonds')) return 'Quản lý Đá Quý';
    if (path.startsWith('/admin/tags')) return 'Quản lý Tags & Danh mục';
    if (path.startsWith('/admin/comments')) return 'Quản lý Bình luận';
    if (path.startsWith('/admin/notifications')) return 'Thông báo hệ thống';
    if (path.startsWith('/admin/analytics')) return 'Thống kê & Báo cáo';
    if (path.startsWith('/admin/logs')) return 'Nhật ký hoạt động';
    if (path.startsWith('/admin/settings')) return 'Cài đặt hệ thống';
    return 'Quản trị';
  };

  const pendingCommentsCount = comments.filter((c) => c.status === 'pending').length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#1e293b] px-6 flex items-center justify-between gap-4 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <Link href="/admin" className="hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-emerald-400 font-extrabold">{getBreadcrumbName(pathname)}</span>
      </div>

      {/* Global Search Bar (Users, Videos, Comments) */}
      <div className="hidden md:flex items-center gap-2.5 bg-[#1e293b] border border-[#334155] px-3.5 py-1.5 rounded-full w-80 text-xs text-slate-300 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm người dùng, video, bình luận..."
          className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-slate-500 font-medium"
        />
      </div>

      {/* Actions: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-300 hover:text-white transition-colors relative cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="p-3 border-b border-[#334155] flex items-center justify-between">
                <span className="text-xs font-black text-white">Thông báo hệ thống</span>
                <span className="text-[10px] text-emerald-400 font-bold">{notifications.length} tin mới</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#334155]/60">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#273549] transition-colors space-y-1">
                    <p className="text-xs font-bold text-white leading-snug">{n.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{n.content}</p>
                    <span className="text-[9px] text-slate-500 block pt-1">
                      {new Date(n.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#334155] text-center bg-[#151f30]">
                <Link
                  href="/admin/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-emerald-400 hover:underline font-bold"
                >
                  Xem tất cả thông báo →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/60 bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.avatar ? (
                <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.fullName || user?.username || 'A').charAt(0)}</span>
              )}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="text-xs font-black text-white block truncate max-w-[120px]">
                {user?.fullName || user?.username || 'Admin'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block">Quản trị viên</span>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in p-1 space-y-1">
              <div className="p-2.5 border-b border-[#334155]">
                <p className="text-xs font-black text-white">{user?.fullName || 'Quản trị viên'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@mickyenglish.com'}</p>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#273549] transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Cài đặt hệ thống</span>
              </Link>

              <Link
                href="/"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#273549] transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Về trang người dùng</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
