'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ChevronDown, CheckCircle2, AlertCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { cleanWord } from '@/lib/diffEngine';
import { useThemeStore } from '@/stores/useThemeStore';

interface DictationWordInputsProps {
  targetSentence: string;
  onCheck: (fullUserInput: string) => void;
  onSkip: () => void;
  onPlaySample?: () => void;
  isChecked?: boolean;
  onContinue?: () => void;
  isPassed?: boolean;
}

export default function DictationWordInputs({
  targetSentence,
  onCheck,
  onSkip,
  onPlaySample,
  isChecked = false,
  onContinue,
  isPassed = false,
}: DictationWordInputsProps) {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Tokenize target sentence words (preserving punctuation formatting)
  const targetWords = targetSentence.trim().split(/\s+/).filter(Boolean);

  // Difficulty Mode: 'normal' (Thường) | 'easy' (Dễ - hints 1st letter) | 'hard' (Khó - no hints)
  const [difficulty, setDifficulty] = useState<'normal' | 'easy' | 'hard'>('normal');

  // User input array for each word slot
  const [userWords, setUserWords] = useState<string[]>([]);
  // Revealed hint per word slot
  const [revealedHints, setRevealedHints] = useState<boolean[]>([]);
  // Currently focused slot index
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize or reset word slots when targetSentence or difficulty changes
  useEffect(() => {
    const words = targetSentence.trim().split(/\s+/).filter(Boolean);
    if (difficulty === 'easy') {
      setUserWords(words.map((w, i) => (i % 3 === 0 ? w : '')));
      setRevealedHints(words.map((_, i) => i % 3 === 0));
    } else if (difficulty === 'normal') {
      // Ở chế độ Thường: Từ kết thúc câu có dấu chấm câu (như "stones." ở Ảnh 28.png) được hiển thị sẵn màu xanh
      const initialUserWords = new Array(words.length).fill('');
      const initialHints = new Array(words.length).fill(false);
      if (words.length > 3) {
        const lastIdx = words.length - 1;
        initialUserWords[lastIdx] = words[lastIdx];
        initialHints[lastIdx] = true;
      }
      setUserWords(initialUserWords);
      setRevealedHints(initialHints);
    } else {
      // Chế độ Khó: Ẩn toàn bộ từ
      setUserWords(new Array(words.length).fill(''));
      setRevealedHints(new Array(words.length).fill(false));
    }

    // Auto-focus first empty input slot
    setFocusedIndex(0);
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [targetSentence, difficulty]);

  const handleInputChange = (index: number, val: string) => {
    // If user presses space at the end of word -> jump to next slot
    if (val.endsWith(' ')) {
      const trimmed = val.trim();
      const updated = [...userWords];
      updated[index] = trimmed;
      setUserWords(updated);

      if (index < targetWords.length - 1) {
        setFocusedIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    const updated = [...userWords];
    updated[index] = val;
    setUserWords(updated);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (!userWords[index] || userWords[index].length === 0)) {
      // If current blank is empty and backspace pressed, go to previous input
      if (index > 0) {
        e.preventDefault();
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowRight' && index < targetWords.length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleHint = (index: number) => {
    const updatedHints = [...revealedHints];
    updatedHints[index] = !updatedHints[index];
    setRevealedHints(updatedHints);

    // If revealing hint, fill in the target word
    if (updatedHints[index]) {
      const updated = [...userWords];
      updated[index] = targetWords[index];
      setUserWords(updated);
    }
  };

  const handleSubmit = () => {
    const fullText = userWords.map((w) => w || '').join(' ').trim();
    onCheck(fullText);
  };

  const handleSkip = () => {
    setUserWords([...targetWords]);
    setRevealedHints(new Array(targetWords.length).fill(true));
    onSkip();
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Bar: Tiêu đề phụ + Menu chọn độ khó (Khớp chuẩn Ảnh 1) */}
      <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-[#1e2d42]'}`}>
        <span className={`text-[12px] font-black tracking-wider uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          GÕ NHỮNG GÌ BẠN NGHE...
        </span>

        {/* Difficulty Dropdown */}
        <div className="relative inline-block">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className={`font-black text-xs px-3.5 py-1.5 rounded-xl cursor-pointer outline-none appearance-none pr-7 border transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-amber-600 hover:border-amber-500'
                : 'bg-[#0e1726] border-[#1e2d42] text-amber-400 hover:border-amber-400'
            }`}
          >
            <option value="normal" className={isLight ? 'bg-white text-slate-900' : 'bg-[#121c2b] text-white'}>
              ● Thường
            </option>
            <option value="easy" className={isLight ? 'bg-white text-slate-900' : 'bg-[#121c2b] text-white'}>
              ● Dễ
            </option>
            <option value="hard" className={isLight ? 'bg-white text-slate-900' : 'bg-[#121c2b] text-white'}>
              ● Khó
            </option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-amber-500 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* 2. Interactive Word Blanks Grid (Khung ô nhập gạch chân như Ảnh 1) */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border min-h-[170px] flex flex-wrap items-center justify-start gap-x-4 gap-y-6 shadow-inner transition-colors ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'
        }`}
      >
        {targetWords.map((targetWord, idx) => {
          const userVal = userWords[idx] || '';
          const isRevealed = revealedHints[idx];
          const isCorrect = cleanWord(userVal) === cleanWord(targetWord);
          const isFocused = focusedIndex === idx;

          // Dynamic width calculation based on target word length
          const minCharWidth = Math.max(4, targetWord.length);
          const inputWidthStyle = { width: `${minCharWidth * 14 + 18}px` };

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 group relative">
              {/* Hint Eye Icon (Icon mắt ở trên như Ảnh 28.png - Ẩn đi khi từ đã được gợi ý) */}
              <div className="h-6 flex items-center justify-center">
                {!isRevealed ? (
                  <button
                    type="button"
                    onClick={() => toggleHint(idx)}
                    tabIndex={-1}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isLight
                        ? 'text-slate-400 hover:text-emerald-600 hover:bg-slate-200/60'
                        : 'text-slate-400 hover:text-emerald-400 hover:bg-[#121c2b]'
                    }`}
                    title={`Xem gợi ý từ: ${targetWord}`}
                  >
                    <Eye className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100" />
                  </button>
                ) : null}
              </div>

              {/* Word Input Blank (Gạch chân ____ sáng rực rỡ khi active, hoặc hiện từ xanh lá khi đã gợi ý) */}
              <div className="relative flex items-center justify-center">
                {isRevealed ? (
                  <div
                    style={inputWidthStyle}
                    className="text-center font-black text-sm sm:text-base text-[#00c950] border-b-2 border-[#00c950] pb-1 tracking-wide"
                  >
                    {targetWord}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      value={userVal}
                      onFocus={() => setFocusedIndex(idx)}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      style={inputWidthStyle}
                      placeholder="____"
                      className={`text-center font-black text-sm sm:text-base bg-transparent border-b-2 outline-none pb-1 transition-all ${
                        isChecked
                          ? isCorrect
                            ? 'border-[#00c950] text-[#00c950] font-black'
                            : 'border-rose-500 text-rose-500 font-bold bg-rose-500/5'
                          : isFocused
                          ? 'border-[#00c950] text-[#00c950] shadow-sm drop-shadow-[0_2px_8px_rgba(0,201,80,0.35)]'
                          : isLight
                          ? 'border-slate-300 text-slate-800 placeholder-slate-400 focus:border-[#00c950]'
                          : 'border-slate-700 text-white placeholder-slate-500 focus:border-[#00c950]'
                      }`}
                    />

                    {/* Glowing highlight indicator under active slot */}
                    {isFocused && !isChecked && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00c950] rounded-full animate-pulse shadow-[0_0_8px_#00c950]" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Footer Instructions (Khớp Ảnh 28.png) */}
      <p className={`text-[12px] font-bold text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
        Space để sang từ tiếp theo • Backspace ở ô trống để quay lại
      </p>

      {/* 4. Action Buttons (Bỏ qua & Kiểm tra xanh lá #00c950 - Khớp chuẩn 28.png) */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSkip}
          className={`px-5 py-2.5 rounded-xl font-black text-xs cursor-pointer transition-colors ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-[#121c2b]'
          }`}
        >
          Bỏ qua
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-7 py-2.5 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer transition-all hover:scale-105"
        >
          Kiểm tra
        </button>
      </div>
    </div>
  );
}
