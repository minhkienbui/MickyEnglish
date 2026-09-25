'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { cleanWord } from '@/lib/diffEngine';
import { DictationSentence } from '@/lib/types';
import { useThemeStore } from '@/stores/useThemeStore';

interface WordOrderGameProps {
  sentence: DictationSentence;
  sentenceIndex: number;
  totalSentences: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevSentence: () => void;
  onNextSentence: () => void;
  onSelectSentence: (index: number) => void;
  onReplaySentence: () => void;
  onCompleteSentence?: () => void;
  sentenceList?: DictationSentence[];
}

interface WordChip {
  id: string;
  word: string;
  cleanText: string;
  originalIndex: number;
  isUsed: boolean;
  isWrong: boolean;
}

// Web Audio API tone generator for instant, latency-free feedback
function playAudioTone(freq: number, duration: number, type: OscillatorType = 'sine') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Graceful fallback
  }
}

function playCorrectSound() {
  playAudioTone(587.33, 0.1, 'sine'); // D5
  setTimeout(() => playAudioTone(880, 0.12, 'sine'), 70); // A5
}

function playErrorSound() {
  playAudioTone(160, 0.22, 'sawtooth'); // Error low buzz
}

function playSuccessFanfare() {
  playAudioTone(523.25, 0.12, 'triangle'); // C5
  setTimeout(() => playAudioTone(659.25, 0.12, 'triangle'), 90); // E5
  setTimeout(() => playAudioTone(783.99, 0.12, 'triangle'), 180); // G5
  setTimeout(() => playAudioTone(1046.5, 0.25, 'triangle'), 270); // C6
}

export default function WordOrderGame({
  sentence,
  sentenceIndex,
  totalSentences,
  isPlaying,
  onTogglePlay,
  onPrevSentence,
  onNextSentence,
  onSelectSentence,
  onReplaySentence,
  onCompleteSentence,
  sentenceList = [],
}: WordOrderGameProps) {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Parse sentence into core words and trailing punctuation (e.g. ".")
  const [coreWords, setCoreWords] = useState<string[]>([]);
  const [endPunctuation, setEndPunctuation] = useState<string>('');

  // Shuffled chips in the bottom pool
  const [shuffledChips, setShuffledChips] = useState<WordChip[]>([]);

  // Words that have been placed correctly in order in the top slots
  const [filledSlots, setFilledSlots] = useState<{ id: string; word: string }[]>([]);

  // State for hint availability (Default 10 hints like Image 29.png)
  const [hintsLeft, setHintsLeft] = useState<number>(10);

  // Status state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Setup words when current sentence changes
  useEffect(() => {
    if (!sentence || !sentence.text) return;

    const trimmed = sentence.text.trim();
    let punct = '';
    let core = trimmed;

    // Extract trailing punctuation (. ? ! …)
    const match = trimmed.match(/([.?!…]+)$/);
    if (match) {
      punct = match[1];
      core = trimmed.slice(0, -punct.length).trim();
    }

    const rawWords = core.split(/\s+/).filter(Boolean);
    setCoreWords(rawWords);
    setEndPunctuation(punct);
    setFilledSlots([]);
    setIsCompleted(false);

    // Create chip objects
    const chips: WordChip[] = rawWords.map((word, idx) => ({
      id: `chip-${idx}-${word}-${Math.random().toString(36).substring(2, 6)}`,
      word,
      cleanText: cleanWord(word),
      originalIndex: idx,
      isUsed: false,
      isWrong: false,
    }));

    // Shuffle chips until order is different from original if length > 2
    let shuffled = [...chips].sort(() => Math.random() - 0.5);
    let attempts = 0;
    while (
      attempts < 10 &&
      rawWords.length > 2 &&
      shuffled.every((c, i) => c.originalIndex === i)
    ) {
      shuffled = [...chips].sort(() => Math.random() - 0.5);
      attempts++;
    }

    setShuffledChips(shuffled);
  }, [sentence]);

  // Click on a word chip in the bottom pool ("Các từ bị xáo trộn")
  const handleChipClick = (clickedChip: WordChip) => {
    if (clickedChip.isUsed || isCompleted) return;

    const currentSlotIndex = filledSlots.length;
    if (currentSlotIndex >= coreWords.length) return;

    const targetWord = coreWords[currentSlotIndex];
    const targetClean = cleanWord(targetWord);
    const clickedClean = cleanWord(clickedChip.word);

    // Check if the clicked chip matches the next required word
    if (clickedClean === targetClean) {
      // 1. MATCH: Word moves to upper slot
      playCorrectSound();

      // Mark this chip as used
      setShuffledChips((prev) =>
        prev.map((c) => (c.id === clickedChip.id ? { ...c, isUsed: true, isWrong: false } : c))
      );

      // Add to filled slots
      const newFilled = [...filledSlots, { id: clickedChip.id, word: clickedChip.word }];
      setFilledSlots(newFilled);

      // Check if complete
      if (newFilled.length === coreWords.length) {
        setIsCompleted(true);
        playSuccessFanfare();
        if (onCompleteSentence) {
          onCompleteSentence();
        }
      }
    } else {
      // 2. MISMATCH: Word shakes with error animation, stays below
      playErrorSound();

      setShuffledChips((prev) =>
        prev.map((c) => (c.id === clickedChip.id ? { ...c, isWrong: true } : c))
      );

      // Reset shake after 480ms so user can retry
      setTimeout(() => {
        setShuffledChips((prev) =>
          prev.map((c) => (c.id === clickedChip.id ? { ...c, isWrong: false } : c))
        );
      }, 480);
    }
  };

  // Click on a filled slot in the upper row to undo it
  const handleSlotClick = (slotIdx: number) => {
    if (isCompleted) return;
    if (slotIdx >= filledSlots.length) return;

    // Unfill slots from slotIdx to the end
    const slotsToUndo = filledSlots.slice(slotIdx);
    const idsToRestore = new Set(slotsToUndo.map((s) => s.id));

    setShuffledChips((prev) =>
      prev.map((c) => (idsToRestore.has(c.id) ? { ...c, isUsed: false } : c))
    );

    setFilledSlots(filledSlots.slice(0, slotIdx));
  };

  // Reset / Làm lại
  const handleReset = () => {
    setFilledSlots([]);
    setIsCompleted(false);

    // Re-shuffle unused chips
    setShuffledChips((prev) =>
      prev
        .map((c) => ({ ...c, isUsed: false, isWrong: false }))
        .sort(() => Math.random() - 0.5)
    );
  };

  // Gợi ý: Tự động chọn từ đúng tiếp theo
  const handleHint = () => {
    if (hintsLeft <= 0 || isCompleted) return;

    const currentSlotIndex = filledSlots.length;
    if (currentSlotIndex >= coreWords.length) return;

    const targetWord = coreWords[currentSlotIndex];
    const targetClean = cleanWord(targetWord);

    // Find the unused chip matching this word
    const matchingChip = shuffledChips.find(
      (c) => !c.isUsed && cleanWord(c.word) === targetClean
    );

    if (matchingChip) {
      setHintsLeft((prev) => Math.max(0, prev - 1));
      handleChipClick(matchingChip);
    }
  };

  return (
    <div
      className={`border rounded-3xl overflow-hidden shadow-2xl animate-fade-in transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
      }`}
    >
      {/* 1. THANH ĐIỀU HƯỚNG XANH LÁ #00c950 (Chuẩn Ảnh 29.png) */}
      <div className="bg-[#00c950] p-3 sm:p-3.5 flex items-center justify-between text-white shadow-md">
        {/* Nút Play tròn trắng với icon xanh */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-11 h-11 rounded-full bg-white text-[#00c950] hover:bg-white/95 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg font-black"
          title={isPlaying ? 'Tạm dừng' : 'Phát video câu này'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Bộ điều hướng chuyển câu < 1 / 29 ∨ > */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onPrevSentence}
            disabled={sentenceIndex === 0}
            className="p-1.5 text-white hover:bg-white/20 rounded-xl disabled:opacity-35 cursor-pointer transition-colors"
            title="Câu trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative group">
            <select
              value={sentenceIndex}
              onChange={(e) => onSelectSentence(Number(e.target.value))}
              className="bg-black/20 hover:bg-black/30 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl appearance-none cursor-pointer outline-none pr-7 border border-white/20 transition-colors"
            >
              {Array.from({ length: totalSentences }).map((_, idx) => (
                <option key={idx} value={idx} className="bg-[#121c2b] text-white">
                  {idx + 1} / {totalSentences}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-white absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={onNextSentence}
            disabled={sentenceIndex === totalSentences - 1}
            className="p-1.5 text-white hover:bg-white/20 rounded-xl cursor-pointer transition-colors disabled:opacity-35"
            title="Câu tiếp theo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Nút Nghe lại (Replay) */}
        <button
          type="button"
          onClick={onReplaySentence}
          className="p-2 text-white hover:bg-white/20 rounded-xl cursor-pointer transition-colors"
          title="Nghe lại câu này"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 2. NỘI DUNG CHÍNH TAB XẾP TỪ (Khớp chuẩn 100% Ảnh 29.png) */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* KHUNG TRÊN: Xếp câu theo thứ tự bạn nghe được (Khớp chuẩn Ảnh 29.png) */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition-colors shadow-sm ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101926] border-[#1e2a3a]'
          }`}
        >
          {/* Header với Tiêu đề và Badge đếm số từ "0/5" */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs sm:text-sm font-bold tracking-tight ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              Xếp câu theo thứ tự bạn nghe được
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isLight
                  ? 'bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300'
              }`}
            >
              {filledSlots.length}/{coreWords.length}
            </span>
          </div>

          {/* Hàng các ô capsule/slot trống [ ] [ ] [ ] . (Khớp chuẩn Ảnh 29.png) */}
          <div className="flex flex-wrap items-center gap-2.5 min-h-[52px]">
            {coreWords.map((targetWord, idx) => {
              const filledWordObj = filledSlots[idx];
              const isFilled = Boolean(filledWordObj);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => isFilled && handleSlotClick(idx)}
                  disabled={!isFilled || isCompleted}
                  className={`h-10 sm:h-11 min-w-[62px] px-3.5 rounded-xl border flex items-center justify-center transition-all ${
                    isFilled
                      ? isLight
                        ? 'bg-white border-[#00c950] text-[#00c950] font-black text-xs sm:text-sm shadow-sm cursor-pointer hover:border-rose-400'
                        : 'bg-[#1c293a] border-[#00c950]/70 text-white font-black text-xs sm:text-sm shadow-md animate-fade-in cursor-pointer hover:border-rose-400/50'
                      : isLight
                      ? 'bg-slate-200/80 border-slate-300 cursor-default'
                      : 'bg-[#182333] border-[#223145] cursor-default'
                  }`}
                  title={isFilled ? 'Bấm để gỡ từ này' : undefined}
                >
                  {isFilled ? filledWordObj.word : ''}
                </button>
              );
            })}

            {/* Dấu chấm câu hoặc dấu câu kết thúc ở cuối hàng slot (như dấu "." trong Ảnh 29.png) */}
            {endPunctuation && (
              <span
                className={`text-lg font-black select-none self-center ml-0.5 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {endPunctuation}
              </span>
            )}
          </div>
        </div>

        {/* KHUNG DƯỚI: Các từ bị xáo trộn (Khớp chuẩn Ảnh 29.png) */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition-colors shadow-sm ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101926] border-[#1e2a3a]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs sm:text-sm font-bold tracking-tight ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              Các từ bị xáo trộn
            </span>
          </div>

          {/* Danh sách các pill từ vựng đảo vị trí (Khớp chuẩn Ảnh 29.png) */}
          <div className="flex flex-wrap gap-2.5 min-h-[50px] items-center">
            {shuffledChips.map((chip) => {
              if (chip.isUsed) {
                // Ẩn từ đã được chọn lên trên để giao diện gọn gàng
                return null;
              }

              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black border transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                    chip.isWrong
                      ? isLight
                        ? 'animate-shake border-rose-500 bg-rose-100 text-rose-700 shadow-md shadow-rose-500/20'
                        : 'animate-shake border-rose-500 bg-rose-500/25 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                      : isLight
                      ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-400 shadow-xs'
                      : 'bg-[#1c2738] hover:bg-[#233348] border-[#2c3d54] text-white hover:border-slate-400 shadow-sm'
                  }`}
                >
                  {chip.word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Banner when completed */}
        {isCompleted && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-between text-emerald-400 text-xs sm:text-sm font-black animate-fade-in shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00c950] shrink-0" />
              <span>Chính xác 100%! Bạn đã xếp các từ hoàn hảo.</span>
            </div>
            {sentenceIndex < totalSentences - 1 && (
              <button
                type="button"
                onClick={onNextSentence}
                className="px-3.5 py-1.5 bg-[#00c950] hover:bg-[#00b046] text-white rounded-xl font-black text-xs cursor-pointer shadow-md transition-all active:scale-95"
              >
                Câu tiếp theo →
              </button>
            )}
          </div>
        )}

        {/* 3. NÚT CHÂN TRANG: ↺ Làm lại & 💡 Gợi ý (còn 10) (Khớp chuẩn 100% Ảnh 29.png) */}
        <div className="flex items-center justify-between pt-1 px-1">
          {/* Nút Làm lại bên trái */}
          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
              isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Làm lại
          </button>

          {/* Nút Gợi ý (còn 10) viền vàng cong bên phải */}
          <button
            type="button"
            onClick={handleHint}
            disabled={hintsLeft <= 0 || isCompleted}
            className={`px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 border shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight
                ? 'border-amber-500 text-amber-600 bg-amber-50 hover:bg-amber-100'
                : 'border-amber-500/80 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Gợi ý (còn {hintsLeft})
          </button>
        </div>
      </div>
    </div>
  );
}
