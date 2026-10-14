'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Volume2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { HSK_BOOKS } from '@/data/hskLessonsData';

export default function CourseShelfPage() {
  const { user } = useAuthStore();
  const { setTargetLanguage } = useLanguageStore();

  const booksList = [
    {
      slug: 'hsk1',
      title: 'Nhai HSK 1',
      wordsCount: 330,
      patternCount: 41,
      color: '#c53428',
    },
    {
      slug: 'hsk2',
      title: 'Nhai HSK 2',
      wordsCount: 213,
      patternCount: 45,
      color: '#c53428',
    },
    {
      slug: 'hsk3',
      title: 'Nhai HSK 3',
      wordsCount: 483,
      patternCount: 63,
      color: '#c53428',
    },
    {
      slug: 'hsk4',
      title: 'Nhai HSK 4',
      wordsCount: 1000,
      patternCount: 80,
      color: '#c53428',
    },
    {
      slug: 'hsk5',
      title: 'Nhai HSK 5',
      wordsCount: 1600,
      patternCount: 105,
      color: '#c53428',
    },
    {
      slug: 'hsk6',
      title: 'Nhai HSK 6',
      wordsCount: 1800,
      patternCount: 120,
      color: '#c53428',
    },
    {
      slug: 'hsk7-9',
      title: 'Nhai HSK 7–9',
      wordsCount: 2200,
      patternCount: 150,
      color: '#c53428',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      {/* 1. TOP SOVEREIGNTY BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-cartoon text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#c53428] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trang chủ</span>
        </Link>
        <div className="text-right">
          <p className="font-cartoon text-xs uppercase tracking-wider text-[#c53428] font-black">
            HOÀNG SA, TRƯỜNG SA LÀ CỦA VIỆT NAM
          </p>
          <p className="font-body text-[11px] text-[#c53428]/80 dark:text-[#c53428]/60">
            西沙（黄沙）群岛、南沙（长沙）群岛属于越南
          </p>
        </div>
      </div>

      {/* 2. HEADER GREETING (Exact Ảnh 1) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-3xl shadow-[3px_3px_0px_#292524] shrink-0">
            🐼
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-cartoon text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Chào
            </h1>
            <span className="washi-tape-yellow px-3 py-0.5 rounded-lg font-cartoon text-2xl sm:text-3xl font-black text-stone-900 -rotate-1 inline-block">
              {user?.fullName || user?.username || 'kien bui'}
            </span>
            <span className="text-3xl animate-bounce">👋</span>
          </div>
        </div>

        <p className="font-body text-sm sm:text-base font-medium text-stone-800 dark:text-stone-200">
          Tiếp tục hành trình từ vựng tiếng Trung của bạn — mỗi ngày một chút là đủ.
        </p>

        <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
          Nhai HSK là website miễn phí giúp bạn tự học tiếng Trung và luyện thi HSK 3.0 (cấp 1–9): giáo trình từ vựng – ngữ pháp, bảng pinyin, bộ thủ, từ điển, shadowing video và ôn tập ngắt quãng.{' '}
          <Link href="/about" className="font-bold underline text-stone-900 dark:text-white hover:text-[#c53428]">
            Tìm hiểu thêm về Nhai HSK
          </Link>
        </p>

        {/* Community Button */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-hand text-sm text-stone-600 dark:text-stone-400 font-bold">Vào nhóm học cùng mọi người nhé:</span>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fffdfa] dark:bg-stone-800 border-2 border-stone-800 rounded-xl font-cartoon text-xs font-bold shadow-[2px_2px_0px_#292524] btn-press hover:bg-amber-100 transition-all text-stone-900 dark:text-white"
          >
            <span>📘</span>
            <span>Nhai tiếng Trung mỗi ngày</span>
          </a>
        </div>
      </div>

      {/* 3. SECTION TITLE: HSK 3.0 • BẢN CẢI TIẾN */}
      <div className="space-y-1 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 bg-amber-400 border border-stone-800 rounded-xs shadow-xs" />
          <h2 className="font-cartoon text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            HSK 3.0
          </h2>
        </div>
        <p className="font-hand text-sm text-stone-500 pl-5 font-bold">Bản cải tiến</p>
      </div>

      {/* 4. 6 CRIMSON RED BOOK CARDS (Exact Ảnh 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {booksList.map((b) => (
          <Link
            key={b.slug}
            href={`/course/${b.slug}`}
            className="group relative rounded-2xl overflow-hidden box-sketch flex flex-col justify-between cursor-pointer btn-press transition-transform hover:-translate-y-1"
          >
            {/* Top Red Texture Body */}
            <div className="paper-texture-red h-40 sm:h-44 p-6 flex flex-col items-center justify-center text-center text-white relative">
              <span className="font-cartoon text-2xl sm:text-3xl font-black tracking-tight leading-tight group-hover:text-amber-200 transition-colors drop-shadow-sm">
                {b.title}
              </span>
            </div>

            {/* Bottom Yellow Washi Strip */}
            <div className="bg-[#f6b73c] border-t-2 border-stone-800 px-5 py-3 flex items-center justify-between text-stone-900">
              <span className="font-cartoon text-xs sm:text-sm font-bold tracking-tight">
                {b.wordsCount} từ vựng • {b.patternCount} mẫu
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
