'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  RotateCcw,
  HelpCircle,
  Settings,
  Bug,
  Volume2,
  Check,
  XCircle,
  ArrowRight,
  Sparkles,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Award,
  Gem,
  Flame,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { ERROR_FIND_QUESTIONS, ErrorFindQuestion } from '@/data/errorFindQuestions';

// SVG Minh họa Thám tử / Người khám phá cầm đuốc và kính lúp giữa rừng cây (Ảnh 1-4)
function DetectiveIllustration({ className = 'w-52 h-44' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Background lush vegetation / Stylized Trees */}
        {/* Far back tree left */}
        <path
          d="M130 180 C110 130 140 70 150 60 C160 70 190 130 170 180 Z"
          fill="#4ade80"
          opacity="0.85"
        />
        <line x1="150" y1="90" x2="150" y2="180" stroke="#166534" strokeWidth="2" strokeDasharray="3 3" />

        {/* Far back center tree */}
        <path
          d="M195 190 C175 120 195 50 210 40 C225 50 245 120 225 190 Z"
          fill="#bef264"
          opacity="0.9"
        />
        <line x1="210" y1="65" x2="210" y2="190" stroke="#4d7c0f" strokeWidth="2" strokeDasharray="3 3" />

        {/* Far back tree right */}
        <path
          d="M270 185 C250 135 280 75 290 65 C300 75 330 135 310 185 Z"
          fill="#a3e635"
          opacity="0.85"
        />
        <line x1="290" y1="95" x2="290" y2="185" stroke="#365314" strokeWidth="2" strokeDasharray="3 3" />

        {/* Foreground foliage / Bushes (Yellow-green and lime) */}
        <path
          d="M80 230 C80 190 130 170 160 190 C190 170 230 180 250 200 C280 180 320 195 330 230 Z"
          fill="#86efac"
          opacity="0.75"
        />
        <ellipse cx="200" cy="245" rx="160" ry="40" fill="#bef264" />

        {/* Stylized leafy grass stalks */}
        <path
          d="M100 230 C90 190 115 160 120 150 C125 170 130 200 125 230"
          stroke="#15803d"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M108 175 C100 170 95 160 100 155 C108 155 112 165 110 175" fill="#22c55e" />
        <path d="M120 185 C128 180 135 170 130 165 C122 165 118 175 120 185" fill="#22c55e" />

        {/* Right side leaves */}
        <path
          d="M300 230 C310 190 285 160 280 150 C275 170 270 200 275 230"
          stroke="#15803d"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M292 175 C300 170 305 160 300 155 C292 155 288 165 290 175" fill="#22c55e" />

        {/* Detective Boy Character */}
        {/* Torso / Green Shirt */}
        <path
          d="M175 170 C160 190 155 230 150 245 L250 245 C245 230 240 190 225 170 Z"
          fill="#16a34a"
        />
        {/* Collar / Neck */}
        <path d="M190 168 C195 175 205 175 210 168" stroke="#fef08a" strokeWidth="3" fill="none" />
        <path d="M192 160 L192 170 L208 170 L208 160 Z" fill="#fed7aa" />

        {/* Head */}
        <ellipse cx="200" cy="140" rx="26" ry="28" fill="#fed7aa" />

        {/* Dark messy hair */}
        <path
          d="M170 135 C170 110 185 95 200 95 C215 95 235 105 235 130 C228 120 220 120 215 125 C210 115 195 115 190 125 C185 120 175 122 170 135 Z"
          fill="#1e293b"
        />
        {/* Side hair tufts */}
        <path d="M170 130 C165 125 168 140 172 145 Z" fill="#1e293b" />
        <path d="M230 130 C238 125 234 142 230 145 Z" fill="#1e293b" />

        {/* Eyes & Eyebrows */}
        {/* Left eye (intense, focused) */}
        <path d="M184 133 C186 130 192 130 194 133" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="189" cy="138" rx="3" ry="4" fill="#0f172a" />
        <circle cx="190" cy="136" r="1.2" fill="#ffffff" />

        {/* Nose & Mouth */}
        <path d="M198 142 C197 146 199 148 202 147" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M194 153 C198 156 204 156 208 153" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Left Hand holding Burning Torch */}
        <path d="M175 180 C160 185 145 195 140 210 L148 215 C155 205 168 195 180 190 Z" fill="#16a34a" />
        {/* Hand */}
        <circle cx="138" cy="208" r="7" fill="#fed7aa" />
        {/* Wooden torch */}
        <rect x="133" y="170" width="8" height="50" rx="3" fill="#ca8a04" transform="rotate(-15 137 195)" />
        {/* Torch flame */}
        <path
          d="M136 170 C125 155 130 135 138 125 C146 138 155 150 144 170 Z"
          fill="#f97316"
        />
        <path
          d="M137 168 C132 158 135 145 140 135 C144 144 148 152 141 168 Z"
          fill="#facc15"
        />
        <circle cx="140" cy="155" r="3" fill="#ffffff" opacity="0.8" />

        {/* Right Hand holding Magnifying Glass over Right Eye */}
        {/* Arm reaching up */}
        <path d="M225 185 C235 190 245 175 235 160 L225 165 Z" fill="#16a34a" />
        <circle cx="218" cy="148" r="6" fill="#fed7aa" />

        {/* Magnifying glass */}
        {/* Handle */}
        <rect x="214" y="150" width="6" height="22" rx="2" fill="#dc2626" transform="rotate(30 217 161)" />
        {/* Outer Frame */}
        <circle cx="210" cy="138" r="16" stroke="#3b82f6" strokeWidth="4" fill="#60a5fa" fillOpacity="0.3" />
        {/* Big Magnified Eye inside Glass */}
        <ellipse cx="210" cy="138" rx="8" ry="10" fill="#ffffff" />
        <ellipse cx="210" cy="138" rx="5" ry="6" fill="#0284c7" />
        <ellipse cx="210" cy="138" rx="3" ry="3.5" fill="#0f172a" />
        <circle cx="212" cy="135" r="1.5" fill="#ffffff" />
        {/* Glass reflection shine */}
        <path d="M200 130 A 13 13 0 0 1 220 128" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        {/* Foreground grass/flowers */}
        <path
          d="M60 260 C120 235 280 235 340 260 L340 280 L60 280 Z"
          fill="#4ade80"
          opacity="0.9"
        />
        <path
          d="M185 240 C190 230 200 230 205 240 C215 230 225 235 220 245 C215 250 195 250 185 240 Z"
          fill="#22c55e"
        />
        {/* Tiny white wild flowers */}
        <circle cx="170" cy="245" r="3" fill="#ffffff" />
        <circle cx="170" cy="245" r="1" fill="#facc15" />
        <circle cx="235" cy="248" r="3" fill="#ffffff" />
        <circle cx="235" cy="248" r="1" fill="#facc15" />
      </svg>
    </div>
  );
}

// Kiểu dữ liệu tương tác cho câu hỏi hiện tại
type StepState = 'initial' | 'select_error_word' | 'select_correction' | 'result';

export default function ErrorFindStudioPage() {
  const router = useRouter();
  const { user, updateProfile, incrementProgress } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';

  // 1. Quản lý Popup Hướng dẫn 4 bước (Ảnh 1-4)
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  // 2. Quản lý danh sách 10 câu hỏi cho lượt chơi
  const [questions, setQuestions] = useState<ErrorFindQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // 3. Quản lý bộ lọc / Danh mục
  const [filterMode, setFilterMode] = useState<string>('random');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // 4. Trạng thái tương tác từng câu
  const [stepState, setStepState] = useState<StepState>('initial');
  const [userAnswerDecision, setUserAnswerDecision] = useState<'has_error' | 'correct' | null>(null);
  const [userSelectedWord, setUserSelectedWord] = useState<string | null>(null);
  const [userSelectedWordIndex, setUserSelectedWordIndex] = useState<number | null>(null);
  const [userSelectedOptionKey, setUserSelectedOptionKey] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [userSelectedOptionText, setUserSelectedOptionText] = useState<string | null>(null);

  // 5. Thống kê điểm và phần thưởng
  const [score, setScore] = useState(0);
  const [diamondsEarned, setDiamondsEarned] = useState(0);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [noteSavedToast, setNoteSavedToast] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  // Khởi tạo câu hỏi ban đầu
  useEffect(() => {
    // Kiểm tra xem đã từng xem hướng dẫn chưa, nếu chưa thì tự động mở Popup
    const hasSeenGuide = localStorage.getItem('micky_error_find_guide_seen');
    if (!hasSeenGuide) {
      setShowGuideModal(true);
      localStorage.setItem('micky_error_find_guide_seen', 'true');
    }

    startNewRound();
  }, []);

  // Khởi động bộ 10 câu hỏi mới
  const startNewRound = () => {
    // Shuffle câu hỏi
    const shuffled = [...ERROR_FIND_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
    setCurrentIdx(0);
    setSessionCompleted(false);
    setScore(0);
    setDiamondsEarned(0);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setStepState('initial');
    setUserAnswerDecision(null);
    setUserSelectedWord(null);
    setUserSelectedWordIndex(null);
    setUserSelectedOptionKey(null);
    setUserSelectedOptionText(null);
  };

  const currentQ = questions[currentIdx] || ERROR_FIND_QUESTIONS[0];

  // Tính phần trăm tiến độ
  const progressPercent = Math.round((currentIdx / (questions.length || 10)) * 100);

  // Web Speech API phát âm câu
  const playSpeech = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ================= XỬ LÝ BƯỚC 1: NHẬN ĐỊNH CÂU (Ảnh 5) =================
  const handleDecision = (decision: 'has_error' | 'correct') => {
    setUserAnswerDecision(decision);

    if (decision === 'correct') {
      // Người dùng chọn "Đúng"
      if (!currentQ.hasError) {
        // Câu gốc đúng thật -> Người dùng nhận định chính xác!
        setScore((prev) => prev + 1);
        setDiamondsEarned((prev) => prev + 2);
      }
      // Chuyển thẳng đến màn hình kết quả và giải thích (Ảnh 6)
      setStepState('result');
    } else {
      // Người dùng chọn "Có lỗi"
      if (!currentQ.hasError) {
        // Nhưng thực tế câu gốc đúng -> Người dùng đoán sai, chuyển thẳng đến giải thích
        setStepState('result');
      } else {
        // Câu gốc thực sự có lỗi -> Chuyển sang Bước 2: "CHẠM VÀO PHẦN CÓ LỖI" (Ảnh 7)
        setStepState('select_error_word');
      }
    }
  };

  // ================= XỬ LÝ BƯỚC 2: CHỈ RA VỊ TRÍ LỖI (Ảnh 7) =================
  const handleSelectWord = (word: string, index: number) => {
    setUserSelectedWord(word);
    setUserSelectedWordIndex(index);
    // Sau khi chạm vào từ, chuyển ngay sang Bước 3: "CHỌN CÁCH SỬA ĐÚNG" (Ảnh 8)
    setStepState('select_correction');
  };

  // ================= XỬ LÝ BƯỚC 3: CHỌN CÁCH SỬA ĐÚNG (Ảnh 8) =================
  const handleSelectCorrection = (key: 'A' | 'B' | 'C' | 'D', text: string) => {
    setUserSelectedOptionKey(key);
    setUserSelectedOptionText(text);

    // Đánh giá toàn bộ câu hỏi
    const isWordCorrect =
      currentQ.errorTokenIndex !== undefined &&
      userSelectedWordIndex === currentQ.errorTokenIndex;
    const isOptionCorrect = key === currentQ.correctReplacementKey;

    if (isWordCorrect && isOptionCorrect) {
      // Chọn đúng cả vị trí và cách sửa -> Điểm tối đa
      setScore((prev) => prev + 1);
      setDiamondsEarned((prev) => prev + 3);
    } else if (isWordCorrect || isOptionCorrect) {
      // Đúng 1 trong 2 phần
      setDiamondsEarned((prev) => prev + 1);
    }

    // Chuyển sang Bước 4: Kết quả và giải thích chuyên sâu (Ảnh 9)
    setStepState('result');
  };

  // Chuyển sang câu tiếp theo
  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      resetQuestionState();
    } else {
      // Hoàn thành cả 10 câu
      setSessionCompleted(true);
      if (user) {
        updateProfile({
          diamonds: (user.diamonds || 0) + diamondsEarned,
        });
        incrementProgress({
          examsCompleted: 1,
        });
      }
    }
  };

  // Lưu câu hỏi vào ghi chú / sổ tay ôn tập
  const handleSaveNote = () => {
    if (!savedNotes.includes(currentQ.id)) {
      setSavedNotes([...savedNotes, currentQ.id]);
    }
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2500);
  };

  // Phân tích các từ trong câu (tokenization)
  const tokens = useMemo(() => {
    if (currentQ.tokens && currentQ.tokens.length > 0) {
      return currentQ.tokens;
    }
    return currentQ.sentence.split(/\s+/);
  }, [currentQ]);

  // Kiểm tra tính chính xác của nhận định
  const isDecisionCorrect =
    (userAnswerDecision === 'correct' && !currentQ.hasError) ||
    (userAnswerDecision === 'has_error' && currentQ.hasError);

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none transition-colors ${
      isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0f17] text-slate-100'
    }`}>
      {/* ================= 1. TOP NAVIGATION BAR (Chuẩn Ảnh 5 - 9) ================= */}
      <header className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors backdrop-blur-md ${
        isLight ? 'bg-white/95 border-slate-200 shadow-xs' : 'bg-[#0d1420]/90 border-[#1e2d42]'
      }`}>
        {/* Bên trái: Nút đóng ✕ và Tiêu đề bài học */}
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200'
                : 'bg-[#162235] hover:bg-[#20314a] text-slate-400 hover:text-white'
            }`}
            title="Quay về trang Luyện tập"
          >
            <X className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-sm sm:text-base font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Tìm lỗi
              </h1>
            </div>
            <p className={`text-[11px] font-semibold ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Bộ 1 • {currentQ.level}
            </p>
          </div>
        </div>

        {/* Ở giữa: Chỉ số CÂU 1 / 10 và Thanh tiến trình */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className={`flex items-center justify-between w-48 sm:w-72 text-[10px] font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>CÂU {currentIdx + 1} / {questions.length}</span>
            <span className="text-emerald-500 font-black">{progressPercent}%</span>
          </div>
          <div className={`h-1.5 w-48 sm:w-72 rounded-full overflow-hidden border ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800/80 border-slate-700/30'
          }`}>
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bên phải: Theme Switcher, Nút Ngẫu nhiên, Bộ mới, Báo lỗi, Hướng dẫn, Phát âm */}
        <div className="flex items-center gap-2">
          {/* NÚT ĐỔI GIAO DIỆN SÁNG / TỐI (LIGHT / DARK SWITCHER) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 shadow-xs'
                : 'bg-[#141e2e] hover:bg-[#1f2d44] border-[#1e2d42] text-amber-400'
            }`}
            title="Chuyển đổi nền Sáng (Trắng) / Tối (Đen)"
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Dropdown chọn ngẫu nhiên */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
                  : 'bg-[#141e2e] border-[#1e2d42] hover:border-slate-600 text-slate-300'
              }`}
            >
              <span>{filterMode === 'random' ? 'Ngẫu nhiên' : filterMode}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showFilterMenu && (
              <div className={`absolute right-0 mt-2 w-48 border rounded-2xl shadow-2xl py-2 z-50 text-xs ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
              }`}>
                <button
                  onClick={() => {
                    setFilterMode('random');
                    setShowFilterMenu(false);
                    startNewRound();
                  }}
                  className={`w-full text-left px-4 py-2 font-bold ${
                    isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#1a2638] text-slate-300 hover:text-white'
                  }`}
                >
                  🎲 Ngẫu nhiên
                </button>
                <button
                  onClick={() => {
                    setFilterMode('A1 - A2');
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 font-medium ${
                    isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#1a2638] text-slate-300 hover:text-white'
                  }`}
                >
                  🟢 Cấp độ Cơ bản (A1 - A2)
                </button>
                <button
                  onClick={() => {
                    setFilterMode('B1 - B2');
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 font-medium ${
                    isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#1a2638] text-slate-300 hover:text-white'
                  }`}
                >
                  🟡 Cấp độ Trung cấp (B1 - B2)
                </button>
                <button
                  onClick={() => {
                    setFilterMode('TRAVEL');
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 font-medium ${
                    isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#1a2638] text-slate-300 hover:text-white'
                  }`}
                >
                  ✈️ Chủ đề: Du lịch (Travel)
                </button>
              </div>
            )}
          </div>

          {/* Nút Bộ mới */}
          <button
            onClick={startNewRound}
            className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs hover:border-emerald-500'
                : 'bg-[#141e2e] border-[#1e2d42] hover:border-emerald-500/50 text-slate-300 hover:text-white'
            }`}
            title="Đổi bộ 10 câu mới"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Bộ mới</span>
          </button>

          {/* Icon Báo lỗi */}
          <button
            onClick={() => setReportModalOpen(true)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-rose-50 border-slate-200 text-slate-500 hover:text-rose-600 shadow-2xs'
                : 'bg-[#141e2e] border-[#1e2d42] hover:bg-[#1e2d42] text-slate-400 hover:text-rose-400'
            }`}
            title="Báo lỗi câu này"
          >
            <Bug className="w-3.5 h-3.5" />
          </button>

          {/* Icon Hướng dẫn ❓ (Mở popup Ảnh 1-4 bất cứ lúc nào) */}
          <button
            onClick={() => {
              setGuideStep(0);
              setShowGuideModal(true);
            }}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-500 hover:text-emerald-600 shadow-2xs'
                : 'bg-[#141e2e] border-[#1e2d42] hover:bg-[#1e2d42] text-slate-400 hover:text-emerald-400'
            }`}
            title="Xem hướng dẫn cách chơi"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Icon Cài đặt ⚙️ / Phát âm */}
          <button
            onClick={() => playSpeech(currentQ.sentence)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 shadow-2xs'
                : 'bg-[#141e2e] border-[#1e2d42] hover:bg-[#1e2d42] text-slate-400 hover:text-white'
            }`}
            title="Phát âm câu này"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ================= 2. KHÔNG GIAN BÀI HỌC CHÍNH (Card Phone/Flashcard Giữa Màn Hình) ================= */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {!sessionCompleted ? (
          <div className="w-full max-w-lg flex flex-col space-y-4 my-auto">
            {/* Card chính phong cách flashcard */}
            <div className={`border rounded-[28px] p-5 sm:p-7 transition-all duration-300 flex flex-col ${
              isLight
                ? 'bg-white border-slate-200 shadow-xl text-slate-900'
                : 'bg-[#121c2b] border-[#1e2d42] shadow-2xl text-slate-100'
            }`}>
              {/* Header của Card: Badges Level + Topic + (Số lỗi ở bước 2/3/4) */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {currentQ.level}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider ${
                    isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-[#1a2638] text-slate-300'
                  }`}>
                    {currentQ.topic}
                  </span>
                </div>

                {/* Badge đếm lỗi (Ảnh 7, 8, 9) */}
                {stepState !== 'initial' && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    stepState === 'result'
                      ? isLight
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {stepState === 'result' ? '1/1 lỗi' : '0/1 lỗi'}
                  </span>
                )}
              </div>

              {/* ----------------- BƯỚC 1: NHẬN ĐỊNH CÂU (Ảnh 5) ----------------- */}
              {stepState === 'initial' && (
                <div className="flex flex-col items-center text-center space-y-5">
                  {/* Tranh minh họa bo góc */}
                  <div className={`w-full max-w-sm h-40 sm:h-48 rounded-2xl overflow-hidden shadow-inner border relative group ${
                    isLight ? 'border-slate-200' : 'border-slate-700/40'
                  }`}>
                    <img
                      src={currentQ.imageUrl}
                      alt={currentQ.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => playSpeech(currentQ.sentence)}
                      className="absolute bottom-2 right-2 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>

                  {/* Câu hỏi gợi ý */}
                  <div className="space-y-2 pt-1">
                    <p className={`text-sm sm:text-base font-bold ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      Câu này đúng hay sai?
                    </p>
                    <h2 className={`text-2xl sm:text-3xl font-black leading-relaxed tracking-tight px-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {currentQ.sentence}
                    </h2>
                  </div>

                  {/* Hint dưới card */}
                  <div className={`pt-2 text-xs sm:text-sm flex items-center justify-center gap-1.5 font-medium ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Chọn đáp án bên dưới để kiểm tra</span>
                  </div>
                </div>
              )}

              {/* ----------------- BƯỚC 2: CHỈ RA VỊ TRÍ LỖI (Ảnh 7) ----------------- */}
              {stepState === 'select_error_word' && (
                <div className="flex flex-col items-center text-center space-y-6 py-4">
                  <div className="space-y-1">
                    <p className={`text-xs sm:text-sm font-black tracking-widest uppercase ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      CHẠM VÀO PHẦN CÓ LỖI
                    </p>
                  </div>

                  {/* Danh sách các từ bấm được thành từng thẻ chip to rõ (Ảnh 7) */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-md py-4">
                    {tokens.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectWord(word, idx)}
                        className={`px-4 sm:px-5 py-3 rounded-2xl border font-black text-lg sm:text-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                          isLight
                            ? 'bg-slate-100 hover:bg-emerald-50 border-slate-200 hover:border-emerald-500 text-slate-900 shadow-xs hover:shadow-md'
                            : 'bg-[#0b0f17] hover:bg-[#162235] border-[#23354d] hover:border-emerald-400 text-white shadow-md'
                        }`}
                      >
                        {word}
                      </button>
                    ))}
                  </div>

                  <p className={`text-xs sm:text-sm font-medium ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Chọn trực tiếp trên flashcard
                  </p>
                </div>
              )}

              {/* ----------------- BƯỚC 3: CHỌN CÁCH SỬA ĐÚNG (Ảnh 8) ----------------- */}
              {stepState === 'select_correction' && (
                <div className="flex flex-col space-y-4">
                  <p className={`text-xs sm:text-sm font-black tracking-widest uppercase text-center ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    CHỌN CÁCH SỬA ĐÚNG
                  </p>

                  {/* Khung: CÂU ĐANG KIỂM TRA */}
                  <div className={`border rounded-2xl p-4 space-y-1 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b0f17] border-[#1e2d42]'
                  }`}>
                    <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      isLight ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      CÂU ĐANG KIỂM TRA
                    </p>
                    <p className={`text-lg sm:text-xl font-bold leading-relaxed ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {tokens.map((token, i) => {
                        const isTheActualError =
                          currentQ.errorTokenIndex !== undefined
                            ? i === currentQ.errorTokenIndex
                            : token === currentQ.errorWord;
                        if (isTheActualError) {
                          return (
                            <span
                              key={i}
                              className="text-rose-600 dark:text-rose-400 underline underline-offset-4 decoration-rose-500 font-black px-1"
                            >
                              {token}{' '}
                            </span>
                          );
                        }
                        return <span key={i}>{token} </span>;
                      })}
                    </p>
                  </div>

                  {/* Banner phản hồi vị trí vừa chọn (Ảnh 8) */}
                  {userSelectedWordIndex !== currentQ.errorTokenIndex ? (
                    <div className={`border rounded-xl p-3.5 text-xs sm:text-sm space-y-1 ${
                      isLight
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                    }`}>
                      <p className="font-bold text-rose-600 dark:text-rose-400">Vị trí vừa chọn chưa đúng.</p>
                      <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                        Bạn đã chọn “<span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{userSelectedWord}</span>”. Phần cần sửa là “<span className="font-bold text-rose-600 dark:text-rose-300">{currentQ.errorWord}</span>”.
                      </p>
                    </div>
                  ) : (
                    <div className={`border rounded-xl p-3.5 text-xs sm:text-sm space-y-1 ${
                      isLight
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    }`}>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">Vị trí vừa chọn chính xác!</p>
                      <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                        Bạn đã xác định đúng phần cần sửa là “<span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentQ.errorWord}</span>”.
                      </p>
                    </div>
                  )}

                  {/* Tiêu đề phương án */}
                  <p className={`text-sm sm:text-base font-black text-center pt-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Thay “<span className="text-rose-500">{currentQ.errorWord}</span>” bằng
                  </p>

                  {/* 4 phương án A, B, C, D (Ảnh 8) */}
                  <div className="space-y-2.5">
                    {currentQ.replacementOptions?.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectCorrection(opt.key, opt.text)}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3.5 text-left transition-all hover:scale-[1.01] group cursor-pointer ${
                          isLight
                            ? 'bg-slate-50 hover:bg-emerald-50/70 border-slate-200 hover:border-emerald-500 shadow-2xs'
                            : 'bg-[#0b0f17] hover:bg-[#162235] border-[#1e2d42] hover:border-emerald-400/80 shadow-sm'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center transition-colors shrink-0 ${
                          isLight
                            ? 'bg-slate-200 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white'
                            : 'bg-[#1a2638] group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-400'
                        }`}>
                          {opt.key}
                        </span>
                        <span className={`text-base sm:text-lg font-bold transition-colors ${
                          isLight ? 'text-slate-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-300'
                        }`}>
                          {opt.text}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className={`text-xs text-center font-medium pt-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Chọn trực tiếp trên flashcard
                  </p>
                </div>
              )}

              {/* ----------------- BƯỚC 4: KẾT QUẢ VÀ GIẢI THÍCH (Ảnh 6 & Ảnh 9) ----------------- */}
              {stepState === 'result' && (
                <div className="flex flex-col space-y-4">
                  {/* Card: CÂU VỪA TRẢ LỜI */}
                  <div className={`border rounded-2xl p-4 space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b0f17] border-[#1e2d42]'
                  }`}>
                    <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      isLight ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      CÂU VỪA TRẢ LỜI
                    </p>
                    <p className={`text-lg sm:text-xl font-bold leading-relaxed ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {currentQ.sentence}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
                      <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Bạn chọn:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          userAnswerDecision === 'has_error'
                            ? 'bg-rose-500/20 text-rose-500 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {userAnswerDecision === 'has_error' ? 'Có lỗi' : 'Đúng'}
                      </span>

                      {/* Hiển thị vị trí & cách sửa đã chọn (Ảnh 9) */}
                      {userSelectedWord && (
                        <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Vị trí: <span className="text-rose-500 font-bold">"{userSelectedWord}"</span>
                        </span>
                      )}
                      {userSelectedOptionText && (
                        <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Cách sửa: <span className="text-rose-500 font-bold">"{userSelectedOptionText}"</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Header: KẾT QUẢ VÀ GIẢI THÍCH + Nút lưu ghi chú */}
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-xs sm:text-sm font-black tracking-wider uppercase ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      KẾT QUẢ VÀ GIẢI THÍCH
                    </span>
                    <button
                      onClick={handleSaveNote}
                      className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-emerald-600'
                          : 'bg-[#162235] hover:bg-[#20314a] border-[#24344d] text-slate-400 hover:text-emerald-400'
                      }`}
                      title="Lưu câu này vào sổ tay ôn tập"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card trạng thái nhận định */}
                  <div
                    className={`rounded-2xl p-4 flex items-start gap-3 border ${
                      isDecisionCorrect
                        ? isLight
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : isLight
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {isDecisionCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <p className={`font-black text-sm sm:text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {isDecisionCorrect ? 'Nhận định chính xác' : 'Nhận định chưa chính xác'}
                      </p>
                      <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {currentQ.hasError ? 'Câu gốc có lỗi.' : 'Câu gốc đúng.'}
                      </p>
                    </div>
                  </div>

                  {/* Card: CÂU ĐÚNG */}
                  <div className={`border rounded-2xl p-4 sm:p-5 space-y-3 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b0f17] border-[#1e2d42]'
                  }`}>
                    <div>
                      <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 ${
                        isLight ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        CÂU ĐÚNG
                      </p>
                      <p className={`text-lg sm:text-xl font-black leading-relaxed flex items-center justify-between ${
                        isLight ? 'text-emerald-700' : 'text-emerald-300'
                      }`}>
                        <span>{currentQ.correctSentence}</span>
                        <button
                          onClick={() => playSpeech(currentQ.correctSentence)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isLight ? 'text-slate-400 hover:text-emerald-600' : 'text-slate-400 hover:text-emerald-400'
                          }`}
                          title="Nghe câu đúng"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </p>
                      <p className={`text-sm sm:text-base font-semibold mt-1 ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {currentQ.translation}
                      </p>
                    </div>

                    {/* Diff Pill nếu câu có lỗi (Ảnh 9) */}
                    {currentQ.hasError && currentQ.errorWord && currentQ.replacementOptions && (
                      <div className="pt-1 flex items-center gap-2 text-xs sm:text-sm">
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 font-mono line-through border border-rose-500/30">
                          {currentQ.errorWord}
                        </span>
                        <span className="text-slate-400 font-black">→</span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono border border-emerald-500/30 font-bold">
                          {
                            currentQ.replacementOptions.find(
                              (o) => o.key === currentQ.correctReplacementKey
                            )?.text
                          }
                        </span>
                      </div>
                    )}

                    {/* Giải thích ngữ pháp chi tiết */}
                    <div className={`text-sm sm:text-base leading-relaxed pt-1 space-y-2 font-normal ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      <p>{currentQ.explanationVi}</p>
                      {currentQ.hasError && userSelectedWordIndex !== currentQ.errorTokenIndex && (
                        <p className="text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm">
                          Bạn chưa chọn đúng vị trí lỗi này.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Mẹo ghi nhớ (Ảnh 9) */}
                  {currentQ.tip && (
                    <div className={`border rounded-2xl p-4 flex items-start gap-2.5 text-xs sm:text-sm ${
                      isLight
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-[#0b171c] border-emerald-500/30 text-emerald-200'
                    }`}>
                      <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="leading-relaxed font-medium">
                        <strong className={isLight ? 'text-emerald-800 font-black' : 'text-emerald-300 font-black'}>Mẹo:</strong> {currentQ.tip}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================= 3. CÁC NÚT HÀNH ĐỘNG DƯỚI CARD ================= */}
            {/* Ở Bước 1: 2 Nút "Có lỗi" & "Đúng" (Ảnh 5) */}
            {stepState === 'initial' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleDecision('has_error')}
                  className="py-4 px-6 rounded-2xl bg-[#e11d48] hover:bg-[#be123c] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Có lỗi</span>
                </button>

                <button
                  onClick={() => handleDecision('correct')}
                  className="py-4 px-6 rounded-2xl bg-[#00c950] hover:bg-[#00b046] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>Đúng</span>
                </button>
              </div>
            )}

            {/* Ở Bước 4: Nút "Câu tiếp theo →" (Ảnh 6 & Ảnh 9) */}
            {stepState === 'result' && (
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 px-6 rounded-2xl bg-[#00c950] hover:bg-[#00b046] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <span>
                  {currentIdx + 1 < questions.length ? 'Câu tiếp theo →' : 'Xem kết quả tổng kết →'}
                </span>
              </button>
            )}
          </div>
        ) : (
          /* ================= MÀN HÌNH TỔNG KẾT SAU 10 CÂU ================= */
          <div className={`w-full max-w-md border rounded-3xl p-6 sm:p-8 text-center space-y-6 my-auto ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 shadow-xl'
              : 'bg-[#121c2b] border-[#1e2d42] text-white shadow-2xl'
          }`}>
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner border ${
              isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              🦉
            </div>

            <div className="space-y-1">
              <h2 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Hoàn thành lượt luyện!</h2>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Bạn vừa rèn luyện 10 câu tìm lỗi ngữ pháp theo chuẩn Bibung.com.
              </p>
            </div>

            {/* Thẻ chỉ số */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`border rounded-2xl p-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b0f17] border-[#1e2d42]'
              }`}>
                <p className={`text-[10px] sm:text-xs font-bold uppercase ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>Chính xác</p>
                <p className="text-2xl font-black text-emerald-500 mt-1">
                  {score} / {questions.length}
                </p>
              </div>
              <div className={`border rounded-2xl p-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b0f17] border-[#1e2d42]'
              }`}>
                <p className={`text-[10px] sm:text-xs font-bold uppercase ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>Kim cương</p>
                <p className="text-2xl font-black text-amber-500 mt-1 flex items-center justify-center gap-1">
                  <Gem className="w-5 h-5 text-amber-500" />
                  <span>+{diamondsEarned}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={startNewRound}
                className="w-full py-3.5 rounded-2xl bg-[#00c950] hover:bg-[#00b046] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Luyện tiếp 10 câu mới</span>
              </button>

              <Link
                href="/practice"
                className={`block w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base cursor-pointer border transition-colors ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    : 'bg-[#1a2638] hover:bg-[#223249] border-[#24344d] text-slate-300 hover:text-white'
                }`}
              >
                Quay về Luyện tập
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* ================= 4. POPUP HƯỚNG DẪN 4 BƯỚC (Chuẩn 100% Ảnh 1 - 4) ================= */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md border rounded-3xl p-6 sm:p-7 shadow-2xl relative flex flex-col justify-between ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-[#131b2a] border-[#24344d] text-white'
          }`}>
            {/* Nút đóng ✕ góc trên bên phải */}
            <button
              onClick={() => setShowGuideModal(false)}
              className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                  : 'bg-[#1e2b40] hover:bg-[#283954] text-slate-400 hover:text-white'
              }`}
              title="Đóng hướng dẫn"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Tranh minh họa Thám tử & Kính lúp (Ảnh 1-4) */}
            <DetectiveIllustration className="w-48 h-36 mx-auto mt-2" />

            {/* NỘI DUNG TỪNG SLIDE */}
            <div className="min-h-[170px] flex flex-col justify-center">
              {/* SLIDE 1: GIỚI THIỆU TÌM LỖI (Ảnh 1) */}
              {guideStep === 0 && (
                <div className="text-center space-y-3">
                  <h3 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Tìm lỗi</h3>
                  <p className={`text-sm sm:text-base font-semibold leading-relaxed ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    <strong className={isLight ? 'text-emerald-700' : 'text-emerald-400'}>Tìm lỗi</strong> giúp bạn luyện phản xạ ngữ pháp bằng cách nhận diện và sửa những lỗi thường gặp trong câu tiếng Anh.
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Mỗi lượt gồm 10 câu ngắn, theo nhiều chủ đề và cấp độ. Hãy đọc kỹ câu trước khi chọn đáp án.
                  </p>
                </div>
              )}

              {/* SLIDE 2: CÁCH CHƠI (Ảnh 2) */}
              {guideStep === 1 && (
                <div className="space-y-3">
                  <h3 className={`text-2xl font-black text-center ${isLight ? 'text-slate-900' : 'text-white'}`}>Cách chơi</h3>

                  <div className="space-y-2">
                    {/* Mục 1 */}
                    <div className={`border rounded-2xl p-3 flex items-start gap-3 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1a2538] border-[#24344d]'
                    }`}>
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        1
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Nhận định câu</h4>
                        <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Chọn “Có lỗi” nếu câu sai, hoặc “Đúng” nếu câu đã chính xác.
                        </p>
                      </div>
                    </div>

                    {/* Mục 2 */}
                    <div className={`border rounded-2xl p-3 flex items-start gap-3 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1a2538] border-[#24344d]'
                    }`}>
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        2
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Chỉ ra vị trí lỗi</h4>
                        <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Khi câu có lỗi, chạm vào từ hoặc cụm từ cần sửa.
                        </p>
                      </div>
                    </div>

                    {/* Mục 3 */}
                    <div className={`border rounded-2xl p-3 flex items-start gap-3 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1a2538] border-[#24344d]'
                    }`}>
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        3
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Chọn cách sửa</h4>
                        <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Chọn phương án thay thế đúng để hoàn thành câu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 3: HỌC TỪ ĐÁP ÁN (Ảnh 3) */}
              {guideStep === 2 && (
                <div className="space-y-4">
                  <h3 className={`text-2xl font-black text-center ${isLight ? 'text-slate-900' : 'text-white'}`}>Học từ đáp án</h3>

                  <div className={`border rounded-2xl p-5 ${
                    isLight
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-[#0f2324] border-emerald-500/30 text-slate-300'
                  }`}>
                    <p className="text-sm sm:text-base leading-relaxed font-medium">
                      Sau mỗi câu, xem lại câu đúng, bản dịch, giải thích và mẹo ghi nhớ. Bạn cũng có thể lưu đáp án vào ghi chú để ôn lại sau.
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 4: MẸO LUYỆN HIỆU QUẢ (Ảnh 4) */}
              {guideStep === 3 && (
                <div className="space-y-4">
                  <h3 className={`text-2xl font-black text-center ${isLight ? 'text-slate-900' : 'text-white'}`}>Mẹo luyện hiệu quả</h3>

                  <div className={`border rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm leading-relaxed font-medium ${
                    isLight
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-[#0f2324] border-emerald-500/30 text-slate-300'
                  }`}>
                    <p>• Đọc trọn câu và chú ý chủ ngữ, thì, giới từ và dạng từ.</p>
                    <p>• Đừng đoán theo cảm tính; hãy xác định chính xác phần khiến câu sai.</p>
                    <p>• Đọc kỹ giải thích sau mỗi câu để tránh lặp lại cùng một lỗi.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ĐIỀU KHIỂN CHUYỂN SLIDE (Dots & Buttons) */}
            <div className={`flex items-center justify-between pt-6 border-t mt-4 ${
              isLight ? 'border-slate-200' : 'border-[#1e2d42]/60'
            }`}>
              {/* 4 Dots indicator */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setGuideStep(dot)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      guideStep === dot
                        ? 'w-6 bg-emerald-500'
                        : isLight
                        ? 'w-2 bg-slate-300 hover:bg-slate-400'
                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {guideStep > 0 && (
                  <button
                    onClick={() => setGuideStep((prev) => prev - 1)}
                    className={`py-2.5 px-4 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-[#1e2b40] hover:bg-[#283954] text-white'
                    }`}
                  >
                    Quay lại
                  </button>
                )}

                {guideStep < 3 ? (
                  <button
                    onClick={() => setGuideStep((prev) => prev + 1)}
                    className="py-2.5 px-5 rounded-full bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs flex items-center gap-1 shadow-lg shadow-emerald-900/30 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <span>Tiếp tục</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowGuideModal(false)}
                    className="py-2.5 px-5 rounded-full bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs flex items-center gap-1 shadow-lg shadow-emerald-900/30 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <span>Đã rõ!</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. TOAST LƯU GHI CHÚ ================= */}
      {noteSavedToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 z-50">
          <Bookmark className="w-4 h-4 fill-white" />
          <span>Đã lưu câu hỏi vào sổ tay ôn tập!</span>
        </div>
      )}

      {/* ================= 6. MODAL BÁO LỖI CÂU HỎI ================= */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm border rounded-3xl p-6 space-y-4 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
              : 'bg-[#121c2b] border-[#1e2d42] text-white'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-black flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <Bug className="w-4 h-4 text-rose-500" />
                <span>Báo lỗi câu hỏi</span>
              </h4>
              <button
                onClick={() => {
                  setReportModalOpen(false);
                  setReportSent(false);
                }}
                className={isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!reportSent ? (
              <div className="space-y-3">
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Bạn nhận thấy vấn đề gì ở câu hỏi này?
                </p>
                <textarea
                  placeholder="Ví dụ: Đáp án chưa chính xác, lỗi chính tả, câu dịch chưa mượt..."
                  className={`w-full h-24 p-3 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 resize-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      : 'bg-[#0b0f17] border-[#1e2d42] text-white placeholder-slate-500'
                  }`}
                />
                <button
                  onClick={() => setReportSent(true)}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Gửi phản hồi
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Cảm ơn bạn đã đóng góp!</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Đội ngũ học thuật sẽ rà soát câu hỏi này sớm nhất.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
