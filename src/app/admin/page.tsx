'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Video,
  BookOpen,
  Gem,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';

export default function AdminDashboardPage() {
  const { users, logs } = useAdminStore();
  const { videos } = useAdminVideoStore();

  const [chartDays, setChartDays] = useState<'7' | '30' | '90'>('30');

  // Video level distribution count
  const levelCounts: Record<string, number> = {
    A1: videos.filter((v) => v.level === 'A1').length || 18,
    A2: videos.filter((v) => v.level === 'A2').length || 24,
    B1: videos.filter((v) => v.level === 'B1').length || 28,
    B2: videos.filter((v) => v.level === 'B2').length || 12,
    C1: videos.filter((v) => v.level === 'C1').length || 5,
    C2: videos.filter((v) => v.level === 'C2').length || 2,
  };

  const totalLevelVideos = Object.values(levelCounts).reduce((a, b) => a + b, 0);

  // Top 5 Most Studied Videos
  const topVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  // Recent 4 registered users
  const recentUsers = users.slice(0, 4);

  // Mock Active Chart data points
  const daysCount = chartDays === '7' ? 7 : chartDays === '30' ? 30 : 90;
  const chartData = Array.from({ length: Math.min(15, daysCount) }, (_, i) => {
    const day = i + 1;
    const studyCount = 180 + Math.sin(i * 0.8) * 80 + i * 12;
    const newUsers = 8 + Math.cos(i * 0.5) * 5 + Math.floor(i * 0.8);
    return { day: `Ngày ${day}`, studyCount: Math.round(studyCount), newUsers: Math.max(1, Math.round(newUsers)) };
  });

  const maxStudy = Math.max(...chartData.map((d) => d.studyCount), 350);

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Dashboard Tổng Quan <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 font-medium pt-0.5">
            Tổng hợp dữ liệu người dùng, video, đá quý và hoạt động thời gian thực của Micky English
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/videos/new"
            className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            ＋ Thêm video mới
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG 1 — STAT CARDS (4 thẻ ngang) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng người dùng */}
        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 relative overflow-hidden shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng người dùng</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">1,234</span>
            <span className="text-xs text-emerald-400 font-bold block pt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12 hôm nay
            </span>
          </div>
        </div>

        {/* Card 2: Tổng video */}
        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 relative overflow-hidden shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng video</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">{videos.length || 89}</span>
            <span className="text-xs text-purple-300 font-bold block pt-1">
              +3 tuần này
            </span>
          </div>
        </div>

        {/* Card 3: Lượt học hôm nay */}
        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 relative overflow-hidden shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Lượt học hôm nay</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">456</span>
            <span className="text-xs text-emerald-400 font-bold block pt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> ↑ 23% so với hôm qua
            </span>
          </div>
        </div>

        {/* Card 4: Đá Quý lưu thông */}
        <div className="p-5 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 relative overflow-hidden shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Đá Quý lưu thông</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">12,500 💎</span>
            <span className="text-xs text-cyan-400 font-bold block pt-1">
              Tuần này
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG 2 — BIỂU ĐỒ HOẠT ĐỘNG VÀ PHÂN BỐ CẤP ĐỘ */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái (70% ~ 8 cols): Biểu đồ đường Người dùng hoạt động */}
        <div className="lg:col-span-8 bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-white">Người dùng hoạt động ({chartDays} ngày qua)</h2>
              <p className="text-[11px] text-slate-400">Tương quan giữa tổng lượt học và người dùng mới đăng ký</p>
            </div>

            {/* Filter 7 / 30 / 90 ngày */}
            <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-[#334155]">
              {(['7', '30', '90'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setChartDays(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    chartDays === d ? 'bg-[#22c55e] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d} ngày
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-64 pt-4 flex flex-col justify-between">
            <div className="flex items-center gap-6 text-xs font-bold pb-2">
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-400" /> Tổng lượt học
              </span>
              <span className="flex items-center gap-2 text-blue-400">
                <span className="w-3 h-3 rounded-full bg-blue-400" /> Người dùng mới
              </span>
            </div>

            <div className="relative w-full flex-1 flex items-end gap-2 border-b border-l border-[#334155] p-2">
              {chartData.map((item, idx) => {
                const heightStudy = (item.studyCount / maxStudy) * 100;
                const heightUser = (item.newUsers / 30) * 100;

                return (
                  <div key={idx} className="flex-1 flex items-end justify-center gap-1 group relative h-full">
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-[#0f172a] border border-[#334155] p-2 rounded-xl text-[10px] whitespace-nowrap shadow-xl z-20">
                      <span className="font-black text-white">{item.day}</span>
                      <span className="text-emerald-400">Lượt học: {item.studyCount}</span>
                      <span className="text-blue-400">User mới: {item.newUsers}</span>
                    </div>

                    {/* Bar Study */}
                    <div
                      style={{ height: `${heightStudy}%` }}
                      className="w-1/2 max-w-[12px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-125"
                    />
                    {/* Bar New User */}
                    <div
                      style={{ height: `${heightUser}%` }}
                      className="w-1/2 max-w-[12px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all group-hover:brightness-125"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-bold pt-2 px-2">
              <span>Đầu chu kỳ</span>
              <span>Giữa chu kỳ</span>
              <span>Hôm nay</span>
            </div>
          </div>
        </div>

        {/* Cột phải (30% ~ 4 cols): Phân bố cấp độ video */}
        <div className="lg:col-span-4 bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-white">Phân bố cấp độ video</h2>
            <p className="text-[11px] text-slate-400">Tỷ lệ video theo khung CEFR (A1 - C2)</p>
          </div>

          {/* Progress Stack Bars */}
          <div className="space-y-3 py-2">
            {[
              { level: 'A1 - Sơ cấp', count: levelCounts.A1, color: 'bg-emerald-500', text: 'text-emerald-400' },
              { level: 'A2 - Cơ bản', count: levelCounts.A2, color: 'bg-teal-500', text: 'text-teal-400' },
              { level: 'B1 - Trung cấp', count: levelCounts.B1, color: 'bg-blue-500', text: 'text-blue-400' },
              { level: 'B2 - Khá', count: levelCounts.B2, color: 'bg-indigo-500', text: 'text-indigo-400' },
              { level: 'C1 - Cao cấp', count: levelCounts.C1, color: 'bg-purple-500', text: 'text-purple-400' },
              { level: 'C2 - Thành thạo', count: levelCounts.C2, color: 'bg-rose-500', text: 'text-rose-400' },
            ].map((item) => {
              const pct = Math.round((item.count / Math.max(1, totalLevelVideos)) * 100);
              return (
                <div key={item.level} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={item.text}>{item.level}</span>
                    <span className="text-slate-300">
                      {item.count} video ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0f172a] rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${item.color} rounded-full`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#334155] text-center">
            <Link
              href="/admin/videos"
              className="text-xs text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
            >
              Xem tất cả video trong kho →
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG 3 — 2 BẢNG NHỎ: Top 5 Video & Người dùng mới hôm nay */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Video học nhiều nhất tuần */}
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              🎬 Top 5 Video được học nhiều nhất
            </h2>
            <Link href="/admin/videos" className="text-xs text-emerald-400 hover:underline font-bold">
              Xem thêm
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase font-black border-b border-[#334155]">
                <tr>
                  <th className="pb-2.5">#</th>
                  <th className="pb-2.5">Thumbnail</th>
                  <th className="pb-2.5">Tiêu đề</th>
                  <th className="pb-2.5 text-center">Lượt học</th>
                  <th className="pb-2.5 text-right">Hoàn thành</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {topVideos.map((video, idx) => (
                  <tr key={video.id} className="hover:bg-[#273549]/40 transition-colors">
                    <td className="py-2.5 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2.5">
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-12 h-8 rounded-lg object-cover bg-black border border-[#334155]"
                      />
                    </td>
                    <td className="py-2.5 font-bold text-white max-w-[180px] truncate">{video.title}</td>
                    <td className="py-2.5 text-center font-mono text-emerald-400 font-bold">
                      {(video.views || 400).toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-300 font-bold">84%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Người dùng mới đăng ký hôm nay */}
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              👥 Người dùng mới đăng ký
            </h2>
            <Link href="/admin/users" className="text-xs text-emerald-400 hover:underline font-bold">
              Xem tất cả
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase font-black border-b border-[#334155]">
                <tr>
                  <th className="pb-2.5">Avatar</th>
                  <th className="pb-2.5">Tên & Username</th>
                  <th className="pb-2.5">Email</th>
                  <th className="pb-2.5 text-center">Giờ ĐK</th>
                  <th className="pb-2.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#273549]/40 transition-colors">
                    <td className="py-2.5">
                      <img
                        src={u.avatar}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[#334155]"
                      />
                    </td>
                    <td className="py-2.5">
                      <p className="font-bold text-white leading-tight">{u.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">@{u.username}</p>
                    </td>
                    <td className="py-2.5 text-slate-300 max-w-[140px] truncate">{u.email}</td>
                    <td className="py-2.5 text-center text-slate-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/admin/users`}
                        className="px-2 py-1 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-slate-300 hover:text-white text-[10px] font-bold border border-[#334155]"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG 4 — HOẠT ĐỘNG GẦN ĐÂY (Feed timeline) */}
      {/* ========================================================================= */}
      <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-xl">
        <h2 className="text-sm font-black text-white flex items-center gap-2">
          ⚡ Hoạt động gần đây trong hệ thống
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0f172a] border border-[#334155]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-mono shrink-0">10 phút trước</span>
            <p className="text-xs text-slate-200">
              Học viên <strong className="text-white font-black">kienbui</strong> đã hoàn thành bài Shadowing{' '}
              <span className="text-emerald-400 font-bold">"Inside Edition - Japanese Leaf Carving"</span> đạt 95% độ chính xác.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0f172a] border border-[#334155]">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-mono shrink-0">25 phút trước</span>
            <p className="text-xs text-slate-200">
              Admin <strong className="text-white font-black">admin</strong> đã xuất bản video bài học mới{' '}
              <span className="text-blue-400 font-bold">"BBC 6 Minute English - The power of silence"</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0f172a] border border-[#334155]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-mono shrink-0">1 giờ trước</span>
            <p className="text-xs text-slate-200">
              Người dùng mới <strong className="text-white font-black">nguyenvanhoc</strong> đã tạo tài khoản qua Google và nhận 100 Đá Quý.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0f172a] border border-[#334155]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-mono shrink-0">2 giờ trước</span>
            <p className="text-xs text-slate-200">
              Bình luận có chứa liên kết spam bị hệ thống tự động ẩn và gắn cờ kiểm duyệt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
