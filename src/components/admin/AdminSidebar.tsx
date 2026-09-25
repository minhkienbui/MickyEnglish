'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Users,
  Gem,
  Tag,
  MessageSquare,
  Bell,
  BarChart3,
  Shield,
  Settings,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import MickyMascot from '@/components/common/MickyMascot';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { comments } = useAdminStore();

  const pendingCommentsCount = comments.filter((c) => c.status === 'pending').length;

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      href: '/admin',
      active: pathname === '/admin',
    },
    {
      title: 'Quản lý Video',
      icon: <Video className="w-4 h-4" />,
      href: '/admin/videos',
      active: pathname.startsWith('/admin/videos'),
    },
    {
      title: 'Quản lý Người dùng',
      icon: <Users className="w-4 h-4" />,
      href: '/admin/users',
      active: pathname.startsWith('/admin/users'),
    },
    {
      title: 'Quản lý Đá Quý',
      icon: <Gem className="w-4 h-4" />,
      href: '/admin/diamonds',
      active: pathname.startsWith('/admin/diamonds'),
    },
    {
      title: 'Quản lý Tags & Danh mục',
      icon: <Tag className="w-4 h-4" />,
      href: '/admin/tags',
      active: pathname.startsWith('/admin/tags'),
    },
    {
      title: 'Quản lý Bình luận',
      icon: <MessageSquare className="w-4 h-4" />,
      href: '/admin/comments',
      active: pathname.startsWith('/admin/comments'),
      badge: pendingCommentsCount > 0 ? pendingCommentsCount : undefined,
    },
    {
      title: 'Thông báo hệ thống',
      icon: <Bell className="w-4 h-4" />,
      href: '/admin/notifications',
      active: pathname.startsWith('/admin/notifications'),
    },
    {
      title: 'Thống kê & Báo cáo',
      icon: <BarChart3 className="w-4 h-4" />,
      href: '/admin/analytics',
      active: pathname.startsWith('/admin/analytics'),
    },
    {
      title: 'Nhật ký hoạt động',
      icon: <Shield className="w-4 h-4" />,
      href: '/admin/logs',
      active: pathname.startsWith('/admin/logs'),
    },
    {
      title: 'Cài đặt hệ thống',
      icon: <Settings className="w-4 h-4" />,
      href: '/admin/settings',
      active: pathname.startsWith('/admin/settings'),
    },
  ];

  return (
    <aside className="w-[260px] bg-[#0f172a] border-r border-[#1e293b] min-h-screen flex flex-col justify-between shrink-0 font-sans select-none sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-5 p-4">
        {/* Header App + Admin info */}
        <div className="flex items-center gap-3 px-2 py-1">
          <MickyMascot size={36} />
          <div className="min-w-0">
            <Link href="/admin" className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              Micky<span className="text-emerald-400">Admin</span>
              <span className="px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400 text-[9px] font-black border border-emerald-500/40">
                PRO
              </span>
            </Link>
            <p className="text-[10px] text-slate-400 font-bold truncate">
              {user?.fullName || user?.username || 'Admin'}
            </p>
          </div>
        </div>

        {/* Navigation Items (10 Items) */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                item.active
                  ? 'bg-[#22c55e] text-white shadow-lg font-black'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={item.active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-[#1e293b] space-y-1.5 bg-[#0b1120]">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Về trang người dùng</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
