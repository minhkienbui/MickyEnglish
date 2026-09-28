'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MickyMascot from '@/components/common/MickyMascot';
import { useThemeStore } from '@/stores/useThemeStore';
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
  Play,
  RotateCcw,
  GraduationCap,
  Layers,
  Gamepad2,
  PenTool,
  Clock,
  Star,
  Users,
  ShieldCheck,
  Check,
  Eye,
  Crown,
} from 'lucide-react';
import { mockPresetWords } from '@/data/mockVocab';
import { mockDictationLessons } from '@/data/mockDictation';

export default function HomePage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // State cho bộ tra từ điển nhanh
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<typeof mockPresetWords[0] | null>(null);

  // State cho Live Interactive Playground
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'word-order' | 'dictation' | 'bilingual' | 'flashcard'>('word-order');

  // State cho mini Word Order Game thử nghiệm trên trang chủ
  const sampleWords = ['I', 'love', 'learning', 'English', 'every', 'day'];
  const [selectedWordIndices, setSelectedWordIndices] = useState<number[]>([]);
  const [shakeWordIndex, setShakeWordIndex] = useState<number | null>(null);
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  // State cho Flashcard Demo
  const [isFlipped, setIsFlipped] = useState(false);

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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Click chọn từ trong mini game
  const handleWordClick = (word: string, index: number) => {
    if (selectedWordIndices.includes(index) || isGameCompleted) return;

    const nextExpectedIndex = selectedWordIndices.length;
    const expectedWord = sampleWords[nextExpectedIndex];

    if (word === expectedWord) {
      // Đúng từ tiếp theo
      speakAudio(word);
      const newIndices = [...selectedWordIndices, index];
      setSelectedWordIndices(newIndices);
      if (newIndices.length === sampleWords.length) {
        setIsGameCompleted(true);
        setTimeout(() => speakAudio('I love learning English every day!'), 400);
      }
    } else {
      // Bấm sai -> rung lắc
      setShakeWordIndex(index);
      setTimeout(() => setShakeWordIndex(null), 450);
    }
  };

  const handleResetGame = () => {
    setSelectedWordIndices([]);
    setIsGameCompleted(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION CAO CẤP VỚI GRADIENT & HIỆU ỨNG ÁNH SÁNG                 */}
      {/* ========================================================================= */}
      <section
        className={`relative rounded-3xl border p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl space-y-10 transition-colors ${
          isLight
            ? 'bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 border-slate-200 text-slate-900'
            : 'bg-gradient-to-b from-[#0f1726] via-[#0d1422] to-[#0a0f1a] border-[#1e2d42] text-white'
        }`}
      >
        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Nền Tảng Tự Học Tiếng Anh Đa Kỹ Năng #1</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Chinh phục{' '}
              <span className="inline-block bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent underline decoration-emerald-500/40">
                Tiếng Anh
              </span>{' '}
              tự nhiên qua phản xạ & trò chơi
            </h1>

            <p className={`text-sm sm:text-base font-semibold leading-relaxed max-w-2xl ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Học nghe chép chính tả <strong>Dictation</strong>, nhại giọng chuẩn bản xứ <strong>Shadowing</strong>, trò chơi <strong>Xếp từ</strong>, viết phản xạ <strong>See & Write</strong> và luyện thi <strong>TOEIC / IELTS</strong> với phương pháp ngắt quãng Spaced Repetition thông minh.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dictation-shadowing"
                className="px-8 py-3.5 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Bắt đầu học miễn phí</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/vocabulary"
                className={`px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base border transition-all cursor-pointer flex items-center gap-2 ${
                  isLight
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
                    : 'border-[#1e2d42] text-slate-200 hover:bg-[#131d2b] hover:border-slate-600'
                }`}
              >
                <BookCheck className="w-4 h-4 text-emerald-500" />
                <span>Kho 100.000+ từ vựng</span>
              </Link>
            </div>

            {/* Feature Checkmarks */}
            <div className={`flex flex-wrap items-center gap-6 text-xs font-bold pt-2 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hoàn toàn miễn phí
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tự do tải video riêng
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lưu tiến độ học tập
              </span>
            </div>
          </div>

          {/* Right Column: Mascot & Interactive Speech */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
            <div className="speech-bubble mb-3 animate-bounce max-w-[280px]">
              Chào bạn! Hãy cùng Micky luyện tập 15 phút mỗi ngày để nói tiếng Anh tự nhiên như người bản xứ nhé! 💬
            </div>

            <div className="relative group cursor-pointer" onClick={() => speakAudio('Hello! Welcome to Micky English!')}>
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all" />
              <MickyMascot size={145} />
            </div>
          </div>
        </div>

        {/* Live Dictionary Quick Search */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto pt-2">
          <div className={`relative flex items-center border-2 rounded-2xl p-2 shadow-xl transition-all ${
            isLight
              ? 'bg-white border-slate-300 focus-within:border-emerald-500'
              : 'bg-[#131d2b] border-[#1e2d42] focus-within:border-emerald-500'
          }`}>
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Gõ thử một từ tiếng Anh (VD: Accomplish, Resilient, Negotiate...)"
              className={`w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold px-3 ${
                isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
              }`}
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              Tra từ ngay
            </button>
          </div>

          {/* Live Search Result Card */}
          {searchResult && (
            <div className={`mt-3 p-4 border rounded-2xl text-left space-y-2 animate-fade-in shadow-xl ${
              isLight ? 'bg-white border-emerald-300' : 'bg-[#131d2b] border-emerald-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-emerald-500">{searchResult.word}</h4>
                  <span className="text-xs text-slate-400 font-semibold">{searchResult.phonetic}</span>
                  <button
                    type="button"
                    onClick={() => speakAudio(searchResult.word)}
                    className="p-1 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="badge-micky-green">{searchResult.topic}</span>
              </div>
              <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                🇻🇳 Nghĩa: {searchResult.meaning}
              </p>
              <p className={`text-xs italic p-2.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#0b0f17] border-[#1e2d42] text-slate-300'
              }`}>
                "🇬🇧 {searchResult.exampleEn}"
              </p>
            </div>
          )}
        </form>

        {/* 4 Chỉ số thành tựu ấn tượng */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className={`border rounded-2xl p-4 space-y-1 transition-all hover:scale-[1.02] ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span className="text-2xl sm:text-3xl font-black text-emerald-500 block">4.415+</span>
            <span className={`text-xs font-black block ${isLight ? 'text-slate-800' : 'text-white'}`}>Bài học Dictation & Shadowing</span>
            <span className="text-[10px] text-slate-400 font-semibold block">Luyện nghe nói phản xạ</span>
          </div>

          <div className={`border rounded-2xl p-4 space-y-1 transition-all hover:scale-[1.02] ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span className="text-2xl sm:text-3xl font-black text-blue-500 block">150+</span>
            <span className={`text-xs font-black block ${isLight ? 'text-slate-800' : 'text-white'}`}>Truyện Song Ngữ</span>
            <span className="text-[10px] text-slate-400 font-semibold block">Đọc & Tra từ 1-chạm</span>
          </div>

          <div className={`border rounded-2xl p-4 space-y-1 transition-all hover:scale-[1.02] ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span className="text-2xl sm:text-3xl font-black text-amber-500 block">5.000+</span>
            <span className={`text-xs font-black block ${isLight ? 'text-slate-800' : 'text-white'}`}>Câu See & Write</span>
            <span className="text-[10px] text-slate-400 font-semibold block">Luyện viết phản xạ</span>
          </div>

          <div className={`border rounded-2xl p-4 space-y-1 transition-all hover:scale-[1.02] ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span className="text-2xl sm:text-3xl font-black text-purple-500 block">503+</span>
            <span className={`text-xs font-black block ${isLight ? 'text-slate-800' : 'text-white'}`}>Đề Thi Thử</span>
            <span className="text-[10px] text-slate-400 font-semibold block">TOEIC, IELTS & VSTEP</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRẢI NGHIỆM TƯƠNG TÁC TRỰC TIẾP (INTERACTIVE FEATURE PLAYGROUND)        */}
      {/* ========================================================================= */}
      <section className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
            <Gamepad2 className="w-4 h-4" />
            <span>Trải nghiệm ngay không cần cài đặt</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black">
            Khám phá phương pháp học cuốn hút tại Micky English
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-medium">
            Hãy thử bấm tương tác trực tiếp với các tính năng đặc sắc dưới đây:
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActivePlaygroundTab('word-order')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlaygroundTab === 'word-order'
                ? 'bg-[#00c950] text-white shadow-lg shadow-emerald-500/25 scale-105'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638]'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Trò chơi Xếp từ (Word Order)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlaygroundTab('dictation')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlaygroundTab === 'dictation'
                ? 'bg-[#00c950] text-white shadow-lg shadow-emerald-500/25 scale-105'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638]'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Dictation & Shadowing</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlaygroundTab('bilingual')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlaygroundTab === 'bilingual'
                ? 'bg-[#00c950] text-white shadow-lg shadow-emerald-500/25 scale-105'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Truyện chêm Song ngữ</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlaygroundTab('flashcard')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlaygroundTab === 'flashcard'
                ? 'bg-[#00c950] text-white shadow-lg shadow-emerald-500/25 scale-105'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcard Spaced Repetition</span>
          </button>
        </div>

        {/* TAB 1: MINI WORD ORDER GAME */}
        {activePlaygroundTab === 'word-order' && (
          <div className={`max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-xl text-left space-y-6 animate-fade-in ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500 block">
                  Bấm các từ theo thứ tự để ghép thành câu đúng:
                </span>
                <p className="text-xs text-slate-400 font-semibold">
                  "Tôi thích học tiếng Anh mỗi ngày."
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetGame}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Làm lại
              </button>
            </div>

            {/* Answer Display Slots */}
            <div className={`p-4 rounded-2xl border min-h-[60px] flex flex-wrap items-center gap-2.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b0f17] border-[#1e2d42]'
            }`}>
              {selectedWordIndices.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Nhấp vào các từ ở pool bên dưới để xếp câu...</span>
              ) : (
                selectedWordIndices.map((idx, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md animate-fade-in"
                  >
                    {sampleWords[idx]}
                  </span>
                ))
              )}
            </div>

            {/* Scrambled Word Pool */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Chọn từ tiếp theo:</span>
              <div className="flex flex-wrap gap-2.5">
                {['learning', 'day', 'I', 'every', 'love', 'English'].map((w, i) => {
                  const originalIndex = sampleWords.indexOf(w);
                  const isUsed = selectedWordIndices.includes(originalIndex);
                  const isShaking = shakeWordIndex === originalIndex;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handleWordClick(w, originalIndex)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isUsed
                          ? 'opacity-30 pointer-events-none bg-slate-800 text-slate-500'
                          : isShaking
                          ? 'animate-shake bg-rose-500/20 text-rose-300 border border-rose-500'
                          : isLight
                          ? 'bg-slate-100 hover:bg-emerald-500 hover:text-white border border-slate-200'
                          : 'bg-[#172338] hover:bg-emerald-600 text-slate-200 hover:text-white border border-[#1e2d42]'
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Victory Banner */}
            {isGameCompleted && (
              <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    🎉
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-300">Chính xác tuyệt đối!</h4>
                    <p className="text-[11px] text-slate-300">"I love learning English every day."</p>
                  </div>
                </div>

                <Link
                  href="/dictation-shadowing"
                  className="px-4 py-2 bg-white text-emerald-700 font-black text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all shrink-0 cursor-pointer"
                >
                  Chơi thêm nhiều câu nữa →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DICTATION & SHADOWING DEMO */}
        {activePlaygroundTab === 'dictation' && (
          <div className={`max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-xl text-left space-y-5 animate-fade-in ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500 block">
                  Công nghệ Auto-pause dứt câu thông minh:
                </span>
                <h4 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Balancing Stones in the River (TED Talk)
                </h4>
              </div>
              <span className="badge-micky-green">Level: B1</span>
            </div>

            <div className="aspect-16/9 w-full bg-black rounded-2xl overflow-hidden border border-[#1e2d42] relative group flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
                alt="Demo"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 space-y-2">
                <span className="text-xs font-bold text-emerald-400">Câu 1/14: (0:00 - 0:05)</span>
                <p className="text-base sm:text-lg font-black text-white">
                  "Every summer, I come to this quiet river to practice the ancient art of balancing stones."
                </p>
                <p className="text-xs text-slate-300 font-medium italic">
                  Mỗi mùa hè, tôi lại đến dòng sông tĩnh lặng này để thực hành nghệ thuật xếp đá cổ xưa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => speakAudio('Every summer, I come to this quiet river to practice the ancient art of balancing stones.')}
                className="absolute w-14 h-14 rounded-full bg-[#00c950] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">💡 Video tự động dừng khi hết câu để bạn nghe chép hoặc nhại lại giọng.</span>
              <Link
                href="/dictation-shadowing/balancing-stones-intro"
                className="px-5 py-2.5 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Vào học bài này ngay →
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: BILINGUAL NEWS DEMO */}
        {activePlaygroundTab === 'bilingual' && (
          <div className={`max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-xl text-left space-y-4 animate-fade-in ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500 block">
              Truyện song ngữ tra từ 1-chạm (Bấm vào từ in đậm để nghe & xem nghĩa):
            </span>

            <div className={`p-5 rounded-2xl border leading-relaxed text-sm font-semibold space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b0f17] border-[#1e2d42] text-slate-200'
            }`}>
              <p>
                Once upon a time in a peaceful valley, an ambitious{' '}
                <button
                  type="button"
                  onClick={() => speakAudio('architect')}
                  className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                  title="architect / kiến trúc sư"
                >
                  architect 🔊
                </button>{' '}
                wanted to build a bridge that could withstand any{' '}
                <button
                  type="button"
                  onClick={() => speakAudio('storm')}
                  className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                  title="storm / cơn bão"
                >
                  storm 🔊
                </button>
                . He gathered the strongest{' '}
                <button
                  type="button"
                  onClick={() => speakAudio('materials')}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                  title="materials / nguyên vật liệu"
                >
                  materials 🔊
                </button>{' '}
                and inspired the entire community.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">📖 Đọc truyện thư giãn, tích lũy từ vựng tự nhiên theo ngữ cảnh.</span>
              <Link
                href="/practice/reading"
                className="px-5 py-2.5 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Đọc thêm truyện song ngữ →
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: FLASHCARD SM-2 DEMO */}
        {activePlaygroundTab === 'flashcard' && (
          <div className="max-w-md mx-auto space-y-4 animate-fade-in">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`p-8 rounded-3xl border shadow-2xl cursor-pointer transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center text-center space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
              }`}
            >
              <span className="badge-micky-green text-[10px]">Chạm để lật thẻ</span>
              {!isFlipped ? (
                <>
                  <h3 className="text-3xl font-black text-emerald-400">Resilient</h3>
                  <p className="text-xs text-slate-400 font-mono">/rɪˈzɪl.jənt/ (adj)</p>
                  <p className="text-xs text-slate-400">Bấm để xem nghĩa tiếng Việt & ví dụ</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-white">Kiên cường, mau phục hồi</h3>
                  <p className="text-xs text-slate-300 italic">"He is resilient and never gives up in tough times."</p>
                  <span className="text-[11px] text-emerald-400 font-bold">Ôn tập lại sau: 3 ngày nữa (SM-2)</span>
                </>
              )}
            </div>

            <Link
              href="/vocabulary"
              className="inline-flex px-6 py-2.5 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Luyện ôn 600 từ TOEIC ngay →
            </Link>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. 6 TRỤ CỘT ĐÀO TẠO CỐT LÕI (CORE LEARNING PILLARS)                        */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Phương pháp độc quyền</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black">
            6 Trụ cột giúp bạn làm chủ Tiếng Anh từ gốc
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-medium">
            Mỗi kỹ năng được thiết kế có hệ thống bài tập thực hành chuyên biệt, không học vẹt ngữ pháp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Dictation */}
          <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] space-y-3.5 shadow-lg ${
            isLight ? 'bg-white border-slate-200 hover:border-emerald-500' : 'bg-[#111a28] border-[#1e2d42] hover:border-emerald-500'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black">1. Nghe chép chính tả (Dictation)</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Tự động dừng khi dứt câu, lặp lại mốc thời gian cho đến khi tai bạn nghe rõ từng mạo từ, đuôi -ed, nối âm bản ngữ.
            </p>
            <Link href="/dictation-shadowing" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline">
              Bắt đầu luyện nghe →
            </Link>
          </div>

          {/* Card 2: Shadowing */}
          <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] space-y-3.5 shadow-lg ${
            isLight ? 'bg-white border-slate-200 hover:border-emerald-500' : 'bg-[#111a28] border-[#1e2d42] hover:border-emerald-500'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black">2. Nhại giọng chuẩn (Shadowing)</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Ghi âm giọng nói nhại lại người bản xứ theo từng câu, điều chỉnh tốc độ 50%-75%-100% để hình thành phản xạ phát âm tự nhiên.
            </p>
            <Link href="/dictation-shadowing" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-500 hover:underline">
              Luyện phát âm ngay →
            </Link>
          </div>

          {/* Card 3: Word Order */}
          <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] space-y-3.5 shadow-lg ${
            isLight ? 'bg-white border-slate-200 hover:border-emerald-500' : 'bg-[#111a28] border-[#1e2d42] hover:border-emerald-500'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black">3. Trò chơi Xếp từ (Word Order)</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Nối từ theo đúng thứ tự câu bạn nghe được. Hệ thống rung lắc cảnh báo khi chọn sai, giúp bạn nhớ cấu trúc câu vô thức.
            </p>
            <Link href="/dictation-shadowing" className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:underline">
              Khám phá Game xếp từ →
            </Link>
          </div>

          {/* Card 4: See & Write */}
          <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] space-y-3.5 shadow-lg ${
            isLight ? 'bg-white border-slate-200 hover:border-emerald-500' : 'bg-[#111a28] border-[#1e2d42] hover:border-emerald-500'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black">4. Viết phản xạ (See & Write)</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Nhìn ý nghĩa tiếng Việt và gõ lại câu tiếng Anh với gợi ý ký tự thông minh. Loại bỏ hoàn toàn tật dịch thầm trong đầu.
            </p>
            <Link href="/practice/see-write" className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:underline">
              Luyện viết phản xạ →
            </Link>
          </div>

          {/* Card 5: Spaced Repetition */}
          <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] space-y-3.5 shadow-lg ${
            isLight ? 'bg-white border-slate-200 hover:border-emerald-500' : 'bg-[#111a28] border-[#1e2d42] hover:border-emerald-500'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black">5. Thuật toán Spaced Repetition</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Ứng dụng thuật toán SuperMemo SM-2 tự động tính toán thời điểm vàng ôn tập từ vựng (1 ngày, 3 ngày, 7 ngày) để đưa vào trí nhớ dài hạn.
            </p>
            <Link href="/vocabulary" className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:underline">
              Xem sổ từ vựng →
            </Link>
          </div>

          {/* Card 6: Exam Simulation */}
          <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] space-y-3.5 shadow-lg ${
            isLight ? 'bg-white border-slate-200 hover:border-emerald-500' : 'bg-[#111a28] border-[#1e2d42] hover:border-emerald-500'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black">6. Thi thử TOEIC & IELTS chuẩn format</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Hơn 500 đề thi đầy đủ phần Nghe & Đọc có đồng hồ tính giờ chính xác, chấm điểm tự động và giải thích chi tiết từng câu.
            </p>
            <Link href="/kho-de" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:underline">
              Làm đề thi thử ngay →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TOP BÀI HỌC NỔI BẬT ĐƯỢC HỌC NHIỀU NHẤT (TRENDING LESSONS)              */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-black uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>Trending tuần này</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Bài học luyện nghe tuyển chọn</h2>
          </div>

          <Link
            href="/dictation-shadowing"
            className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
          >
            <span>Xem tất cả 4.415+ bài học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDictationLessons.slice(0, 3).map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dictation-shadowing/${lesson.id}`}
              className={`group rounded-3xl border overflow-hidden shadow-lg transition-all hover:scale-[1.02] flex flex-col ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
              }`}
            >
              <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
                <img
                  src={lesson.thumbnail || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80'}
                  alt={lesson.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#2563eb] text-white text-[10px] font-black">
                  {lesson.level || 'B1'}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-300" />
                  {Math.floor((lesson.duration || 60) / 60)}:{(lesson.duration || 60) % 60 < 10 ? '0' : ''}{(lesson.duration || 60) % 60}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-500 block">{lesson.topic}</span>
                  <h3 className="text-sm font-black line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {lesson.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 text-[11px] font-bold text-slate-400">
                  <span>{lesson.sentences?.length || 10} câu luyện tập</span>
                  <span className="text-emerald-500 flex items-center gap-1 font-black">
                    Học ngay <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ĐÁNH GIÁ & PHẢN HỒI THỰC TẾ TỪ HỌC VIÊN (TESTIMONIALS)                 */}
      {/* ========================================================================= */}
      <section className={`p-8 sm:p-12 rounded-3xl border text-center space-y-8 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f1726] border-[#1e2d42]'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Được tin tưởng bởi hơn 50.000+ người học</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
            Từ sinh viên mất gốc đến người đi làm cần cải thiện tiếng Anh cấp tốc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className={`p-6 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                TH
              </div>
              <div>
                <p className="text-xs font-black">Trần Hoàng Linh</p>
                <p className="text-[10px] text-emerald-500 font-bold">Sinh viên ĐH Ngoại Thương • TOEIC 865</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              "Trước đây mình nghe bị nuốt từ rất nhiều. Nhờ luyện Dictation dừng dứt câu và Shadowing mỗi ngày 20 phút, điểm Listening TOEIC của mình đã nhảy vọt từ 280 lên 445!"
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                NM
              </div>
              <div>
                <p className="text-xs font-black">Nguyễn Minh Quân</p>
                <p className="text-[10px] text-blue-400 font-bold">Kỹ sư Phần mềm tại FPT Software</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              "Tính năng tự up video tiếng Anh của công ty lên rồi auto chia mốc câu để luyện Shadowing quá đỉnh! Mình tự tin họp và thuyết trình tiếng Anh với sếp nước ngoài hơn hẳn."
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                KL
              </div>
              <div>
                <p className="text-xs font-black">Khánh Linh</p>
                <p className="text-[10px] text-purple-400 font-bold">IELTS Band 7.5</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              "Game xếp từ và phần See & Write cực kỳ gây nghiện! Giao diện MickyEnglish mượt mà, tối giản, không bị chèn quảng cáo khó chịu như các trang khác."
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FINAL CALL TO ACTION (CTA BANNER CUỐI TRANG)                           */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 text-center text-white overflow-hidden shadow-2xl space-y-6">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black">
            Bắt đầu hành trình thành thạo Tiếng Anh ngay hôm nay
          </h2>
          <p className="text-xs sm:text-sm font-medium text-emerald-100 leading-relaxed">
            Học miễn phí không giới hạn, không cần thẻ tín dụng. Tặng ngay 100 kim cương 💎 để mở khóa tất cả các chế độ luyện tập nâng cao.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              Tạo tài khoản miễn phí →
            </Link>
            <Link
              href="/dictation-shadowing"
              className="px-6 py-3.5 bg-emerald-900/60 hover:bg-emerald-900/80 border border-emerald-400/40 text-white font-black text-sm sm:text-base rounded-2xl transition-all cursor-pointer"
            >
              Học thử không cần đăng nhập
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
