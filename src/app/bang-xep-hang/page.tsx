'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { weeklyMilestones, LeaderboardUser } from '@/data/mockLeaderboard';
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Clock,
  Sparkles,
  Zap,
  Gem,
  Award,
  ChevronRight,
  TrendingUp,
  Gift,
  CheckCircle2,
  Calendar,
  Check,
  ArrowUp,
  Shield,
  Star,
  Users,
  UserPlus,
} from 'lucide-react';

export default function LeaderboardPage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const { user, isAuthenticated } = useAuthStore();
  const { period, metric, setPeriod, setMetric, claimMilestone, isMilestoneClaimed } = useLeaderboardStore();

  const [claimToast, setClaimToast] = useState<string | null>(null);
  const [realDbUsers, setRealDbUsers] = useState<LeaderboardUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Tải danh sách người dùng thật từ API /api/leaderboard (kết nối trực tiếp database)
  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setRealDbUsers(data.users);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, []);

  // Tính toán XP thực tế của user hiện tại
  const currentUserXp = useMemo(() => {
    if (!user) return 0;
    const base = (user.wordsLearned || 0) * 10 + (user.dictationMinutes || 0) * 5 + (user.examsCompleted || 0) * 50;
    return (user.xp || 0) + base;
  }, [user]);

  const currentUserStudyTime = useMemo(() => {
    if (!user) return 0;
    return (user.dictationMinutes || 0) + (user.shadowingMinutes || 0);
  }, [user]);

  // Ghép user hiện tại vào danh sách người dùng thật
  const fullRankList = useMemo(() => {
    const list = [...realDbUsers];

    if (isAuthenticated && user) {
      const existingIdx = list.findIndex((u) => u.id === user.id || u.name === (user.fullName || user.username));
      const userRankItem: LeaderboardUser = {
        id: user.id,
        rank: 99,
        name: user.fullName || user.username || 'Bạn',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        badge: 'Học viên Chăm chỉ',
        roleTitle: user.role === 'admin' ? 'Quản Trị Viên' : 'Học Viên',
        level: currentUserXp > 2000 ? 'C1' : currentUserXp > 1000 ? 'B2' : currentUserXp > 300 ? 'B1' : 'A2',
        streak: user.streak || 1,
        schoolOrOrg: 'Học viên MickyEnglish',
        xp: {
          weekly: Math.round(currentUserXp * 0.5),
          monthly: currentUserXp,
          allTime: currentUserXp,
        },
        studyTimeMinutes: {
          weekly: Math.round(currentUserStudyTime * 0.5),
          monthly: currentUserStudyTime,
          allTime: currentUserStudyTime,
        },
        wordsLearned: user.wordsLearned || 0,
        isCurrentUser: true,
      };

      if (existingIdx >= 0) {
        list[existingIdx] = userRankItem;
      } else {
        list.push(userRankItem);
      }
    }

    // Sắp xếp danh sách theo tiêu chí (XP hoặc Thời gian học)
    list.sort((a, b) => {
      const valA = metric === 'xp' ? a.xp[period] || 0 : a.studyTimeMinutes[period] || 0;
      const valB = metric === 'xp' ? b.xp[period] || 0 : b.studyTimeMinutes[period] || 0;
      return valB - valA;
    });

    // Cập nhật lại số thứ tự rank
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [realDbUsers, isAuthenticated, user, period, metric, currentUserXp, currentUserStudyTime]);

  // Tìm vị trí của user hiện tại
  const currentUserRankData = useMemo(() => {
    return fullRankList.find((u) => u.isCurrentUser) || null;
  }, [fullRankList]);

  // Top 3 người dẫn đầu (nếu có người dùng thật)
  const top1 = fullRankList[0] || null;
  const top2 = fullRankList[1] || null;
  const top3 = fullRankList[2] || null;
  const restList = fullRankList.slice(3);

  // Xử lý bấm nhận thưởng chỉ tiêu
  const handleClaimQuest = (questId: string) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để nhận thưởng kim cương.');
      return;
    }
    const result = claimMilestone(questId);
    if (result.success) {
      setClaimToast(result.message);
      setTimeout(() => setClaimToast(null), 4000);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER: VINH DANH BẢNG VÀNG                                       */}
      {/* ========================================================================= */}
      <section
        className={`relative rounded-3xl border p-6 sm:p-10 overflow-hidden shadow-2xl space-y-6 transition-colors ${
          isLight
            ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-emerald-500/10 border-amber-300 text-slate-900'
            : 'bg-gradient-to-r from-[#172033] via-[#121c2b] to-[#1a2538] border-amber-500/40 text-white'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 text-xs font-black tracking-wider uppercase shadow-xs">
              <Trophy className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
              <span>BẢNG VÀNG VINH DANH • MÙA GIẢI 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Bảng Xếp Hạng <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Chiến Binh Micky</span>
            </h1>

            <p className={`text-xs sm:text-sm font-semibold max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Bảng xếp hạng theo thời gian thực dành cho người dùng thật của MickyEnglish. Tích lũy <strong>XP</strong> và <strong>thời gian luyện nghe</strong> để giành vị trí Quán Quân, nhận hàng trăm 💎 Kim cương cùng danh hiệu cao quý!
            </p>
          </div>

          {/* Hộp đếm ngược mùa giải */}
          <div className={`p-4 rounded-2xl border text-center space-y-1.5 shrink-0 shadow-lg min-w-[200px] ${
            isLight ? 'bg-white border-amber-300' : 'bg-[#0d1420] border-amber-500/30'
          }`}>
            <span className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {period === 'weekly' ? 'Mùa giải Tuần kết thúc:' : period === 'monthly' ? 'Mùa giải Tháng kết thúc:' : 'Bảng vàng Vinh Danh:'}
            </span>
            <div className="text-base sm:text-lg font-black font-mono text-amber-400">
              {period === 'weekly' ? 'Chủ Nhật • 23:59' : period === 'monthly' ? 'Ngày 30 • 23:59' : 'Mọi Thời Đại'}
            </div>
            <span className="text-[10px] text-emerald-500 font-bold block">Tự động trao thưởng vào tài khoản</span>
          </div>
        </div>

        {/* TOAST THÔNG BÁO NHẬN THƯỞNG */}
        {claimToast && (
          <div className="p-3 bg-emerald-950/95 border border-emerald-500 rounded-2xl text-center text-xs font-black text-emerald-300 flex items-center justify-center gap-2 animate-fade-in shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{claimToast}</span>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. KHU VỰC ĐIỀU HƯỚNG BỘ LỌC (TABS: TUẦN / THÁNG / TOÀN THỜI GIAN & XP / TIME) */}
      {/* ========================================================================= */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Lọc theo thời gian */}
        <div className={`flex rounded-2xl p-1.5 border gap-1 shadow-sm w-full sm:w-auto ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
        }`}>
          <button
            type="button"
            onClick={() => setPeriod('weekly')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              period === 'weekly'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Theo Tuần (Tuần này)</span>
          </button>

          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              period === 'monthly'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Theo Tháng (Tháng này)</span>
          </button>

          <button
            type="button"
            onClick={() => setPeriod('allTime')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              period === 'allTime'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Toàn thời gian</span>
          </button>
        </div>

        {/* Lọc theo tiêu chí: XP vs Thời gian học */}
        <div className={`flex rounded-2xl p-1.5 border gap-1 shadow-sm w-full sm:w-auto ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
        }`}>
          <button
            type="button"
            onClick={() => setMetric('xp')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              metric === 'xp'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Điểm XP (Kinh nghiệm)</span>
          </button>

          <button
            type="button"
            onClick={() => setMetric('time')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              metric === 'time'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Thời gian học (Phút)</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MỐC THƯỞNG XẾP HẠNG TOP 1 - TOP 2 - TOP 3                              */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg sm:text-xl font-black">Phần Thưởng Mùa Giải Cho Top Đầu</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Top 1 Reward */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border-2 border-amber-400 shadow-xl space-y-2 relative overflow-hidden">
            <span className="absolute -right-2 -bottom-2 text-5xl opacity-20">👑</span>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                🥇 TOP 1 (Quán Quân)
              </span>
              <Gem className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">+500 💎 Kim cương</div>
            <p className="text-[11px] text-slate-300 font-semibold leading-snug">
              Danh hiệu 👑 <strong>Bá Chủ Anh Ngữ</strong> vinh danh trang chủ + Tặng VIP 7 ngày
            </p>
          </div>

          {/* Top 2 Reward */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-400/20 via-slate-300/10 to-transparent border-2 border-slate-300 shadow-xl space-y-2 relative overflow-hidden">
            <span className="absolute -right-2 -bottom-2 text-5xl opacity-20">🥈</span>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-900 font-black text-xs shadow-md">
                🥈 TOP 2 (Á Quân)
              </span>
              <Gem className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
            <div className="text-2xl font-black text-slate-200">+300 💎 Kim cương</div>
            <p className="text-[11px] text-slate-300 font-semibold leading-snug">
              Danh hiệu 🥈 <strong>Chiến Thần Chăm Chỉ</strong> + Huy hiệu Bạc vinh dự
            </p>
          </div>

          {/* Top 3 Reward */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-orange-600/20 via-amber-700/10 to-transparent border-2 border-orange-400 shadow-xl space-y-2 relative overflow-hidden">
            <span className="absolute -right-2 -bottom-2 text-5xl opacity-20">🥉</span>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white font-black text-xs shadow-md">
                🥉 TOP 3 (Quý Quân)
              </span>
              <Gem className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
            <div className="text-2xl font-black text-orange-400">+150 💎 Kim cương</div>
            <p className="text-[11px] text-slate-300 font-semibold leading-snug">
              Danh hiệu 🥉 <strong>Cao Thủ Bứt Phá</strong> + Khung Avatar độc quyền
            </p>
          </div>

          {/* Top 4-10 Reward */}
          <div className={`p-4 rounded-3xl border shadow-lg space-y-2 relative overflow-hidden ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-black text-xs">
                🎖️ TOP 4 - 10
              </span>
              <Gem className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">+50 💎 Kim cương</div>
            <p className="text-[11px] text-slate-400 font-semibold leading-snug">
              Huy hiệu Tinh Anh mùa giải + Tích lũy điểm vào kho báu học tập
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BỤC VINH QUANG PODIUM (TOP 2 - TOP 1 - TOP 3)                          */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-center">Top 3 Chiến Binh Dẫn Đầu</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
          {/* PODIUM #2: Á QUÂN (BÊN TRÁI) */}
          <div className="order-2 md:order-1 flex flex-col items-center">
            {top2 ? (
              <>
                <div className="relative mb-3 group">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-300 overflow-hidden shadow-xl shadow-slate-300/20">
                    <img src={top2.avatar} alt={top2.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center font-black text-sm shadow-md">
                    2
                  </div>
                </div>

                <div className={`w-full p-5 rounded-t-3xl border-t-4 border-slate-300 text-center space-y-2 shadow-2xl h-56 flex flex-col justify-between ${
                  isLight ? 'bg-white border-slate-200' : 'bg-gradient-to-b from-[#16233a] to-[#0f1726] border-[#1e2d42]'
                }`}>
                  <div>
                    <h4 className="font-black text-sm truncate">{top2.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{top2.schoolOrOrg}</p>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-slate-300/20 text-slate-300 text-[10px] font-bold">
                      {top2.badge}
                    </span>
                  </div>

                  <div className="space-y-1 bg-black/20 p-2.5 rounded-2xl border border-white/5">
                    <div className="text-xl font-black text-slate-200 font-mono">
                      {metric === 'xp' ? `${top2.xp[period]?.toLocaleString() || 0} XP` : `${top2.studyTimeMinutes[period] || 0} phút`}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> {top2.streak} ngày streak
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={`w-full p-6 rounded-3xl border-2 border-dashed border-slate-500/40 text-center space-y-3 h-56 flex flex-col items-center justify-center ${
                isLight ? 'bg-slate-50' : 'bg-[#121c2b]/60'
              }`}>
                <div className="w-12 h-12 rounded-full bg-slate-500/20 text-slate-300 flex items-center justify-center text-xl font-black">
                  🥈
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-300">Đang chờ Á Quân</h4>
                  <p className="text-[10px] text-slate-400">Hãy học bài để leo lên Top 2 nhận 300 💎!</p>
                </div>
              </div>
            )}
          </div>

          {/* PODIUM #1: QUÁN QUÂN (Ở GIỮA - CAO NHẤT) */}
          <div className="order-1 md:order-2 flex flex-col items-center relative -top-3">
            {top1 ? (
              <>
                <div className="relative mb-3 group">
                  <Crown className="w-10 h-10 text-amber-400 fill-amber-400 absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-[0_4px_10px_rgba(251,191,36,0.6)]" />
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden shadow-2xl shadow-amber-400/30 ring-4 ring-amber-400/20">
                    <img src={top1.avatar} alt={top1.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-slate-950 rounded-full font-black text-xs shadow-md">
                    QUÁN QUÂN
                  </div>
                </div>

                <div className={`w-full p-6 rounded-t-3xl border-t-4 border-amber-400 text-center space-y-3 shadow-2xl h-64 flex flex-col justify-between ${
                  isLight ? 'bg-amber-500/10 border-amber-300' : 'bg-gradient-to-b from-[#1e2e4a] via-[#142036] to-[#0f1726] border-[#1e2d42]'
                }`}>
                  <div>
                    <h4 className="font-black text-base text-amber-400 truncate">{top1.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{top1.schoolOrOrg}</p>
                    <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black">
                      {top1.badge}
                    </span>
                  </div>

                  <div className="space-y-1 bg-amber-950/40 border border-amber-500/30 p-3 rounded-2xl shadow-inner">
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      {metric === 'xp' ? `${top1.xp[period]?.toLocaleString() || 0} XP` : `${top1.studyTimeMinutes[period] || 0} phút`}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-black">
                      <Flame className="w-4 h-4 fill-amber-400" /> {top1.streak} ngày streak liên tục
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={`w-full p-6 rounded-3xl border-2 border-dashed border-amber-400/50 text-center space-y-3 h-64 flex flex-col items-center justify-center ${
                isLight ? 'bg-amber-50/50' : 'bg-[#142033]/60'
              }`}>
                <Crown className="w-10 h-10 text-amber-400 fill-amber-400 animate-bounce" />
                <div>
                  <h4 className="font-black text-sm text-amber-400">Vị Trí Quán Quân Đang Mở</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Hãy học ngay hôm nay để trở thành người dẫn đầu mùa giải và nhận <strong>500 💎 Kim cương</strong>!
                  </p>
                </div>
                <Link
                  href="/dictation-shadowing"
                  className="px-4 py-2 bg-[#00c950] text-white text-xs font-black rounded-xl shadow-md hover:scale-105 transition-all"
                >
                  Bắt đầu học ngay →
                </Link>
              </div>
            )}
          </div>

          {/* PODIUM #3: QUÝ QUÂN (BÊN PHẢI) */}
          <div className="order-3 flex flex-col items-center">
            {top3 ? (
              <>
                <div className="relative mb-3 group">
                  <div className="w-20 h-20 rounded-full border-4 border-orange-500 overflow-hidden shadow-xl shadow-orange-500/20">
                    <img src={top3.avatar} alt={top3.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md">
                    3
                  </div>
                </div>

                <div className={`w-full p-5 rounded-t-3xl border-t-4 border-orange-500 text-center space-y-2 shadow-2xl h-52 flex flex-col justify-between ${
                  isLight ? 'bg-white border-slate-200' : 'bg-gradient-to-b from-[#182030] to-[#0f1726] border-[#1e2d42]'
                }`}>
                  <div>
                    <h4 className="font-black text-sm truncate">{top3.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{top3.schoolOrOrg}</p>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                      {top3.badge}
                    </span>
                  </div>

                  <div className="space-y-1 bg-black/20 p-2.5 rounded-2xl border border-white/5">
                    <div className="text-xl font-black text-orange-400 font-mono">
                      {metric === 'xp' ? `${top3.xp[period]?.toLocaleString() || 0} XP` : `${top3.studyTimeMinutes[period] || 0} phút`}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> {top3.streak} ngày streak
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={`w-full p-6 rounded-3xl border-2 border-dashed border-orange-500/40 text-center space-y-3 h-52 flex flex-col items-center justify-center ${
                isLight ? 'bg-slate-50' : 'bg-[#121c2b]/60'
              }`}>
                <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl font-black">
                  🥉
                </div>
                <div>
                  <h4 className="font-black text-xs text-orange-400">Đang chờ Quý Quân</h4>
                  <p className="text-[10px] text-slate-400">Tích lũy XP để chiếm vị trí Top 3 nhận 150 💎!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MỤC CHỈ TIÊU & NHIỆM VỤ TUẦN: ĐẠT ĐỦ CHỈ TIÊU LÀ NHẬN THƯỞNG 💎         */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-lg sm:text-xl font-black">Nhiệm Vụ Chỉ Tiêu Tuần • Nhận Quà 100%</h2>
              <p className="text-xs text-slate-400">Không cần lọt Top vẫn nhận thưởng nếu bạn chăm chỉ đạt đủ mốc học tập!</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeklyMilestones.map((quest) => {
            const isClaimed = isMilestoneClaimed(quest.id);

            // Đo lường tiến độ của user hiện tại
            let currentVal = 0;
            if (quest.targetType === 'xp') currentVal = currentUserXp;
            else if (quest.targetType === 'time') currentVal = currentUserStudyTime;
            else if (quest.targetType === 'streak') currentVal = user?.streak || 1;

            const isCompleted = currentVal >= quest.targetValue;
            const progressPercent = Math.min(100, Math.round((currentVal / quest.targetValue) * 100));

            return (
              <div
                key={quest.id}
                className={`p-5 rounded-3xl border transition-all space-y-3 shadow-md flex flex-col justify-between ${
                  isClaimed
                    ? 'opacity-70 bg-emerald-950/20 border-emerald-500/30'
                    : isCompleted
                    ? 'bg-gradient-to-br from-emerald-950/40 to-teal-950/30 border-emerald-500/60 ring-2 ring-emerald-500/20'
                    : isLight
                    ? 'bg-white border-slate-200'
                    : 'bg-[#111a28] border-[#1e2d42]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{quest.icon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-black flex items-center gap-1">
                      <Gem className="w-3 h-3 fill-cyan-400" /> +{quest.rewardDiamonds} 💎
                    </span>
                  </div>

                  <h4 className="text-xs font-black line-clamp-1">{quest.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{quest.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-700/20">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Tiến độ:</span>
                    <span className={isCompleted ? 'text-emerald-400 font-black' : 'text-slate-300 font-mono'}>
                      {currentVal} / {quest.targetValue} {quest.unit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-[#00c950]' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Claim Button */}
                  <button
                    type="button"
                    disabled={isClaimed || !isCompleted}
                    onClick={() => handleClaimQuest(quest.id)}
                    className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isClaimed
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-[#00c950] hover:bg-[#00b046] text-white shadow-lg shadow-emerald-500/30 animate-pulse hover:scale-[1.02]'
                        : 'bg-[#18263a] text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã nhận thưởng</span>
                      </>
                    ) : isCompleted ? (
                      <>
                        <Gift className="w-3.5 h-3.5" />
                        <span>Nhận {quest.rewardDiamonds} 💎 ngay</span>
                      </>
                    ) : (
                      <span>Chưa đủ chỉ tiêu ({progressPercent}%)</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BẢNG XẾP HẠNG CHI TIẾT (FULL LEADERBOARD TABLE)                        */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-black">Danh Sách Xếp Hạng Người Dùng</h2>
          </div>
          <span className="text-xs text-slate-400 font-bold">Tổng cộng: {fullRankList.length} học viên</span>
        </div>

        <div className={`rounded-3xl border overflow-hidden shadow-2xl ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
        }`}>
          {/* Table Header */}
          <div className={`grid grid-cols-12 gap-2 p-4 text-[11px] font-black uppercase tracking-wider border-b ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#142033] border-[#1e2d42] text-slate-400'
          }`}>
            <div className="col-span-2 sm:col-span-1 text-center">Hạng</div>
            <div className="col-span-6 sm:col-span-5">Học viên</div>
            <div className="hidden sm:block sm:col-span-2 text-center">Chuỗi Streak</div>
            <div className="col-span-4 sm:col-span-2 text-right">
              {metric === 'xp' ? 'Kinh Nghiệm (XP)' : 'Thời Gian Học'}
            </div>
            <div className="hidden sm:block sm:col-span-2 text-right pr-2">Từ Đã Học</div>
          </div>

          {/* Table Content */}
          {fullRankList.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Trophy className="w-12 h-12 text-amber-500/40 mx-auto animate-pulse" />
              <h4 className="text-base font-black text-slate-300">Mùa giải mới đang bắt đầu!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Chưa có học viên nào ghi danh tuần này. Hãy là người đầu tiên học bài để vươn lên Top 1 và nhận 500 💎!
              </p>
              <Link
                href="/dictation-shadowing"
                className="inline-flex px-5 py-2.5 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Học bài tích lũy XP ngay →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/20">
              {fullRankList.map((item) => {
                const isUser = item.isCurrentUser;
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-2 p-3.5 sm:p-4 items-center transition-colors ${
                      isUser
                        ? 'bg-emerald-500/15 border-l-4 border-emerald-500 ring-1 ring-emerald-500/30'
                        : isLight
                        ? 'hover:bg-slate-50'
                        : 'hover:bg-[#152338]'
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-2 sm:col-span-1 text-center font-black flex items-center justify-center">
                      {item.rank === 1 ? (
                        <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-sm shadow-md font-black">
                          🥇
                        </span>
                      ) : item.rank === 2 ? (
                        <span className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center text-sm shadow-md font-black">
                          🥈
                        </span>
                      ) : item.rank === 3 ? (
                        <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm shadow-md font-black">
                          🥉
                        </span>
                      ) : (
                        <span className={`text-sm font-mono ${isUser ? 'text-emerald-400 font-black' : 'text-slate-400'}`}>
                          #{item.rank}
                        </span>
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden border border-slate-600 shrink-0 shadow-sm">
                        <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs sm:text-sm font-black truncate ${isUser ? 'text-emerald-400 font-extrabold' : ''}`}>
                            {item.name} {isUser && '(Bạn)'}
                          </p>
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[9px] font-black border border-blue-500/30 shrink-0">
                            {item.level}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{item.schoolOrOrg || item.badge}</p>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="hidden sm:flex sm:col-span-2 items-center justify-center gap-1 text-xs font-black text-amber-400">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      <span>{item.streak} ngày</span>
                    </div>

                    {/* Primary Metric Score */}
                    <div className="col-span-4 sm:col-span-2 text-right font-black">
                      <span className="text-xs sm:text-sm font-mono text-emerald-400 block">
                        {metric === 'xp'
                          ? `${(item.xp[period] || 0).toLocaleString()} XP`
                          : `${item.studyTimeMinutes[period] || 0} phút`}
                      </span>
                      <span className="text-[10px] text-slate-400 sm:hidden block">
                        🔥 {item.streak} ngày
                      </span>
                    </div>

                    {/* Words Learned */}
                    <div className="hidden sm:block sm:col-span-2 text-right pr-2 text-xs font-bold text-slate-300">
                      {(item.wordsLearned || 0).toLocaleString()} từ
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. THANH CỐ ĐỊNH VỊ TRÍ CỦA BẠN (STICKY BOTTOM RANK BAR)                  */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1420]/95 backdrop-blur-md border-t-2 border-emerald-500 p-3 sm:p-4 shadow-2xl text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0 border border-emerald-400/40">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span>{(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white truncate">
                  {user ? (user.fullName || user.username) : 'Khách (Guest)'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                  {currentUserRankData ? `Hạng #${currentUserRankData.rank}` : 'Chưa xếp hạng'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-bold truncate">
                {metric === 'xp' ? `Bạn đang có ${currentUserXp.toLocaleString()} XP` : `Bạn đã học ${currentUserStudyTime} phút`}
                {' • '}💎 {user?.diamonds ?? 100} Kim cương
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dictation-shadowing"
              className="px-5 py-2.5 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Cày Rank Ngay</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
