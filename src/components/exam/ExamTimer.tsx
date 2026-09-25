'use client';

import { useEffect } from 'react';
import { Clock, AlertTriangle, Infinity as InfinityIcon } from 'lucide-react';

interface ExamTimerProps {
  remainingSeconds: number;
  isUnlimited?: boolean;
  onTick: () => void;
  onTimeUp: () => void;
}

export default function ExamTimer({ remainingSeconds, isUnlimited = false, onTick, onTimeUp }: ExamTimerProps) {
  useEffect(() => {
    if (isUnlimited) return;

    if (remainingSeconds <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, isUnlimited, onTick, onTimeUp]);

  if (isUnlimited) {
    return (
      <div className="px-3.5 py-1.5 rounded-xl border border-[#1e2d42] bg-[#0e1726] text-emerald-400 font-black text-xs flex items-center gap-1.5 shadow-sm">
        <InfinityIcon className="w-4 h-4" />
        <span>Không giới hạn</span>
      </div>
    );
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 0; // Warning when < 5 mins

  return (
    <div
      className={`px-3.5 py-1.5 rounded-xl border font-black text-xs flex items-center gap-1.5 transition-all ${
        isWarning
          ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse shadow-md'
          : 'bg-[#0e1726] text-amber-400 border-[#1e2d42]'
      }`}
    >
      {isWarning ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
