'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  KeyRound,
  Download,
  Trash2,
  Edit,
  Eye,
  Gem,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpDown,
  Lock,
  Unlock,
} from 'lucide-react';
import { useAdminStore, AdminUserItem } from '@/stores/useAdminStore';

export default function AdminUsersPage() {
  const {
    users,
    updateUser,
    toggleUserRole,
    toggleUserBan,
    deleteUser,
    resetUserPassword,
    adjustUserDiamonds,
    resetUserStreak,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [providerFilter, setProviderFilter] = useState<'all' | 'email' | 'google'>('all');

  // Modals
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [adjustDiamondModal, setAdjustDiamondModal] = useState<AdminUserItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState<string>('Thưởng hoạt động xuất sắc');
  const [resetPassModal, setResetPassModal] = useState<AdminUserItem | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !u.isBanned) ||
        (statusFilter === 'banned' && u.isBanned);
      const matchesProvider = providerFilter === 'all' || u.provider === providerFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesProvider;
    });
  }, [users, searchQuery, roleFilter, statusFilter, providerFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID,Họ tên,Username,Email,Role,Đá Quý,Streak,Trạng thái,Provider,Ngày tạo\n'];
    const rows = filteredUsers.map(
      (u) =>
        `"${u.id}","${u.fullName}","${u.username}","${u.email}","${u.role}",${u.diamonds},${u.streak},"${
          u.isBanned ? 'Bị khóa' : 'Hoạt động'
        }","${u.provider}","${u.createdAt}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('✓ Đã xuất danh sách người dùng thành công (CSV).');
  };

  // Handle Diamond Adjustment Submit
  const handleDiamondSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustDiamondModal) return;
    adjustUserDiamonds(adjustDiamondModal.id, adjustAmount, adjustReason);
    showToast(`✓ Đã điều chỉnh ${adjustAmount > 0 ? '+' : ''}${adjustAmount} Đá Quý cho ${adjustDiamondModal.fullName}.`);
    setAdjustDiamondModal(null);
  };

  // Handle Password Reset Submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassModal || !newPassword) return;
    resetUserPassword(resetPassModal.id, newPassword);
    showToast(`✓ Đã đặt lại mật khẩu mới cho ${resetPassModal.fullName}.`);
    setResetPassModal(null);
    setNewPassword('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500 py-2.5 px-4 rounded-2xl text-xs font-black text-emerald-300 flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white">Quản lý Người dùng</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-black">
              {users.length} tài khoản
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Quản lý tài khoản học viên, phân quyền Admin, cấp thưởng Đá Quý và kiểm soát an toàn hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-[#334155] rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Xuất Excel / CSV</span>
        </button>
      </div>

      {/* TOOLBAR SEARCH & FILTERS */}
      <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, username, email..."
              className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2 pl-9 pr-4 text-xs text-white font-medium outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="user">Học viên (User)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="banned">Đang bị khóa</option>
            </select>
          </div>

          {/* Provider Filter */}
          <div className="sm:col-span-3">
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="all">Đăng ký qua: Tất cả</option>
              <option value="email">Đăng ký qua Email</option>
              <option value="google">Đăng ký qua Google</option>
            </select>
          </div>
        </div>
      </div>

      {/* BẢNG NGƯỜI DÙNG */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] border-b border-[#334155] text-slate-400 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Avatar & Người dùng</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 text-center">Vai trò</th>
                <th className="py-3.5 px-4 text-center">Đá Quý</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
                <th className="py-3.5 px-4 text-center">Đăng nhập cuối</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-bold">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isBanned = u.isBanned;

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[#273549]/60 transition-colors ${
                        isBanned ? 'bg-rose-950/10 opacity-75' : ''
                      }`}
                    >
                      {/* Avatar & Tên */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-[#334155] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate hover:text-emerald-300">{u.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">@{u.username}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email & Provider */}
                      <td className="py-3 px-4 max-w-[180px]">
                        <p className="text-slate-300 truncate">{u.email}</p>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{u.provider}</span>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleUserRole(u.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                            isAdmin
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 hover:bg-purple-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                          }`}
                          title="Click để đổi vai trò Admin / User"
                        >
                          {isAdmin ? '🛡️ Admin' : 'Học viên'}
                        </button>
                      </td>

                      {/* Diamonds */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setAdjustDiamondModal(u)}
                          className="inline-flex items-center gap-1 font-mono text-cyan-400 font-bold hover:underline cursor-pointer"
                          title="Click để cộng/trừ Đá Quý"
                        >
                          <Gem className="w-3 h-3 fill-cyan-400" />
                          <span>{u.diamonds.toLocaleString()}</span>
                        </button>
                      </td>

                      {/* Streak */}
                      <td className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">
                        <span className="inline-flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-emerald-400" /> {u.streak} ngày
                        </span>
                      </td>

                      {/* Last Login & IP */}
                      <td className="py-3 px-4 text-center text-[11px] text-slate-400">
                        <p>{new Date(u.lastLogin).toLocaleDateString('vi-VN')}</p>
                        <p className="text-[9px] text-slate-500 font-mono">{u.lastIp}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleUserBan(u.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                            isBanned
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          }`}
                          title="Click để Khóa / Mở khóa tài khoản"
                        >
                          {isBanned ? '🚫 Đã khóa' : '✓ Hoạt động'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155]"
                            title="Xem hồ sơ chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setResetPassModal(u)}
                            className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-amber-400 hover:text-amber-300 border border-[#334155] cursor-pointer"
                            title="Đặt lại mật khẩu"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${u.fullName}"?`)) {
                                deleteUser(u.id);
                                showToast(`🗑️ Đã xóa người dùng ${u.fullName}.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-[#334155] cursor-pointer"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ĐIỀU CHỈNH ĐÁ QUÝ */}
      {adjustDiamondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
          <form
            onSubmit={handleDiamondSubmit}
            className="w-full max-w-md bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-cyan-400">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Cộng / Trừ Đá Quý</h3>
                <p className="text-xs text-slate-400">Học viên: {adjustDiamondModal.fullName}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">
                Số lượng Đá Quý (Số dương = Cộng, Số âm = Trừ)
              </label>
              <input
                type="number"
                required
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-cyan-500 rounded-2xl py-2 px-3 text-xs font-mono text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Lý do điều chỉnh</label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="VD: Thưởng học viên xuất sắc, bồi hoàn sự cố..."
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-cyan-500 rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAdjustDiamondModal(null)}
                className="px-4 py-2 border border-[#334155] hover:bg-[#334155] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-md"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ĐẶT LẠI MẬT KHẨU */}
      {resetPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
          <form
            onSubmit={handlePasswordSubmit}
            className="w-full max-w-md bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Đặt lại mật khẩu</h3>
                <p className="text-xs text-slate-400">Học viên: {resetPassModal.fullName}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Mật khẩu mới</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới cho người dùng..."
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-amber-500 rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetPassModal(null)}
                className="px-4 py-2 border border-[#334155] hover:bg-[#334155] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-md"
              >
                Lưu mật khẩu mới
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
