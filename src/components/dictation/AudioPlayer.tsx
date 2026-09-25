'use client';

import { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Repeat, Zap } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isLooping: boolean;
  onLoopToggle: () => void;
}

export default function AudioPlayer({
  audioUrl,
  speed,
  onSpeedChange,
  isLooping,
  onLoopToggle,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const rewind5s = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const speeds = [0.75, 1.0, 1.25];

  return (
    <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        loop={isLooping}
      />

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={rewind5s}
          className="p-2.5 rounded-full bg-[#0e1726] text-slate-300 hover:text-white border border-[#1e2d42] shadow-xs transition-transform active:scale-95 cursor-pointer"
          title="Tua lại 5 giây"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
          title={isPlaying ? 'Tạm dừng' : 'Phát audio'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
        </button>

        <button
          onClick={onLoopToggle}
          className={`p-2.5 rounded-full border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
            isLooping
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-[#0e1726] text-slate-400 border-[#1e2d42] hover:bg-[#1b2738]'
          }`}
          title="Lặp lại câu hiện tại"
        >
          <Repeat className="w-4 h-4" />
          <span className="hidden sm:inline">Lặp lại</span>
        </button>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5 bg-[#0e1726] p-1.5 rounded-2xl border border-[#1e2d42]">
        <Zap className="w-4 h-4 text-amber-400 ml-1" />
        <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Tốc độ:</span>
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-colors cursor-pointer ${
              speed === s
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:bg-[#1b2738]'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
