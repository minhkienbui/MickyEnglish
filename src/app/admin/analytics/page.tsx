'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Video,
  Gem,
  Download,
  Calendar,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';

export default function AdminAnalyticsPage() {
  const { users, diamondTransactions } = useAdminStore();
  const { videos } = useAdminVideoStore();

  const [activeTab, setActiveTab] = useState<'users' | 'videos' | 'diamonds' | 'export'>('users');
  const [exportType, setExportType] = useState('full_analytics');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Google vs Email Provider count
  const googleCount = users.filter((u) => u.provider === 'google').length;
  const emailCount = users.filter((u) => u.provider === 'email').length;
  const totalUsers = Math.max(1, users.length);

  // Top learners
  const topLearners = [...users]
    .sort((a, b) => (b.studiedVideosCount || 0) - (a.studiedVideosCount || 0))
    .slice(0, 10);

  // Top videos
  const topViewVideos = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  const lowViewVideos = [...videos].sort((a, b) => (a.views || 0) - (b.views || 0)).slice(0, 5);

  const handleExport = () => {
    let content = '';
    let filename = `report_${exportType}_${new Date().toISOString().slice(0, 10)}`;
    let mime = 'text/plain';

    if (exportFormat === 'json') {
      content = JSON.stringify({ users, videos, diamondTransactions }, null, 2);
      filename += '.json';
      mime = 'application/json';
    } else {
      content = 'Loai bao cao,Tong user,Tong video,Tong da quy\n';
      content += `Bao cao he thong,${users.length},${videos.length},${users.reduce((a, b) => a + b.diamonds, 0)}\n`;
      filename += '.csv';
      mime = 'text/csv';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    showToast(`✓ Đã tải xuống báo cáo định dạng ${exportFormat.toUpperCase()}.`);
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
            <BarChart3 className="w-6 h-6 text-emerald-400" /> Thống kê & Báo cáo
          </h1>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Báo cáo phân tích chuyên sâu về hành vi người học, hiệu suất bài học và dữ liệu kinh tế
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#334155] gap-2">
        {[
          { id: 'users', label: '👥 Người dùng', icon: Users },
          { id: 'videos', label: '🎬 Video & Bài học', icon: Video },
          { id: 'diamonds', label: '💎 Đá Quý & Kinh tế', icon: Gem },
          { id: 'export', label: '📊 Xuất báo cáo', icon: Download },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400 bg-[#1e293b]/40 rounded-t-2xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: NGƯỜI DÙNG */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active hours bar chart */}
            <div className="lg:col-span-8 bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-black text-white">Lượng học viên hoạt động theo khung giờ trong ngày</h2>
              <p className="text-xs text-slate-400">Giờ cao điểm học viên luyện Dictation & Shadowing nhiều nhất</p>

              <div className="h-48 flex items-end justify-between gap-1 pt-4 border-b border-l border-[#334155] px-2">
                {Array.from({ length: 24 }, (_, h) => {
                  const height =
                    h >= 19 && h <= 23
                      ? 70 + (h - 19) * 6
                      : h >= 6 && h <= 8
                      ? 45
                      : h >= 12 && h <= 14
                      ? 55
                      : 15 + Math.random() * 20;
                  return (
                    <div key={h} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full bg-emerald-500 rounded-t-sm group-hover:bg-emerald-400 transition-colors"
                      />
                      <span className="text-[9px] text-slate-500 font-mono">{h}h</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Provider share */}
            <div className="lg:col-span-4 bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-white">Phương thức đăng ký</h2>
                <p className="text-xs text-slate-400">Tỷ lệ người dùng đăng ký qua Google vs Email</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold pb-1">
                    <span className="text-blue-400">Google OAuth 2.0</span>
                    <span className="text-white">
                      {googleCount} ({Math.round((googleCount / totalUsers) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0f172a] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(googleCount / totalUsers) * 100}%` }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold pb-1">
                    <span className="text-emerald-400">Tài khoản Email</span>
                    <span className="text-white">
                      {emailCount} ({Math.round((emailCount / totalUsers) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0f172a] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(emailCount / totalUsers) * 100}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#0f172a] rounded-2xl border border-[#334155] text-center">
                <span className="text-xs text-slate-400 font-bold">Tổng số học viên: </span>
                <span className="text-xs font-black text-white font-mono">{users.length} tài khoản</span>
              </div>
            </div>
          </div>

          {/* Top 10 learners */}
          <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl">
            <h2 className="text-sm font-black text-white">🏆 Bảng vàng Top 10 Học viên chăm chỉ nhất</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f172a] text-slate-400 uppercase font-black text-[10px] border-b border-[#334155]">
                  <tr>
                    <th className="py-3 px-4 w-12">#</th>
                    <th className="py-3 px-4">Học viên</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">Số video đã học</th>
                    <th className="py-3 px-4 text-center">Thời gian luyện tập</th>
                    <th className="py-3 px-4 text-right">Chuỗi Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {topLearners.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-[#273549]/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <img src={u.avatar} alt={u.fullName} className="w-6 h-6 rounded-full object-cover" />
                        <span>{u.fullName}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                        {u.studiedVideosCount || 10 + idx * 3} bài
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-300">
                        {u.totalDictationMinutes || 60 + idx * 20} phút
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">{u.streak} ngày 🔥</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIDEO */}
      {activeTab === 'videos' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 10 viewed */}
            <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-black text-white">Top 10 Video xem nhiều nhất</h2>
              <div className="space-y-2.5">
                {topViewVideos.map((v, i) => (
                  <div
                    key={v.id}
                    className="p-3 bg-[#0f172a] rounded-2xl border border-[#334155] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold text-slate-500 w-4">{i + 1}</span>
                      <p className="font-bold text-white truncate max-w-xs">{v.title}</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">
                      {(v.views || 0).toLocaleString()} lượt
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low engagement videos */}
            <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-black text-white">Video ít tương tác (Cần tối ưu)</h2>
              <div className="space-y-2.5">
                {lowViewVideos.map((v, i) => (
                  <div
                    key={v.id}
                    className="p-3 bg-[#0f172a] rounded-2xl border border-[#334155] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold text-slate-500 w-4">{i + 1}</span>
                      <p className="font-bold text-white truncate max-w-xs">{v.title}</p>
                    </div>
                    <span className="font-mono text-amber-400 font-bold shrink-0">
                      {(v.views || 10).toLocaleString()} lượt
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ĐÁ QUÝ */}
      {activeTab === 'diamonds' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-3">
              <h2 className="text-sm font-black text-white">Nguồn kiếm Đá Quý phổ biến nhất</h2>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#0f172a] rounded-2xl flex justify-between">
                  <span>Hoàn thành bài tập Dictation / Shadowing</span>
                  <span className="font-bold text-emerald-400 font-mono">68%</span>
                </div>
                <div className="p-3 bg-[#0f172a] rounded-2xl flex justify-between">
                  <span>Duy trì chuỗi streak hàng ngày</span>
                  <span className="font-bold text-emerald-400 font-mono">22%</span>
                </div>
                <div className="p-3 bg-[#0f172a] rounded-2xl flex justify-between">
                  <span>Quà tặng đăng ký mới & Sự kiện</span>
                  <span className="font-bold text-emerald-400 font-mono">10%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-3">
              <h2 className="text-sm font-black text-white">Hành động tiêu Đá Quý phổ biến nhất</h2>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#0f172a] rounded-2xl flex justify-between">
                  <span>Mở khóa video bài học VIP Premium</span>
                  <span className="font-bold text-cyan-400 font-mono">75%</span>
                </div>
                <div className="p-3 bg-[#0f172a] rounded-2xl flex justify-between">
                  <span>Tự upload video cá nhân học tập</span>
                  <span className="font-bold text-cyan-400 font-mono">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: XUẤT BÁO CÁO */}
      {activeTab === 'export' && (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-6 max-w-xl animate-fade-in">
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Tùy chọn xuất báo cáo
            </h2>
            <p className="text-xs text-slate-400">Chọn định dạng tệp và xuất dữ liệu ra hệ thống bên ngoài</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Loại dữ liệu báo cáo</label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-bold text-white outline-none"
              >
                <option value="full_analytics">Tổng hợp toàn bộ hệ thống (Users + Videos + Kinh tế)</option>
                <option value="users_only">Báo cáo danh sách người dùng</option>
                <option value="videos_only">Báo cáo kho video bài học</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Định dạng tệp</label>
              <div className="grid grid-cols-3 gap-2">
                {(['csv', 'excel', 'json'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setExportFormat(fmt)}
                    className={`py-2 px-3 rounded-2xl text-xs font-black uppercase transition-all cursor-pointer ${
                      exportFormat === fmt
                        ? 'bg-[#22c55e] text-white shadow-md'
                        : 'bg-[#0f172a] text-slate-400 border border-[#334155]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleExport}
                className="w-full py-3 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống tệp báo cáo ({exportFormat.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
