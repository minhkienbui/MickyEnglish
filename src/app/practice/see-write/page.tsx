'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  X,
  RotateCcw,
  History,
  HelpCircle,
  Bug,
  Settings,
  Volume2,
  Check,
  Send,
  Lightbulb,
  Gem,
  AlertTriangle,
  Bot,
  MessageSquare,
  Sparkles,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';

interface PhotoSet {
  id: string;
  level: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  validKeywords: string[];
  distractorKeywords: string[];
  sampleParagraphEn: string;
  sampleParagraphVi: string;
}

const PHOTO_SETS: PhotoSet[] = [
  {
    id: 'rural-valley',
    level: 'C2',
    category: 'Phong cảnh',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Serene rural landscape with hills and nestled village',
    validKeywords: [
      'vibrant',
      'serene',
      'view',
      'nestled',
      'rural',
      'aerial',
      'hills',
      'green',
      'village',
      'small',
    ],
    distractorKeywords: [
      'performing',
      'channel',
      'drew',
      'became',
      'amuses',
      'desk',
      'assuring',
      'checking',
      'admitted',
      'was',
    ],
    sampleParagraphEn:
      'Nestled amidst vibrant rolling green hills, the serene rural village offers a breathtaking aerial view of tranquil countryside life, where small houses blend seamlessly into the mist-covered landscape.',
    sampleParagraphVi:
      'Nằm nép mình giữa những ngọn đồi xanh mướt đầy sức sống, ngôi làng nông thôn thanh bình mang đến một góc nhìn từ trên cao ngoạn mục về cuộc sống miền quê yên ả, nơi những ngôi nhà nhỏ hòa quyện hoàn hảo vào phong cảnh phủ sương mờ.',
  },
  {
    id: 'mountain-lake',
    level: 'C1',
    category: 'Thiên nhiên',
    imageUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Foggy morning over a peaceful alpine lake',
    validKeywords: [
      'alpine',
      'tranquil',
      'fog',
      'reflection',
      'mountain',
      'pristine',
      'wilderness',
      'calm',
      'waters',
      'majestic',
    ],
    distractorKeywords: [
      'traffic',
      'subway',
      'factory',
      'crowded',
      'keyboard',
      'invoice',
      'office',
      'skyscrapers',
      'concrete',
      'retail',
    ],
    sampleParagraphEn:
      'A dense morning fog drifts over the tranquil alpine lake, creating pristine water reflections beneath majestic mountain ridges untouched by modern civilization.',
    sampleParagraphVi:
      'Lớp sương mù buổi sớm dày đặc lững lờ trôi trên mặt hồ trên núi tĩnh lặng, tạo nên những bóng phản chiếu nguyên sơ dưới những rặng núi hùng vĩ chưa từng bị nền văn minh hiện đại chạm tới.',
  },
  {
    id: 'coastal-sunset',
    level: 'B2',
    category: 'Đời sống',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Golden hour sunset over a serene tropical beach',
    validKeywords: [
      'golden',
      'sunset',
      'waves',
      'shoreline',
      'breeze',
      'horizon',
      'tropical',
      'sand',
      'glowing',
      'peaceful',
    ],
    distractorKeywords: [
      'snowstorm',
      'highway',
      'skyscraper',
      'freezing',
      'engine',
      'asphalt',
      'subway',
      'tunnel',
      'elevator',
      'factory',
    ],
    sampleParagraphEn:
      'As the golden sun descends past the open horizon, gentle tropical waves lap gently against the warm shoreline, casting an enchanting amber glow across the tranquil sand.',
    sampleParagraphVi:
      'Khi vầng mặt trời rực rỡ lặn dần về phía đường chân trời rộng mở, những con sóng nhiệt đới vỗ nhẹ vào bờ cát ấm áp, tỏa ra ánh hoàng hôn màu hổ phách mê hoặc khắp dải cát thanh bình.',
  },
];

export default function SeeWritePage() {
  const { user, incrementProgress } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';

  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const currentSet = PHOTO_SETS[currentSetIdx];

  // Shuffled keywords list
  const allKeywords = useMemo(() => {
    const list = [
      ...currentSet.validKeywords.map((w) => ({ word: w, isValid: true })),
      ...currentSet.distractorKeywords.map((w) => ({ word: w, isValid: false })),
    ];
    // deterministic seeded order matching screenshot layout
    return list.sort((a, b) => a.word.localeCompare(b.word));
  }, [currentSet]);

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [hasCheckedKeywords, setHasCheckedKeywords] = useState(false);
  const [userText, setUserText] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [aiSampleGenerated, setAiSampleGenerated] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [submittedFeedback, setSubmittedFeedback] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle keyword selection
  const handleToggleKeyword = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      if (selectedWords.length >= 10) {
        showToast('Bạn chỉ được chọn tối đa 10 từ khóa!');
        return;
      }
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Pronounce word
  const handleSpeak = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  // Check keywords
  const handleCheckKeywords = () => {
    if (selectedWords.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 từ khóa để kiểm tra!');
      return;
    }
    setHasCheckedKeywords(true);
  };

  // Change to another photo set
  const handleChangePhoto = () => {
    const nextIdx = (currentSetIdx + 1) % PHOTO_SETS.length;
    setCurrentSetIdx(nextIdx);
    setSelectedWords([]);
    setHasCheckedKeywords(false);
    setUserText('');
    setAiSampleGenerated(null);
    setSubmittedFeedback(null);
  };

  // Build the prompt text for AI
  const promptContent = useMemo(() => {
    const wordsList = selectedWords.length > 0 ? selectedWords.join(', ') : currentSet.validKeywords.join(', ');
    return `You are an expert English language tutor. Write a high-level ${currentSet.level} descriptive passage (50-80 words) describing the following scene: "${currentSet.imageAlt}".
You must naturally incorporate the following vocabulary keywords: [${wordsList}].
Provide:
1. The English descriptive paragraph with required keywords highlighted.
2. A high-quality Vietnamese translation.
3. Vocabulary explanation and grammar highlights for C2 learner reflection.`;
  }, [currentSet, selectedWords]);

  // Copy prompt to clipboard
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      showToast('Đã sao chép prompt chi tiết vào bộ nhớ tạm!');
    } catch {
      showToast('Không thể sao chép prompt.');
    }
  };

  // Open external AI tools
  const handleOpenAiTool = async (tool: 'chatgpt' | 'gemini') => {
    await handleCopyPrompt();
    if (tool === 'chatgpt') {
      window.open('https://chatgpt.com', '_blank');
    } else {
      window.open('https://gemini.google.com', '_blank');
    }
  };

  // System AI generator
  const handleUseSystemAi = () => {
    setShowAiModal(false);
    setAiSampleGenerated(currentSet.sampleParagraphEn);
    showToast('Đã tạo câu mẫu AI hệ thống thành công!');
  };

  // Submit description
  const handleSubmit = () => {
    if (!userText.trim()) {
      showToast('Vui lòng nhập đoạn mô tả của bạn trước khi nộp bài!');
      return;
    }

    const wordsCount = userText.trim().split(/\s+/).length;
    const usedKeywords = selectedWords.filter((w) =>
      new RegExp(`\\b${w}\\b`, 'i').test(userText)
    );

    setSubmittedFeedback({
      score: 9.5,
      wordsCount,
      usedKeywordsCount: usedKeywords.length,
      totalKeywordsCount: selectedWords.length,
      feedbackEn:
        'Outstanding vocabulary synthesis! Your sentence demonstrates advanced subordination and vivid descriptive prowess.',
      feedbackVi:
        'Đoạn văn sử dụng từ ngữ xuất sắc, cấu trúc ngữ pháp tự nhiên và truyền tải rất tốt chiều sâu của bức ảnh.',
    });
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
      isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0f17] text-slate-100'
    }`}>
      {/* ================= 1. HEADER CHUẨN BIBUNG ================= */}
      <header className={`h-14 border-b px-4 flex items-center justify-between shrink-0 transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
          : 'bg-[#0d131d] border-[#1e2d42] text-white shadow-md'
      }`}>
        {/* Left: Close button, Title, Level */}
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-xs'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Đóng và quay lại Luyện tập"
          >
            <X className="w-4 h-4" />
          </Link>
          <div>
            <h1 className={`text-sm sm:text-base font-black leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Nhìn và viết
            </h1>
            <span className={`text-[11px] sm:text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Cấp độ: {currentSet.level}
            </span>
          </div>
        </div>

        {/* Right: Actions bar */}
        <div className="flex items-center gap-2">
          {/* NÚT CHUYỂN ĐỔI NỀN SÁNG / TỐI (LIGHT / DARK SWITCHER) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 shadow-xs'
                : 'bg-[#121c2b] hover:bg-[#1a2638] border-[#1e2d42] text-amber-400'
            }`}
            title="Chuyển đổi nền Sáng (Trắng) / Tối (Đen)"
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Category dropdown */}
          <div className="relative hidden sm:block">
            <select className={`border rounded-xl px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 shadow-xs'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:border-slate-600'
            }`}>
              <option value="random">Ngẫu nhiên</option>
              <option value="landscape">Phong cảnh</option>
              <option value="nature">Thiên nhiên</option>
              <option value="lifestyle">Đời sống</option>
            </select>
          </div>

          {/* Button Câu khác */}
          <button
            onClick={handleChangePhoto}
            className={`px-3 py-1.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-[#121c2b] hover:bg-[#1a2638] border-[#1e2d42] text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Câu khác</span>
          </button>

          {/* Button Lịch sử */}
          <button
            onClick={() => showToast('Bạn chưa có lịch sử nộp bài See & Write.')}
            className={`px-3 py-1.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-[#121c2b] hover:bg-[#1a2638] border-[#1e2d42] text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Lịch sử</span>
          </button>

          {/* Icon buttons: Help, Bug, Settings */}
          <button
            onClick={() =>
              showToast('Hướng dẫn: Chọn các từ khóa phù hợp với bức ảnh rồi viết đoạn văn mô tả hoàn chỉnh.')
            }
            className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-400 hover:text-white'
            }`}
            title="Trợ giúp"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => showToast('Cảm ơn bạn! Báo cáo phản hồi đã được gửi.')}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-400 hover:text-white'
            }`}
            title="Báo cáo lỗi"
          >
            <Bug className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/cai-dat"
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-400 hover:text-white'
            }`}
            title="Cài đặt"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-16 right-6 z-50 py-2.5 px-4 border rounded-xl text-xs font-bold shadow-2xl animate-in fade-in flex items-center gap-2 ${
          isLight
            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
            : 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
        }`}>
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 2. MAIN 2-COLUMN LAYOUT ================= */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ================= CỘT TRÁI (7 CỘT - ~58%) ================= */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Bức ảnh chất lượng cao */}
          <div className={`relative aspect-16/10 w-full rounded-3xl overflow-hidden bg-black border shadow-xl ${
            isLight ? 'border-slate-200' : 'border-[#1e2d42]'
          }`}>
            <img
              src={currentSet.imageUrl}
              alt={currentSet.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hộp chọn từ khóa của bạn - FONT CHỮ LỚN VÀ TƯƠNG PHẢN CAO */}
          <div className={`border rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg sm:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Chọn từ khóa của bạn
                </h3>
                <p className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Chọn tối đa 10 từ khóa
                </p>
              </div>
              <span className={`text-xs sm:text-sm font-black font-mono px-3 py-1 rounded-xl border ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-[#0d131d] border-[#1e2d42] text-slate-300'
              }`}>
                {selectedWords.length}/10
              </span>
            </div>

            {/* Keyword pills grid với kích thước chữ to rõ, dễ bấm */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {allKeywords.map(({ word, isValid }) => {
                const isSelected = selectedWords.includes(word);

                let pillStyle = isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
                  : 'bg-[#0d131d] border-[#1e2d42] text-slate-300 hover:border-slate-500';
                let iconElement = null;

                if (hasCheckedKeywords) {
                  if (isSelected && isValid) {
                    pillStyle = isLight
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-black shadow-xs'
                      : 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/10 font-black';
                    iconElement = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
                  } else if (isSelected && !isValid) {
                    pillStyle = isLight
                      ? 'bg-rose-50 border-rose-500 text-rose-900 font-black shadow-xs'
                      : 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-sm shadow-rose-500/10 font-black';
                    iconElement = <X className="w-4 h-4 text-rose-500 shrink-0" />;
                  } else if (!isSelected && isValid) {
                    pillStyle = isLight
                      ? 'bg-amber-50/50 border-amber-300 text-amber-700'
                      : 'bg-amber-500/5 border-amber-500/30 text-amber-400/80';
                    iconElement = <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
                  }
                } else if (isSelected) {
                  pillStyle = isLight
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-xs'
                    : 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-black';
                }

                return (
                  <button
                    key={word}
                    onClick={() => handleToggleKeyword(word)}
                    className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border text-base sm:text-lg font-black transition-all flex items-center gap-2.5 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${pillStyle}`}
                  >
                    {iconElement}
                    <span>{word}</span>
                    <span
                      onClick={(e) => handleSpeak(e, word)}
                      className="p-1 hover:text-emerald-500 transition-colors"
                      title="Phát âm"
                    >
                      <Volume2 className="w-4 h-4 text-slate-400 hover:text-emerald-500" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Nút Kiểm tra bên phải */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleCheckKeywords}
                className="py-3 px-8 bg-[#00c950] hover:bg-[#00b046] text-white text-sm sm:text-base font-black rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Kiểm tra</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI (5 CỘT - ~42%) ================= */}
        <div className={`lg:col-span-5 border rounded-3xl p-6 min-h-[580px] flex flex-col justify-between shadow-xl ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
        }`}>
          {!hasCheckedKeywords ? (
            /* ================= TRẠNG THÁI CHƯA CHỌN TỪ KHÓA (ẢNH 1 - 5.webp) ================= */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-5">
              {/* Black Cat Laptop Mascot chuẩn ảnh 5.webp */}
              <div className="w-32 h-32 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                  {/* Cat Body */}
                  <path
                    d="M 28 82 C 22 55 26 35 32 30 L 26 15 L 42 26 C 48 23 52 23 58 26 L 74 15 L 68 30 C 74 35 78 55 72 82 Z"
                    fill={isLight ? '#1e293b' : '#080c14'}
                    stroke={isLight ? '#94a3b8' : '#1e2d42'}
                    strokeWidth="2.5"
                  />
                  {/* Ears inner */}
                  <polygon points="30,20 38,26 32,32" fill="#ff7a9e" opacity="0.6" />
                  <polygon points="70,20 62,26 68,32" fill="#ff7a9e" opacity="0.6" />
                  {/* Expressive White Eyes */}
                  <ellipse cx="41" cy="40" rx="4.5" ry="6" fill="#ffffff" />
                  <circle cx="42" cy="40" r="2.5" fill="#000000" />
                  <circle cx="43" cy="38.5" r="1" fill="#ffffff" />
                  <ellipse cx="59" cy="40" rx="4.5" ry="6" fill="#ffffff" />
                  <circle cx="60" cy="40" r="2.5" fill="#000000" />
                  <circle cx="61" cy="38.5" r="1" fill="#ffffff" />
                  {/* Nose & Whiskers */}
                  <polygon points="49.5,47 50.5,47 50,49" fill="#ff7a9e" />
                  <line x1="32" y1="46" x2="20" y2="44" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="32" y1="50" x2="20" y2="52" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="68" y1="46" x2="80" y2="44" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="68" y1="50" x2="80" y2="52" stroke="#64748b" strokeWidth="1.5" />
                  {/* Laptop base */}
                  <rect x="22" y="74" width="56" height="7" rx="3" fill="#38bdf8" />
                  {/* Laptop screen with gentle glow */}
                  <polygon points="27,74 32,48 68,48 73,74" fill="#7dd3fc" opacity="0.95" />
                  {/* Laptop keyboard glow */}
                  <line x1="28" y1="77" x2="72" y2="77" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
                  {/* Paws */}
                  <circle cx="36" cy="74" r="4.5" fill={isLight ? '#1e293b' : '#080c14'} stroke={isLight ? '#94a3b8' : '#1e2d42'} strokeWidth="1.5" />
                  <circle cx="64" cy="74" r="4.5" fill={isLight ? '#1e293b' : '#080c14'} stroke={isLight ? '#94a3b8' : '#1e2d42'} strokeWidth="1.5" />
                </svg>
              </div>

              <p className={`text-sm sm:text-base font-semibold max-w-[280px] leading-relaxed ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Hãy chọn từ khóa bên trái để bắt đầu phần viết
              </p>
            </div>
          ) : (
            /* ================= TRẠNG THÁI ĐÃ KIỂM TRA TỪ KHÓA (ẢNH 2 - 6.webp) ================= */
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                {/* Header Mô tả của bạn */}
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs sm:text-sm font-black tracking-wider uppercase ${
                    isLight ? 'text-slate-700' : 'text-white'
                  }`}>
                    MÔ TẢ CỦA BẠN
                  </h3>
                  <span className={`text-xs font-mono font-medium ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {userText.length}/400
                  </span>
                </div>

                {/* Textarea nhập mô tả - FONT CHỮ LỚN DỄ NHÌN */}
                <textarea
                  rows={9}
                  maxLength={400}
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder="Bắt đầu viết mô tả bằng các từ khóa bên trái..."
                  className={`w-full border rounded-3xl p-4 sm:p-5 text-base sm:text-lg font-medium leading-relaxed outline-none resize-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                      : 'bg-[#0d131d] border-[#1e2d42] text-slate-100 placeholder-slate-500 focus:border-emerald-500'
                  }`}
                />

                {/* Hộp gợi ý Câu Mẫu */}
                <div className={`p-4 border rounded-2xl space-y-2.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d131d] border-[#1e2d42]'
                }`}>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className={`font-black flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>CÂU MẪU</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Gem className="w-3.5 h-3.5 fill-emerald-500" />
                      <span>{user?.diamonds ?? 135} gems</span>
                    </span>
                  </div>

                  {/* Nút Xem câu mẫu AI */}
                  <button
                    onClick={() => setShowAiModal(true)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      isLight
                        ? 'bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800'
                        : 'bg-[#1c1810] hover:bg-[#261f12] border border-amber-500/30 text-amber-400'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Xem câu mẫu AI</span>
                  </button>

                  {/* Hiển thị câu mẫu nếu đã tạo */}
                  {aiSampleGenerated && (
                    <div className={`p-3.5 border rounded-xl space-y-1.5 text-xs sm:text-sm animate-in fade-in ${
                      isLight
                        ? 'bg-amber-50/70 border-amber-300 text-slate-800'
                        : 'bg-[#141d2b] border-amber-500/30 text-slate-200'
                    }`}>
                      <div className="font-bold leading-relaxed">
                        {aiSampleGenerated}
                      </div>
                      <div className={`italic text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {currentSet.sampleParagraphVi}
                      </div>
                    </div>
                  )}
                </div>

                {/* Kết quả chấm điểm sau khi nộp */}
                {submittedFeedback && (
                  <div className={`p-4 border rounded-2xl space-y-2 text-xs sm:text-sm animate-in zoom-in-95 ${
                    isLight
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                      : 'bg-emerald-950/50 border-emerald-500/50 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> AI Đánh Giá: {submittedFeedback.score}/10
                      </span>
                      <span className="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-300">
                        +{submittedFeedback.usedKeywordsCount * 5 + 10} 💎
                      </span>
                    </div>
                    <p className="font-semibold leading-relaxed">{submittedFeedback.feedbackEn}</p>
                    <p className={`text-xs italic ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{submittedFeedback.feedbackVi}</p>
                  </div>
                )}
              </div>

              {/* Nút Nộp Bài lớn màu xanh */}
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-[#00c950] hover:bg-[#00b046] text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-95"
                >
                  <span>NỘP BÀI</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= 3. MODAL "LẤY GỢI Ý SEE & WRITE" (ẢNH 3 - 7.png) ================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-lg border rounded-3xl p-6 shadow-2xl space-y-5 ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
          }`}>
            {/* Header Modal */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Lấy gợi ý See & Write
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Chọn nơi tạo đoạn tham khảo từ đúng prompt và từ khóa của bài hiện tại.
                </p>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                    : 'bg-[#0d131d] border-[#1e2d42] hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ✕
              </button>
            </div>

            {/* 4 Cards Lựa Chọn Gợi Ý (2x2 Grid Chuẩn Ảnh 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. AI hệ thống */}
              <button
                onClick={handleUseSystemAi}
                className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer space-y-1.5 ${
                  isLight
                    ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/70'
                    : 'bg-[#1c1810] border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="font-black text-amber-600 dark:text-amber-400 text-sm">AI hệ thống</span>
                </div>
                <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Lưu kết quả trong See & Write
                </p>
              </button>

              {/* 2. ChatGPT */}
              <button
                onClick={() => handleOpenAiTool('chatgpt')}
                className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer space-y-1.5 ${
                  isLight
                    ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/70'
                    : 'bg-[#0d1c1a] border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">ChatGPT</span>
                </div>
                <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Copy prompt và mở ChatGPT
                </p>
              </button>

              {/* 3. Gemini */}
              <button
                onClick={() => handleOpenAiTool('gemini')}
                className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer space-y-1.5 ${
                  isLight
                    ? 'bg-indigo-50/70 border-indigo-300 hover:bg-indigo-100/70'
                    : 'bg-[#121629] border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-500/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">Gemini</span>
                </div>
                <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Copy prompt và mở Gemini
                </p>
              </button>

              {/* 4. Copy prompt */}
              <button
                onClick={handleCopyPrompt}
                className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer space-y-1.5 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    : 'bg-[#0d131d] border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
                  }`}>
                    <Copy className="w-4 h-4" />
                  </div>
                  <span className={`font-black text-sm ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Copy prompt
                  </span>
                </div>
                <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Tự dán vào công cụ AI khác
                </p>
              </button>
            </div>

            {/* Accordion "XEM PROMPT CHI TIẾT" */}
            <div className={`border rounded-2xl overflow-hidden ${
              isLight ? 'border-slate-200' : 'border-[#1e2d42]'
            }`}>
              <button
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className={`w-full p-3 flex items-center justify-between text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    : 'bg-[#0d131d] hover:bg-[#141d2b] text-slate-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {showPromptDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>XEM PROMPT CHI TIẾT</span>
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Xem nội dung lệnh AI</span>
              </button>

              {showPromptDetails && (
                <div className={`p-4 border-t space-y-2 text-xs font-mono ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-[#080d14] border-[#1e2d42] text-slate-300'
                }`}>
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed select-all">
                    {promptContent}
                  </pre>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleCopyPrompt}
                      className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Copy className="w-3.5 h-3.5" /> Sao chép
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer text */}
            <div className={`pt-1 text-xs flex items-center gap-1.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>ChatGPT/Gemini chỉ nhận prompt khi bạn chủ động mở và gửi.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
