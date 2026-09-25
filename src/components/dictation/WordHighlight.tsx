'use client';

import React, { useMemo } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

export type WordStatus = 'correct' | 'wrong' | 'pending';

export interface WordHighlightProps {
  originalSentence: string;
  spokenWords: string[];
  interimText?: string;
  isListening?: boolean;
  className?: string;
}

/**
 * Chuẩn hóa từ vựng: chuyển chữ thường, loại bỏ toàn bộ dấu câu và ký tự đặc biệt
 */
export function normalizeWord(word: string): string {
  return (word || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Thuật toán so khớp từng từ giữa câu gốc và các từ người dùng đã nói (Zero Delay)
 */
export function compareWordsLevel(
  originalSentence: string,
  spokenWords: string[]
): {
  tokens: { word: string; status: WordStatus; matchedWith?: string }[];
  correctCount: number;
  totalCount: number;
  accuracy: number;
} {
  const originalWords = (originalSentence || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (originalWords.length === 0) {
    return { tokens: [], correctCount: 0, totalCount: 0, accuracy: 0 };
  }

  const cleanSpoken = spokenWords.map(normalizeWord).filter(Boolean);
  let correctCount = 0;
  let spokenIndex = 0;

  const tokens = originalWords.map((origWord) => {
    const cleanOrig = normalizeWord(origWord);

    // Nếu người dùng chưa nói đến độ dài này
    if (spokenIndex >= cleanSpoken.length) {
      return {
        word: origWord,
        status: 'pending' as WordStatus,
      };
    }

    // 1. Kiểm tra khớp chính xác tại vị trí hiện tại
    if (cleanSpoken[spokenIndex] === cleanOrig) {
      correctCount++;
      const matched = cleanSpoken[spokenIndex];
      spokenIndex++;
      return {
        word: origWord,
        status: 'correct' as WordStatus,
        matchedWith: matched,
      };
    }

    // 2. Tìm kiếm trong cửa sổ gần (Lookahead 2 từ phòng trường hợp nói nhầm / nuốt âm)
    const lookaheadIdx = cleanSpoken
      .slice(spokenIndex, spokenIndex + 3)
      .findIndex((w) => w === cleanOrig);

    if (lookaheadIdx >= 0) {
      correctCount++;
      spokenIndex += lookaheadIdx + 1;
      return {
        word: origWord,
        status: 'correct' as WordStatus,
        matchedWith: cleanOrig,
      };
    }

    // 3. Nếu không khớp và vị trí này đã được nói
    spokenIndex++;
    return {
      word: origWord,
      status: 'wrong' as WordStatus,
    };
  });

  const accuracy = Math.round((correctCount / originalWords.length) * 100);

  return {
    tokens,
    correctCount,
    totalCount: originalWords.length,
    accuracy,
  };
}

/**
 * Component WordHighlight: Render câu tiếng Anh với token chips theo chuẩn Ảnh 2 (27.png)
 * [ hospital, ] [ all ] [ while ] [ shielding ] [ me ] [ and ] [ my ]
 */
export default function WordHighlight({
  originalSentence,
  spokenWords,
  interimText = '',
  isListening = false,
  className = '',
}: WordHighlightProps) {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Gộp interimText (từ đang phát âm) vào spokenWords để có phản hồi tức thì dưới 50ms
  const effectiveSpokenWords = useMemo(() => {
    if (!interimText || !interimText.trim()) return spokenWords;
    const interimList = interimText.trim().split(/\s+/).filter(Boolean);
    return [...spokenWords, ...interimList];
  }, [spokenWords, interimText]);

  const { tokens, correctCount, totalCount, accuracy } = useMemo(() => {
    return compareWordsLevel(originalSentence, effectiveSpokenWords);
  }, [originalSentence, effectiveSpokenWords]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Dòng câu gốc với Token Chips riêng biệt (Chuẩn Ảnh 2) */}
      <div className="flex flex-wrap items-center justify-center gap-2 leading-relaxed">
        {tokens.map((token, idx) => {
          let badgeStyle = '';

          if (token.status === 'correct') {
            badgeStyle = isLight
              ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm font-black scale-105'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/80 shadow-md font-black scale-105';
          } else if (token.status === 'wrong') {
            badgeStyle = isLight
              ? 'bg-rose-50 text-rose-700 border-rose-400 font-bold'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/80 font-bold';
          } else {
            // Mặc định Chưa nói: Chip nổi bật rõ ràng, chuẩn khung ảnh 2
            badgeStyle = isLight
              ? 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 shadow-xs'
              : 'bg-[#182638] text-slate-100 border-[#2a3c54] hover:border-slate-500 shadow-xs';
          }

          return (
            <span
              key={idx}
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl border text-sm sm:text-base font-black transition-all duration-150 ${badgeStyle}`}
            >
              {token.word}
            </span>
          );
        })}
      </div>

      {/* 2. Hiển thị % độ chính xác dạng thanh tiến trình */}
      {effectiveSpokenWords.length > 0 && (
        <div className={`pt-3 border-t space-y-1.5 animate-fade-in ${isLight ? 'border-slate-200' : 'border-[#1e2d42]'}`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
              Độ chính xác từ vựng: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{correctCount}/{totalCount} từ ({accuracy}%)</strong>
            </span>
            <span
              className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${
                accuracy >= 80
                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40'
                  : accuracy >= 50
                  ? 'bg-amber-500/15 text-amber-500 border-amber-500/40'
                  : 'bg-rose-500/15 text-rose-500 border-rose-500/40'
              }`}
            >
              {accuracy >= 80 ? '🌟 Phát âm chuẩn' : accuracy >= 50 ? '👍 Khá tốt' : '⚡ Cần luyện lại'}
            </span>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#0e1726] border-[#1e2d42]'}`}>
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                accuracy >= 80 ? 'bg-[#00c950]' : accuracy >= 50 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
