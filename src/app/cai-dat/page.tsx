'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Volume2,
  Bell,
  Target,
  Database,
  Crown,
  Check,
  Save,
  Moon,
  Globe,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import PremiumModal from '@/components/common/PremiumModal';

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Settings State
  const [audioSpeed, setAudioSpeed] = useState('1.0');
  const [voiceAccent, setVoiceAccent] = useState('en-US');
  const [autoPlaySound, setAutoPlaySound] = useState(true);
  const [showBilingualSub, setShowBilingualSub] = useState(true);
  const [shadowingDelay, setShadowingDelay] = useState('1.0');

  const [dailyWordGoal, setDailyWordGoal] = useState('10');
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState('30');
  const [reminderTime, setReminderTime] = useState('20:00');
  const [enableReminder, setEnableReminder] = useState(true);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-emerald-400" />
            Cài Đặt Hệ Thống
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Tùy chỉnh trải nghiệm học tập, giọng đọc bản xứ và lịch nhắc nhở cá nhân.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="py-2.5 px-5 bg-[#00c950] hover:bg-[#00b046] text-white text-xs font-black rounded-full flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Lưu cài đặt
        </button>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" /> Cài đặt của bạn đã được lưu thành công vào bộ nhớ cục bộ!
        </div>
      )}

      {/* 1. Thông tin tài khoản & VIP */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0d131d] border border-[#1e2d42] flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <div className="text-base font-black text-white">
                {user?.fullName || 'Học viên MickyEnglish'}
              </div>
              <div className="text-xs text-slate-400">
                {user?.email || 'learner@mickyenglish.com'} • {user?.isVip ? '👑 Thành viên VIP' : 'Tài khoản tiêu chuẩn'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPremiumModal(true)}
            className="py-2 px-4 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>Nâng Cấp VIP</span>
          </button>
        </div>
      </div>

      {/* 2. Cài đặt âm thanh & Luyện tập */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-white font-black text-base border-b border-[#1e2d42] pb-3">
          <Volume2 className="w-5 h-5 text-emerald-400" />
          <span>Âm Thanh & Giọng Đọc Bản Xứ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Tốc độ phát */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Tốc độ phát âm thanh mặc định:</label>
            <select
              value={audioSpeed}
              onChange={(e) => setAudioSpeed(e.target.value)}
              className="w-full bg-[#0d131d] border border-[#1e2d42] rounded-xl p-2.5 text-white font-medium outline-none focus:border-emerald-500"
            >
              <option value="0.75">0.75x (Chậm - Dành cho người mới bắt đầu)</option>
              <option value="0.9">0.9x (Hơi chậm - Luyện nghe âm đuôi)</option>
              <option value="1.0">1.0x (Chuẩn bản xứ tự nhiên)</option>
              <option value="1.25">1.25x (Nhanh - Thử thách phản xạ)</option>
            </select>
          </div>

          {/* Giọng đọc chuẩn */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Chất giọng ưu tiên (Accent):</label>
            <select
              value={voiceAccent}
              onChange={(e) => setVoiceAccent(e.target.value)}
              className="w-full bg-[#0d131d] border border-[#1e2d42] rounded-xl p-2.5 text-white font-medium outline-none focus:border-emerald-500"
            >
              <option value="en-US">English (United States - Mỹ)</option>
              <option value="en-GB">English (United Kingdom - Anh)</option>
              <option value="en-AU">English (Australia - Úc)</option>
            </select>
          </div>

          {/* Độ trễ Shadowing */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Độ trễ nhại giọng (Shadowing Delay):</label>
            <select
              value={shadowingDelay}
              onChange={(e) => setShadowingDelay(e.target.value)}
              className="w-full bg-[#0d131d] border border-[#1e2d42] rounded-xl p-2.5 text-white font-medium outline-none focus:border-emerald-500"
            >
              <option value="0.5">0.5 giây (Phản xạ tức thì)</option>
              <option value="1.0">1.0 giây (Tiêu chuẩn đề xuất)</option>
              <option value="1.5">1.5 giây (Thong thả ghi nhớ)</option>
            </select>
          </div>

          {/* Toggle phụ đề song ngữ */}
          <div className="flex items-center justify-between p-3 bg-[#0d131d] border border-[#1e2d42] rounded-xl">
            <div>
              <div className="font-bold text-slate-200">Hiển thị song ngữ mặc định</div>
              <div className="text-[10px] text-slate-400">Tự động hiện nghĩa tiếng Việt dưới phụ đề</div>
            </div>
            <button
              onClick={() => setShowBilingualSub(!showBilingualSub)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                showBilingualSub ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showBilingualSub ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mục tiêu học tập hàng ngày */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-white font-black text-base border-b border-[#1e2d42] pb-3">
          <Target className="w-5 h-5 text-amber-400" />
          <span>Mục Tiêu Học Tập & Chuỗi Streak</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-slate-300">Từ vựng mới mỗi ngày:</label>
            <div className="grid grid-cols-4 gap-2">
              {['5', '10', '20', '50'].map((val) => (
                <button
                  key={val}
                  onClick={() => setDailyWordGoal(val)}
                  className={`py-2 rounded-xl font-bold cursor-pointer border transition-colors ${
                    dailyWordGoal === val
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                      : 'bg-[#0d131d] border-[#1e2d42] text-slate-400'
                  }`}
                >
                  {val} từ
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-300">Thời gian nghe tối thiểu:</label>
            <div className="grid grid-cols-4 gap-2">
              {['15', '30', '45', '60'].map((val) => (
                <button
                  key={val}
                  onClick={() => setDailyStudyMinutes(val)}
                  className={`py-2 rounded-xl font-bold cursor-pointer border transition-colors ${
                    dailyStudyMinutes === val
                      ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                      : 'bg-[#0d131d] border-[#1e2d42] text-slate-400'
                  }`}
                >
                  {val}p
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Nhắc nhở thông báo */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-white font-black text-base border-b border-[#1e2d42] pb-3">
          <Bell className="w-5 h-5 text-cyan-400" />
          <span>Lịch Nhắc Nhở Hàng Ngày</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="flex items-center justify-between p-3 bg-[#0d131d] border border-[#1e2d42] rounded-xl">
            <div>
              <div className="font-bold text-slate-200">Bật nhắc nhở học tập</div>
              <div className="text-[10px] text-slate-400">Gửi thông báo đẩy giữ vững chuỗi Streak 🔥</div>
            </div>
            <button
              onClick={() => setEnableReminder(!enableReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                enableReminder ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  enableReminder ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-300">Khung giờ nhắc học:</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full bg-[#0d131d] border border-[#1e2d42] rounded-xl p-2.5 text-white font-medium outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
