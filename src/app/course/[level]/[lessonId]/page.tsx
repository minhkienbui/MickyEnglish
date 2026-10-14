'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Volume2,
  Bookmark,
  Star,
  Flag,
  RotateCcw,
  Check,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Play,
  Pause,
  Eye,
  EyeOff,
  Settings,
  HelpCircle,
  Keyboard,
  Award,
  Zap,
} from 'lucide-react';
import { HSK_BOOKS, HskLesson, HskLessonWord } from '@/data/hskLessonsData';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useVocabStore } from '@/stores/useVocabStore';
import { useThemeStore } from '@/stores/useThemeStore';

type StudyMode =
  | 'flashcard'
  | 'quiz'
  | 'typing'
  | 'reading'
  | 'sentence-builder'
  | 'hanzi-dance'
  | 'battle';

export default function LessonStudyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const levelSlug = (params.level as string) || 'hsk1';
  const lessonId = (params.lessonId as string) || 'bai-1';

  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const { addWord } = useVocabStore();

  const book = HSK_BOOKS[levelSlug] || HSK_BOOKS.hsk1;
  const lesson: HskLesson =
    book.lessons.find((l) => l.id === lessonId) || book.lessons[0];

  const words = lesson.words;

  // Active study mode
  const [activeMode, setActiveMode] = useState<StudyMode>('flashcard');
  const [showPinyinOverall, setShowPinyinOverall] = useState(true);

  // ----------------------------------------------------
  // MODE 1: FLASHCARD STATE
  // ----------------------------------------------------
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardTab, setFlashcardTab] = useState<'word' | 'example'>('word');
  const [knownWordIds, setKnownWordIds] = useState<Set<string>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentWord: HskLessonWord = words[cardIdx] || words[0];

  // ----------------------------------------------------
  // MODE 2: TRẮC NGHIỆM (QUIZ) STATE
  // ----------------------------------------------------
  const [quizSubtype, setQuizSubtype] = useState<'pinyin' | 'vocab' | 'meaning'>('pinyin');
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<string | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);

  const currentQuizWord = words[quizIdx] || words[0];

  // Generate 4 choices for Quiz
  const quizChoices = useMemo(() => {
    const correct = currentQuizWord;
    const others = words.filter((w) => w.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const pool = [correct, ...others].sort(() => Math.random() - 0.5);
    return pool;
  }, [quizIdx, words, currentQuizWord]);

  // ----------------------------------------------------
  // MODE 3: GÕ TỪ (TYPING) STATE
  // ----------------------------------------------------
  const [typingSubtype, setTypingSubtype] = useState<'pinyin' | 'sinoVi' | 'hanzi'>('pinyin');
  const [typingIdx, setTypingIdx] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [typingFeedback, setTypingFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [revealedHintCount, setRevealedHintCount] = useState(0);

  const currentTypingWord = words[typingIdx] || words[0];

  // ----------------------------------------------------
  // MODE 4: NGHE GHÉP CÂU (SENTENCE BUILDER) STATE
  // ----------------------------------------------------
  const [sentenceSubtype, setSentenceSubtype] = useState<'tiles' | 'typing'>('tiles');
  const [sentenceSpeed, setSentenceSpeed] = useState<number>(1.0);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [typedSentenceInput, setTypedSentenceInput] = useState('');
  const [sentenceFeedback, setSentenceFeedback] = useState<boolean | null>(null);

  const currentSentenceWord = words[sentenceIdx] || words[0];
  const targetExampleSentence = currentSentenceWord.exampleZh || currentSentenceWord.hanzi;

  // Split sentence into tiles
  const sentenceTilesPool = useMemo(() => {
    const raw = targetExampleSentence.replace(/[，。！？、；：]/g, ' ').trim().split(/\s+/).filter(Boolean);
    const tiles = raw.length > 1 ? raw : Array.from(targetExampleSentence).filter((c) => c.trim().length > 0);
    return [...tiles].sort(() => Math.random() - 0.5);
  }, [targetExampleSentence]);

  // ----------------------------------------------------
  // MODE 5: ĐỌC HIỂU (READING QUIZ) STATE
  // ----------------------------------------------------
  const [readingIdx, setReadingIdx] = useState(0);
  const [selectedReadingChoice, setSelectedReadingChoice] = useState<string | null>(null);
  const [showReadingMeaning, setShowReadingMeaning] = useState(true);

  const currentReadingWord = words[readingIdx] || words[0];

  const readingSentencePrompt = useMemo(() => {
    const ex = currentReadingWord.exampleZh || `你好，我是${currentReadingWord.hanzi}。`;
    const blanked = ex.replace(currentReadingWord.hanzi, '___');
    return {
      sentence: blanked,
      pinyin: currentReadingWord.examplePinyin || currentReadingWord.pinyin,
      meaning: currentReadingWord.exampleVi || currentReadingWord.meaning,
      correctHanzi: currentReadingWord.hanzi,
    };
  }, [currentReadingWord]);

  const readingChoices = useMemo(() => {
    const correct = currentReadingWord.hanzi;
    const others = words.filter((w) => w.hanzi !== correct).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.hanzi);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }, [currentReadingWord, words]);

  // Text-To-Speech helper
  const speakText = (text: string, rate: number = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Convert numbers to tone accents (e.g. ni3 -> nǐ)
  const formatPinyinWithTones = (str: string) => {
    const toneMap: Record<string, string> = {
      a1: 'ā', a2: 'á', a3: 'ǎ', a4: 'à',
      e1: 'ē', e2: 'é', e3: 'ě', e4: 'è',
      i1: 'ī', i2: 'í', i3: 'ǐ', i4: 'ì',
      o1: 'ō', o2: 'ó', o3: 'ǒ', o4: 'ò',
      u1: 'ū', u2: 'ú', u3: 'ǔ', u4: 'ù',
      v1: 'ǖ', v2: 'ǘ', v3: 'ǚ', v4: 'ǜ',
    };
    return str.replace(/([aeiouv])([1-4])/gi, (_, v, t) => toneMap[`${v.toLowerCase()}${t}`] || v);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIdx((prev) => (prev + 1) % words.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIdx((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleMarkKnown = (known: boolean) => {
    const next = new Set(knownWordIds);
    if (known) {
      next.add(currentWord.id);
    } else {
      next.delete(currentWord.id);
    }
    setKnownWordIds(next);
    handleNextCard();
  };

  const handleSaveAllToSrs = () => {
    words.forEach((w) => {
      addWord({
        word: w.hanzi,
        phonetic: w.pinyin,
        meaning: `${w.sinoVietnamese ? `[${w.sinoVietnamese}] ` : ''}${w.meaning}`,
        exampleEn: w.exampleZh || w.hanzi,
        exampleVi: w.exampleVi || w.meaning,
        topic: `${book.title} • ${lesson.title}`,
      });
    });
    alert(`✓ Đã thêm toàn bộ ${words.length} từ vựng của bài vào Sổ tay Ôn tập Flashcard!`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6 font-sans">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/course/${levelSlug}`}
          className="inline-flex items-center gap-1.5 font-cartoon text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#c53428] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách bài</span>
        </Link>

        {/* Sovereignty Banner & Pinyin Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="font-cartoon text-[11px] uppercase tracking-wider text-[#c53428] font-black">
              HOÀNG SA, TRƯỜNG SA LÀ CỦA VIỆT NAM
            </p>
          </div>

          <button
            onClick={() => setShowPinyinOverall(!showPinyinOverall)}
            className={`px-3 py-1.5 rounded-xl font-cartoon text-xs font-bold border-2 border-stone-800 flex items-center gap-1.5 transition-all cursor-pointer ${
              showPinyinOverall
                ? 'bg-amber-300 text-stone-900 shadow-[2px_2px_0px_#292524]'
                : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-600 shadow-xs'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>拼 Pinyin</span>
          </button>
        </div>
      </div>

      {/* Lesson Title Header Box */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-2.5 py-0.5 rounded bg-stone-900 text-amber-200 font-cartoon text-xs font-black border border-stone-800">
          Bài {lesson.lessonNumber}
        </span>
        <span className="font-hand text-sm text-stone-500 font-bold">
          {lesson.wordCount} từ vựng
        </span>
        <div className="washi-tape-yellow px-3.5 py-0.5 rounded-lg font-cartoon text-xl sm:text-2xl font-black text-stone-900 -rotate-1 inline-block">
          {lesson.title}
        </div>
        <span className="text-xs font-hand text-stone-500">
          Bài {lesson.lessonNumber} — Từ vựng HSK {book.levelNumber}
        </span>
      </div>

      {/* 2. CHỌN 7 CHẾ ĐỘ HỌC (STUDY MODES TABS - EXACT MATCHING SCREENSHOT) */}
      <div className="space-y-2">
        <span className="font-cartoon text-xs font-black uppercase text-stone-500 block">
          CHỌN CHẾ ĐỘ HỌC:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'flashcard', name: 'Flashcard', icon: '📚' },
            { id: 'quiz', name: 'Trắc nghiệm', icon: '🎯' },
            { id: 'typing', name: 'Gõ từ', icon: '⚡' },
            { id: 'reading', name: 'Đọc hiểu', icon: '📖' },
            { id: 'sentence-builder', name: 'Nghe ghép câu', icon: '🎧' },
            { id: 'hanzi-dance', name: 'Hanzi Dance', icon: '🎵' },
            { id: 'battle', name: 'Đấu trí', icon: '⚔️' },
          ].map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as StudyMode);
                  setIsFlipped(false);
                }}
                className={`px-4 py-2.5 rounded-xl font-cartoon text-xs font-bold whitespace-nowrap transition-all border-2 border-stone-800 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-[2px_2px_0px_#292524] scale-[1.02]'
                    : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-800 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({mode.id === 'battle' ? 'Xếp hạng' : 'Chưa học'})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FLASHCARD (ẢNH 3 & 4)                                              */}
      {/* ========================================================================= */}
      {activeMode === 'flashcard' && (
        <div className="space-y-5 animate-fade-in">
          {/* Top sub-controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex p-1 bg-[#ede4d3] dark:bg-stone-800 border-2 border-stone-800 rounded-xl shadow-[2px_2px_0px_#292524] gap-1">
              <button
                onClick={() => setFlashcardTab('word')}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  flashcardTab === 'word'
                    ? 'bg-amber-300 text-stone-900 border border-stone-800 shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                📚 Từ vựng
              </button>
              <button
                onClick={() => setFlashcardTab('example')}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  flashcardTab === 'example'
                    ? 'bg-amber-300 text-stone-900 border border-stone-800 shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                📖 Ví dụ
              </button>
            </div>

            {/* Counter Badge */}
            <div className="px-4 py-1.5 rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-800 font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524]">
              {cardIdx + 1} / {words.length}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => speakText(currentWord.hanzi)}
                className="p-2 rounded-xl bg-amber-300 text-stone-900 border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const shuffled = [...words].sort(() => Math.random() - 0.5);
                  setCardIdx(0);
                }}
                className="p-2 rounded-xl bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                title="Xáo trộn từ"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* THE BIG FLASHCARD BOX (ẢNH 3) */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] sm:min-h-[340px] rounded-3xl bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 box-sketch p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-300 relative group hover:shadow-[6px_6px_0px_#292524]"
          >
            {/* Speaker Button inside card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(currentWord.hanzi);
              }}
              className="absolute top-5 right-5 w-11 h-11 rounded-xl bg-amber-300 border-2 border-stone-800 flex items-center justify-center text-stone-900 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
              title="Phát âm"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {!isFlipped ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <span className="text-6xl sm:text-7xl font-black text-stone-900 dark:text-white font-serif tracking-tight">
                  {currentWord.hanzi}
                </span>

                {showPinyinOverall && (
                  <p className="font-cartoon text-lg text-[#c53428] dark:text-amber-300 font-bold font-mono">
                    {currentWord.pinyin}
                  </p>
                )}

                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-200 border border-stone-800 text-stone-900 font-cartoon text-xs font-bold shadow-xs">
                    {currentWord.posBadge || 'Cụm từ'}
                  </span>
                </div>

                <p className="font-hand text-sm text-stone-500 pt-2">
                  ✨ Click để lật xem nghĩa & âm Hán-Việt
                </p>
              </div>
            ) : (
              <div className="space-y-3 animate-in zoom-in-95 duration-200">
                <p className="font-cartoon text-2xl font-black text-[#c53428] dark:text-amber-300 font-mono">
                  {currentWord.pinyin}
                </p>

                {currentWord.sinoVietnamese && (
                  <p className="font-cartoon text-sm font-bold text-stone-500 dark:text-stone-400">
                    Âm Hán Việt: <span className="text-stone-900 dark:text-white uppercase font-black">{currentWord.sinoVietnamese}</span>
                  </p>
                )}

                <h4 className="font-body text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                  {currentWord.meaning}
                </h4>

                {currentWord.exampleZh && (
                  <div className="p-3 bg-[#fff9ea] dark:bg-stone-900 border-2 border-stone-800 rounded-xl text-xs space-y-1 max-w-md text-left mt-2">
                    <p className="font-bold text-stone-900 dark:text-white">{currentWord.exampleZh}</p>
                    <p className="text-stone-500 font-mono">{currentWord.examplePinyin}</p>
                    <p className="text-stone-600 dark:text-stone-400 italic">{currentWord.exampleVi}</p>
                  </div>
                )}

                <p className="font-hand text-xs text-stone-400 pt-2">
                  Click để lật lại chữ Hán
                </p>
              </div>
            )}
          </div>

          {/* Flashcard Bottom Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrevCard}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleMarkKnown(false)}
                className="px-6 py-2.5 rounded-xl bg-[#c53428] hover:bg-[#b02c21] text-white font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Chưa thuộc</span>
              </button>

              <button
                onClick={() => handleMarkKnown(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Đã thuộc</span>
              </button>
            </div>

            <button
              onClick={handleNextCard}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer flex items-center gap-1.5"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: TRẮC NGHIỆM (QUIZ - ẢNH 5, 6, 7)                                  */}
      {/* ========================================================================= */}
      {activeMode === 'quiz' && (
        <div className="space-y-5 animate-fade-in">
          {/* Sub-selector pills: [Cách đọc] [Từ vựng] [Ý nghĩa] */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => speakText(currentQuizWord.hanzi)}
              className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-stone-900 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bí quá thì nghe</span>
            </button>

            <div className="inline-flex p-1 bg-[#ede4d3] dark:bg-stone-800 border-2 border-stone-800 rounded-xl shadow-[2px_2px_0px_#292524] gap-1">
              <button
                onClick={() => {
                  setQuizSubtype('pinyin');
                  setSelectedQuizChoice(null);
                  setIsQuizAnswered(false);
                }}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  quizSubtype === 'pinyin'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Cách đọc
              </button>
              <button
                onClick={() => {
                  setQuizSubtype('vocab');
                  setSelectedQuizChoice(null);
                  setIsQuizAnswered(false);
                }}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  quizSubtype === 'vocab'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Từ vựng
              </button>
              <button
                onClick={() => {
                  setQuizSubtype('meaning');
                  setSelectedQuizChoice(null);
                  setIsQuizAnswered(false);
                }}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  quizSubtype === 'meaning'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Ý nghĩa
              </button>
            </div>
          </div>

          {/* Quiz Card Box */}
          <div className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-3xl box-sketch p-8 text-center space-y-6">
            <div className="space-y-1">
              {quizSubtype === 'pinyin' ? (
                <>
                  <h3 className="font-cartoon text-4xl font-black text-stone-900 dark:text-white font-mono">
                    {currentQuizWord.pinyin}
                  </h3>
                  <p className="font-cartoon text-xs font-bold text-stone-500 uppercase">
                    {currentQuizWord.sinoVietnamese}
                  </p>
                  <p className="font-body text-base font-bold text-[#c53428]">
                    {currentQuizWord.meaning}
                  </p>
                </>
              ) : quizSubtype === 'meaning' ? (
                <>
                  <h3 className="font-serif text-5xl font-black text-stone-900 dark:text-white">
                    {currentQuizWord.hanzi}
                  </h3>
                  <p className="font-mono text-sm text-[#c53428] font-bold">
                    {currentQuizWord.pinyin}
                  </p>
                  <p className="font-hand text-base text-stone-500">
                    Chọn nghĩa tiếng Việt đúng:
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-body text-2xl font-black text-stone-900 dark:text-white">
                    {currentQuizWord.meaning}
                  </h3>
                  <p className="font-hand text-base text-stone-500">
                    Chọn chữ Hán tương ứng:
                  </p>
                </>
              )}
            </div>

            {/* 4 Choices Grid (Ảnh 5, 6) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {quizChoices.map((choice, i) => {
                const isSelected = selectedQuizChoice === choice.id;
                const isCorrect = choice.id === currentQuizWord.id;

                let btnStyle = 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-2 border-stone-800 hover:bg-amber-100';

                if (isQuizAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-2 border-stone-800';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-[#c53428] text-white border-2 border-stone-800';
                  }
                }

                return (
                  <button
                    key={choice.id}
                    disabled={isQuizAnswered}
                    onClick={() => {
                      setSelectedQuizChoice(choice.id);
                      setIsQuizAnswered(true);
                      speakText(choice.hanzi);
                    }}
                    className={`p-4 rounded-2xl font-cartoon text-base font-bold shadow-[2px_2px_0px_#292524] btn-press transition-all cursor-pointer flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-800 flex items-center justify-center text-xs shrink-0 font-mono text-stone-900 dark:text-white">
                      {i + 1}
                    </span>
                    <span className="truncate flex-1 text-left">
                      {quizSubtype === 'meaning'
                        ? choice.meaning
                        : choice.hanzi}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next or I don't know */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-cartoon font-bold">
              <span className="text-stone-500">
                {quizIdx + 1} / {words.length}
              </span>

              {isQuizAnswered ? (
                <button
                  onClick={() => {
                    setIsQuizAnswered(false);
                    setSelectedQuizChoice(null);
                    setQuizIdx((prev) => (prev + 1) % words.length);
                  }}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                >
                  Câu tiếp theo ➔
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsQuizAnswered(true);
                    setSelectedQuizChoice(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                >
                  ♡ Không biết
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: GÕ TỪ (TYPING - ẢNH 8, 9, 10)                                      */}
      {/* ========================================================================= */}
      {activeMode === 'typing' && (
        <div className="space-y-5 animate-fade-in">
          {/* Sub-selector pills: [Cách đọc] [Âm Hán] [Chữ Hán] */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => speakText(currentTypingWord.hanzi)}
              className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-stone-900 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bí quá thì nghe</span>
            </button>

            <div className="inline-flex p-1 bg-[#ede4d3] dark:bg-stone-800 border-2 border-stone-800 rounded-xl shadow-[2px_2px_0px_#292524] gap-1">
              <button
                onClick={() => {
                  setTypingSubtype('pinyin');
                  setTypedInput('');
                  setTypingFeedback(null);
                }}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  typingSubtype === 'pinyin'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Cách đọc
              </button>
              <button
                onClick={() => {
                  setTypingSubtype('sinoVi');
                  setTypedInput('');
                  setTypingFeedback(null);
                }}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  typingSubtype === 'sinoVi'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Âm Hán
              </button>
              <button
                onClick={() => {
                  setTypingSubtype('hanzi');
                  setTypedInput('');
                  setTypingFeedback(null);
                }}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold transition-all cursor-pointer ${
                  typingSubtype === 'hanzi'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                Chữ Hán
              </button>
            </div>
          </div>

          {/* Typing Card Box */}
          <div className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-3xl box-sketch p-8 text-center space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-serif text-5xl font-black text-stone-900 dark:text-white">
                {typingSubtype === 'hanzi' ? currentTypingWord.meaning : currentTypingWord.hanzi}
              </h3>
              <p className="font-hand text-lg text-stone-600 dark:text-stone-400">
                {typingSubtype === 'hanzi' ? currentTypingWord.pinyin : currentTypingWord.meaning}
              </p>
            </div>

            {/* Input & Check area */}
            <div className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(formatPinyinWithTones(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Check typing
                    let expected = '';
                    if (typingSubtype === 'pinyin') expected = currentTypingWord.pinyin;
                    else if (typingSubtype === 'sinoVi') expected = currentTypingWord.sinoVietnamese || '';
                    else expected = currentTypingWord.hanzi;

                    const match = typedInput.trim().toLowerCase() === expected.trim().toLowerCase();
                    setTypingFeedback(match ? 'correct' : 'wrong');
                    if (match) speakText(currentTypingWord.hanzi);
                  }
                }}
                placeholder={
                  typingSubtype === 'pinyin'
                    ? 'Gõ pinyin, số là thanh điệu (ni3 → nǐ)...'
                    : typingSubtype === 'sinoVi'
                    ? 'Nhập âm Hán Việt (VD: ĐỒNG HỌC)...'
                    : 'Gõ chữ Hán (dùng bộ gõ tiếng Trung)...'
                }
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-cartoon text-sm border-2 border-stone-800 text-center shadow-inner outline-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    let full = '';
                    if (typingSubtype === 'pinyin') full = currentTypingWord.pinyin;
                    else if (typingSubtype === 'sinoVi') full = currentTypingWord.sinoVietnamese || '';
                    else full = currentTypingWord.hanzi;

                    setRevealedHintCount((c) => Math.min(c + 1, full.length));
                    setTypedInput(full.slice(0, revealedHintCount + 1));
                  }}
                  className="flex-1 py-2.5 bg-[#fff9ea] dark:bg-stone-800 hover:bg-amber-100 text-stone-800 dark:text-stone-200 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] cursor-pointer"
                >
                  💡 Gợi ý ({revealedHintCount})
                </button>

                <button
                  onClick={() => {
                    let expected = '';
                    if (typingSubtype === 'pinyin') expected = currentTypingWord.pinyin;
                    else if (typingSubtype === 'sinoVi') expected = currentTypingWord.sinoVietnamese || '';
                    else expected = currentTypingWord.hanzi;

                    const match = typedInput.trim().toLowerCase() === expected.trim().toLowerCase();
                    setTypingFeedback(match ? 'correct' : 'wrong');
                    if (match) speakText(currentTypingWord.hanzi);
                  }}
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-[#c53428] text-white rounded-xl font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                >
                  ⌨️ Kiểm tra
                </button>
              </div>

              {typingFeedback && (
                <div
                  className={`p-3 rounded-xl border-2 font-cartoon text-xs flex items-center justify-between ${
                    typingFeedback === 'correct'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                      : 'bg-rose-100 text-rose-950 border-rose-600'
                  }`}
                >
                  <span>
                    {typingFeedback === 'correct' ? '🎉 Chính xác tuyệt đối!' : '⚠️ Chưa đúng rồi, hãy thử lại nhé!'}
                  </span>
                  {typingFeedback === 'correct' && (
                    <button
                      onClick={() => {
                        setTypingFeedback(null);
                        setTypedInput('');
                        setRevealedHintCount(0);
                        setTypingIdx((prev) => (prev + 1) % words.length);
                      }}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold"
                    >
                      Tiếp theo ➔
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-cartoon font-bold text-stone-500">
              <span>{typingIdx + 1} / {words.length}</span>
              <button
                onClick={() => {
                  setTypingIdx((prev) => (prev + 1) % words.length);
                  setTypedInput('');
                  setTypingFeedback(null);
                  setRevealedHintCount(0);
                }}
                className="hover:underline cursor-pointer"
              >
                Bỏ qua ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: NGHE GHÉP CÂU (SENTENCE BUILDER - ẢNH 11, 12)                      */}
      {/* ========================================================================= */}
      {activeMode === 'sentence-builder' && (
        <div className="space-y-5 animate-fade-in">
          {/* Top speed controls & sub-modes */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(targetExampleSentence, sentenceSpeed)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe câu</span>
              </button>
              <button
                onClick={() => speakText(targetExampleSentence, sentenceSpeed)}
                className="p-2 bg-white dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-stone-800 rounded-xl shadow-xs cursor-pointer"
                title="Lặp lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed pills */}
            <div className="flex items-center gap-1 bg-[#ede4d3] dark:bg-stone-800 border-2 border-stone-800 p-1 rounded-xl shadow-[2px_2px_0px_#292524]">
              {[0.5, 0.8, 1.0, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSentenceSpeed(s)}
                  className={`px-2.5 py-0.5 rounded-lg font-cartoon text-xs font-bold cursor-pointer transition-all ${
                    sentenceSpeed === s ? 'bg-amber-300 text-stone-900 border border-stone-800' : 'text-stone-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Sub-modes: [Ghép câu] [Gõ lại] */}
            <div className="inline-flex p-1 bg-[#ede4d3] dark:bg-stone-800 border-2 border-stone-800 rounded-xl shadow-[2px_2px_0px_#292524] gap-1">
              <button
                onClick={() => setSentenceSubtype('tiles')}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold cursor-pointer ${
                  sentenceSubtype === 'tiles' ? 'bg-stone-900 text-white' : 'text-stone-700'
                }`}
              >
                Ghép câu
              </button>
              <button
                onClick={() => setSentenceSubtype('typing')}
                className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold cursor-pointer ${
                  sentenceSubtype === 'typing' ? 'bg-stone-900 text-white' : 'text-stone-700'
                }`}
              >
                Gõ lại
              </button>
            </div>
          </div>

          {/* Builder Box */}
          <div className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-3xl box-sketch p-8 text-center space-y-6">
            <p className="font-hand text-base text-stone-600 dark:text-stone-400">
              {currentSentenceWord.exampleVi ? `"${currentSentenceWord.exampleVi}"` : 'Nghe và sắp xếp câu đúng thứ tự:'}
            </p>

            {sentenceSubtype === 'tiles' ? (
              <div className="space-y-6 max-w-xl mx-auto">
                {/* Target Slots */}
                <div className="min-h-[70px] p-4 bg-[#fff9ea] dark:bg-stone-900 border-2 border-stone-800 rounded-2xl flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
                  {selectedTiles.length === 0 ? (
                    <span className="font-hand text-sm text-stone-400">
                      Bấm các mảnh chữ ở bên dưới để ghép câu...
                    </span>
                  ) : (
                    selectedTiles.map((t, idx) => (
                      <span
                        key={idx}
                        onClick={() => setSelectedTiles(selectedTiles.filter((_, i) => i !== idx))}
                        className="px-4 py-2 bg-amber-300 text-stone-900 font-cartoon font-bold text-base rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] cursor-pointer hover:bg-rose-200"
                        title="Bấm để gỡ ra"
                      >
                        {t}
                      </span>
                    ))
                  )}
                </div>

                {/* Tiles Pool */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {sentenceTilesPool.map((tile, idx) => {
                    const isUsed = selectedTiles.includes(tile);
                    return (
                      <button
                        key={idx}
                        disabled={isUsed}
                        onClick={() => setSelectedTiles([...selectedTiles, tile])}
                        className={`px-4 py-2.5 rounded-xl font-cartoon font-bold text-base border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all cursor-pointer ${
                          isUsed
                            ? 'opacity-30 pointer-events-none bg-stone-200'
                            : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white hover:bg-amber-100'
                        }`}
                      >
                        {tile}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const assembled = selectedTiles.join('');
                      const cleanTarget = targetExampleSentence.replace(/[，。！？、；：\s]/g, '');
                      const cleanAssembled = assembled.replace(/[，。！？、；：\s]/g, '');
                      const match = cleanAssembled === cleanTarget;
                      setSentenceFeedback(match);
                      if (match) speakText(targetExampleSentence);
                    }}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-[#c53428] text-white font-cartoon text-xs font-bold rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                  >
                    Kiểm tra câu
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto space-y-3">
                <textarea
                  rows={2}
                  value={typedSentenceInput}
                  onChange={(e) => setTypedSentenceInput(e.target.value)}
                  placeholder="Gõ lại câu vừa nghe (pinyin hoặc chữ Hán)..."
                  className="w-full p-4 rounded-2xl bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-body text-sm border-2 border-stone-800 shadow-inner outline-none"
                />
                <button
                  onClick={() => {
                    const match = typedSentenceInput.trim().length > 0;
                    setSentenceFeedback(match);
                    if (match) speakText(targetExampleSentence);
                  }}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-[#c53428] text-white font-cartoon text-xs font-bold rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                >
                  ⌨️ Kiểm tra
                </button>
              </div>
            )}

            {sentenceFeedback !== null && (
              <div
                className={`p-3 rounded-xl border-2 font-cartoon text-xs flex items-center justify-between max-w-md mx-auto ${
                  sentenceFeedback
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                    : 'bg-rose-100 text-rose-950 border-rose-600'
                }`}
              >
                <span>{sentenceFeedback ? '🎉 Tuyệt vời! Câu ghép chính xác!' : '⚠️ Chưa đúng trật tự, hãy thử lại!'}</span>
                {sentenceFeedback && (
                  <button
                    onClick={() => {
                      setSentenceFeedback(null);
                      setSelectedTiles([]);
                      setTypedSentenceInput('');
                      setSentenceIdx((prev) => (prev + 1) % words.length);
                    }}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold"
                  >
                    Câu tiếp theo ➔
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 5: ĐỌC HIỂU (READING QUIZ - ẢNH 13)                                   */}
      {/* ========================================================================= */}
      {activeMode === 'reading' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => speakText(currentReadingWord.exampleZh || currentReadingWord.hanzi)}
              className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-stone-900 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bí quá thì nghe</span>
            </button>

            <button
              onClick={() => setShowReadingMeaning(!showReadingMeaning)}
              className="px-3 py-1.5 bg-[#fffdfa] dark:bg-stone-800 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-xs cursor-pointer"
            >
              👁️ Nghĩa
            </button>
          </div>

          <div className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-3xl box-sketch p-8 text-center space-y-6">
            <div className="space-y-1">
              <p className="font-mono text-sm text-[#c53428] font-bold">
                {readingSentencePrompt.pinyin}
              </p>
              <h3 className="font-serif text-4xl sm:text-5xl font-black text-stone-900 dark:text-white">
                {readingSentencePrompt.sentence}
              </h3>
              {showReadingMeaning && (
                <p className="font-hand text-base text-stone-600 dark:text-stone-400 italic pt-1">
                  "{readingSentencePrompt.meaning}"
                </p>
              )}
            </div>

            {/* 4 Choices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {readingChoices.map((choice, i) => {
                const isSelected = selectedReadingChoice === choice;
                const isCorrect = choice === readingSentencePrompt.correctHanzi;

                let btnStyle = 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-2 border-stone-800 hover:bg-amber-100';

                if (selectedReadingChoice) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-2 border-stone-800';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-[#c53428] text-white border-2 border-stone-800';
                  }
                }

                return (
                  <button
                    key={choice}
                    disabled={Boolean(selectedReadingChoice)}
                    onClick={() => {
                      setSelectedReadingChoice(choice);
                      speakText(choice);
                    }}
                    className={`p-4 rounded-2xl font-cartoon text-lg font-bold shadow-[2px_2px_0px_#292524] btn-press transition-all cursor-pointer flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-800 flex items-center justify-center text-xs shrink-0 font-mono text-stone-900 dark:text-white">
                      {i + 1}
                    </span>
                    <span className="truncate flex-1 text-left font-serif text-2xl">
                      {choice}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-cartoon font-bold text-stone-500">
              <span>{readingIdx + 1} / {words.length}</span>

              {selectedReadingChoice ? (
                <button
                  onClick={() => {
                    setSelectedReadingChoice(null);
                    setReadingIdx((prev) => (prev + 1) % words.length);
                  }}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                >
                  Câu tiếp theo ➔
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedReadingChoice(readingSentencePrompt.correctHanzi);
                  }}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ♡ Câu này bó tay
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 6: HANZI DANCE & MODE 7: ĐẤU TRÍ                                     */}
      {/* ========================================================================= */}
      {(activeMode === 'hanzi-dance' || activeMode === 'battle') && (
        <div className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-3xl box-sketch p-8 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-300 border-2 border-stone-800 flex items-center justify-center text-3xl shadow-[3px_3px_0px_#292524]">
            {activeMode === 'hanzi-dance' ? '🎵' : '⚔️'}
          </div>
          <h3 className="font-cartoon text-xl font-bold text-stone-900 dark:text-white">
            {activeMode === 'hanzi-dance' ? 'Hanzi Dance • Luyện Nét Bút Thuận' : 'Đấu Trí • Thử Thách Phản Xạ 60 Giây'}
          </h3>
          <p className="font-body text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
            {activeMode === 'hanzi-dance'
              ? 'Tập vẽ và tô theo từng nét chữ Hán của bài học. Sai 2 lần hệ thống sẽ tự động hiện thứ tự nét bút!'
              : 'Chạy đua với thời gian để trả lời nhiều câu hỏi nhất, nhận điểm XP để leo top Bảng xếp hạng tuần.'}
          </p>
          <Link
            href="/practice/hanzi-writer"
            className="inline-flex px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press"
          >
            Mở Vở Tập Viết A4 ➔
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SCROLL DOWN: DANH SÁCH TỪ VỰNG CỦA BÀI HỌC (ẢNH 4)                     */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-6 border-t-2 border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span>Danh Sách Từ Vựng Bài {lesson.lessonNumber}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-200 border border-stone-800 text-stone-900 font-bold">
                {words.length} từ
              </span>
            </h3>
            <p className="font-hand text-xs text-stone-500">
              Có đầy đủ Pinyin, Âm Hán-Việt, Nghĩa tiếng Việt và câu ví dụ minh họa chuẩn NhaiHSK.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#fffdfa] dark:bg-stone-800 hover:bg-amber-100 text-stone-800 dark:text-stone-200 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In file</span>
            </button>

            <button
              onClick={handleSaveAllToSrs}
              className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-stone-900 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-1.5 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Thêm cả bài vào ôn tập</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid of Word Cards (Exact Ảnh 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {words.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl p-5 box-sketch-sm space-y-3 relative group"
            >
              {/* Header Row: Index, Hanzi, POS, Pinyin, SinoVi, Meaning & Icons */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <span className="font-cartoon text-xs font-bold text-stone-400 mt-1">
                    {idx + 1}.
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-serif text-3xl font-black text-stone-900 dark:text-white">
                        {item.hanzi}
                      </span>
                      <span className="px-2 py-0.5 rounded font-cartoon text-[10px] font-bold bg-[#ede4d3] dark:bg-stone-800 border border-stone-800 text-stone-800 dark:text-stone-300">
                        {item.posBadge || 'Từ vựng'}
                      </span>
                    </div>

                    <div className="font-cartoon text-xs text-stone-500">
                      <span className="text-[#c53428] font-bold font-mono mr-2">{item.pinyin}</span>
                      {item.sinoVietnamese && (
                        <span className="uppercase font-bold text-stone-800 dark:text-stone-300">{item.sinoVietnamese}</span>
                      )}
                    </div>

                    <p className="font-body text-xs font-bold text-stone-900 dark:text-white">
                      {item.meaning}
                    </p>
                  </div>
                </div>

                {/* Top Action Icons: Flag, Star, Speaker */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakText(item.hanzi)}
                    className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-300 text-stone-900 border border-stone-800 transition-colors cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      addWord({
                        word: item.hanzi,
                        phonetic: item.pinyin,
                        meaning: `${item.sinoVietnamese ? `[${item.sinoVietnamese}] ` : ''}${item.meaning}`,
                        exampleEn: item.exampleZh || item.hanzi,
                        exampleVi: item.exampleVi || item.meaning,
                        topic: `${book.title} • ${lesson.title}`,
                      });
                      alert(`✓ Đã lưu từ "${item.hanzi}" vào Flashcard!`);
                    }}
                    className="p-1.5 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 text-stone-600 dark:text-stone-300 border border-stone-800 transition-colors cursor-pointer"
                    title="Ghim từ vựng"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Example Sentence Divider Row (Exact Ảnh 4) */}
              {item.exampleZh && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-start justify-between gap-2">
                  <div className="text-xs space-y-0.5 min-w-0">
                    <p className="font-mono text-[11px] text-stone-500 truncate">{item.examplePinyin}</p>
                    <p className="font-serif text-sm font-bold text-stone-900 dark:text-white truncate">{item.exampleZh}</p>
                    <p className="font-hand text-xs text-[#c53428] dark:text-amber-300 italic truncate">→ {item.exampleVi}</p>
                  </div>

                  <button
                    onClick={() => speakText(item.exampleZh || item.hanzi)}
                    className="p-1.5 rounded-lg bg-[#fff9ea] dark:bg-stone-800 hover:bg-amber-200 text-stone-700 dark:text-stone-300 border border-stone-800 shrink-0 cursor-pointer"
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
