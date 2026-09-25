'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart2,
  BookOpen,
  Edit3,
  Search,
  Sparkles,
  Clock,
  Award,
  Layers,
  Newspaper,
  CheckCircle2,
  XCircle,
  Volume2,
  ArrowRight,
  RotateCcw,
  Gem,
  Flame,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';

export default function PracticeHubPage() {
  const { user, isAuthenticated, incrementProgress } = useAuthStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [activeModalMode, setActiveModalMode] = useState<string | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const modes = [
    {
      id: 'see-write',
      title: 'Nhìn và viết',
      description: 'Quan sát hình ảnh hoặc video, tìm từ khóa rồi luyện viết câu hoàn chỉnh.',
      icon: '🐱',
      badge: null,
      href: '/practice/see-write',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    },
    {
      id: 'reading',
      title: 'Luyện đọc',
      description: 'Đọc truyện ngắn theo cấp độ, làm quiz và viết phản hồi để đo mức hiểu bài.',
      icon: '📖',
      badge: null,
      href: '/practice/reading',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30',
    },
    {
      id: 'error-find',
      title: 'Tìm lỗi',
      description: 'Lật 10 flashcard ngẫu nhiên, nhận định đúng sai, tìm chính xác vị trí và chọn cách sửa lỗi.',
      icon: '🦉',
      badge: 'NEW',
      href: '/practice/error-find',
      color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30',
    },
    {
      id: 'chunk-flow',
      title: 'ChunkFlow (Nối câu)',
      description: 'Đọc, nói và viết lại theo từng cụm rồi nối thành một đoạn hoàn chỉnh.',
      icon: '🕸️',
      badge: 'NEW',
      color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30',
    },
    {
      id: 'bilingual-news',
      title: 'Đọc báo song ngữ',
      description: 'Đọc báo song ngữ, làm quiz luyện đề và ôn lại lỗi sai.',
      icon: '💬',
      badge: 'NEW',
      href: '/practice/bilingual-news',
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
    },
  ];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 font-sans transition-colors ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* 1. Header Luyện tập chuẩn Bibung */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Luyện tập
          </h1>
          <p className={`text-sm sm:text-base font-medium mt-1 ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Chọn một chế độ để bắt đầu rèn luyện kỹ năng của bạn.
          </p>
        </div>

        <button
          onClick={() => setShowStatsModal(true)}
          className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black rounded-full flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 cursor-pointer shrink-0"
        >
          <BarChart2 className="w-4 h-4" /> Thống kê
        </button>
      </div>

      {/* 2. Grid 5 Chế Độ Luyện Tập Chuẩn Ảnh 4 */}
      <div className="space-y-4">
        {/* Hàng trên: 3 chế độ (Nhìn và viết, Luyện đọc, Tìm lỗi) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.slice(0, 3).map((mode) => (
            <PracticeCard
              key={mode.id}
              mode={mode}
              isLight={isLight}
              onClick={() => setActiveModalMode(mode.id)}
            />
          ))}
        </div>

        {/* Hàng dưới: 2 chế độ (ChunkFlow, Đọc báo song ngữ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.slice(3, 5).map((mode) => (
            <PracticeCard
              key={mode.id}
              mode={mode}
              isLight={isLight}
              onClick={() => setActiveModalMode(mode.id)}
            />
          ))}
        </div>
      </div>

      {/* 3. Hai Widget Chân Trang: Hoạt Động Gần Đây & Bài Học Nổi Bật */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Hoạt động gần đây */}
        <div className={`border rounded-3xl p-6 space-y-4 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#121c2b] border-[#1e2d42]'
        }`}>
          <div className={`flex items-center gap-2 font-black text-base sm:text-lg ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <Clock className="w-5 h-5 text-emerald-500" />
            <span>Hoạt động gần đây</span>
          </div>

          {!isAuthenticated ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Đăng nhập để xem hoạt động luyện tập gần đây.
              </p>
              <Link
                href="/login"
                className="text-sm font-bold text-emerald-500 hover:underline"
              >
                Đăng nhập ngay &gt;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`p-4 border rounded-2xl flex items-center justify-between text-sm transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div>
                  <div className={`font-bold text-sm sm:text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Tìm lỗi (10 Flashcards)
                  </div>
                  <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Đạt 9/10 câu chính xác • +20 💎
                  </div>
                </div>
                <span className="text-xs text-emerald-500 font-bold">Vừa xong</span>
              </div>
              <div className={`p-4 border rounded-2xl flex items-center justify-between text-sm transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div>
                  <div className={`font-bold text-sm sm:text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    ChunkFlow: Work-Life Balance
                  </div>
                  <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Hoàn thành 4 cụm câu • 100% trôi chảy
                  </div>
                </div>
                <span className={`text-xs font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Hôm qua
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bài học nổi bật */}
        <div className={`border rounded-3xl p-6 space-y-4 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#121c2b] border-[#1e2d42]'
        }`}>
          <div className={`flex items-center gap-2 font-black text-base sm:text-lg ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Bài học nổi bật</span>
          </div>

          {!isAuthenticated ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Đăng nhập để xem bài học nổi bật.
              </p>
              <Link
                href="/login"
                className="text-sm font-bold text-emerald-500 hover:underline"
              >
                Đăng nhập ngay &gt;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/practice/error-find"
                className={`p-4 border rounded-2xl flex items-center justify-between text-sm cursor-pointer transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-emerald-500 hover:shadow-xs'
                    : 'bg-[#0d131d] border-[#1e2d42] hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className={`font-bold text-sm sm:text-base flex items-center gap-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    <span>10 Lỗi Giới Từ Thường Gặp Nhất</span>
                    <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded">NEW</span>
                  </div>
                  <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Luyện mắt phát hiện lỗi in/on/at nhanh
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-500" />
              </Link>

              <Link
                href="/practice/bilingual-news"
                className={`p-4 border rounded-2xl flex items-center justify-between text-sm cursor-pointer transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-emerald-500 hover:shadow-xs'
                    : 'bg-[#0d131d] border-[#1e2d42] hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className={`font-bold text-sm sm:text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Tin Tức Công Nghệ AI 2026 (Song Ngữ)
                  </div>
                  <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    300 từ vựng nâng cao • Có đối chiếu tiếng Việt
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-500" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL 1: GAME TÌM LỖI 10 FLASHCARD ================= */}
      {activeModalMode === 'error-find' && (
        <ErrorFindTrainer isLight={isLight} onClose={() => setActiveModalMode(null)} />
      )}

      {/* ================= MODAL 2: CHUNKFLOW NỐI CÂU ================= */}
      {activeModalMode === 'chunk-flow' && (
        <ChunkFlowTrainer isLight={isLight} onClose={() => setActiveModalMode(null)} />
      )}

      {/* ================= MODAL 3: NHÌN VÀ VIẾT ================= */}
      {activeModalMode === 'see-write' && (
        <SeeWriteTrainer isLight={isLight} onClose={() => setActiveModalMode(null)} />
      )}

      {/* ================= MODAL 4: LUYỆN ĐỌC ================= */}
      {activeModalMode === 'reading' && (
        <ReadingTrainer isLight={isLight} onClose={() => setActiveModalMode(null)} />
      )}

      {/* ================= MODAL 5: ĐỌC BÁO SONG NGỮ ================= */}
      {activeModalMode === 'bilingual-news' && (
        <BilingualNewsTrainer isLight={isLight} onClose={() => setActiveModalMode(null)} />
      )}

      {/* ================= MODAL THỐNG KÊ KỸ NĂNG ================= */}
      {showStatsModal && (
        <StatsModal isLight={isLight} onClose={() => setShowStatsModal(false)} />
      )}
    </div>
  );
}

// Card chế độ luyện tập chuẩn Bibung
function PracticeCard({ mode, isLight, onClick }: { mode: any; isLight: boolean; onClick: () => void }) {
  const content = (
    <div
      onClick={mode.href ? undefined : onClick}
      className={`group relative border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 h-full ${
        isLight
          ? 'bg-white border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-xl'
          : 'bg-[#121c2b] border-[#1e2d42] hover:border-emerald-500/80 shadow-md hover:shadow-2xl'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform ${
          isLight ? 'bg-slate-100 border border-slate-200' : 'bg-[#0d131d] border border-[#1e2d42]'
        }`}>
          {mode.icon}
        </div>
        {mode.badge && (
          <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded-md uppercase tracking-wider shadow-sm">
            {mode.badge}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className={`text-lg sm:text-xl font-black transition-colors ${
          isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-400'
        }`}>
          {mode.title}
        </h3>
        <p className={`text-sm sm:text-base leading-relaxed font-medium ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          {mode.description}
        </p>
      </div>

      <div className="pt-2 flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
        <span>Bắt đầu luyện tập &gt;</span>
      </div>
    </div>
  );

  if (mode.href) {
    return <Link href={mode.href} className="block h-full">{content}</Link>;
  }

  return content;
}

// ================= TRAINER 1: TÌM LỖI (10 FLASHCARDS) =================
function ErrorFindTrainer({ isLight, onClose }: { isLight: boolean; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'correct' | 'wrong' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const cards = [
    {
      sentence: "She don't like drinking black coffee in the morning.",
      hasError: true,
      errorPart: "don't like",
      correction: "doesn't like",
      rule: "Chủ ngữ 'She' là ngôi thứ 3 số ít, nên trợ động từ phủ định phải là 'doesn't', không phải 'don't'.",
    },
    {
      sentence: "They have lived in this apartment since five years.",
      hasError: true,
      errorPart: "since five years",
      correction: "for five years",
      rule: "Khoảng thời gian ('five years') phải đi với giới từ 'for'. 'Since' chỉ đi với mốc thời gian (ví dụ: since 2020).",
    },
    {
      sentence: "The committee reached a unanimous agreement yesterday.",
      hasError: false,
      errorPart: null,
      correction: "Câu hoàn toàn chính xác!",
      rule: "Cấu trúc 'reach an agreement' (đạt được sự thống nhất) và tính từ 'unanimous' (nhất trí) được dùng chuẩn xác.",
    },
    {
      sentence: "If I was you, I would accept the job offer immediately.",
      hasError: true,
      errorPart: "If I was you",
      correction: "If I were you",
      rule: "Trong câu điều kiện loại 2 giả định trái thực tế, 'were' được ưu tiên sử dụng cho mọi ngôi.",
    },
    {
      sentence: "He is capable of solving complex algorithmic problems.",
      hasError: false,
      errorPart: null,
      correction: "Câu hoàn toàn chính xác!",
      rule: "Cụm 'capable of + V-ing' được dùng hoàn hảo.",
    },
    {
      sentence: "She insisted on pay for the entire dinner bill.",
      hasError: true,
      errorPart: "pay",
      correction: "paying",
      rule: "Sau giới từ 'on', động từ phải ở dạng V-ing: 'insist on paying'.",
    },
    {
      sentence: "Neither of the candidates has enough practical experience.",
      hasError: false,
      errorPart: null,
      correction: "Câu hoàn toàn chính xác!",
      rule: "'Neither of' đi với danh từ số nhiều nhưng động từ chia ở ngôi thứ 3 số ít ('has').",
    },
    {
      sentence: "I look forward to hear from your company soon.",
      hasError: true,
      errorPart: "hear",
      correction: "hearing",
      rule: "Cụm quen thuộc 'look forward to + V-ing': 'look forward to hearing'.",
    },
    {
      sentence: "The economic growth has slowed down considerably this quarter.",
      hasError: false,
      errorPart: null,
      correction: "Câu hoàn toàn chính xác!",
      rule: "Hiện tại hoàn thành 'has slowed down' cùng trạng từ 'considerably' được dùng chuẩn ngữ pháp.",
    },
    {
      sentence: "He suggested me to consult a professional lawyer.",
      hasError: true,
      errorPart: "me to consult",
      correction: "that I consult / consulting",
      rule: "Động từ 'suggest' không đi với 'suggest someone to do something', mà là 'suggest doing' hoặc 'suggest that S (should) do'.",
    },
  ];

  const current = cards[currentIdx];

  const handleAnswer = (choice: 'correct' | 'wrong') => {
    setSelectedAnswer(choice);
    setShowExplanation(true);
    const isRight = (choice === 'wrong' && current.hasError) || (choice === 'correct' && !current.hasError);
    if (isRight) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentIdx + 1 < cards.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-xl border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 transition-colors ${
        isLight ? 'bg-white border-amber-300 text-slate-900' : 'bg-[#121c2b] border-yellow-500/40 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦉</span>
            <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Tìm Lỗi Ngữ Pháp (10 Flashcards)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ✕
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-5">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Thẻ {currentIdx + 1} / 10</span>
              <span className="text-emerald-500 font-mono text-sm">Điểm: {score}</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              isLight ? 'bg-slate-100' : 'bg-[#0d131d]'
            }`}>
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
              />
            </div>

            {/* Flashcard Box with Large Typography */}
            <div className={`p-6 sm:p-8 border-2 rounded-3xl text-center space-y-3 shadow-inner min-h-[160px] flex flex-col justify-center ${
              isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-[#0d131d] border-[#1e2d42]'
            }`}>
              <p className={`text-xl sm:text-2xl font-black leading-relaxed ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}>
                "{current.sentence}"
              </p>
            </div>

            {/* Answer Buttons */}
            {!showExplanation ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleAnswer('correct')}
                  className="py-3.5 sm:py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5" /> CÂU NÀY ĐÚNG
                </button>
                <button
                  onClick={() => handleAnswer('wrong')}
                  className="py-3.5 sm:py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-transform"
                >
                  <XCircle className="w-5 h-5" /> CÓ LỖI SAI
                </button>
              </div>
            ) : (
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-in fade-in ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0b1320] border-slate-700 text-slate-100'
              }`}>
                <div className="flex items-center gap-2 font-black text-base">
                  {((selectedAnswer === 'wrong' && current.hasError) || (selectedAnswer === 'correct' && !current.hasError)) ? (
                    <span className="text-emerald-500 flex items-center gap-1.5">
                      <Check className="w-5 h-5" /> Chính xác! (+10 💎)
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1.5">
                      <X className="w-5 h-5" /> Chưa chính xác!
                    </span>
                  )}
                </div>

                {current.hasError ? (
                  <div className="text-sm space-y-1.5">
                    <div>Lỗi sai: <span className="text-rose-500 line-through font-bold">{current.errorPart}</span></div>
                    <div>Sửa thành: <span className="text-emerald-500 font-bold">{current.correction}</span></div>
                    <div className={`text-xs sm:text-sm pt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {current.rule}
                    </div>
                  </div>
                ) : (
                  <div className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {current.rule}
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-md cursor-pointer"
                >
                  {currentIdx + 1 < 10 ? 'Câu tiếp theo →' : 'Xem kết quả'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h4 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Hoàn Thành 10 Flashcards!
            </h4>
            <p className={`text-base ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Bạn đạt được <span className="text-amber-500 font-black text-xl">{score}/10</span> câu chính xác.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-black text-sm">
              <Gem className="w-4 h-4 text-cyan-500" /> +{score * 10} Kim Cương Đã Được Cộng
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setScore(0);
                  setIsFinished(false);
                }}
                className="py-3 px-7 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-full cursor-pointer shadow-md"
              >
                Luyện tập lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= TRAINER 2: CHUNKFLOW (NỐI CÂU) =================
function ChunkFlowTrainer({ isLight, onClose }: { isLight: boolean; onClose: () => void }) {
  const initialChunks = [
    { id: 1, text: 'In today modern world,' },
    { id: 2, text: 'maintaining a healthy work-life balance' },
    { id: 3, text: 'has become increasingly essential' },
    { id: 4, text: 'for mental and physical well-being.' },
  ];

  const [shuffled, setShuffled] = useState(() =>
    [...initialChunks].sort(() => Math.random() - 0.5)
  );
  const [selectedOrder, setSelectedOrder] = useState<any[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectChunk = (chunk: any) => {
    if (selectedOrder.some((c) => c.id === chunk.id)) return;
    const next = [...selectedOrder, chunk];
    setSelectedOrder(next);
    if (next.length === initialChunks.length) {
      const isRight = next.every((item, idx) => item.id === initialChunks[idx].id);
      if (isRight) setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setSelectedOrder([]);
    setIsSuccess(false);
    setShuffled([...initialChunks].sort(() => Math.random() - 0.5));
  };

  const speakAll = () => {
    if ('speechSynthesis' in window) {
      const text = initialChunks.map((c) => c.text).join(' ');
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-xl border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 transition-colors ${
        isLight ? 'bg-white border-cyan-300 text-slate-900' : 'bg-[#121c2b] border-cyan-500/40 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕸️</span>
            <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              ChunkFlow: Nối Cụm Câu Tự Nhiên
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ✕
          </button>
        </div>

        <p className={`text-sm sm:text-base leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Nhấp chọn các cụm từ (chunks) theo thứ tự ngữ pháp chính xác để tạo thành câu hoàn chỉnh:
        </p>

        {/* Selected sentence box with large text */}
        <div className={`p-4 sm:p-5 border-2 border-dashed rounded-2xl min-h-[100px] flex items-center flex-wrap gap-2.5 ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#0d131d] border-[#1e2d42]'
        }`}>
          {selectedOrder.length === 0 ? (
            <span className={`text-sm italic ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              Chọn các cụm từ bên dưới theo thứ tự...
            </span>
          ) : (
            selectedOrder.map((c, i) => (
              <span
                key={i}
                className={`px-3.5 py-1.5 border rounded-xl text-sm sm:text-base font-bold animate-in fade-in ${
                  isLight
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-2xs'
                    : 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                }`}
              >
                {c.text}
              </span>
            ))
          )}
        </div>

        {/* Available chunks */}
        <div className="flex flex-wrap gap-2.5">
          {shuffled.map((chunk) => {
            const isUsed = selectedOrder.some((c) => c.id === chunk.id);
            return (
              <button
                key={chunk.id}
                disabled={isUsed}
                onClick={() => handleSelectChunk(chunk)}
                className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all ${
                  isUsed
                    ? isLight
                      ? 'opacity-30 bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'opacity-30 bg-slate-800 text-slate-500 cursor-not-allowed'
                    : isLight
                    ? 'bg-slate-100 border border-slate-200 hover:bg-cyan-600 hover:text-white text-slate-800 cursor-pointer shadow-xs'
                    : 'bg-[#1e2d42] hover:bg-cyan-600 text-white cursor-pointer shadow-md'
                }`}
              >
                {chunk.text}
              </button>
            );
          })}
        </div>

        {/* Success message */}
        {isSuccess && (
          <div className={`p-4 rounded-2xl border space-y-2 text-center animate-in zoom-in-95 ${
            isLight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
          }`}>
            <div className="text-emerald-600 dark:text-emerald-400 font-black text-base flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Tuyệt vời! Bạn đã nối câu hoàn hảo!
            </div>
            <button
              onClick={speakAll}
              className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Volume2 className="w-4 h-4" /> Nghe toàn bộ câu
            </button>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            onClick={handleReset}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Thử lại
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black cursor-pointer shadow-md"
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= TRAINER 3: NHÌN VÀ VIẾT =================
function SeeWriteTrainer({ isLight, onClose }: { isLight: boolean; onClose: () => void }) {
  const [userInput, setUserInput] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-xl border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 transition-colors ${
        isLight ? 'bg-white border-amber-300 text-slate-900' : 'bg-[#121c2b] border-amber-500/40 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐱</span>
            <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Nhìn và Viết (See & Write)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-black shadow-md">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
            alt="Balance stones"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1.5">
          <span className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Từ khóa gợi ý:
          </span>
          <div className="flex flex-wrap gap-2">
            {['stones', 'balance', 'patience', 'zen'].map((k) => (
              <span
                key={k}
                className={`px-3 py-1 rounded-lg font-bold text-xs sm:text-sm border ${
                  isLight
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                #{k}
              </span>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Viết một câu tiếng Anh mô tả bức ảnh sử dụng ít nhất 2 từ khóa..."
          className={`w-full rounded-2xl p-3.5 text-sm sm:text-base outline-none transition-colors border ${
            isLight
              ? 'bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
              : 'bg-[#0d131d] border-[#1e2d42] focus:border-emerald-500 text-white placeholder-slate-500'
          }`}
        />

        {evaluated && (
          <div className={`p-4 border rounded-2xl space-y-1.5 text-sm animate-in fade-in ${
            isLight
              ? 'bg-emerald-50 border-emerald-300 text-slate-800'
              : 'bg-emerald-950/40 border-emerald-500/50 text-slate-200'
          }`}>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-base">✓ AI Chấm Điểm: 9.5/10</div>
            <div className="leading-relaxed">Cấu trúc câu tự nhiên, ngữ pháp chuẩn xác và truyền tải tốt cảm xúc của bức ảnh.</div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => setEvaluated(true)}
            className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-full cursor-pointer shadow-md"
          >
            Chấm điểm AI
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= TRAINER 4: LUYỆN ĐỌC =================
function ReadingTrainer({ isLight, onClose }: { isLight: boolean; onClose: () => void }) {
  const [showVi, setShowVi] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto transition-colors ${
        isLight ? 'bg-white border-blue-300 text-slate-900' : 'bg-[#121c2b] border-blue-500/40 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Luyện Đọc Hiểu: The Secret Garden
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowVi(!showVi)}
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            {showVi ? 'Ẩn bản dịch tiếng Việt' : 'Hiện bản dịch song ngữ'}
          </button>
        </div>

        <div className={`p-5 border rounded-2xl space-y-3 leading-relaxed ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
        }`}>
          <p className={`text-base sm:text-lg font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            Mary Lennox was a young girl who discovered a hidden, locked garden on her uncle's Yorkshire estate. With determination and the help of a robin, she found the hidden key buried in the soil.
          </p>
          {showVi && (
            <p className={`text-sm sm:text-base italic pt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Mary Lennox là một cô bé đã khám phá ra một khu vườn bí mật bị khóa kín trên trang viên Yorkshire của chú mình. Với sự quyết tâm và sự giúp đỡ của một chú chim cổ đỏ, cô đã tìm thấy chiếc chìa khóa bị chôn vùi dưới lòng đất.
            </p>
          )}
        </div>

        {/* Quick quiz with large text */}
        <div className="space-y-3 pt-2">
          <h4 className={`text-sm sm:text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Câu hỏi: Ai đã giúp Mary tìm ra chiếc chìa khóa?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
            {['Her uncle', 'A robin bird', 'A gardener', 'Her dog'].map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQuiz(idx)}
                className={`p-3.5 rounded-xl text-left font-bold transition-colors cursor-pointer border ${
                  selectedQuiz === idx
                    ? idx === 1
                      ? isLight
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                        : 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                      : isLight
                      ? 'bg-rose-100 border-rose-400 text-rose-800'
                      : 'bg-rose-600/30 border-rose-500 text-rose-300'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'
                    : 'bg-[#0d131d] border-[#1e2d42] text-slate-200 hover:border-slate-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= TRAINER 5: ĐỌC BÁO SONG NGỮ =================
function BilingualNewsTrainer({ isLight, onClose }: { isLight: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'bilingual' | 'vocab'>('bilingual');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto transition-colors ${
        isLight ? 'bg-white border-emerald-300 text-slate-900' : 'bg-[#121c2b] border-emerald-500/40 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Đọc Báo Song Ngữ: AI and Future Education
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ✕
          </button>
        </div>

        <div className={`flex gap-3 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-[#1e2d42]'}`}>
          <button
            onClick={() => setActiveTab('bilingual')}
            className={`text-xs sm:text-sm font-bold pb-1 cursor-pointer transition-colors ${
              activeTab === 'bilingual'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đoạn văn đối chiếu
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`text-xs sm:text-sm font-bold pb-1 cursor-pointer transition-colors ${
              activeTab === 'vocab'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Từ vựng trọng tâm (Vocabulary)
          </button>
        </div>

        {activeTab === 'bilingual' ? (
          <div className="space-y-3 leading-relaxed">
            <div className={`p-4 border rounded-2xl space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
            }`}>
              <p className={`font-semibold text-base sm:text-lg ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Artificial intelligence is revolutionizing modern language acquisition by providing personalized real-time tutoring.
              </p>
              <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Trí tuệ nhân tạo đang cách mạng hóa việc tiếp thu ngôn ngữ hiện đại bằng cách cung cấp sự kèm cặp cá nhân hóa trong thời gian thực.
              </p>
            </div>
            <div className={`p-4 border rounded-2xl space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
            }`}>
              <p className={`font-semibold text-base sm:text-lg ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Learners can now practice shadowing and dictation with immediate phonetic feedback.
              </p>
              <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Người học giờ đây có thể luyện tập nhại giọng và chép chính tả với phản hồi ngữ âm tức thì.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className={`p-4 border rounded-2xl space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
            }`}>
              <div className="font-black text-emerald-600 dark:text-emerald-400 text-base">revolutionize (v)</div>
              <div className={isLight ? 'text-slate-700' : 'text-slate-300'}>Cách mạng hóa</div>
            </div>
            <div className={`p-4 border rounded-2xl space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
            }`}>
              <div className="font-black text-emerald-600 dark:text-emerald-400 text-base">acquisition (n)</div>
              <div className={isLight ? 'text-slate-700' : 'text-slate-300'}>Sự tiếp thu, lĩnh hội</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= MODAL THỐNG KÊ KỸ NĂNG =================
function StatsModal({ isLight, onClose }: { isLight: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-lg border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 transition-colors ${
        isLight ? 'bg-white border-emerald-300 text-slate-900' : 'bg-[#121c2b] border-emerald-500/40 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Bảng Thống Kê Kỹ Năng Luyện Tập
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
          }`}>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">92%</div>
            <div className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Độ Chính Xác Tìm Lỗi
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
          }`}>
            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">14 câu</div>
            <div className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              ChunkFlow Đã Nối
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
          }`}>
            <div className="text-3xl font-black text-amber-500">5 ngày</div>
            <div className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Chuỗi Luyện Tập Liên Tục
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
          }`}>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">8 bài</div>
            <div className={`text-xs font-bold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Bài Đọc Song Ngữ
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl cursor-pointer shadow-md"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
