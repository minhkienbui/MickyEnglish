'use client';

import { useState } from 'react';
import Link from 'next/link';
import MickyMascot from '@/components/common/MickyMascot';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Headphones,
  BookCheck,
  Award,
  BookOpen,
  Search,
  Volume2,
  Flame,
  Zap,
} from 'lucide-react';
import { mockPresetWords } from '@/data/mockVocab';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<typeof mockPresetWords[0] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = mockPresetWords.find(
      (w) =>
        w.word.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        w.meaning.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setSearchResult(found || mockPresetWords[0]);
  };

  const speakAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section Container Matching Screenshot */}
      <section className="relative rounded-3xl bg-[#0e1726] border border-[#1e2d42] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl space-y-10">
        {/* Background Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-6 text-left">
            {/* Top Green Tag */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>HOÀN TOÀN MIỄN PHÍ</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Luyện tập{' '}
              <span className="inline-block bg-gradient-to-r from-emerald-950 to-green-900/90 text-emerald-400 border border-emerald-500/50 px-4 py-1 rounded-2xl shadow-inner my-1">
                Tiếng Anh
              </span>{' '}
              Toàn Diện Đa Kỹ Năng
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-semibold leading-relaxed max-w-2xl">
              Học từ vựng thông minh, luyện viết phản xạ (See & Write), luyện nghe nói nhại giọng (Dictation & Shadowing), đọc truyện song ngữ bản xứ, và thi thử TOEIC/IELTS/VSTEP - tất cả trong một nền tảng.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/dictation-shadowing" className="btn-micky-primary text-sm sm:text-base px-8 py-3.5 shadow-lg">
                Bắt đầu ngay
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link href="/dang-nhap" className="btn-micky-secondary text-sm sm:text-base px-6 py-3.5">
                Đăng nhập
              </Link>
            </div>

            {/* Feature Checkmarks */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Không cần thẻ tín dụng
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bắt đầu ngay hôm nay
              </span>
            </div>
          </div>

          {/* Right Mascot & Speech Bubble */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center relative pt-4 lg:pt-0">
            {/* Speech Bubble */}
            <div className="speech-bubble mb-3 animate-bounce">
              Chào bạn! Hãy gõ một từ bất kỳ ở ô tìm kiếm dưới đây để tra thử từ điển nhé! 💬
            </div>

            {/* Mascot Bear */}
            <div className="relative">
              <MickyMascot size={130} />
            </div>
          </div>
        </div>

        {/* Quick Dictionary Lookup Input */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center bg-[#131d2b] border-2 border-[#1e2d42] focus-within:border-emerald-500 rounded-2xl p-2 shadow-xl transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Gõ một từ tiếng Anh để tra từ điển (VD: Accommodate, Negotiate, Resilient...)"
              className="w-full bg-transparent border-none outline-none text-white text-xs sm:text-sm font-semibold px-3 placeholder-slate-500"
            />
            <button type="submit" className="btn-micky-primary text-xs py-2 px-5 shrink-0">
              Tra từ ngay
            </button>
          </div>

          {/* Live Search Result Card */}
          {searchResult && (
            <div className="mt-3 p-4 bg-[#131d2b] border border-emerald-500/40 rounded-2xl text-left space-y-2 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-emerald-400">{searchResult.word}</h4>
                  <span className="text-xs text-slate-400 font-semibold">{searchResult.phonetic}</span>
                  <button
                    type="button"
                    onClick={() => speakAudio(searchResult.word)}
                    className="p-1 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-800 transition-colors"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="badge-micky-green">{searchResult.topic}</span>
              </div>
              <p className="text-xs font-bold text-white">🇻🇳 Nghĩa: {searchResult.meaning}</p>
              <p className="text-xs text-slate-300 italic bg-[#0b0f17] p-2.5 rounded-xl border border-[#1e2d42]">
                "🇬🇧 {searchResult.exampleEn}"
              </p>
            </div>
          )}
        </form>

        {/* 4 Dark Stats Cards Grid (Matching Screenshot) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#1e2d42]">
          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 space-y-1 hover:border-emerald-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">4.415+</span>
            <span className="text-xs font-black text-white block">Bài học Dictation & Shadowing</span>
            <span className="text-[10px] text-slate-400 font-semibold block">Luyện nghe nói phản xạ</span>
          </div>

          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 space-y-1 hover:border-emerald-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">150+</span>
            <span className="text-xs font-black text-white block">Truyện Song Ngữ</span>
            <span className="text-[10px] text-slate-400 font-semibold block">Đọc & Tra từ tức thì</span>
          </div>

          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 space-y-1 hover:border-emerald-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">5.000+</span>
            <span className="text-xs font-black text-white block">Câu See & Write</span>
            <span className="text-[10px] text-slate-400 font-semibold block">Luyện viết phản xạ</span>
          </div>

          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-2xl p-4 space-y-1 hover:border-emerald-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">503+</span>
            <span className="text-xs font-black text-white block">Đề Thi Thử</span>
            <span className="text-[10px] text-slate-400 font-semibold block">TOEIC, IELTS & VSTEP</span>
          </div>
        </div>
      </section>

      {/* Dictionary Section Below */}
      <section className="rounded-3xl bg-[#0e1726] border border-[#1e2d42] p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-black tracking-wider uppercase">
          <BookCheck className="w-4 h-4" />
          <span>TỪ ĐIỂN SIÊU KHỔNG LỒ</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white">
          Tra cứu & Học từ vựng nhanh chóng với hơn <span className="text-emerald-400">100.000+</span> từ vựng phong phú
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-semibold">
          Tích hợp sẵn phiên âm chuẩn IPA, phát âm giọng chuẩn Mỹ/Anh, câu ví dụ thực tế và tự động lưu vào bộ từ để ôn tập ngắt quãng Spaced Repetition.
        </p>

        <div className="pt-2">
          <Link href="/tuvung" className="btn-micky-primary text-sm px-8 py-3">
            Khám phá kho từ vựng ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
