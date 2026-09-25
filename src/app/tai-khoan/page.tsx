'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import ProgressChart from '@/components/profile/ProgressChart';
import { Flame, BookCheck, Headphones, Award, LogOut, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user: storeUser, isAuthenticated, logout } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const res = await fetch('/api/user/progress');
        if (!res.ok) {
          // If not logged in on backend yet, fallback to store data
          setProfileData({
            user: storeUser || {
              name: 'Học viên Micky',
              email: 'hocvien@mickyenglish.com',
              streak: 5,
              wordsLearned: 42,
              dictationMinutes: 45,
              examsCompleted: 2,
            },
            recentDictations: [],
            recentExams: [],
          });
          return;
        }
        const data = await res.json();
        if (data.success) {
          setProfileData(data);
        }
      } catch (err: any) {
        setError('Không thể tải dữ liệu tiến độ');
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [storeUser]);

  if (!isAuthenticated && !profileData?.user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-8 space-y-4 shadow-xl">
          <h2 className="text-xl font-black text-white">Bạn chưa đăng nhập</h2>
          <p className="text-xs text-slate-400">Vui lòng đăng nhập để xem thông tin cá nhân và tiến độ học tập.</p>
          <Link href="/dang-nhap" className="btn-micky-primary w-full py-2.5 text-xs font-bold">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  const currentUser = profileData?.user || storeUser || {
    name: 'Học viên Micky',
    email: 'hocvien@mickyenglish.com',
    streak: 5,
    wordsLearned: 42,
    dictationMinutes: 45,
    examsCompleted: 2,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 border border-emerald-500/40 rounded-3xl text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-emerald-300">
            {currentUser.name ? currentUser.name.charAt(0) : 'M'}
          </div>
          <div>
            <h1 className="text-2xl font-black">{currentUser.name || 'Học viên'}</h1>
            <p className="text-xs text-emerald-200 mt-0.5">{currentUser.email}</p>
            <div className="inline-flex items-center gap-1.5 mt-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
              <Calendar className="w-3.5 h-3.5" />
              <span>Thành viên tự học Micky English</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6 gap-2 text-xs font-bold text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Đang đồng bộ tiến độ học tập mới nhất...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 flex flex-col items-center text-center">
          <Flame className="w-8 h-8 text-emerald-400 mb-1 animate-bounce" />
          <span className="text-2xl font-black text-emerald-400">{currentUser.streak || 1} ngày</span>
          <span className="text-xs font-bold text-slate-400">Chuỗi Streak</span>
        </div>

        <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 flex flex-col items-center text-center">
          <BookCheck className="w-8 h-8 text-emerald-400 mb-1" />
          <span className="text-2xl font-black text-emerald-400">{currentUser.wordsLearned || 0}</span>
          <span className="text-xs font-bold text-slate-400">Từ đã nhớ</span>
        </div>

        <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 flex flex-col items-center text-center">
          <Headphones className="w-8 h-8 text-blue-400 mb-1" />
          <span className="text-2xl font-black text-blue-400">{currentUser.dictationMinutes || 0} phút</span>
          <span className="text-xs font-bold text-slate-400">Thời lượng nghe</span>
        </div>

        <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 flex flex-col items-center text-center">
          <Award className="w-8 h-8 text-purple-400 mb-1" />
          <span className="text-2xl font-black text-purple-400">{currentUser.examsCompleted || 0} đề</span>
          <span className="text-xs font-bold text-slate-400">Đề thi đã làm</span>
        </div>
      </div>

      {/* Progress Chart */}
      <ProgressChart />

      {/* Recent Activity List */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Lịch sử hoạt động gần đây</h3>
        <div className="space-y-3">
          {profileData?.recentDictations?.length > 0 ? (
            profileData.recentDictations.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{item.lesson?.title || 'Luyện nghe chép chính tả'}</p>
                    <p className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <span className="badge-micky-green">Độ chính xác {Math.round(item.accuracy)}%</span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <BookCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Học tập từ vựng & luyện chép chính tả hàng ngày</p>
                  <p className="text-[10px] text-slate-400">Hôm nay</p>
                </div>
              </div>
              <span className="badge-micky-green">Sẵn sàng</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
