'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Edit3,
  FileText,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Volume2,
  Award,
  AlertCircle,
  Gem,
  Send,
  Sun,
  Moon,
} from 'lucide-react';
import { READING_STORIES, StoryData, QuizQuestion } from '@/data/readingStories';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';

type ActiveTab = 'story' | 'quiz' | 'essay' | 'explanation';
type ReadingMode = 'scroll' | 'single';

export default function ReadingStudioPage() {
  const { user, incrementProgress, updateProfile } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';
  const story: StoryData = READING_STORIES[0]; // "A Helping Hand"

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('story');

  // Reading modes & page indicator
  const [readingMode, setReadingMode] = useState<ReadingMode>('scroll');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = story.totalPages;

  // License collapse
  const [showLicenseInfo, setShowLicenseInfo] = useState<boolean>(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);

  // Essay state
  const [essayText, setEssayText] = useState<string>('');
  const [isEvaluatingEssay, setIsEvaluatingEssay] = useState<boolean>(false);
  const [essayFeedback, setEssayFeedback] = useState<{
    score: number;
    feedbackEn: string;
    feedbackVi: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Scroll ref for page tracking
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Switch pages in single mode or scroll to page
  const handleGoToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);

    if (readingMode === 'scroll') {
      const el = document.getElementById(`page-card-${pageNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Reset reading
  const handleResetReading = () => {
    setCurrentPage(1);
    if (readingMode === 'scroll') {
      const el = document.getElementById('page-card-1');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    showToast('Đã chuyển về trang 1 của bài đọc.');
  };

  // Handle quiz option select
  const handleSelectOption = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < story.quiz.length) {
      showToast(`Vui lòng trả lời đủ ${story.quiz.length} câu hỏi trước khi nộp bài!`);
      return;
    }

    let correctCount = 0;
    story.quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    setQuizScore(correctCount);
    if (correctCount > bestScore) {
      setBestScore(correctCount);
    }
    setIsQuizSubmitted(true);

    // Reward diamonds
    const earnedDiamonds = correctCount * 5 + 10;
    if (user) {
      updateProfile({
        diamonds: (user.diamonds || 0) + earnedDiamonds,
      });
    }
    incrementProgress({
      examsCompleted: 1,
    });

    showToast(`Nộp Quiz thành công! Đạt ${correctCount}/${story.quiz.length} câu đúng (+${earnedDiamonds} 💎)`);
    // Automatically switch to explanation tab or prompt
  };

  // Submit & evaluate Essay
  const handleEvaluateEssay = () => {
    if (essayText.trim().length < story.essayMinChars) {
      showToast(`Đoạn văn quá ngắn! Cần tối thiểu ${story.essayMinChars} ký tự để AI đánh giá.`);
      return;
    }

    setIsEvaluatingEssay(true);

    setTimeout(() => {
      setIsEvaluatingEssay(false);
      const mockScore = 9.2;
      setEssayFeedback({
        score: mockScore,
        feedbackEn:
          'Deep emotional reflection! Your narrative beautifully bridges empathy and inclusivity, closely aligning with the themes explored in "A Helping Hand".',
        feedbackVi:
          'Bài viết giàu cảm xúc và tư duy nhân văn sâu sắc. Bạn đã nắm bắt rất tốt thông điệp về sự hòa nhập và đồng cảm thay vì chỉ đơn thuần tò mò về sự khác biệt.',
        strengths: [
          'Vốn từ vựng mô tả phong phú (empathy, inclusive, supportive).',
          'Cấu trúc câu phức và mệnh đề quan hệ được sử dụng tự nhiên.',
          'Bám sát và phản ánh đúng tâm lý nhân vật trong câu chuyện.',
        ],
        improvements: [
          'Có thể bổ sung thêm một câu kết ngắn gọn để nhấn mạnh bài học cho bản thân.',
        ],
      });

      // Reward diamonds for essay
      if (user) {
        updateProfile({
          diamonds: (user.diamonds || 0) + 30,
        });
      }
      incrementProgress({
        examsCompleted: 1,
      });

      showToast('AI đã hoàn thành chấm điểm Essay! (+30 💎)');
    }, 1200);
  };

  // Read aloud text using SpeechSynthesis
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Trình duyệt không hỗ trợ Web Speech API.');
    }
  };

  // Progress metrics
  const answeredCount = Object.keys(userAnswers).length;
  const masteryPercentage = Math.round(
    ((isQuizSubmitted ? 50 : 0) + (essayFeedback ? 50 : 0))
  );

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors ${
      isLight ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#0b0f17] text-slate-200'
    }`}>
      {/* ================= 1. TOP HEADER BAR ================= */}
      <header className={`h-14 border-b px-4 flex items-center justify-between shrink-0 sticky top-0 z-40 transition-colors backdrop-blur-md ${
        isLight ? 'bg-white/95 border-slate-200 shadow-xs' : 'bg-[#0d131d] border-[#1e2d42]'
      }`}>
        {/* Left: Close button, Title, Level */}
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-[#121c2b] border-[#1e2d42] hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Đóng và quay lại Luyện tập"
          >
            <X className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-sm font-black leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {story.title}
              </h1>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                Story
              </span>
            </div>
            <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {story.level} • Mastery {masteryPercentage}%
            </span>
          </div>
        </div>

        {/* Center: Page switchers (visible when reading tab active) */}
        {activeTab === 'story' && (
          <div className={`flex items-center gap-2 border px-2.5 py-1 rounded-full text-xs font-bold ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700'
              : 'bg-[#121c2b] border-[#1e2d42] text-slate-300'
          }`}>
            <button
              onClick={() => handleGoToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`p-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors ${
                isLight ? 'hover:text-slate-900' : 'hover:text-white'
              }`}
              title="Trang trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-black text-emerald-500">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => handleGoToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`p-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors ${
                isLight ? 'hover:text-slate-900' : 'hover:text-white'
              }`}
              title="Trang sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Theme Switcher, Actions (Đọc lại, Cuộn dọc, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* NÚT ĐỔI GIAO DIỆN SÁNG / TỐI (LIGHT / DARK SWITCHER) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 shadow-xs'
                : 'bg-[#121c2b] hover:bg-[#1a2638] border-[#1e2d42] text-amber-400'
            }`}
            title="Chuyển đổi nền Sáng (Trắng) / Tối (Đen)"
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Button Đọc lại */}
          <button
            onClick={handleResetReading}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
                : 'bg-[#121c2b] hover:bg-[#1a2638] border-[#1e2d42] text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Đọc lại</span>
          </button>

          {/* Button Cuộn dọc / Lật trang */}
          <button
            onClick={() => {
              const nextMode = readingMode === 'scroll' ? 'single' : 'scroll';
              setReadingMode(nextMode);
              showToast(`Đã chuyển sang chế độ ${nextMode === 'scroll' ? 'Cuộn dọc' : 'Từng trang'}`);
            }}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
                : 'bg-[#121c2b] hover:bg-[#1a2638] border-[#1e2d42] text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">
              {readingMode === 'scroll' ? 'Cuộn dọc' : 'Từng trang'}
            </span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-400 hover:text-white'
            }`}
            title="Toàn màn hình"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 py-2.5 px-4 bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-xl shadow-2xl animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 2. MAIN 2-COLUMN LAYOUT ================= */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= CỘT TRÁI (8 CỘT - ~67%) ================= */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* 4 TABS NAVIGATION TRUNG TÂM (Chuẩn Ảnh 1-5) */}
          <div className={`flex items-center border rounded-2xl p-1.5 gap-1.5 shrink-0 transition-colors ${
            isLight
              ? 'bg-white border-slate-200 shadow-md'
              : 'bg-[#121c2b] border-[#1e2d42] shadow-lg'
          }`}>
            {/* Tab 1: Đọc truyện */}
            <button
              onClick={() => setActiveTab('story')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'story'
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d131d]'
              }`}
              title="Đọc truyện"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Đọc truyện</span>
            </button>

            {/* Tab 2: Quiz */}
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d131d]'
              }`}
              title="Quiz"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz</span>
            </button>

            {/* Tab 3: Viết Essay */}
            <button
              onClick={() => setActiveTab('essay')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'essay'
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d131d]'
              }`}
              title="Viết"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Viết</span>
            </button>

            {/* Tab 4: Giải thích */}
            <button
              onClick={() => setActiveTab('explanation')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'explanation'
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d131d]'
              }`}
              title="Giải thích"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Giải thích</span>
            </button>
          </div>

          {/* ================= NỘI DUNG TAB 1: ĐỌC TRUYỆN (ẢNH 1 & ẢNH 2) ================= */}
          {activeTab === 'story' && (
            <div ref={containerRef} className="space-y-6">
              {readingMode === 'scroll' ? (
                // Chế độ cuộn dọc toàn bộ các trang (Scroll Mode - Chuẩn ảnh 1 & 2)
                story.pages.map((p) => (
                  <div
                    key={p.pageNumber}
                    id={`page-card-${p.pageNumber}`}
                    className={`border rounded-3xl overflow-hidden transition-all ${
                      isLight
                        ? 'bg-white border-slate-200 shadow-xl'
                        : 'bg-[#121c2b] border-[#1e2d42] shadow-2xl'
                    }`}
                  >
                    {/* Header Thẻ Trang */}
                    <div className={`px-5 py-3 border-b flex items-center justify-between text-xs sm:text-sm font-black tracking-wider ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-emerald-700'
                        : 'bg-[#0d131d] border-[#1e2d42] text-emerald-400'
                    }`}>
                      <span>PAGE {p.pageNumber}</span>
                      <button
                        onClick={() => handleSpeak(p.text)}
                        className={`p-1.5 flex items-center gap-1.5 transition-colors cursor-pointer rounded-lg ${
                          isLight
                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title="Đọc toàn bộ trang này"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-xs font-semibold">Nghe</span>
                      </button>
                    </div>

                    {/* Khung tranh minh họa phong cách StoryWeaver giấy Kraft cổ điển */}
                    <div className="relative w-full aspect-16/10 bg-[#e0c9a6] overflow-hidden">
                      <img
                        src={p.imageUrl}
                        alt={p.imageAlt}
                        className="w-full h-full object-cover mix-blend-multiply opacity-95"
                      />
                    </div>

                    {/* Khối văn bản câu chuyện bên dưới tranh - FONT CHỮ LỚN TO RÕ */}
                    <div className={`p-6 sm:p-8 text-lg sm:text-xl leading-relaxed sm:leading-loose font-serif font-medium transition-colors ${
                      isLight ? 'bg-white text-slate-800' : 'bg-[#0d131d] text-slate-100'
                    }`}>
                      <p className="whitespace-pre-line tracking-wide">{p.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                // Chế độ lật từng trang đơn (Single Page Mode)
                <div className={`border rounded-3xl overflow-hidden ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-xl'
                    : 'bg-[#121c2b] border-[#1e2d42] shadow-2xl'
                }`}>
                  {(() => {
                    const p = story.pages.find((page) => page.pageNumber === currentPage) || story.pages[0];
                    return (
                      <div>
                        <div className={`px-5 py-3 border-b flex items-center justify-between text-xs sm:text-sm font-black tracking-wider ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 text-emerald-700'
                            : 'bg-[#0d131d] border-[#1e2d42] text-emerald-400'
                        }`}>
                          <span>PAGE {p.pageNumber} OF {totalPages}</span>
                          <button
                            onClick={() => handleSpeak(p.text)}
                            className={`p-1.5 flex items-center gap-1.5 transition-colors cursor-pointer rounded-lg ${
                              isLight
                                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                            <span className="text-xs font-semibold">Nghe trang này</span>
                          </button>
                        </div>
                        <div className="relative w-full aspect-16/10 bg-[#e0c9a6] overflow-hidden">
                          <img
                            src={p.imageUrl}
                            alt={p.imageAlt}
                            className="w-full h-full object-cover mix-blend-multiply opacity-95"
                          />
                        </div>
                        {/* FONT CHỮ LỚN TO RÕ */}
                        <div className={`p-6 sm:p-8 text-lg sm:text-xl leading-relaxed sm:leading-loose font-serif font-medium min-h-[160px] transition-colors ${
                          isLight ? 'bg-white text-slate-800' : 'bg-[#0d131d] text-slate-100'
                        }`}>
                          <p className="whitespace-pre-line tracking-wide">{p.text}</p>
                        </div>
                        {/* Footer chuyển trang */}
                        <div className={`p-4 border-t flex items-center justify-between ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
                        }`}>
                          <button
                            onClick={() => handleGoToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className={`py-2 px-4 rounded-xl border text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                              isLight
                                ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                                : 'bg-[#0d131d] border-[#1e2d42] text-slate-300 hover:text-white'
                            }`}
                          >
                            ← Trang trước
                          </button>
                          <span className={`text-xs font-mono font-bold ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {currentPage}/{totalPages}
                          </span>
                          <button
                            onClick={() => handleGoToPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className={`py-2 px-4 rounded-xl border text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                              isLight
                                ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                                : 'bg-[#0d131d] border-[#1e2d42] text-slate-300 hover:text-white'
                            }`}
                          >
                            Trang tiếp theo →
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ================= NỘI DUNG TAB 2: QUIZ (ẢNH 3 - 10.png) ================= */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {/* Banner Quiz Header */}
              <div className={`border rounded-3xl p-6 shadow-xl flex items-center justify-between ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
              }`}>
                <div>
                  <span className="text-[11px] font-black text-emerald-500 tracking-wider uppercase block mb-1">
                    QUIZ
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">
                    {story.quiz.length} questions
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 border rounded-2xl text-center min-w-[75px] ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
                  }`}>
                    <div className="text-lg sm:text-xl font-black font-mono leading-tight">
                      {answeredCount}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      ANSWERED
                    </div>
                  </div>

                  <div className={`px-4 py-2 border rounded-2xl text-center min-w-[75px] ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
                  }`}>
                    <div className="text-lg sm:text-xl font-black font-mono leading-tight">
                      {bestScore}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      BEST
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách 4 câu hỏi Quiz chuẩn Ảnh 3 với FONT CHỮ LỚN TO RÕ */}
              <div className="space-y-4">
                {story.quiz.map((q, idx) => {
                  const selectedKey = userAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`border rounded-3xl p-6 space-y-4 shadow-lg ${
                        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
                      }`}
                    >
                      {/* Tiêu đề câu hỏi */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                          {idx + 1}
                        </div>
                        <div>
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${
                            isLight ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            QUESTION {idx + 1} / {story.quiz.length}
                          </div>
                          <h3 className={`text-lg sm:text-xl font-black mt-1 leading-snug tracking-tight ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {q.question}
                          </h3>
                        </div>
                      </div>

                      {/* 4 Lựa chọn A, B, C, D - FONT CHỮ LỚN TO RÕ */}
                      <div className="space-y-3 pt-1">
                        {q.options.map((opt) => {
                          const isSelected = selectedKey === opt.key;
                          let btnStyle = isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-400'
                            : 'bg-[#0d131d] border-[#1e2d42] text-slate-200 hover:border-slate-500';

                          if (isSelected) {
                            btnStyle = isLight
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-xs'
                              : 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-black shadow-sm shadow-emerald-500/20';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={isQuizSubmitted}
                              onClick={() => handleSelectOption(q.id, opt.key)}
                              className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-base sm:text-lg flex items-center gap-4 transition-all cursor-pointer ${btnStyle} ${
                                isQuizSubmitted ? 'cursor-default' : ''
                              }`}
                            >
                              <span
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center font-black text-sm sm:text-base shrink-0 ${
                                  isSelected
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : isLight
                                    ? 'border-slate-300 bg-white text-slate-800'
                                    : 'border-[#1e2d42] bg-[#121c2b] text-slate-300'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span className="flex-1 leading-relaxed font-bold">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nút nộp bài Quiz */}
              {!isQuizSubmitted ? (
                <div className="pt-2">
                  <button
                    onClick={handleSubmitQuiz}
                    className="w-full py-4 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
                  >
                    <span>NỘP BÀI QUIZ</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className={`p-6 border rounded-3xl text-center space-y-3 animate-in zoom-in-95 ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : 'bg-emerald-950/40 border-emerald-500 text-white'
                }`}>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-500">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black">
                    Bạn đạt {quizScore}/{story.quiz.length} câu chính xác!
                  </h3>
                  <p className={`text-xs sm:text-sm max-w-md mx-auto ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    Phần giải thích đáp án chi tiết và phân tích câu chuyện đã được mở khóa.
                  </p>
                  <button
                    onClick={() => setActiveTab('explanation')}
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-full shadow-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Xem giải thích chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= NỘI DUNG TAB 3: VIẾT ESSAY (ẢNH 4 - 11.png) ================= */}
          {activeTab === 'essay' && (
            <div className="space-y-4">
              {/* Khung ESSAY PROMPT chuẩn Ảnh 4 */}
              <div className={`border rounded-3xl p-6 space-y-2.5 shadow-lg ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
              }`}>
                <span className="text-[11px] font-black text-cyan-600 dark:text-cyan-400 tracking-wider uppercase block">
                  ESSAY PROMPT
                </span>
                <p className={`text-sm sm:text-base font-medium leading-relaxed ${
                  isLight ? 'text-slate-800' : 'text-slate-100'
                }`}>
                  {story.essayPrompt}
                </p>
              </div>

              {/* Banner lưu ý màu hổ phách/cam chuẩn Ảnh 4 */}
              <div className={`p-3.5 border rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
                isLight
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-[#211a10] border-amber-500/30 text-amber-400'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Nên làm quiz trước rồi viết essay để AI có thêm bối cảnh đánh giá.</span>
              </div>

              {/* Khung soạn thảo Textarea */}
              <div className={`border rounded-3xl p-5 space-y-3 shadow-lg ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
              }`}>
                <textarea
                  rows={10}
                  maxLength={story.essayMaxChars}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Viết essay bằng tiếng Anh sau khi đọc truyện..."
                  className={`w-full border focus:border-emerald-500 rounded-2xl p-4 text-sm sm:text-base font-medium leading-relaxed outline-none resize-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      : 'bg-[#0d131d] border-[#1e2d42] text-slate-100 placeholder-slate-500'
                  }`}
                />

                <div className={`flex items-center justify-between text-xs font-mono ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span>{essayText.length}/{story.essayMaxChars}</span>
                  <span>Tối thiểu {story.essayMinChars} ký tự</span>
                </div>
              </div>

              {/* Nút hành động "AI chấm essay" */}
              <div className="pt-1">
                <button
                  disabled={isEvaluatingEssay}
                  onClick={handleEvaluateEssay}
                  className="w-full py-4 bg-[#1f6b3e] hover:bg-[#1a5a34] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  {isEvaluatingEssay ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>AI đang phân tích & đánh giá bài viết...</span>
                    </>
                  ) : (
                    <>
                      <span>AI chấm essay</span>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>
              </div>

              {/* Kết quả đánh giá từ AI */}
              {essayFeedback && (
                <div className={`p-6 border rounded-3xl space-y-4 animate-in zoom-in-95 shadow-xl ${
                  isLight
                    ? 'bg-white border-emerald-300 text-slate-900'
                    : 'bg-[#0e1f18] border-emerald-500/50 text-slate-100'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${
                    isLight ? 'border-slate-200' : 'border-emerald-500/20'
                  }`}>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm sm:text-base">
                      <Award className="w-5 h-5" />
                      <span>Điểm AI: {essayFeedback.score}/10</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-300 dark:border-cyan-500/30">
                      +30 💎 Kim Cương
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                    <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{essayFeedback.feedbackEn}</div>
                    <div className={`italic ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{essayFeedback.feedbackVi}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
                    <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
                      isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-[#08150f] border-emerald-500/20'
                    }`}>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider">
                        Điểm sáng
                      </div>
                      <ul className={`list-disc list-inside space-y-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {essayFeedback.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
                      isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-[#08150f] border-amber-500/20'
                    }`}>
                      <div className="font-bold text-amber-600 dark:text-amber-400 text-xs uppercase tracking-wider">
                        Gợi ý cải thiện
                      </div>
                      <ul className={`list-disc list-inside space-y-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {essayFeedback.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= NỘI DUNG TAB 4: GIẢI THÍCH ĐÁP ÁN (ẢNH 5 - 12.png) ================= */}
          {activeTab === 'explanation' && (
            <div>
              {!isQuizSubmitted ? (
                /* ================= TRẠNG THÁI KHÓA (ẢNH 5 - 12.png) ================= */
                <div className={`border rounded-3xl p-12 min-h-[440px] flex flex-col items-center justify-center text-center space-y-4 shadow-xl ${
                  isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
                }`}>
                  {/* Icon ổ khóa màu cam tròn */}
                  <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-base sm:text-lg font-black">
                      Giải thích chưa được mở khóa
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      Hoàn thành và nộp Quiz để mở khóa phần giải thích. Sau đó bạn có thể xem lại bất cứ lúc nào.
                    </p>
                  </div>

                  {/* Nút xanh lá: Đi tới Quiz */}
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="py-3 px-8 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      Đi tới Quiz
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= TRẠNG THÁI ĐÃ MỞ KHÓA SAU KHI NỘP QUIZ ================= */
                <div className="space-y-4">
                  <div className={`border rounded-3xl p-5 flex items-center justify-between shadow-lg ${
                    isLight ? 'bg-white border-emerald-300' : 'bg-[#121c2b] border-emerald-500/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-500">
                        <Unlock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm sm:text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Giải thích đáp án chi tiết
                        </h3>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Đối chiếu bài làm với nội dung trích xuất từ câu chuyện
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                      {quizScore}/{story.quiz.length} ĐÚNG
                    </span>
                  </div>

                  {/* Chi tiết từng câu hỏi & trích dẫn */}
                  <div className="space-y-4">
                    {story.quiz.map((q, idx) => {
                      const userAns = userAnswers[q.id];
                      const isCorrect = userAns === q.correctAnswer;
                      const correctOpt = q.options.find((o) => o.key === q.correctAnswer);
                      const userOpt = q.options.find((o) => o.key === userAns);

                      return (
                        <div
                          key={q.id}
                          className={`border rounded-3xl p-6 space-y-4 shadow-lg ${
                            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md ${
                                  isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              >
                                {idx + 1}
                              </div>
                              <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  isLight ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  QUESTION {idx + 1} • TRANG {q.relatedPage}
                                </span>
                                <h4 className={`text-base sm:text-lg font-black mt-0.5 ${
                                  isLight ? 'text-slate-900' : 'text-white'
                                }`}>
                                  {q.question}
                                </h4>
                              </div>
                            </div>

                            {isCorrect ? (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-500 text-xs font-black flex items-center gap-1 shrink-0">
                                <XCircle className="w-3.5 h-3.5" /> Sai
                              </span>
                            )}
                          </div>

                          {/* So sánh đáp án */}
                          <div className={`p-3.5 rounded-2xl border space-y-2 text-xs sm:text-sm ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Lựa chọn của bạn:</span>
                              <span
                                className={`font-bold ${
                                  isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                                }`}
                              >
                                ({userAns}) {userOpt?.text}
                              </span>
                            </div>

                            {!isCorrect && (
                              <div className="flex items-center gap-2">
                                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Đáp án chính xác:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  ({q.correctAnswer}) {correctOpt?.text}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Trích dẫn chứng cứ gốc trong truyện */}
                          <div className={`p-3.5 border rounded-2xl space-y-1.5 text-xs sm:text-sm ${
                            isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-amber-500/5 border-amber-500/25'
                          }`}>
                            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                              <span>Trích dẫn chứng cứ (Page {q.relatedPage}):</span>
                            </div>
                            <blockquote className={`italic pl-2 border-l-2 border-amber-500 ${
                              isLight ? 'text-slate-800' : 'text-slate-300'
                            }`}>
                              "{q.evidenceQuote}"
                            </blockquote>
                          </div>

                          {/* Giải thích chi tiết */}
                          <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                            <div className={isLight ? 'text-slate-900 font-semibold' : 'text-slate-100 font-semibold'}>{q.explanationVi}</div>
                            <div className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{q.explanationEn}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= CỘT PHẢI (4 CỘT - ~33%) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* CARD 1: PROGRESS (Chuẩn Ảnh 1-5) */}
          <div className={`border rounded-3xl p-5 shadow-lg space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-wider block ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              PROGRESS
            </span>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Quiz stat */}
              <div className={`p-3 border rounded-2xl ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div className={`text-base sm:text-lg font-black font-mono leading-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {isQuizSubmitted ? quizScore : 0}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Quiz
                </div>
              </div>

              {/* Essay stat */}
              <div className={`p-3 border rounded-2xl ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div className={`text-base sm:text-lg font-black font-mono leading-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {essayFeedback ? 1 : 0}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Essay
                </div>
              </div>

              {/* Mastery stat */}
              <div className={`p-3 border rounded-2xl ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div className={`text-base sm:text-lg font-black font-mono leading-tight ${
                  isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}>
                  {masteryPercentage}%
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Mastery
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: STORYWEAVER READING BADGE (Chuẩn Ảnh 1-5) */}
          <div className={`border rounded-3xl p-3.5 shadow-lg flex items-center justify-between cursor-pointer transition-colors ${
            isLight
              ? 'bg-white border-slate-200 hover:border-emerald-500'
              : 'bg-[#121c2b] border-[#1e2d42] hover:border-slate-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-amber-950/50 border border-slate-200 dark:border-[#1e2d42] shrink-0">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-500 tracking-wider uppercase block">
                  {story.category.toUpperCase()}
                </span>
                <h4 className={`text-xs sm:text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {story.title}
                </h4>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* CARD 3: TÍNH NĂNG CHÍNH (Chuẩn Ảnh 1-5) */}
          <div className={`border rounded-3xl p-5 shadow-lg space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-wider block ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              TÍNH NĂNG CHÍNH
            </span>

            <div className="space-y-2.5">
              {/* Nút xanh lá: ? Quiz */}
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full py-3 px-4 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quiz</span>
              </button>

              {/* Nút Giải thích */}
              <button
                onClick={() => {
                  if (isQuizSubmitted) {
                    setActiveTab('explanation');
                  } else {
                    showToast('Vui lòng hoàn thành Quiz để mở khóa phần giải thích.');
                  }
                }}
                className={`w-full py-3 px-4 rounded-2xl border text-xs sm:text-sm font-black flex items-start gap-2.5 transition-all text-left cursor-pointer ${
                  isQuizSubmitted
                    ? isLight
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-[#122b1c] border-emerald-500/40 text-emerald-300 hover:bg-[#163824]'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                    : 'bg-[#0d131d] border-[#1e2d42] text-slate-400 hover:text-slate-300'
                }`}
              >
                {isQuizSubmitted ? (
                  <Unlock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="leading-none">Giải thích</div>
                  <div className={`text-[10px] sm:text-xs font-normal mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {isQuizSubmitted ? 'Xem phân tích chi tiết đáp án' : 'Mở sau khi nộp Quiz'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* CARD 4: LICENSE & GHI CÔNG (Chuẩn Ảnh 1-5) */}
          <div className={`border rounded-3xl p-5 shadow-lg space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-wider block ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              LICENSE
            </span>

            <div className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {story.license}
            </div>

            {/* Accordion dropdown Thông tin ghi công */}
            <div className="pt-1">
              <button
                onClick={() => setShowLicenseInfo(!showLicenseInfo)}
                className={`w-full p-2.5 border rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-[#0d131d] hover:bg-[#151f2e] border-[#1e2d42] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">▶</span>
                  <span>Thông tin ghi công</span>
                </div>
                {showLicenseInfo ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {showLicenseInfo && (
                <div className={`p-3 border border-t-0 rounded-b-xl text-[11px] space-y-2 leading-relaxed animate-in fade-in ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : 'bg-[#0d131d] border-[#1e2d42] text-slate-400'
                }`}>
                  <div>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>Tác giả:</span> {story.author}
                  </div>
                  <div>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>Minh họa:</span> {story.illustrator}
                  </div>
                  <div>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>Nguồn:</span> StoryWeaver (Pratham Books)
                  </div>
                  <div className={`text-[10px] border-t pt-2 ${
                    isLight ? 'border-slate-200 text-slate-500' : 'border-[#1e2d42] text-slate-400'
                  }`}>
                    {story.licenseDetails}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
