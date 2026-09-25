'use client';

import React, { useState } from 'react';
import {
  Bell,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAdminStore, AdminNotificationItem } from '@/stores/useAdminStore';

export default function AdminNotificationsPage() {
  const { notifications, createNotification, deleteNotification } = useAdminStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<AdminNotificationItem['type']>('general');
  const [link, setLink] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'group' | 'specific'>('all');
  const [targetGroup, setTargetGroup] = useState('B1');
  const [scheduledAt, setScheduledAt] = useState('');

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createNotification({
      title: title.trim(),
      content: content.trim(),
      type,
      link: link.trim() || undefined,
      targetType,
      targetGroup: targetType === 'group' ? targetGroup : undefined,
      scheduledAt: scheduledAt || undefined,
      status: scheduledAt ? 'scheduled' : 'sent',
    });

    showToast(scheduledAt ? '⏰ Đã lên lịch gửi thông báo thành công!' : '🚀 Đã phát sóng thông báo tới học viên!');
    setIsFormOpen(false);
    setTitle('');
    setContent('');
    setLink('');
    setScheduledAt('');
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" /> Thông báo Hệ thống
          </h1>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Soạn thảo và phát sóng thông báo tới toàn bộ người dùng hoặc phân đoạn học viên theo cấp độ
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Đóng biểu mẫu' : '＋ Soạn thông báo mới'}</span>
        </button>
      </div>

      {/* FORM SOẠN THÔNG BÁO MỚI */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-5 shadow-2xl animate-fade-in"
        >
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" /> Biểu mẫu gửi thông báo mới
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-xs font-black text-slate-300">
                Tiêu đề thông báo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Cập nhật tính năng Shadowing 2.0..."
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2.5 px-4 text-xs text-white outline-none"
              />
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-black text-slate-300">Loại thông báo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2.5 px-3 text-xs font-bold text-white outline-none"
              >
                <option value="general">📢 Thông báo chung</option>
                <option value="promo">🎁 Sự kiện / Khuyến mãi</option>
                <option value="feature">🏆 Cập nhật tính năng</option>
                <option value="maintenance">⚠️ Bảo trì hệ thống</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300">
              Nội dung thông báo <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung chi tiết thông báo..."
              className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl p-3 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300">Liên kết đính kèm</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/dictation-shadowing hoặc link ngoài..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300">Đối tượng nhận tin</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none"
              >
                <option value="all">Tất cả người dùng</option>
                <option value="group">Theo phân nhóm cấp độ</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300">Lên lịch gửi (Tùy chọn)</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-[#334155] text-slate-300 rounded-xl text-xs font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{scheduledAt ? 'Lên lịch phát sóng' : 'Gửi ngay bây giờ'}</span>
            </button>
          </div>
        </form>
      )}

      {/* LỊCH SỬ THÔNG BÁO */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-black text-[10px] border-b border-[#334155]">
              <tr>
                <th className="py-3.5 px-4">Loại & Tiêu đề</th>
                <th className="py-3.5 px-4 max-w-sm">Nội dung</th>
                <th className="py-3.5 px-4 text-center">Đối tượng</th>
                <th className="py-3.5 px-4 text-center">Đã gửi / Đã đọc</th>
                <th className="py-3.5 px-4 text-center">Thời gian</th>
                <th className="py-3.5 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {notifications.map((n) => (
                <tr key={n.id} className="hover:bg-[#273549]/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white leading-snug">{n.title}</p>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold">{n.type}</span>
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <p className="text-slate-300 line-clamp-2 leading-relaxed">{n.content}</p>
                    {n.link && <p className="text-[10px] text-blue-400 font-mono pt-0.5">{n.link}</p>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md bg-[#0f172a] text-slate-300 text-[10px] font-bold">
                      {n.targetType === 'all' ? 'Tất cả' : `Nhóm ${n.targetGroup}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-white font-bold">{n.readCount}</span>
                    <span className="text-slate-500"> / {n.sentCount}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 text-[11px]">
                    {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Xóa thông báo này khỏi lịch sử?')) {
                          deleteNotification(n.id);
                          showToast('🗑️ Đã xóa thông báo.');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-[#334155] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
