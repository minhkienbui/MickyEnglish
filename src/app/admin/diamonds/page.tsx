'use client';

import React, { useState } from 'react';
import {
  Gem,
  Plus,
  Minus,
  Settings,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';

export default function AdminDiamondsPage() {
  const { users, rewards, diamondTransactions, updateRewardConfig, bulkAdjustDiamonds } = useAdminStore();

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkGroup, setBulkGroup] = useState<'all' | 'active' | 'admin'>('all');
  const [bulkAmount, setBulkAmount] = useState<number>(100);
  const [bulkReason, setBulkReason] = useState<string>('Thưởng sự kiện cuối tuần');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Stats calculation
  const totalCirculation = users.reduce((acc, u) => acc + (u.diamonds || 0), 0);

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bulkAdjustDiamonds(bulkGroup, bulkAmount, bulkReason);
    showToast(`✓ Đã phân phối ${bulkAmount > 0 ? '+' : ''}${bulkAmount} Đá Quý tới nhóm ${bulkGroup}.`);
    setShowBulkModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500 py-2.5 px-4 rounded-2xl text-xs font-black text-emerald-300 flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Gem className="w-6 h-6 text-cyan-400 fill-cyan-400" /> Quản lý Đá Quý (Diamonds)
          </h1>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Theo dõi dòng lưu thông kinh tế, cấu hình phần thưởng học tập và phân phối Đá Quý hàng loạt
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBulkModal(true)}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:scale-105 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Cộng / Trừ hàng loạt</span>
        </button>
      </div>

      {/* 4 STAT OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-slate-400">Tổng Đá Quý lưu thông</span>
          <p className="text-2xl font-black text-cyan-400 font-mono">{totalCirculation.toLocaleString()} 💎</p>
          <span className="text-[11px] text-slate-500 block">Trong toàn bộ {users.length} tài khoản</span>
        </div>

        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-slate-400">Đã cấp hôm nay</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">+450 💎</p>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Từ nhiệm vụ học tập
          </span>
        </div>

        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-slate-400">Đã cấp tuần này</span>
          <p className="text-2xl font-black text-blue-400 font-mono">+2,800 💎</p>
          <span className="text-[11px] text-slate-500">Đăng ký mới & streak</span>
        </div>

        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-2 shadow-lg">
          <span className="text-xs font-bold text-slate-400">Đã tiêu tuần này</span>
          <p className="text-2xl font-black text-amber-400 font-mono">-1,200 💎</p>
          <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> Mở khóa bài VIP
          </span>
        </div>
      </div>

      {/* CẤU HÌNH GIÁ TRỊ ĐÁ QUÝ */}
      <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" /> Bảng Cấu Hình Thưởng / Phí Đá Quý
            </h2>
            <p className="text-xs text-slate-400">Điều chỉnh số lượng Đá Quý thưởng hoặc tiêu hao cho từng hành động</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-black text-[10px] border-b border-[#334155]">
              <tr>
                <th className="py-3 px-4">Hành động của học viên</th>
                <th className="py-3 px-4 text-center">Số lượng Đá Quý (+ / -)</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Lưu thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {rewards.map((r) => (
                <tr key={r.id} className="hover:bg-[#273549]/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{r.action}</td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      value={r.rewardAmount}
                      onChange={(e) => updateRewardConfig(r.id, { rewardAmount: parseInt(e.target.value) || 0 })}
                      className="w-24 bg-[#0f172a] border border-[#334155] rounded-xl py-1 px-2.5 text-center text-xs font-mono text-cyan-400 font-bold outline-none"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => updateRewardConfig(r.id, { isEnabled: !r.isEnabled })}
                      className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer ${
                        r.isEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {r.isEnabled ? '✅ Bật' : '⊘ Tắt'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] text-slate-500">Tự động lưu</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LỊCH SỬ GIAO DỊCH ĐÁ QUÝ */}
      <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" /> Nhật ký giao dịch Đá Quý gần đây
          </h2>
          <span className="text-xs text-slate-400">{diamondTransactions.length} giao dịch</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-black text-[10px] border-b border-[#334155]">
              <tr>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Học viên</th>
                <th className="py-3 px-4 text-center">Số lượng</th>
                <th className="py-3 px-4">Lý do giao dịch</th>
                <th className="py-3 px-4 text-right">Người thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {diamondTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#273549]/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(tx.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{tx.userName}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    <span className={tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 💎
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{tx.reason}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-md bg-[#0f172a] text-slate-400 text-[10px] font-mono">
                      {tx.performedBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CỘNG/TRỪ HÀNG LOẠT */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
          <form
            onSubmit={handleBulkSubmit}
            className="w-full max-w-md bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-cyan-400">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Cộng / Trừ Đá Quý Hàng Loạt</h3>
                <p className="text-xs text-slate-400">Áp dụng cho toàn bộ danh sách người dùng theo bộ lọc</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Nhóm học viên áp dụng</label>
              <select
                value={bulkGroup}
                onChange={(e) => setBulkGroup(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none"
              >
                <option value="all">Tất cả người dùng ({users.length} tài khoản)</option>
                <option value="active">Chỉ người dùng đang hoạt động ({users.filter((u) => !u.isBanned).length})</option>
                <option value="admin">Chỉ tài khoản Admin ({users.filter((u) => u.role === 'admin').length})</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Số lượng Đá Quý (+ để tặng, - để trừ)</label>
              <input
                type="number"
                required
                value={bulkAmount}
                onChange={(e) => setBulkAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-mono text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Lý do</label>
              <input
                type="text"
                required
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                placeholder="VD: Quà tặng sự kiện ra mắt Micky 2.0..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border border-[#334155] text-slate-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-black shadow-md"
              >
                Xác nhận phân phối
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
