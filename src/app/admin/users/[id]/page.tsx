'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Shield,
  Gem,
  Flame,
  Clock,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Video,
  History,
  MessageSquare,
  Send,
  RotateCcw,
  KeyRound,
} from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { users, diamondTransactions, comments, adjustUserDiamonds, resetUserStreak, toggleUserBan, toggleUserRole } =
    useAdminStore();
  const { videos } = useAdminVideoStore();

  const user = users.find((u) => u.id === userId) || users[0];

  const [activeTab, setActiveTab] = useState<'videos' | 'history' | 'diamonds' | 'comments'>('videos');
  const [toastMsg, setToastMsg] = useState('');

  // Diamonds modal state
  const [showDiamondModal, setShowDiamondModal] = useState(false);
  const [diamondAmount, setDiamondAmount] = useState(100);
  const [diamondReason, setDiamondReason] = useState('Thưởng hoàn thành khóa học');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const userTxs = diamondTransactions.filter((t) => t.userId === user?.id);
  const userComments = comments.filter((c) => c.userId === user?.id);

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Không tìm thấy người dùng này.</p>
        <Link href="/admin/users" className="text-emerald-400 font-bold hover:underline mt-2 inline-block">
          Quay lại danh sách người dùng
        </Link>
      </div>
    );
  }

  const handleDiamondSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustUserDiamonds(user.id, diamondAmount, diamondReason);
    showToast(`✓ Đã điều chỉnh ${diamondAmount > 0 ? '+' : ''}${diamondAmount} Đá Quý cho ${user.fullName}`);
    setShowDiamondModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500 py-2.5 px-4 rounded-2xl text-xs font-black text-emerald-300 flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Back */}
      <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Chi tiết học viên: {user.fullName}
            </h1>
            <p className="text-xs text-slate-400">Hồ sơ người dùng, tiến độ học tập và lịch sử giao dịch Đá Quý</p>
          </div>
        </div>
      </div>

      {/* Main 2-column detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (4 cols): THÔNG TIN HỌC VIÊN & QUICK ACTIONS */}
        <div className="lg:col-span-4 bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-6 shadow-xl">
          {/* Avatar + Tên */}
          <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-[#334155]">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
            />
            <h2 className="text-base font-black text-white">{user.fullName}</h2>
            <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-black uppercase">
                {user.role}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  user.isBanned
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {user.isBanned ? '🚫 Bị khóa' : '✓ Hoạt động'}
              </span>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-[#0f172a] border border-[#334155] rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 block">Số dư Đá Quý</span>
              <span className="text-lg font-black text-cyan-400 font-mono">{user.diamonds.toLocaleString()} 💎</span>
            </div>
            <div className="p-3 bg-[#0f172a] border border-[#334155] rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 block">Chuỗi Streak</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{user.streak} ngày 🔥</span>
            </div>
          </div>

          {/* Meta Details */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">Email:</span>
              <span className="font-semibold text-white truncate max-w-[170px]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">Đăng ký qua:</span>
              <span className="font-bold text-white uppercase">{user.provider}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">Ngày tham gia:</span>
              <span className="text-slate-300">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">Đăng nhập cuối:</span>
              <span className="text-slate-300">{new Date(user.lastLogin).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">IP cuối:</span>
              <span className="font-mono text-slate-400">{user.lastIp}</span>
            </div>
          </div>

          {/* HÀNH ĐỘNG NHANH */}
          <div className="pt-4 border-t border-[#334155] space-y-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Hành động nhanh</h3>

            <button
              type="button"
              onClick={() => setShowDiamondModal(true)}
              className="w-full py-2 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Gem className="w-3.5 h-3.5" /> Cộng / Trừ Đá Quý
            </button>

            <button
              type="button"
              onClick={() => {
                resetUserStreak(user.id);
                showToast('✓ Đã reset chuỗi Streak về 0.');
              }}
              className="w-full py-2 px-3 bg-[#0f172a] hover:bg-[#334155] text-slate-300 border border-[#334155] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Streak về 0
            </button>

            <button
              type="button"
              onClick={() => {
                toggleUserBan(user.id);
                showToast(`✓ Đã ${user.isBanned ? 'mở khóa' : 'khóa'} tài khoản.`);
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                user.isBanned
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {user.isBanned ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{user.isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI (8 cols): TABS HOẠT ĐỘNG */}
        <div className="lg:col-span-8 bg-[#1e293b] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#334155] bg-[#0f172a] px-4">
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === 'videos' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
              }`}
            >
              🎬 Video đang học ({videos.slice(0, 3).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === 'history' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
              }`}
            >
              <History className="w-3.5 h-3.5 inline mr-1" /> Lịch sử học tập
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diamonds')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === 'diamonds' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
              }`}
            >
              💎 Giao dịch Đá Quý ({userTxs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === 'comments' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
              }`}
            >
              💬 Bình luận ({userComments.length})
            </button>
          </div>

          {/* Tab 1: Video đang học */}
          {activeTab === 'videos' && (
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-black text-white">Danh sách bài học đang thực hiện</h3>
              <div className="space-y-3">
                {videos.slice(0, 3).map((v, idx) => {
                  const progress = idx === 0 ? 95 : idx === 1 ? 60 : 30;
                  return (
                    <div key={v.id} className="p-4 bg-[#0f172a] border border-[#334155] rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                            alt={v.title}
                            className="w-12 h-8 rounded-lg object-cover bg-black"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{v.title}</p>
                            <p className="text-[10px] text-slate-400">{v.level} • {v.sentences.length} câu</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400 font-mono">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                        <div style={{ width: `${progress}%` }} className="h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Lịch sử học tập */}
          {activeTab === 'history' && (
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-black text-white">Timeline học tập theo ngày</h3>
              <div className="space-y-3">
                <div className="p-3.5 bg-[#0f172a] border border-[#334155] rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">Hoàn thành Shadowing: Japanese Leaf Carving</p>
                    <p className="text-[10px] text-slate-400">Độ chính xác: 95% • Thời lượng: 12 phút</p>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">+50 💎</span>
                </div>
                <div className="p-3.5 bg-[#0f172a] border border-[#334155] rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">Hoàn thành Dictation: The power of silence</p>
                    <p className="text-[10px] text-slate-400">Độ chính xác: 88% • Thời lượng: 18 phút</p>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">+50 💎</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Giao dịch Đá Quý */}
          {activeTab === 'diamonds' && (
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-black text-white">Lịch sử biến động số dư Đá Quý</h3>
              {userTxs.length === 0 ? (
                <p className="text-xs text-slate-500">Chưa có giao dịch nào được ghi nhận.</p>
              ) : (
                <div className="space-y-2">
                  {userTxs.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 bg-[#0f172a] border border-[#334155] rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{tx.reason}</p>
                        <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <span className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 💎
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Bình luận đã đăng */}
          {activeTab === 'comments' && (
            <div className="p-6 space-y-4">
              <h3 className="text-xs font-black text-white">Bình luận của học viên</h3>
              {userComments.length === 0 ? (
                <p className="text-xs text-slate-500">Học viên chưa đăng bình luận nào.</p>
              ) : (
                <div className="space-y-3">
                  {userComments.map((c) => (
                    <div key={c.id} className="p-3.5 bg-[#0f172a] border border-[#334155] rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold">{c.videoTitle}</span>
                        <span className="text-slate-500">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p className="text-xs text-slate-200">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL CỘNG/TRỪ ĐÁ QUÝ */}
      {showDiamondModal && (
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
                <p className="text-xs text-slate-400">Học viên: {user.fullName}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">
                Số lượng Đá Quý (+ để cộng, - để trừ)
              </label>
              <input
                type="number"
                required
                value={diamondAmount}
                onChange={(e) => setDiamondAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-mono text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Lý do điều chỉnh</label>
              <input
                type="text"
                required
                value={diamondReason}
                onChange={(e) => setDiamondReason(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDiamondModal(false)}
                className="px-4 py-2 border border-[#334155] text-slate-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-black shadow-md"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
