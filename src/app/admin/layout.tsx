'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Lock, Home } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addLog } = useAdminStore();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
    } else if (!isAdmin && user) {
      // Log access attempt
      addLog({
        adminId: user.id,
        adminName: user.fullName || user.username || 'Khách',
        action: 'auth.forbidden_access_attempt',
        targetType: 'auth',
        targetId: user.id,
        newValue: { role: user.role, email: user.email },
        ipAddress: '192.168.1.247',
      });
    }
  }, [isAuthenticated, isAdmin, user, router, addLog]);

  // [PHẦN 0] 403 Forbidden View if user is not Admin
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#1e293b] border border-[#334155] p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">403 — Không có quyền truy cập</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khu vực này chỉ dành riêng cho tài khoản quản trị viên (<strong>Admin</strong>). Tài khoản hiện tại của bạn không có đủ quyền hạn để truy cập.
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-[#334155] text-left text-xs space-y-1">
            <p className="text-slate-400 font-bold">Gợi ý đăng nhập admin:</p>
            <p className="text-emerald-400 font-mono">Tài khoản: <strong>admin</strong></p>
            <p className="text-emerald-400 font-mono">Mật khẩu: <strong>1</strong></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 bg-[#334155] hover:bg-slate-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" /> Về trang chủ
            </Link>

            <Link
              href="/login?redirect=/admin"
              className="flex-1 py-2.5 px-4 bg-[#22c55e] hover:bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              Đăng nhập Admin →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Authenticated View
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex font-sans antialiased">
      {/* Sidebar Cố định 260px */}
      <AdminSidebar />

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#0f172a]">{children}</main>
      </div>
    </div>
  );
}
