'use client';

import { X, Crown, CheckCircle2, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { useState } from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

  if (!isOpen) return null;

  const benefits = [
    'Mở khóa toàn bộ 7.000+ video Dictation & Shadowing chuẩn bản xứ',
    'Không giới hạn AI tạo phụ đề, sửa lỗi câu và phân tích phát âm',
    'Truy cập trọn bộ từ vựng PRO (English Collocations in Use, Oxford 3000, IELTS 8.0)',
    'Trải nghiệm trọn vẹn 5 chế độ luyện tập: Tìm lỗi, ChunkFlow, Đọc báo song ngữ...',
    'Đồng bộ tiến trình Spaced Repetition (SRS) trên mọi thiết bị',
    'Tặng 1.000 💎 Kim cương hàng tháng để tham gia minigames & giải đấu',
  ];

  const plans = [
    {
      id: 'monthly',
      name: '1 Tháng',
      price: '99.000đ',
      period: '/tháng',
      save: null,
    },
    {
      id: 'yearly',
      name: '1 Năm (Tiết kiệm nhất)',
      price: '59.000đ',
      period: '/tháng (708.000đ/năm)',
      save: 'Tiết kiệm 45%',
      isPopular: true,
    },
    {
      id: 'lifetime',
      name: 'Trọn đời',
      price: '1.499.000đ',
      period: 'Thanh toán 1 lần duy nhất',
      save: 'VIP Vĩnh viễn',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#121c2b] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
            <Crown className="w-4 h-4 text-amber-400" /> NÂNG CẤP TÀI KHOẢN VIP
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Mở Khóa Toàn Diện Micky<span className="text-amber-400">Premium</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Tăng tốc khả năng phản xạ nghe nói & ghi nhớ từ vựng gấp 3 lần cùng AI
          </p>
        </div>

        {/* Benefits list */}
        <div className="bg-[#0d131d] border border-[#1e2d42] rounded-2xl p-4 mb-6 space-y-2.5">
          {benefits.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Plans Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {plans.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p.id as any)}
              className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === p.id
                  ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-[#0d131d] border-[#1e2d42] hover:border-slate-600'
              }`}
            >
              {p.save && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                  {p.save}
                </span>
              )}
              <div className="text-xs font-bold text-slate-300 mb-1">{p.name}</div>
              <div className="text-base font-black text-amber-400">{p.price}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{p.period}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            alert('Cảm ơn bạn đã quan tâm! Đang chuyển hướng tới cổng thanh toán an toàn...');
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          Kích Hoạt Gói Premium Ngay
        </button>

        <p className="text-[10px] text-center text-slate-500 mt-3">
          Cam kết hoàn tiền 100% trong vòng 7 ngày nếu không hài lòng. Hỗ trợ 24/7.
        </p>
      </div>
    </div>
  );
}
