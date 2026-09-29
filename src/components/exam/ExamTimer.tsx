'use client';

import { useEffect } from 'react';
import { Clock, AlertTriangle, Timer, Hourglass } from 'lucide-react';
import { ExamMode } from '@/stores/useExamStore';

interface ExamTimerProps {
  mode: ExamMode; // 'practice' (Luyện đề) | 'exam' (Thi thử)
  remainingSeconds: number; // for exam mode
  elapsedSeconds?: number; // for practice mode
  onTickRemaining?: () => void;
  onTickElapsed?: () => void;
  onTimeUp?: () => void;
}

export default function ExamTimer({
  mode,
  remainingSeconds,
  elapsedSeconds = 0,
  onTickRemaining,
  onTickElapsed,
  onTimeUp,
}: ExamTimerProps) {
  // Practice Mode: Đồng hồ đếm xuôi (Stopwatch) không giới hạn thời gian
  useEffect(() => {
    if (mode !== 'practice') return;

    const timer = setInterval(() => {
      if (onTickElapsed) onTickElapsed();
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, onTickElapsed]);

  // Exam Mode: Đồng hồ đếm ngược (Countdown) có tự động nộp bài
  useEffect(() => {
    if (mode !== 'exam') return;

    if (remainingSeconds <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      if (onTickRemaining) onTickRemaining();
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, remainingSeconds, onTickRemaining, onTimeUp]);

  // RENDER PRACTICE MODE: Đếm giờ làm bài
  if (mode === 'practice') {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;

    return (
      <div
        className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
        title="Thời gian luyện đề (Không giới hạn)"
      >
        <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
        <span>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // RENDER EXAM MODE: Đếm ngược
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 0; // Cảnh báo khi còn dưới 5 phút

  return (
    <div
      className={`px-3.5 py-1.5 rounded-xl border font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm ${
        isWarning
          ? 'bg-rose-950/90 text-rose-300 border-rose-500 animate-pulse shadow-rose-900/50'
          : 'bg-[#0e1726] text-amber-400 border-amber-500/40'
      }`}
      title="Thời gian còn lại (Tự động nộp khi hết giờ)"
    >
      {isWarning ? (
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
      ) : (
        <Hourglass className="w-3.5 h-3.5 text-amber-400" />
      )}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
