'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Headphones, Mic, BookOpen } from 'lucide-react';
import { DictationLesson } from '@/lib/types';

interface PracticeModeModalProps {
  isOpen: boolean;
  lesson: DictationLesson | null;
  onClose: () => void;
}

export default function PracticeModeModal({
  isOpen,
  lesson,
  onClose,
}: PracticeModeModalProps) {
  const router = useRouter();

  if (!isOpen || !lesson) return null;

  const handleSelectMode = (mode: 'dictation' | 'shadowing' | 'transcript') => {
    onClose();
    router.push(`/dictation-shadowing/${lesson.id}?mode=${mode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Chọn chế độ luyện tập
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Chọn chế độ học phù hợp với bạn nhất
          </p>
        </div>

        {/* 3 Large Mode Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Card 1: Dictation */}
          <button
            type="button"
            onClick={() => handleSelectMode('dictation')}
            className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0d1522] border border-[#1e2d42] hover:border-emerald-500 hover:bg-[#122132] transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#132235] border border-[#22354e] group-hover:border-emerald-500/50 flex items-center justify-center mb-4 transition-colors">
              <Headphones className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
              Dictation
            </span>
          </button>

          {/* Card 2: Shadowing */}
          <button
            type="button"
            onClick={() => handleSelectMode('shadowing')}
            className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0d1522] border border-[#1e2d42] hover:border-emerald-500 hover:bg-[#122132] transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#132235] border border-[#22354e] group-hover:border-emerald-500/50 flex items-center justify-center mb-4 transition-colors">
              <Mic className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
              Shadowing
            </span>
          </button>

          {/* Card 3: Transcript */}
          <button
            type="button"
            onClick={() => handleSelectMode('transcript')}
            className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0d1522] border border-[#1e2d42] hover:border-emerald-500 hover:bg-[#122132] transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#132235] border border-[#22354e] group-hover:border-emerald-500/50 flex items-center justify-center mb-4 transition-colors">
              <BookOpen className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
              Transcript
            </span>
          </button>
        </div>

        {/* Selected Video Footer */}
        <div className="text-center pt-2 border-t border-[#1e2d42]">
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
            Video đã chọn: <span className="font-bold text-slate-200">{lesson.title}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
