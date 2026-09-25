'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Award,
  Layers,
  FileText,
  Search,
  Check,
  Flame,
  Info,
  ExternalLink,
  BookMarked,
  Glasses,
  Sun,
  Moon,
} from 'lucide-react';
import { BILINGUAL_NEWS_ARTICLES, BilingualNewsArticle, BilingualParagraph, QuizQuestionAI } from '@/data/bilingualNewsData';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BilingualNewsDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { user, deductDiamonds, updateProfile, incrementProgress } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';

  // Tìm bài báo theo ID hoặc slug
  const article = BILINGUAL_NEWS_ARTICLES.find(
    (a) => a.id === unwrappedParams.id || a.slug === unwrappedParams.id
  ) || BILINGUAL_NEWS_ARTICLES[0];

  // Trạng thái giao diện
  const [activeMode, setActiveMode] = useState<'reading' | 'quiz'>('reading');
  const [viewColumnMode, setViewColumnMode] = useState<'bilingual' | 'en_only' | 'vi_only'>('bilingual');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // Trạng thái Popup Phương Pháp Học (Ảnh 3)
  const [showMethodModal, setShowMethodModal] = useState<boolean>(false);
  const [dontShowMethodAgain, setDontShowMethodAgain] = useState<boolean>(false);

  // Trạng thái AI Quiz (Ảnh 4)
  const [quizTab, setQuizTab] = useState<'ielts' | 'toeic' | 'quick' | 'review'>('ielts');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [generatedQuizzes, setGeneratedQuizzes] = useState<{
    ielts: QuizQuestionAI[];
    toeic: QuizQuestionAI[];
    quick: QuizQuestionAI[];
  }>(article.quizzes);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [earnedDiamonds, setEarnedDiamonds] = useState<number>(0);

  // Từ điển nhanh khi click từ
  const [lookupWord, setLookupWord] = useState<{ word: string; definition: string; phonetic: string } | null>(null);

  // Text-to-speech
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speakingParagraphTag, setSpeakingParagraphTag] = useState<string | null>(null);

  // Refs để cuộn đến mốc dẫn chứng
  const paragraphRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Danh sách câu hỏi hiện tại theo tab
  const currentQuizList = React.useMemo(() => {
    if (quizTab === 'review') {
      // Các câu đã làm sai
      const allQ = [...generatedQuizzes.ielts, ...generatedQuizzes.toeic, ...generatedQuizzes.quick];
      return allQ.filter((q) => userAnswers[q.id] && userAnswers[q.id] !== q.correctAnswer);
    }
    return generatedQuizzes[quizTab] || [];
  }, [quizTab, generatedQuizzes, userAnswers]);

  const currentQuestion: QuizQuestionAI | undefined = currentQuizList[currentQuestionIndex];

  // Cuộn tự động tới đoạn dẫn chứng khi câu hỏi thay đổi trong chế độ Quiz
  useEffect(() => {
    if (activeMode === 'quiz' && currentQuestion?.evidenceTag) {
      const tag = currentQuestion.evidenceTag;
      const targetElement = paragraphRefs.current[tag];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeMode, currentQuestionIndex, currentQuestion?.evidenceTag]);

  // Kiểm tra popup phương pháp trong localStorage
  useEffect(() => {
    const hasSeen = localStorage.getItem('seen_bilingual_quiz_method_modal');
    if (!hasSeen) {
      // Khi lần đầu chuyển sang tab quiz sẽ bật popup
    }
  }, []);

  // Chuyển chế độ sang Quiz có kèm kiểm tra popup phương pháp
  const handleSwitchToQuiz = () => {
    const hasSeen = localStorage.getItem('seen_bilingual_quiz_method_modal');
    if (!hasSeen) {
      setShowMethodModal(true);
    }
    setActiveMode('quiz');
  };

  const handleCloseMethodModal = () => {
    if (dontShowMethodAgain) {
      localStorage.setItem('seen_bilingual_quiz_method_modal', 'true');
    }
    setShowMethodModal(false);
  };

  // Trình phát âm thanh Web Speech API
  const handleSpeakText = (text: string, tag?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio && speakingParagraphTag === tag) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setSpeakingParagraphTag(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      if (tag) setSpeakingParagraphTag(tag);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setSpeakingParagraphTag(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setSpeakingParagraphTag(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Tra nghĩa nhanh một từ
  const handleWordClick = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!cleanWord || cleanWord.length < 2) return;

    // Bộ từ vựng trọng tâm mẫu của bài báo
    const dictMap: Record<string, { definition: string; phonetic: string }> = {
      retirement: { definition: 'Sự nghỉ hưu, quãng thời gian sau khi thôi làm việc', phonetic: '/rɪˈtaɪərmənt/' },
      retirements: { definition: 'Các đợt nghỉ hưu hoặc giai đoạn nghỉ dưỡng', phonetic: '/rɪˈtaɪərmənts/' },
      benefits: { definition: 'Lợi ích, thành quả, phúc lợi được hưởng', phonetic: '/ˈbenɪfɪts/' },
      interim: { definition: 'Tạm thời, lâm thời, giai đoạn chuyển tiếp', phonetic: '/ˈɪntərɪm/' },
      burnout: { definition: 'Tình trạng kiệt sức hoàn toàn do áp lực công việc kéo dài', phonetic: '/ˈbɜːrnaʊt/' },
      demanding: { definition: 'Đòi hỏi khắt khe, áp lực cao, tốn nhiều công sức', phonetic: '/dɪˈmændɪŋ/' },
      intentional: { definition: 'Có chủ đích, có kế hoạch rõ ràng từ trước', phonetic: '/ɪnˈtenʃənl/' },
      chronic: { definition: 'Mãn tính, kinh niên, lặp đi lặp lại lâu năm', phonetic: '/ˈkrɑːnɪk/' },
      indispensable: { definition: 'Tuyệt đối cần thiết, không thể thiếu được (= essential)', phonetic: '/ˌɪndɪˈspensəbl/' },
      budgeting: { definition: 'Việc lập kế hoạch ngân sách tài chính', phonetic: '/ˈbʌdʒɪtɪŋ/' },
      compounding: { definition: 'Tích lũy theo cấp số nhân, hiệu ứng lãi kép', phonetic: '/kəmˈpaʊndɪŋ/' },
      vitality: { definition: 'Sức sống mãnh liệt, năng lượng dồi dào', phonetic: '/vaɪˈtæləti/' },
    };

    const found = dictMap[cleanWord] || {
      definition: `Nghĩa của từ "${cleanWord}" trong ngữ cảnh bài viết chuyên sâu.`,
      phonetic: `/${cleanWord}/`,
    };

    setLookupWord({
      word: cleanWord,
      definition: found.definition,
      phonetic: found.phonetic,
    });
  };

  // Hành động Phân tích bài báo & Tạo đề AI (tính phí 5 gem)
  const handleGenerateAIQuiz = () => {
    // Trừ 5 gem qua auth store
    const gemSuccess = deductDiamonds(5);
    if (!gemSuccess) {
      alert('Bạn không đủ Gem (cần 5 Gem). Hãy hoàn thành bài tập khác để tích lũy thêm!');
      return;
    }

    setIsGeneratingQuiz(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 700);
    setTimeout(() => setGenerationStep(3), 1400);
    setTimeout(() => setGenerationStep(4), 2100);
    setTimeout(() => {
      setIsGeneratingQuiz(false);
      setGenerationStep(0);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setIsSubmitted(false);
      setShowResults(false);
    }, 2800);
  };

  // Chọn đáp án
  const handleSelectOption = (questionId: string, optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (userAnswers[questionId]) return; // Đã trả lời rồi thì không đổi
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Nộp bài & Xem kết quả
  const handleFinishQuiz = () => {
    let score = 0;
    currentQuizList.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const reward = score * 5;
    setEarnedDiamonds(reward);

    if (user) {
      updateProfile({
        diamonds: (user.diamonds || 0) + reward,
        gems: (user.gems || 0) + reward,
      });
    }

    incrementProgress({
      examsCompleted: 1,
    });

    setShowResults(true);
  };

  // Lấy cỡ chữ tương ứng - Nâng cấp to rõ, thoáng và dễ đọc
  const fontSizeClass = {
    sm: 'text-base sm:text-lg leading-relaxed',
    base: 'text-lg sm:text-xl leading-relaxed',
    lg: 'text-xl sm:text-2xl leading-relaxed',
    xl: 'text-2xl sm:text-3xl leading-loose',
  }[fontSize];

  return (
    <div className={`min-h-screen flex flex-col font-sans select-text transition-colors duration-200 ${
      isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0f17] text-slate-100'
    }`}>
      {/* ================= 1. TOP HEADER BAR (Ảnh 2 & Ảnh 4) ================= */}
      <header className={`sticky top-0 z-40 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
        isLight
          ? 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-xs'
          : 'bg-[#0d131d]/95 border-b border-[#1e2d42] text-slate-100 shadow-md'
      }`}>
        {/* Bên trái: Nút đóng ✕, Tên bài báo, Nguồn */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/practice/bilingual-news"
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                : 'bg-[#141e2e] border-[#1e2d42] hover:border-slate-500 text-slate-300 hover:text-white'
            }`}
            title="Đóng & Quay lại danh sách"
          >
            <X className="w-4 h-4" />
          </Link>

          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800/80'
              }`}>
                {article.publisher}
              </span>
              <h2 className={`text-xs sm:text-sm font-bold truncate max-w-xs md:max-w-md ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {article.titleEn}
              </h2>
            </div>
          </div>
        </div>

        {/* Ở giữa: Bộ chuyển đổi [📖 Đọc báo] | [✨ AI quiz] (Chuẩn Ảnh 2 & Ảnh 4) */}
        <div className={`flex items-center border p-1 rounded-2xl shadow-inner shrink-0 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
        }`}>
          <button
            onClick={() => setActiveMode('reading')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'reading'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Đọc báo</span>
          </button>

          <button
            onClick={handleSwitchToQuiz}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'quiz'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI quiz</span>
          </button>
        </div>

        {/* Bên phải: Nút Đổi Nền Trắng/Đen, Cỡ chữ Aa, View cột, Phát âm, Số Gem */}
        <div className="flex items-center gap-2 shrink-0">
          {/* NÚT CHUYỂN ĐỔI NỀN TRẮNG - ĐEN (LIGHT / DARK MODE) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-xs'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:text-white'
            }`}
            title="Chuyển đổi nền Sáng (Trắng) / Tối (Đen)"
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Cỡ chữ to rõ (Aa) */}
          <div className={`flex items-center border rounded-xl px-2.5 py-1 text-xs ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#121c2b] border-[#1e2d42] text-slate-300'
          }`}>
            <span className="text-[11px] font-bold opacity-60 mr-1.5">Aa</span>
            <button
              onClick={() => setFontSize(fontSize === 'sm' ? 'base' : fontSize === 'base' ? 'lg' : fontSize === 'lg' ? 'xl' : 'sm')}
              className="text-xs font-black text-emerald-500 hover:text-emerald-400 cursor-pointer uppercase tracking-wide"
              title="Đổi cỡ chữ hiển thị"
            >
              {fontSize === 'sm' ? 'Vừa' : fontSize === 'base' ? 'Lớn' : fontSize === 'lg' ? 'Rất lớn' : 'Cực đại'}
            </button>
          </div>

          {/* Chọn hiển thị cột trong chế độ đọc */}
          {activeMode === 'reading' && (
            <select
              value={viewColumnMode}
              onChange={(e) => setViewColumnMode(e.target.value as any)}
              className={`hidden md:block border text-[11px] font-semibold py-1.5 px-2.5 rounded-xl outline-none cursor-pointer transition-colors ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800 hover:border-slate-400'
                  : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:border-slate-500'
              }`}
            >
              <option value="bilingual">Song ngữ (2 cột)</option>
              <option value="en_only">Chỉ tiếng Anh</option>
              <option value="vi_only">Chỉ tiếng Việt</option>
            </select>
          )}

          {/* Thông tin phương pháp */}
          <button
            onClick={() => setShowMethodModal(true)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-[#141e2e]'
            }`}
            title="Phương pháp đọc hiểu chuyên sâu"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Gem / Diamond Balance */}
          <div className={`flex items-center gap-1 border px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-500 shadow-inner ${
            isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <span>💎</span>
            <span>{user?.gems ?? user?.diamonds ?? 250}</span>
          </div>
        </div>
      </header>

      {/* ================= 2. NỘI DUNG CHÍNH (ĐỌC BÁO HOẶC AI QUIZ STUDIO) ================= */}
      <main className="flex-1 flex overflow-hidden">
        {activeMode === 'reading' ? (
          /* ================= CHẾ ĐỘ 1: ĐỌC BÁO SONG NGỮ ĐỐI CHIẾU (Ảnh 2 `23.png`) ================= */
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full space-y-6">
            {/* Banner audio controls */}
            <div className={`flex items-center justify-between border p-3.5 rounded-2xl text-xs sm:text-sm transition-colors ${
              isLight
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-[#121c2b]/80 border-[#1e2d42]'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Chạm vào bất kỳ từ vựng tiếng Anh nào để tra nhanh phiên âm và nghĩa.
                </span>
              </div>
              <button
                onClick={() => {
                  const fullText = article.paragraphs.map((p) => p.en).join('. ');
                  handleSpeakText(fullText, 'full');
                }}
                className={`py-1.5 px-3 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingAudio && speakingParagraphTag === 'full'
                    ? 'bg-rose-500 text-white'
                    : isLight
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-[#1a2638] text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {isPlayingAudio && speakingParagraphTag === 'full' ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> Dừng phát
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> Nghe toàn bài
                  </>
                )}
              </button>
            </div>

            {/* Bảng song ngữ 2 cột đối chiếu 1-1 */}
            <div className="space-y-6">
              {article.paragraphs.map((para) => {
                const isHovered = hoveredTag === para.tag;
                const isSpeakingThis = isPlayingAudio && speakingParagraphTag === para.tag;

                return (
                  <div
                    key={para.tag}
                    onMouseEnter={() => setHoveredTag(para.tag)}
                    onMouseLeave={() => setHoveredTag(null)}
                    className={`grid grid-cols-1 ${
                      viewColumnMode === 'bilingual' ? 'md:grid-cols-2' : ''
                    } gap-6 p-5 sm:p-6 rounded-3xl transition-all duration-200 border ${
                      isLight
                        ? isHovered
                          ? 'bg-white border-emerald-400 shadow-lg'
                          : 'bg-white border-slate-200 shadow-xs'
                        : isHovered
                          ? 'bg-[#131f31] border-emerald-500/40 shadow-xl'
                          : 'bg-[#0f1725] border-[#1a2638]'
                    }`}
                  >
                    {/* CỘT TRÁI: TIẾNG ANH GỐC (Ảnh 2 `23.png`) */}
                    {viewColumnMode !== 'vi_only' && (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 font-black rounded-lg text-xs ${
                              isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-[#1a2638] text-emerald-400'
                            }`}>
                              {para.tag}
                            </span>
                            <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>English</span>
                          </div>
                          <button
                            onClick={() => handleSpeakText(para.en, para.tag)}
                            className="p-1 hover:text-emerald-500 transition-colors cursor-pointer"
                            title="Nghe đoạn này"
                          >
                            <Volume2 className={`w-4 h-4 ${isSpeakingThis ? 'text-emerald-500 animate-pulse' : isLight ? 'text-slate-400' : 'text-slate-400'}`} />
                          </button>
                        </div>

                        {/* Tiêu đề đoạn [A] lớn và ảnh minh họa như ảnh 2 */}
                        {para.isHeadline ? (
                          <div className="space-y-4">
                            <h2 className={`text-2xl sm:text-3xl font-black leading-tight ${
                              isLight ? 'text-slate-900' : 'text-white'
                            }`}>
                              {para.en}
                            </h2>
                            {para.hasIllustration && (
                              <div className="rounded-2xl overflow-hidden border aspect-[16/9] shadow-md border-slate-200 dark:border-[#1e2d42] bg-slate-900">
                                <img
                                  src={article.imageUrl}
                                  alt={article.imageAlt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className={`${fontSizeClass} ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                            {/* Phân tách từ để người học có thể click tra nghĩa một chạm */}
                            {para.en.split(' ').map((w, idx) => (
                              <span
                                key={idx}
                                onClick={(e) => handleWordClick(w, e)}
                                className="hover:text-emerald-500 hover:underline cursor-pointer transition-colors"
                              >
                                {w}{' '}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    )}

                    {/* CỘT PHẢI: BẢN DỊCH TIẾNG VIỆT TƯƠNG ỨNG (Ảnh 2 `23.png`) */}
                    {viewColumnMode !== 'en_only' && (
                      <div className={`space-y-3.5 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 ${
                        isLight ? 'border-slate-200' : 'border-[#1e2d42]'
                      }`}>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2.5 py-1 font-black rounded-lg text-xs ${
                            isLight ? 'bg-indigo-100 text-indigo-800' : 'bg-[#1a2638] text-indigo-400'
                          }`}>
                            {para.tag}
                          </span>
                          <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tiếng Việt</span>
                        </div>

                        {para.isHeadline ? (
                          <h2 className={`text-xl sm:text-2xl font-bold leading-tight ${
                            isLight ? 'text-slate-700' : 'text-slate-200'
                          }`}>
                            {para.vi}
                          </h2>
                        ) : (
                          <p className={`${fontSizeClass} font-normal ${
                            isLight ? 'text-slate-600' : 'text-slate-300'
                          }`}>
                            {para.vi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= CHẾ ĐỘ 2: AI QUIZ STUDIO CHIA ĐÔI MÀN HÌNH (Ảnh 4 `25.png`) ================= */
          <div className="flex-1 flex flex-col md:flex-row w-full h-[calc(100vh-61px)] overflow-hidden">
            {/* CỘT TRÁI: BÀI ĐỌC GỐC ĐÍNH KÈM HIGHLIGHT DẪN CHỨNG (50% WIDTH) */}
            <div className={`w-full md:w-1/2 border-r overflow-y-auto p-4 sm:p-6 space-y-4 transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0e16]/80 border-[#1e2d42]'
            }`}>
              <div className={`sticky top-0 backdrop-blur-md pb-3 z-10 flex items-center justify-between border-b text-xs ${
                isLight ? 'bg-slate-50/95 border-slate-200' : 'bg-[#0a0e16]/95 border-[#1e2d42]'
              }`}>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span className={`font-black text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Văn bản bài báo</span>
                </div>
                {currentQuestion?.evidenceTag && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 rounded-full font-black text-xs animate-pulse">
                    Đoạn {currentQuestion.evidenceTag} là dẫn chứng
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {article.paragraphs.map((para) => {
                  const isEvidence = currentQuestion?.evidenceTag === para.tag;
                  return (
                    <div
                      key={para.tag}
                      ref={(el) => {
                        paragraphRefs.current[para.tag] = el;
                      }}
                      className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                        isEvidence
                          ? isLight
                            ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/60'
                            : 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                          : isLight
                            ? 'bg-white border-slate-200 shadow-xs'
                            : 'bg-[#121c2b]/60 border-[#1e2d42]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2.5 py-0.5 font-black text-xs rounded-md ${
                            isEvidence
                              ? 'bg-amber-500 text-black font-extrabold'
                              : isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-[#1a2638] text-emerald-400'
                          }`}
                        >
                          {para.tag}
                        </span>

                        {isEvidence && (
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            🔍 Dẫn chứng cho câu {currentQuestionIndex + 1}
                          </span>
                        )}
                      </div>

                      {para.isHeadline ? (
                        <h3 className={`font-black text-lg sm:text-xl leading-snug ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {para.en}
                        </h3>
                      ) : (
                        <p className={`text-base sm:text-lg leading-relaxed ${
                          isLight ? 'text-slate-800' : 'text-slate-100'
                        }`}>
                          {para.en}
                        </p>
                      )}

                      <div className={`mt-2.5 pt-2.5 border-t text-sm sm:text-base italic leading-relaxed ${
                        isLight ? 'border-slate-200 text-slate-500' : 'border-[#1e2d42]/60 text-slate-400'
                      }`}>
                        {para.vi}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CỘT PHẢI: STUDIO TẠO ĐỀ & LÀM BÀI AI QUIZ (50% WIDTH - Ảnh 4 `25.png`) */}
            <div className={`w-full md:w-1/2 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between transition-colors ${
              isLight ? 'bg-white' : 'bg-[#0b0f17]'
            }`}>
              {/* 1. Header các Tab AI: IELTS, TOEIC, Quick, Ôn sai */}
              <div className="space-y-5">
                <div className={`flex items-center justify-between border-b pb-3 overflow-x-auto gap-2 ${
                  isLight ? 'border-slate-200' : 'border-[#1e2d42]'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setQuizTab('ielts');
                        setCurrentQuestionIndex(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        quizTab === 'ielts'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-[#121c2b] text-slate-400 hover:text-white'
                      }`}
                    >
                      ✨ IELTS (AI)
                    </button>

                    <button
                      onClick={() => {
                        setQuizTab('toeic');
                        setCurrentQuestionIndex(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        quizTab === 'toeic'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-[#121c2b] text-slate-400 hover:text-white'
                      }`}
                    >
                      ✨ TOEIC (AI)
                    </button>

                    <button
                      onClick={() => {
                        setQuizTab('quick');
                        setCurrentQuestionIndex(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        quizTab === 'quick'
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                          : isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-[#121c2b] text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚡ Quick quiz (AI)
                    </button>

                    <button
                      onClick={() => {
                        setQuizTab('review');
                        setCurrentQuestionIndex(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        quizTab === 'review'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-[#121c2b] text-slate-400 hover:text-white'
                      }`}
                    >
                      📑 Ôn câu sai
                    </button>
                  </div>

                  {/* Nút Tạo Quiz AI (trừ 5 gem) */}
                  <button
                    onClick={handleGenerateAIQuiz}
                    disabled={isGeneratingQuiz}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>Tạo Quiz AI</span>
                    <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded font-normal">5 💎</span>
                  </button>
                </div>

                {/* 2. Trạng thái Loading Phân tích bài báo & Tạo đề */}
                {isGeneratingQuiz ? (
                  <div className={`p-8 text-center border rounded-3xl space-y-4 my-8 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
                  }`}>
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-2xl animate-bounce">
                      ✨
                    </div>
                    <div className="space-y-1.5">
                      <h4 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>AI đang phân tích bài báo...</h4>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {generationStep === 1 && '1/4. Đang phân tích cú pháp & cấu trúc ngữ pháp toàn bài...'}
                        {generationStep === 2 && '2/4. Trích xuất cấu trúc từ vựng trọng tâm (burnout, interim, indispensable)...'}
                        {generationStep === 3 && '3/4. Tự động tạo câu hỏi đọc hiểu chuẩn format bài thi...'}
                        {generationStep === 4 && '4/4. Ánh xạ mốc dẫn chứng đối chiếu [A], [B], [C] trực tiếp...'}
                      </p>
                    </div>

                    <div className={`w-48 mx-auto h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${(generationStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : currentQuestion ? (
                  /* 3. Hiển thị câu hỏi AI Quiz (Ảnh 4 `25.png`) */
                  <div className="space-y-5">
                    {/* Thanh tiến độ câu hỏi */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-black text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Câu hỏi {currentQuestionIndex + 1} / {currentQuizList.length}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          }`}>
                            {currentQuestion.difficulty || 'IELTS Band 6.5+'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            Dẫn chứng: {currentQuestion.evidenceTag}
                          </span>
                        </div>
                      </div>

                      <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-[#121c2b]'}`}>
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{
                            width: `${((currentQuestionIndex + 1) / currentQuizList.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Nội dung câu hỏi - To rõ nét */}
                    <div className={`p-5 rounded-2xl border space-y-2 shadow-xs ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
                    }`}>
                      <p className={`text-lg sm:text-xl font-black leading-relaxed tracking-tight ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {currentQuestion.question}
                      </p>
                    </div>

                    {/* Danh sách 4 lựa chọn A, B, C, D - To và dễ bấm */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => {
                        const isSelected = userAnswers[currentQuestion.id] === option.key;
                        const hasAnswered = !!userAnswers[currentQuestion.id];
                        const isCorrectOption = option.key === currentQuestion.correctAnswer;

                        let cardStyle = isLight
                          ? 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800'
                          : 'bg-[#121c2b] border-[#1e2d42] hover:border-slate-500 text-slate-200';

                        if (hasAnswered) {
                          if (isCorrectOption) {
                            cardStyle = isLight
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                              : 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                          } else if (isSelected && !isCorrectOption) {
                            cardStyle = isLight
                              ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500'
                              : 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                          } else {
                            cardStyle = isLight
                              ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                              : 'bg-[#0f1725] border-[#1a2638] text-slate-500 opacity-60';
                          }
                        } else if (isSelected) {
                          cardStyle = isLight
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-400'
                            : 'bg-emerald-500/10 border-emerald-500 text-white';
                        }

                        return (
                          <div
                            key={option.key}
                            onClick={() => handleSelectOption(currentQuestion.id, option.key)}
                            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${cardStyle}`}
                          >
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                                hasAnswered && isCorrectOption
                                  ? 'bg-emerald-500 text-white'
                                  : hasAnswered && isSelected && !isCorrectOption
                                  ? 'bg-rose-500 text-white'
                                  : isSelected
                                  ? 'bg-emerald-500 text-white'
                                  : isLight ? 'bg-slate-200 text-slate-800' : 'bg-[#1a2638] text-slate-300'
                              }`}
                            >
                              {option.key}
                            </span>
                            <div className="flex-1 text-base sm:text-lg font-bold leading-relaxed">
                              {option.text}
                            </div>
                            {hasAnswered && isCorrectOption && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            )}
                            {hasAnswered && isSelected && !isCorrectOption && (
                              <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Mục DẪN CHỨNG ĐỐI CHIẾU TRỰC TIẾP (Sau khi chọn đáp án) */}
                    {userAnswers[currentQuestion.id] && (
                      <div className={`p-4 sm:p-5 rounded-2xl space-y-3 animate-fadeIn border ${
                        isLight
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-emerald-950/20 border-emerald-500/30'
                      }`}>
                        <div className="flex items-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>DẪN CHỨNG ĐỐI CHIẾU TRỰC TIẾP (Đoạn {currentQuestion.evidenceTag})</span>
                        </div>

                        <div className={`p-3.5 rounded-xl border text-base font-mono leading-relaxed italic ${
                          isLight
                            ? 'bg-white border-emerald-200 text-amber-900 shadow-xs'
                            : 'bg-[#0b0f17] border-[#1e2d42] text-amber-200/90'
                        }`}>
                          &ldquo;{currentQuestion.evidenceText}&rdquo;
                        </div>

                        <div className="text-base leading-relaxed space-y-1">
                          <p className={`font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Giải thích chi tiết:</p>
                          <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>{currentQuestion.explanationVi}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`p-8 text-center border rounded-3xl space-y-3 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
                  }`}>
                    <p className={`text-base ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Chưa có câu hỏi nào trong mục này.</p>
                    <button
                      onClick={handleGenerateAIQuiz}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      ✨ Tạo câu hỏi mới bằng AI
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Footer Điều hướng Câu trước / Câu tiếp theo / Hoàn thành */}
              {currentQuestion && (
                <div className={`pt-4 border-t flex items-center justify-between mt-6 ${
                  isLight ? 'border-slate-200' : 'border-[#1e2d42]'
                }`}>
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1 transition-colors ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:text-white'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Câu trước
                  </button>

                  {currentQuestionIndex < currentQuizList.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-600/30 transition-all"
                    >
                      Câu tiếp theo <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all"
                    >
                      <Award className="w-4 h-4" /> Hoàn thành bài & Chấm điểm
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================= 3. POPUP PHƯƠNG PHÁP HỌC (Ảnh 3 `24.png`) ================= */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border max-w-lg w-full rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative animate-scaleUp transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
          }`}>
            <button
              onClick={handleCloseMethodModal}
              className={`absolute top-5 right-5 p-1 rounded-xl cursor-pointer transition-colors ${
                isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-[#1a2638] text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header popup */}
            <div className="space-y-2 text-center">
              <span className={`px-3 py-1 font-black text-[11px] rounded-full uppercase tracking-wider border ${
                isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}>
                Comprehensible Input &rarr; Critical Reading
              </span>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                TỪ ĐỌC SONG NGỮ ĐẾN ĐỌC HIỂU CHUYÊN SÂU
              </h2>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Phương pháp nâng cấp tư duy đọc hiểu thực chiến hướng tới IELTS 4.5+ / TOEIC 500+
              </p>
            </div>

            {/* 3 trụ cột phương pháp (Ảnh 3 `24.png`) */}
            <div className="space-y-3.5">
              <div className={`p-3.5 rounded-2xl flex items-start gap-3 border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-base shrink-0">
                  ✨
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Tự động phân tích toàn bộ bài báo hiện tại
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    AI trích xuất hệ thống từ vựng học thuật, phân tích cấu trúc ngữ pháp phức tạp và luận điểm nòng cốt của bài viết.
                  </p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl flex items-start gap-3 border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 text-base shrink-0">
                  🎯
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Tạo đề chuẩn format bài thi IELTS & TOEIC
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Bao gồm các dạng: Skimming tìm ý chính, Scanning thông tin chi tiết, Từ đồng nghĩa (Paraphrasing) và suy luận logic.
                  </p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl flex items-start gap-3 border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-base shrink-0">
                  🔍
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Dẫn chứng đối chiếu trực tiếp
                  </h4>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Mỗi câu hỏi liên kết trực tiếp với đoạn văn chứa đáp án, tự động highlight mốc [A], [B], [C] để bạn kiểm chứng tư duy.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox và nút hành động */}
            <div className="space-y-4 pt-1">
              <label className={`flex items-center gap-2 text-xs cursor-pointer ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <input
                  type="checkbox"
                  checked={dontShowMethodAgain}
                  onChange={(e) => setDontShowMethodAgain(e.target.checked)}
                  className="rounded border-slate-400 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Không hiển thị lại hướng dẫn này</span>
              </label>

              <button
                onClick={handleCloseMethodModal}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                ✨ Khám phá AI Quiz ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. POPUP KẾT QUẢ HOÀN THÀNH AI QUIZ ================= */}
      {showResults && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border max-w-md w-full rounded-3xl p-6 sm:p-7 space-y-5 text-center shadow-2xl relative animate-scaleUp transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner animate-bounce">
              🏆
            </div>

            <div className="space-y-1.5">
              <h3 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Xuất Sắc! Hoàn Thành Bài Đọc</h3>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Bạn đã hoàn thành bộ câu hỏi đọc hiểu chuyên sâu của bài viết.
              </p>
            </div>

            <div className={`grid grid-cols-2 gap-3 p-4 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
            }`}>
              <div className="space-y-0.5">
                <div className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Điểm đạt được</div>
                <div className="text-xl font-black text-emerald-500">
                  {Object.keys(userAnswers).filter(
                    (qid) => userAnswers[qid] === currentQuizList.find((q) => q.id === qid)?.correctAnswer
                  ).length}{' '}
                  / {currentQuizList.length}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Thưởng Kim Cương</div>
                <div className="text-xl font-black text-amber-500">+{earnedDiamonds} 💎</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowResults(false);
                  setUserAnswers({});
                  setCurrentQuestionIndex(0);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-[#1a2638] hover:bg-[#223249] text-white'
                }`}
              >
                Làm lại quiz
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setActiveMode('reading');
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-md shadow-emerald-600/30"
              >
                Đọc lại bài báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. POPUP TRA TỪ ĐIỂN NHANH KHI CLICK ================= */}
      {lookupWord && (
        <div
          onClick={() => setLookupWord(null)}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`border max-w-xs w-full rounded-2xl p-4 space-y-2 shadow-2xl animate-scaleUp transition-colors ${
              isLight
                ? 'bg-white border-emerald-400 text-slate-900'
                : 'bg-[#121c2b] border-emerald-500/50 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-base font-black capitalize ${isLight ? 'text-slate-900' : 'text-white'}`}>{lookupWord.word}</h4>
                <p className="text-xs text-emerald-500 font-mono">{lookupWord.phonetic}</p>
              </div>
              <button
                onClick={() => handleSpeakText(lookupWord.word)}
                className={`p-2 rounded-xl cursor-pointer transition-colors ${
                  isLight ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-[#1a2638] hover:bg-emerald-500/20 text-emerald-400'
                }`}
                title="Phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-xs leading-relaxed pt-1 border-t ${
              isLight ? 'border-slate-200 text-slate-700' : 'border-[#1e2d42] text-slate-300'
            }`}>
              {lookupWord.definition}
            </p>
            <button
              onClick={() => setLookupWord(null)}
              className={`w-full mt-2 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-[#1a2638] text-slate-300 hover:text-white'
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
