'use client';

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Check,
  EyeOff,
  Trash2,
  AlertTriangle,
  Settings,
  CheckCircle2,
  ShieldAlert,
  Flag,
} from 'lucide-react';
import { useAdminStore, AdminCommentItem } from '@/stores/useAdminStore';

export default function AdminCommentsPage() {
  const { comments, updateCommentStatus, deleteComment, settings, updateSettings } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'hidden' | 'spam' | 'reported'>('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Settings State
  const [autoApprove, setAutoApprove] = useState(settings.commentAutoApproval);
  const [reportThreshold, setReportThreshold] = useState(settings.commentReportThreshold || 3);
  const [bannedKeywordsText, setBannedKeywordsText] = useState((settings.bannedKeywords || []).join(', '));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      const matchesSearch =
        c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.videoTitle.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'reported') {
        matchesStatus = c.reportCount > 0;
      } else if (statusFilter !== 'all') {
        matchesStatus = c.status === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [comments, searchQuery, statusFilter]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = bannedKeywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    updateSettings({
      commentAutoApproval: autoApprove,
      commentReportThreshold: reportThreshold,
      bannedKeywords: keywords,
    });
    showToast('✓ Đã lưu cài đặt kiểm duyệt bình luận.');
    setShowConfigModal(false);
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
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-400" /> Quản lý Bình luận
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black">
              {comments.length} bình luận
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Kiểm duyệt bình luận dưới video bài học, xử lý báo cáo vi phạm và cấu hình lọc từ cấm tự động
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          className="px-4 py-2.5 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-[#334155] rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>Cài đặt kiểm duyệt</span>
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo nội dung, người dùng, tiêu đề video..."
              className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2 pl-9 pr-4 text-xs text-white font-medium outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-6">
            <div className="flex flex-wrap gap-1.5 justify-end">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'pending', label: 'Chờ duyệt' },
                { id: 'approved', label: 'Đã duyệt' },
                { id: 'reported', label: 'Bị báo cáo' },
                { id: 'hidden', label: 'Đã ẩn' },
                { id: 'spam', label: 'Spam' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-[#0f172a] text-slate-400 hover:text-white border border-[#334155]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG BÌNH LUẬN */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-black text-[10px] border-b border-[#334155]">
              <tr>
                <th className="py-3.5 px-4">Học viên</th>
                <th className="py-3.5 px-4 max-w-sm">Nội dung bình luận</th>
                <th className="py-3.5 px-4">Video bài học</th>
                <th className="py-3.5 px-4 text-center">Báo cáo</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Thời gian</th>
                <th className="py-3.5 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredComments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-bold">
                    Không có bình luận nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredComments.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-[#273549]/40 transition-colors">
                      {/* User */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.userAvatar}
                            alt={c.userName}
                            className="w-8 h-8 rounded-full object-cover border border-[#334155]"
                          />
                          <span className="font-bold text-white truncate max-w-[110px]">{c.userName}</span>
                        </div>
                      </td>

                      {/* Content */}
                      <td className="py-3 px-4 max-w-sm">
                        <p className="text-slate-200 leading-relaxed">{c.content}</p>
                      </td>

                      {/* Video */}
                      <td className="py-3 px-4 max-w-[160px]">
                        <span className="text-emerald-400 font-bold truncate block">{c.videoTitle}</span>
                      </td>

                      {/* Reports */}
                      <td className="py-3 px-4 text-center">
                        {c.reportCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-bold font-mono">
                            <Flag className="w-3 h-3" /> {c.reportCount}
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            c.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : c.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : c.status === 'spam'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {c.status === 'approved'
                            ? 'Đã duyệt'
                            : c.status === 'pending'
                            ? 'Chờ duyệt'
                            : c.status === 'spam'
                            ? 'Spam'
                            : 'Đã ẩn'}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-center text-slate-400 text-[11px] font-mono">
                        {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {c.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateCommentStatus(c.id, 'approved');
                                showToast('✓ Đã phê duyệt bình luận.');
                              }}
                              className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-emerald-950 text-emerald-400 border border-[#334155] cursor-pointer"
                              title="Duyệt bình luận"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {c.status !== 'hidden' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateCommentStatus(c.id, 'hidden');
                                showToast('✓ Đã ẩn bình luận.');
                              }}
                              className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#334155] cursor-pointer"
                              title="Ẩn bình luận"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bình luận này?')) {
                                deleteComment(c.id);
                                showToast('🗑️ Đã xóa bình luận.');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-[#334155] cursor-pointer"
                            title="Xóa bình luận"
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

      {/* MODAL CÀI ĐẶT KIỂM DUYỆT */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
          <form
            onSubmit={handleSaveConfig}
            className="w-full max-w-md bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-indigo-400">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Cài đặt kiểm duyệt bình luận</h3>
                <p className="text-xs text-slate-400">Thiết lập tự động phát hiện và chặn vi phạm</p>
              </div>
            </div>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white block">Tự động duyệt bình luận mới</span>
                <span className="text-[11px] text-slate-400 block">Bình luận hợp lệ sẽ hiển thị ngay lập tức</span>
              </div>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="w-4 h-4 text-indigo-500 rounded-sm cursor-pointer"
              />
            </label>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">
                Số lượt báo cáo để tự động ẩn bình luận
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={reportThreshold}
                onChange={(e) => setReportThreshold(parseInt(e.target.value) || 3)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-mono text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">
                Danh sách từ khóa cấm (ngăn cách bằng dấu phẩy)
              </label>
              <textarea
                rows={3}
                value={bannedKeywordsText}
                onChange={(e) => setBannedKeywordsText(e.target.value)}
                placeholder="spam, hack, lua dao, bit.ly, ..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl p-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 border border-[#334155] text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                Lưu cấu hình
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
