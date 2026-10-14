'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  Volume2,
  Mic,
  Keyboard,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  Star,
  Search,
  RotateCcw,
  Languages,
  Play,
  Check,
  X,
  Clock,
  Eye,
} from 'lucide-react';
import { mockPresetWords } from '@/data/mockVocab';
import { mockDictationLessons } from '@/data/mockDictation';
import { mockChineseVocabulary } from '@/data/mockChineseVocab';
import { mockChineseLessons } from '@/data/mockChineseLessons';

export default function HomePage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const { targetLanguage, setTargetLanguage } = useLanguageStore();
  const { user, isAuthenticated } = useAuthStore();
  const isChinese = targetLanguage === 'zh';

  // State cho bộ tra từ điển nhanh
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<typeof mockPresetWords[0] | null>(null);
  const [searchResultZh, setSearchResultZh] = useState<typeof mockChineseVocabulary[0] | null>(null);

  // State cho Interactive Mini Practice Widget ("Góc Thử Thách 60 Giây Hôm Nay")
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [showDictationInput, setShowDictationInput] = useState<boolean>(false);
  const [dictationInputValue, setDictationInputValue] = useState<string>('');
  const [dictationFeedback, setDictationFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Target sentence for Mini Practice Widget
  const targetSentenceEn = "I used to think learning a new language was impossible, but consistency changes everything.";
  const targetSentenceZh = "只要你每天坚持练习Shadowing，你的口语一定会说得非常好！";
  const targetMeaningEn = "Tôi từng nghĩ rằng việc học một ngôn ngữ mới là bất khả thi, nhưng sự kiên trì đã thay đổi tất cả.";
  const targetMeaningZh = "Chỉ cần bạn mỗi ngày kiên trì luyện tập Shadowing, khẩu ngữ của bạn nhất định sẽ nói rất chuẩn!";

  const activeTargetSentence = isChinese ? targetSentenceZh : targetSentenceEn;
  const activeTargetMeaning = isChinese ? targetMeaningZh : targetMeaningEn;

  // Reset khi đổi ngôn ngữ
  useEffect(() => {
    setShowTranslation(false);
    setShowDictationInput(false);
    setDictationInputValue('');
    setDictationFeedback(null);
    setSearchQuery('');
    setSearchResult(null);
    setSearchResultZh(null);
  }, [targetLanguage]);

  const speakAudio = (text: string, customLang?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const isZh = customLang === 'zh-CN' || isChinese || /[一-龥]/.test(text);
      utterance.lang = isZh ? 'zh-CN' : 'en-US';
      utterance.rate = playbackSpeed;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayPracticeAudio = () => {
    speakAudio(activeTargetSentence, isChinese ? 'zh-CN' : 'en-US');
  };

  const handleTriggerRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech. Hãy thử trên Google Chrome hoặc Edge!');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = isChinese ? 'zh-CN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      alert(`🎉 Đã nghe thấy bạn nói: "${transcript}"\nKhẩu ngữ của bạn phát âm rất tự tin! +10 XP ⚡`);
    };

    recognition.start();
  };

  const handleCheckDictation = () => {
    if (!dictationInputValue.trim()) return;
    const cleanUser = dictationInputValue.trim().toLowerCase().replace(/[^a-z0-9一-龥]/gi, '');
    const cleanTarget = activeTargetSentence.trim().toLowerCase().replace(/[^a-z0-9一-龥]/gi, '');

    if (cleanUser === cleanTarget) {
      setDictationFeedback({
        isCorrect: true,
        message: '🎉 Chính xác 100%! Tai nghe của bạn cực kỳ nhạy bén! +20 XP ⚡',
      });
      speakAudio(isChinese ? '太棒了！' : 'Excellent work!');
    } else {
      setDictationFeedback({
        isCorrect: false,
        message: '⚠️ Có chút khác biệt nhỏ. Hãy nghe lại lần nữa và kiểm tra từng từ nhé!',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toLowerCase();
    if (isChinese) {
      const found = mockChineseVocabulary.find(
        (w) =>
          w.hanzi.includes(q) ||
          w.pinyin.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          w.sinoVietnamese.toLowerCase().includes(q)
      );
      setSearchResultZh(found || mockChineseVocabulary[0]);
    } else {
      const found = mockPresetWords.find(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q)
      );
      setSearchResult(found || mockPresetWords[0]);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* 1. WELCOME NOTEBOOK BANNER WITH YELLOW HIGHLIGHT STICKER (NhaiHSK Style)  */}
      {/* ========================================================================= */}
      <div className="relative bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 md:p-8 box-sketch overflow-hidden transition-all">
        {/* Washi tape label at top-left */}
        <div className="absolute -top-3 left-8 washi-tape-yellow px-4 py-1 rounded rotate-[-2deg] z-10 flex items-center gap-1.5">
          <span className="text-sm">📒</span>
          <span className="font-cartoon text-xs font-black text-stone-900 uppercase tracking-wider">
            {isChinese ? 'Vở Ghi Chép Nhại Giọng HSK' : 'Vở Ghi Chép Nhại Giọng'}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
          <div className="flex flex-col space-y-3 max-w-2xl">
            {/* Header with sticker highlight */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-3xl shadow-[3px_3px_0px_#292524] shrink-0">
                🐼
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-cartoon text-2xl md:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                    Chào bạn
                  </span>
                  <span className="inline-block bg-[#f6b73c] px-3 py-0.5 rounded-lg border-2 border-stone-800 shadow-[2px_2px_0px_#292524] font-cartoon text-2xl md:text-3xl font-black text-stone-900 -rotate-1">
                    {isAuthenticated ? user?.fullName || user?.username || 'Micky!' : 'Micky!'}
                  </span>
                  <span className="text-2xl animate-bounce">👋</span>
                </div>
                <p className="font-hand text-base sm:text-lg text-stone-600 dark:text-amber-300/80 mt-0.5">
                  Hôm nay là thời điểm tuyệt vời để mở miệng nhại theo người bản xứ!
                </p>
              </div>
            </div>

            <p className="text-stone-700 dark:text-stone-300 text-sm md:text-base leading-relaxed font-body">
              Học ngoại ngữ tự nhiên như một đứa trẻ bằng phương pháp{' '}
              <strong className="bg-amber-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700 font-bold text-stone-900 dark:text-amber-300">
                Nhại giọng (Shadowing)
              </strong>,{' '}
              <strong className="bg-amber-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700 font-bold text-stone-900 dark:text-amber-300">
                Nghe chép chính tả (Dictation)
              </strong> và{' '}
              <strong className="bg-amber-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700 font-bold text-stone-900 dark:text-amber-300">
                Lặp lại ngắt quãng (SM-2)
              </strong>. Không gò bó ngữ pháp, mỗi ngày 15 phút là nói trôi chảy.
            </p>

            {/* Language buttons & Student club */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex p-1 bg-[#ede4d3] dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-600 rounded-xl shadow-[2px_2px_0px_#292524] gap-1">
                <button
                  type="button"
                  onClick={() => setTargetLanguage('en')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                    !isChinese
                      ? 'bg-amber-300 text-stone-900 border border-stone-800 shadow-[1.5px_1.5px_0px_#292524]'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>Tiếng Anh (Micky)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetLanguage('zh')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                    isChinese
                      ? 'bg-[#c53428] text-white border border-stone-800 shadow-[1.5px_1.5px_0px_#292524]'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <span>🇨🇳</span>
                  <span>Tiếng Trung (HSK)</span>
                </button>
              </div>

              <Link
                href="/roadmap"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#fff4de] dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all cursor-pointer"
              >
                <span>🚀</span>
                <span>Xem Lộ Trình Toàn Diện: <strong>4 Chặng</strong></span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mini Daily Goal Notebook Widget on Right */}
          <div className="p-4 rounded-xl bg-[#faf4e8] dark:bg-[#221c17] border-2 border-stone-800 box-sketch-sm flex flex-col items-center justify-center text-center w-full lg:w-44 shrink-0">
            <div className="w-14 h-14 rounded-full bg-amber-300 border-2 border-stone-800 flex items-center justify-center font-cartoon font-black text-xl text-stone-900 shadow-[2px_2px_0px_#292524] mb-2">
              72%
            </div>
            <span className="font-cartoon text-xs font-black text-stone-800 dark:text-amber-300 uppercase tracking-tight">
              Tiến độ hôm nay
            </span>
            <span className="font-hand text-sm text-stone-600 dark:text-stone-400 mt-0.5">
              18 / 25 phút nghe
            </span>
            <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-800 border border-stone-800 mt-2 overflow-hidden p-0.5">
              <div className="h-full bg-[#c53428] rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HAND-DRAWN PROGRESS RESUME BAR (Ảnh Lộ trình NhaiHSK)                   */}
      {/* ========================================================================= */}
      <div className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-4 md:p-5 box-sketch">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 border-2 border-stone-800 flex items-center justify-center text-xl shadow-[2px_2px_0px_#292524] shrink-0">
              🚩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cartoon text-base md:text-lg font-bold text-stone-900 dark:text-white">
                  Hành trình của bạn
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#c53428] text-white font-cartoon text-[11px] font-bold border border-stone-800">
                  🔥 Streak 7 ngày
                </span>
              </div>
              <p className="font-hand text-base text-stone-700 dark:text-stone-300 mt-0.5">
                Bạn đang ở: <strong className="text-stone-900 dark:text-white font-bold font-cartoon text-sm">
                  {isChinese
                    ? 'Chặng 1 • Bảng Ngữ Âm Pinyin & 214 Bộ Thủ'
                    : 'Bài 4 • Shadowing "Friends" Season 1 - The Thumb'}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-hand text-sm text-stone-600 dark:text-stone-400">Đã xong: 65% bài học</span>
              <div className="w-32 h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-800 mt-1 overflow-hidden p-0.5">
                <div className="bg-[#c53428] h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <Link
              href={isChinese ? "/dictation-shadowing" : "/dictation-shadowing"}
              className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#292524] hover:bg-[#c53428] text-amber-200 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Tiếp tục học ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION TITLE WITH CARTOON HIGHLIGHT STICKER                           */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#f6b73c] px-3.5 py-1 rounded-lg border-2 border-stone-800 shadow-[2px_2px_0px_#292524] -rotate-1 flex items-center gap-1.5">
            <span className="text-base">📌</span>
            <h2 className="font-cartoon text-lg md:text-xl font-black text-stone-900">
              {isChinese ? 'Lộ Trình Học HSK Trọng Tâm' : 'Lộ Trình Học Trọng Tâm'}
            </h2>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#f0e6d6] dark:bg-stone-800 border border-stone-800 font-hand text-sm text-stone-700 dark:text-stone-300">
            Mỗi ngày 15 phút vui học
          </span>
        </div>
        <Link
          href="/roadmap"
          className="font-hand text-base text-[#c53428] dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
        >
          <span>Xem sơ đồ chi tiết ➔</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 4. 6 MAIN METHOD CARDS (NHAIHSK RETRO VERMILION CARTOON TEXTURE CARDS)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: IPA & Pinyin */}
        <Link
          href={isChinese ? "/practice/pinyin-radicals" : "/practice"}
          className="group relative rounded-2xl overflow-hidden box-sketch flex flex-col justify-between cursor-pointer btn-press transition-transform hover:-translate-y-0.5"
        >
          <div className="paper-texture-red p-5 text-white relative flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="washi-tape-yellow px-2 py-0.5 rounded font-cartoon text-[11px] font-black text-stone-900 uppercase">
                Nhập môn
              </span>
              <span className="text-2xl">🗣️</span>
            </div>
            <h3 className="font-cartoon text-xl font-black text-white tracking-tight mb-1.5 group-hover:text-amber-200 transition-colors">
              {isChinese ? 'Phát Âm Pinyin & Bộ Thủ' : 'Phát Âm IPA & Pinyin'}
            </h3>
            <p className="font-hand text-base text-white/95 leading-snug">
              {isChinese
                ? 'Nền tảng chuẩn hóa 23 thanh mẫu, vận mẫu, 4 thanh điệu Pinyin và 214 Bộ thủ Khang Hy kèm audio Bắc Kinh.'
                : 'Nền tảng chuẩn hóa 44 âm IPA tiếng Anh và bảng phiên âm thanh mẫu, vận mẫu tiếng Trung kèm video khẩu hình dễ hiểu.'}
            </p>
          </div>
          <div className="bg-[#f6b73c] border-t-2 border-stone-800 px-4 py-2.5 flex items-center justify-between text-stone-900">
            <span className="font-cartoon text-xs font-bold tracking-tight">
              {isChinese ? '23 thanh mẫu • 214 bộ thủ' : '120 bài tập • 45 video khẩu hình'}
            </span>
            <span className="font-cartoon text-xs font-black group-hover:translate-x-1 transition-transform">
              Vào học ➔
            </span>
          </div>
        </Link>

        {/* CARD 2: Shadowing */}
        <Link
          href="/dictation-shadowing?mode=shadowing"
          className="group relative rounded-2xl overflow-hidden box-sketch flex flex-col justify-between cursor-pointer btn-press transition-transform hover:-translate-y-0.5"
        >
          <div className="paper-texture-red p-5 text-white relative flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-amber-300 border-2 border-stone-800 text-stone-900 px-2 py-0.5 rounded font-cartoon text-[11px] font-black uppercase">
                ⭐ Phổ biến nhất
              </span>
              <span className="text-2xl">🎙️</span>
            </div>
            <h3 className="font-cartoon text-xl font-black text-white tracking-tight mb-1.5 group-hover:text-amber-200 transition-colors">
              Nhại Giọng Shadowing
            </h3>
            <p className="font-hand text-base text-white/95 leading-snug">
              {isChinese
                ? 'Luyện dẻo cơ miệng theo khẩu ngữ đời thực, phim hoạt hình và talkshow với phụ đề 3 dòng Hanzi + Pinyin + Tiếng Việt.'
                : 'Luyện dẻo cơ miệng, bắt chước từng ngữ điệu, luyến âm chuẩn bản xứ với vòng lặp A-B vui nhộn từng câu một.'}
            </p>
          </div>
          <div className="bg-[#f6b73c] border-t-2 border-stone-800 px-4 py-2.5 flex items-center justify-between text-stone-900">
            <span className="font-cartoon text-xs font-bold tracking-tight">
              1.250 câu nhại • Chấm dẻo giọng
            </span>
            <span className="font-cartoon text-xs font-black group-hover:translate-x-1 transition-transform">
              Vào học ➔
            </span>
          </div>
        </Link>

        {/* CARD 3: Dictation */}
        <Link
          href="/dictation-shadowing?mode=dictation"
          className="group relative rounded-2xl overflow-hidden box-sketch flex flex-col justify-between cursor-pointer btn-press transition-transform hover:-translate-y-0.5"
        >
          <div className="paper-texture-red p-5 text-white relative flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="washi-tape-yellow px-2 py-0.5 rounded font-cartoon text-[11px] font-black text-stone-900 uppercase">
                Mài sắc đôi tai
              </span>
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="font-cartoon text-xl font-black text-white tracking-tight mb-1.5 group-hover:text-amber-200 transition-colors">
              Nghe Chép Dictation
            </h3>
            <p className="font-hand text-base text-white/95 leading-snug">
              Mài sắc đôi tai bắt từng từ ngữ. Hệ thống tự động so khớp, gạch chân lỗi chính tả và gợi ý nối âm chi tiết dứt câu.
            </p>
          </div>
          <div className="bg-[#f6b73c] border-t-2 border-stone-800 px-4 py-2.5 flex items-center justify-between text-stone-900">
            <span className="font-cartoon text-xs font-bold tracking-tight">
              850 đoạn audio • Chấm câu chi tiết
            </span>
            <span className="font-cartoon text-xs font-black group-hover:translate-x-1 transition-transform">
              Vào học ➔
            </span>
          </div>
        </Link>

        {/* CARD 4: Word Order Game */}
        <Link
          href="/tro-choi"
          className="group relative rounded-2xl overflow-hidden box-sketch flex flex-col justify-between cursor-pointer btn-press transition-transform hover:-translate-y-0.5"
        >
          <div className="paper-texture-red p-5 text-white relative flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="washi-tape-yellow px-2 py-0.5 rounded font-cartoon text-[11px] font-black text-stone-900 uppercase">
                Vừa học vừa chơi
              </span>
              <span className="text-2xl">🧩</span>
            </div>
            <h3 className="font-cartoon text-xl font-black text-white tracking-tight mb-1.5 group-hover:text-amber-200 transition-colors">
              {isChinese ? 'Xếp Câu Chữ Hán' : 'Xếp Từ Phản Xạ'}
            </h3>
            <p className="font-hand text-base text-white/95 leading-snug">
              Game hóa cấu trúc câu: Chọn các mảnh từ vựng theo trật tự tự nhiên, sai bị rung lắc cảnh báo đỏ, đúng bay lên vị trí.
            </p>
          </div>
          <div className="bg-[#f6b73c] border-t-2 border-stone-800 px-4 py-2.5 flex items-center justify-between text-stone-900">
            <span className="font-cartoon text-xs font-bold tracking-tight">
              620 màn thử thách • Leo rank tuần
            </span>
            <span className="font-cartoon text-xs font-black group-hover:translate-x-1 transition-transform">
              Vào chơi ➔
            </span>
          </div>
        </Link>

        {/* CARD 5: See & Write Reflex / Tập viết chữ Hán */}
        <Link
          href={isChinese ? "/practice/hanzi-writer" : "/practice/see-write"}
          className="group relative rounded-2xl overflow-hidden box-sketch flex flex-col justify-between cursor-pointer btn-press transition-transform hover:-translate-y-0.5"
        >
          <div className="paper-texture-red p-5 text-white relative flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="washi-tape-yellow px-2 py-0.5 rounded font-cartoon text-[11px] font-black text-stone-900 uppercase">
                {isChinese ? 'Xuất PDF in A4' : 'Phản xạ 5 giây'}
              </span>
              <span className="text-2xl">{isChinese ? '📝' : '⚡'}</span>
            </div>
            <h3 className="font-cartoon text-xl font-black text-white tracking-tight mb-1.5 group-hover:text-amber-200 transition-colors">
              {isChinese ? 'Tạo Vở Viết Ô Mễ/Điền' : 'Phản Xạ See & Write'}
            </h3>
            <p className="font-hand text-base text-white/95 leading-snug">
              {isChinese
                ? 'Tự động tạo vở luyện viết chữ Hán ô Mễ (米字格) và ô Điền (田字格), chữ mờ tô theo nét bút thuận xuất file in A4.'
                : 'Màn hình hiển thị ý nghĩa tiếng Việt hoặc hình ảnh, bạn gõ lại câu hoàn chỉnh bằng ngoại ngữ trong áp lực thời gian.'}
            </p>
          </div>
          <div className="bg-[#f6b73c] border-t-2 border-stone-800 px-4 py-2.5 flex items-center justify-between text-stone-900">
            <span className="font-cartoon text-xs font-bold tracking-tight">
              {isChinese ? 'Chuẩn in ấn A4 • Nét bút thuận' : '450 tình huống đời thực'}
            </span>
            <span className="font-cartoon text-xs font-black group-hover:translate-x-1 transition-transform">
              Vào học ➔
            </span>
          </div>
        </Link>

        {/* CARD 6: Exam Prep (TOEIC / IELTS / HSK) */}
        <Link
          href="/kho-de"
          className="group relative rounded-2xl overflow-hidden box-sketch flex flex-col justify-between cursor-pointer btn-press transition-transform hover:-translate-y-0.5"
        >
          <div className="paper-texture-red p-5 text-white relative flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-amber-300 border-2 border-stone-800 text-stone-900 px-2 py-0.5 rounded font-cartoon text-[11px] font-black uppercase">
                Cấp tốc chứng chỉ
              </span>
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="font-cartoon text-xl font-black text-white tracking-tight mb-1.5 group-hover:text-amber-200 transition-colors">
              {isChinese ? 'Phòng Thi HSK 1–6 & HSKK' : 'Luyện Thi Chứng Chỉ'}
            </h3>
            <p className="font-hand text-base text-white/95 leading-snug">
              {isChinese
                ? 'Đề thi thử HSK 1 đến 6 và đề thi khẩu ngữ HSKK chuẩn 200 điểm. Luyện đề tự do hoặc thi thử bấm giờ tự nộp.'
                : 'Kho bài thi TOEIC Listening 450-800+, IELTS Dictation Cam 10-18 và toàn bộ 3.544 câu hỏi Oxford trắc nghiệm.'}
            </p>
          </div>
          <div className="bg-[#f6b73c] border-t-2 border-stone-800 px-4 py-2.5 flex items-center justify-between text-stone-900">
            <span className="font-cartoon text-xs font-bold tracking-tight">
              {isChinese ? 'HSK 1–6 & HSKK khẩu ngữ' : '503+ đề thi chuẩn format'}
            </span>
            <span className="font-cartoon text-xs font-black group-hover:translate-x-1 transition-transform">
              Vào thi ➔
            </span>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE MINI PRACTICE WIDGET ("Góc Thử Thách 60 Giây Hôm Nay")     */}
      {/* ========================================================================= */}
      <div className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 md:p-8 box-sketch relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-950/80 border-2 border-stone-800 text-stone-900 dark:text-amber-200 font-cartoon text-xs font-bold">
              <span>⚡</span>
              <span>Góc Thử Thách 60 Giây Hôm Nay</span>
            </div>
            <h3 className="font-cartoon text-xl md:text-2xl font-bold text-stone-900 dark:text-white">
              {isChinese ? 'Luyện khẩu ngữ với câu thoại tiếng Trung đời thực' : 'Luyện phản xạ với câu thoại nổi tiếng'}
            </h3>
            <p className="font-hand text-sm md:text-base text-stone-600 dark:text-stone-400">
              Nghe câu nói, nhấn nút thu âm để nhại lại hoặc gõ lại câu để kiểm tra chính tả.
            </p>
          </div>

          {/* Speed controller */}
          <div className="flex items-center gap-1.5 bg-[#ede4d3] dark:bg-stone-800 border-2 border-stone-800 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#292524]">
            <span className="font-cartoon text-xs font-bold text-stone-800 dark:text-stone-300">Tốc độ:</span>
            {[0.8, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-0.5 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-amber-400 text-stone-900 border border-stone-800 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Active Sentence Card Box */}
        <div className="p-5 rounded-2xl bg-[#fff9ea] dark:bg-[#221c17] border-2 border-stone-800 box-sketch-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-cartoon text-xs text-stone-600 dark:text-stone-400 font-bold">
              {isChinese ? 'Khẩu ngữ giao tiếp • HSK 1 - 2' : 'Trích đoạn TED Talk • Cấp độ B1-B2'}
            </span>
            <button
              type="button"
              onClick={() => setShowTranslation(!showTranslation)}
              className="font-cartoon text-xs text-[#c53428] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showTranslation ? 'Ẩn nghĩa' : 'Xem nghĩa tiếng Việt'}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="font-cartoon text-lg md:text-xl font-bold text-stone-900 dark:text-white leading-relaxed">
              "{activeTargetSentence}"
            </p>
            {showTranslation && (
              <p className="font-hand text-base md:text-lg text-stone-700 dark:text-stone-300 italic animate-fade-in">
                "{activeTargetMeaning}"
              </p>
            )}
          </div>

          {/* Action Triggers */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePlayPracticeAudio}
              className={`px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all flex items-center gap-2 cursor-pointer ${
                isPlayingAudio ? 'ring-2 ring-amber-500 animate-pulse' : ''
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Đang phát âm...' : 'Nghe phát âm bản xứ'}</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerRecording}
              className={`px-4 py-2 rounded-xl border-2 border-stone-800 font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press transition-all flex items-center gap-2 cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-bounce'
                  : 'bg-[#fffdfa] dark:bg-stone-800 hover:bg-[#c53428] hover:text-white text-stone-800 dark:text-stone-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'Đang lắng nghe bạn...' : 'Thu âm nhại giọng'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDictationInput(!showDictationInput)}
              className="px-4 py-2 rounded-xl bg-[#fffdfa] dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-2 border-stone-800 font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press transition-all flex items-center gap-2 cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
              <span>Gõ chép chính tả</span>
            </button>
          </div>

          {/* Expandable Dictation Input Area */}
          {showDictationInput && (
            <div className="pt-2 space-y-2 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  value={dictationInputValue}
                  onChange={(e) => setDictationInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCheckDictation();
                  }}
                  placeholder={
                    isChinese
                      ? 'Gõ lại câu tiếng Trung vừa nghe được vào đây...'
                      : 'Gõ lại câu tiếng Anh vừa nghe được vào đây...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-body text-sm border-2 border-stone-800 outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleCheckDictation}
                  className="absolute right-2 top-2 px-3.5 py-1 bg-[#c53428] hover:bg-[#b02c21] text-white font-cartoon text-xs font-bold rounded-lg border border-stone-800 shadow-sm cursor-pointer"
                >
                  Kiểm tra
                </button>
              </div>

              {dictationFeedback && (
                <div
                  className={`p-3 rounded-xl border-2 font-cartoon text-xs flex items-center gap-2 ${
                    dictationFeedback.isCorrect
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                      : 'bg-rose-100 text-rose-950 border-rose-600'
                  }`}
                >
                  {dictationFeedback.isCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                  <span>{dictationFeedback.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. LIVE DICTIONARY QUICK SEARCH (TRA TỪ ĐIỂN 100K+ CHUẨN SỔ TAY)           */}
      {/* ========================================================================= */}
      <div className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 box-sketch space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">📖</span>
          <div>
            <h3 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">
              Tra Cứu Từ Điển Nhanh
            </h3>
            <p className="font-hand text-sm text-stone-600 dark:text-stone-400">
              {isChinese
                ? 'Tìm kiếm trong hơn 5.400 từ vựng HSK 1 - 6 (Chữ Hán, Pinyin, Hán-Việt).'
                : 'Tìm kiếm trong hơn 100.000 từ vựng Oxford 3000 & từ vựng TOEIC/IELTS.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-full">
          <div className="relative flex items-center border-2 border-stone-800 rounded-2xl bg-white dark:bg-stone-900 shadow-[3px_3px_0px_#292524] p-1.5">
            <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isChinese
                  ? 'Tra cứu chữ Hán hoặc Pinyin (VD: 学习, 朋友, 汉语, nǐ hǎo...)'
                  : 'Gõ thử một từ tiếng Anh (VD: Accomplish, Resilient, Negotiate...)'
              }
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold px-3 text-stone-900 dark:text-white placeholder-stone-400"
            />
            <button
              type="submit"
              className={`px-5 py-2.5 text-white font-cartoon text-xs font-bold rounded-xl border border-stone-800 shadow-md transition-all shrink-0 cursor-pointer ${
                isChinese ? 'bg-[#c53428] hover:bg-[#b02c21]' : 'bg-[#292524] hover:bg-amber-600'
              }`}
            >
              Tra từ ngay
            </button>
          </div>
        </form>

        {/* Search result card */}
        {isChinese && searchResultZh && (
          <div className="p-4 rounded-xl border-2 border-stone-800 bg-[#fff9ea] dark:bg-[#221c17] space-y-2 animate-fade-in shadow-[2px_2px_0px_#292524]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-black text-[#c53428] font-serif">{searchResultZh.hanzi}</h4>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-bold font-mono">{searchResultZh.pinyin}</span>
                {searchResultZh.sinoVietnamese && (
                  <span className="text-xs text-stone-500 font-semibold font-cartoon">({searchResultZh.sinoVietnamese})</span>
                )}
                <button
                  type="button"
                  onClick={() => speakAudio(searchResultZh.hanzi, 'zh-CN')}
                  className="p-1 rounded-lg bg-amber-200 text-stone-900 border border-stone-800 hover:bg-amber-300 transition-colors cursor-pointer"
                  title="Phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-cartoon font-bold bg-[#c53428] text-white border border-stone-800">
                HSK {searchResultZh.hskLevel}
              </span>
            </div>
            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
              🇻🇳 Nghĩa: {searchResultZh.meaning}
            </p>
            {searchResultZh.exampleZh && (
              <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                "{searchResultZh.exampleZh}"
              </p>
            )}
          </div>
        )}

        {!isChinese && searchResult && (
          <div className="p-4 rounded-xl border-2 border-stone-800 bg-[#fff9ea] dark:bg-[#221c17] space-y-2 animate-fade-in shadow-[2px_2px_0px_#292524]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black text-amber-700 dark:text-amber-300 font-cartoon">{searchResult.word}</h4>
                <span className="text-xs text-stone-500 font-semibold">{searchResult.phonetic}</span>
                <button
                  type="button"
                  onClick={() => speakAudio(searchResult.word)}
                  className="p-1 rounded-lg bg-amber-200 text-stone-900 border border-stone-800 hover:bg-amber-300 transition-colors cursor-pointer"
                  title="Phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-cartoon font-bold bg-amber-400 text-stone-900 border border-stone-800">
                {searchResult.topic}
              </span>
            </div>
            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
              🇻🇳 Nghĩa: {searchResult.meaning}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 italic">
              "{searchResult.exampleEn}"
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 7. FEATURED VIDEO LESSONS ("Video Học Nhại Thịnh Hành")                   */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-7 bg-[#c53428] rounded-sm shadow-sm" />
            <h2 className="font-cartoon text-lg md:text-xl font-bold text-stone-900 dark:text-white">
              {isChinese ? 'Video Khẩu Ngữ Thịnh Hành' : 'Video Học Nhại Thịnh Hành'}
            </h2>
          </div>
          <Link
            href="/dictation-shadowing"
            className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-300 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả bài học</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(isChinese ? mockChineseLessons.slice(0, 3) : mockDictationLessons.slice(0, 3)).map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dictation-shadowing/${lesson.id}`}
              className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl overflow-hidden box-sketch hover:shadow-[6px_6px_0px_#292524] transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative h-44 bg-stone-900 overflow-hidden border-b-2 border-stone-800">
                <img
                  src={
                    lesson.thumbnail ||
                    (lesson.youtubeId ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg` : '') ||
                    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={lesson.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-stone-950/80 text-white font-cartoon text-[11px] font-bold border border-stone-700">
                  {Math.floor((lesson.duration || 60) / 60)}:{(lesson.duration || 60) % 60 < 10 ? '0' : ''}{(lesson.duration || 60) % 60}
                </div>
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-amber-400 border border-stone-800 text-stone-900 font-cartoon text-[10px] font-black uppercase">
                  {lesson.level || (isChinese ? 'HSK 1' : 'B1')}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <span className="font-cartoon text-xs text-[#c53428] dark:text-amber-400 font-bold">
                    {lesson.topic} • {lesson.sentences?.length || 5} câu nhại
                  </span>
                  <h4 className="font-cartoon text-sm font-bold text-stone-900 dark:text-white line-clamp-2 mt-1 group-hover:text-[#c53428] transition-colors">
                    {lesson.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-cartoon text-xs">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {lesson.views || '12.8k'} lượt học
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS & FINAL NOTEBOOK CALL TO ACTION                          */}
      {/* ========================================================================= */}
      <section className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 md:p-8 box-sketch text-center space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <h2 className="font-cartoon text-xl md:text-2xl font-bold text-stone-900 dark:text-white">
            Được tin tưởng bởi hơn 50.000+ bạn học viên
          </h2>
          <p className="font-hand text-base text-stone-600 dark:text-stone-400">
            Học nhẹ nhàng, không áp lực ngữ pháp, nhớ sâu tự nhiên qua âm thanh & hình ảnh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-[#fff9ea] dark:bg-[#221c17] border-2 border-stone-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 border border-stone-800 flex items-center justify-center font-cartoon font-bold text-xs text-stone-900">
                TH
              </div>
              <div>
                <p className="font-cartoon text-xs font-bold text-stone-900 dark:text-white">Trần Hoàng Linh</p>
                <p className="font-hand text-xs text-[#c53428]">Sinh viên ĐH Ngoại Thương • TOEIC 865</p>
              </div>
            </div>
            <p className="font-body text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              "Luyện Dictation dừng dứt câu và Shadowing mỗi ngày 15 phút giúp tai mình bắt âm tiếng Anh cực kỳ chuẩn, phản xạ nghe tăng vọt!"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fff9ea] dark:bg-[#221c17] border-2 border-stone-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-400 border border-stone-800 flex items-center justify-center font-cartoon font-bold text-xs text-stone-900">
                MQ
              </div>
              <div>
                <p className="font-cartoon text-xs font-bold text-stone-900 dark:text-white">Minh Quân</p>
                <p className="font-hand text-xs text-teal-700 dark:text-teal-400">HSK 5 • Đang làm việc tại Thượng Hải</p>
              </div>
            </div>
            <p className="font-body text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              "Tính năng tạo file in ô Mễ/Điền PDF và bài khoá đọc hiểu tra từ 1-chạm giống hệt phong cách NhaiHSK, học cực kỳ cuốn hút!"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fff9ea] dark:bg-[#221c17] border-2 border-stone-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-400 border border-stone-800 flex items-center justify-center font-cartoon font-bold text-xs text-white">
                KL
              </div>
              <div>
                <p className="font-cartoon text-xs font-bold text-stone-900 dark:text-white">Khánh Linh</p>
                <p className="font-hand text-xs text-[#c53428]">IELTS Band 7.5</p>
              </div>
            </div>
            <p className="font-body text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              "Game xếp từ và giao diện vở vẽ hoạt hình rất thân thiện, học không hề buồn ngủ như các sách giáo trình truyền thống."
            </p>
          </div>
        </div>

        {/* Final CTA button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/roadmap"
            className="px-6 py-3 bg-[#c53428] hover:bg-[#b02c21] text-white font-cartoon text-xs sm:text-sm font-bold rounded-xl border-2 border-stone-800 shadow-[3px_3px_0px_#292524] btn-press transition-all"
          >
            Bắt đầu học theo lộ trình miễn phí →
          </Link>

          <Link
            href="/dictation-shadowing"
            className="px-5 py-3 bg-amber-300 hover:bg-amber-400 text-stone-900 font-cartoon text-xs sm:text-sm font-bold rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all"
          >
            Luyện nhại giọng ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
