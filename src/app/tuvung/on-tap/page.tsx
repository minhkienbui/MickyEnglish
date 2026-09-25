'use client';

import { useState, useEffect } from 'react';
import Flashcard from '@/components/vocab/Flashcard';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, Brain, Loader2, Sparkles } from 'lucide-react';
import { useVocabStore } from '@/stores/useVocabStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ReviewPage() {
  const { words: fallbackWords, rateWord } = useVocabStore();
  const { incrementProgress } = useAuthStore();
  const [dueWords, setDueWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDueWords() {
      try {
        setLoading(true);
        const res = await fetch('/api/vocabulary/due');
        const data = await res.json();
        if (data.success && data.words && data.words.length > 0) {
          setDueWords(data.words);
        } else {
          setDueWords(fallbackWords);
        }
      } catch (err) {
        setDueWords(fallbackWords);
      } finally {
        setLoading(false);
      }
    }

    fetchDueWords();
  }, [fallbackWords]);

  const currentWord = dueWords[currentIndex];

  const handleRate = async (rating: any) => {
    if (!currentWord) return;

    // Call real review API
    try {
      fetch('/api/vocabulary/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: currentWord.id,
          rating,
        }),
      });
    } catch (e) {
      console.error('Error submitting review to backend:', e);
    }

    rateWord(currentWord.id, rating);
    setCompletedCount((prev) => prev + 1);
    incrementProgress({ wordsLearned: 1 });

    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex((prev) => prev + 1); // trigger complete screen
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
        <p className="text-xs font-bold text-slate-300">Đang chuẩn bị thẻ từ vựng cần ôn hôm nay...</p>
      </div>
    );
  }

  if (!dueWords || dueWords.length === 0 || currentIndex >= dueWords.length) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-[#121c2b] border border-[#1e2d42] p-8 rounded-3xl space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white">Tuyệt vời! Hoàn thành xuất sắc!</h2>
          <p className="text-xs text-slate-300">
            Bạn đã ôn tập xong tất cả {completedCount || dueWords.length} thẻ từ vựng đến hạn hôm nay theo thuật toán Spaced Repetition (SM-2).
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <Link href="/tuvung" className="btn-micky-primary w-full py-3 text-xs">
              Quay lại danh mục từ vựng
            </Link>
            <Link href="/dictation-shadowing" className="btn-micky-secondary w-full py-3 text-xs">
              Luyện nghe & Chép chính tả
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/tuvung" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại từ vựng
        </Link>
        <span className="badge-micky-green flex items-center gap-1">
          <Brain className="w-3.5 h-3.5" /> Từ {currentIndex + 1} / {dueWords.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1e2d42] h-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300 shadow-sm"
          style={{ width: `${((currentIndex + 1) / dueWords.length) * 100}%` }}
        />
      </div>

      {/* Flashcard Render */}
      <Flashcard word={currentWord} onRate={handleRate} />
    </div>
  );
}
