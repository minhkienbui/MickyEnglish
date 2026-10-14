'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  PenTool,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { HSK_BOOKS, HskBookCourse } from '@/data/hskLessonsData';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useThemeStore } from '@/stores/useThemeStore';

export default function CourseLevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelSlug = (params.level as string) || 'hsk1';

  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const { setTargetLanguage } = useLanguageStore();

  const [activeSkillTab, setActiveSkillTab] = useState<'vocab' | 'grammar' | 'hanzi'>('vocab');

  // Look up course book
  const book: HskBookCourse = HSK_BOOKS[levelSlug] || HSK_BOOKS.hsk1;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6 font-sans">
      {/* 1. TOP BREADCRUMB & SOVEREIGNTY BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/vocabulary"
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

      {/* 2. HERO COURSE HEADER (Nhai HSK Book Header) */}
      <div className="relative bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 sm:p-8 box-sketch flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-start sm:items-center gap-5">
          {/* Crimson Red Book Cover */}
          <div className="w-20 sm:w-24 h-28 sm:h-32 rounded-xl paper-texture-red border-2 border-stone-800 shadow-[4px_4px_0px_#292524] flex flex-col items-center justify-center text-center p-2 text-white shrink-0 relative overflow-hidden group">
            <span className="font-hand text-[10px] text-amber-200">Nhai</span>
            <span className="font-cartoon text-base sm:text-lg font-black tracking-tight leading-tight">
              {book.coverTitle}
            </span>
            <div className="w-full h-1 bg-[#f6b73c] mt-2 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-stone-900 text-amber-200 font-cartoon text-xs font-black border border-stone-800">
                HSK {book.levelNumber}
              </span>
              <span className="font-hand text-sm text-stone-600 dark:text-stone-400 font-bold">
                {book.lessonCount} bài học
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📖</span>
              <h1 className="washi-tape-yellow px-3 py-0.5 rounded-lg font-cartoon text-2xl sm:text-3xl font-black text-stone-900 inline-block -rotate-1">
                HSK {book.levelNumber} 3.0
              </h1>
            </div>

            <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
              {book.standardTitle} • {book.wordCountTotal} từ vựng chuẩn HSK 3.0 & {book.patternCountTotal} cấu trúc ngữ pháp.
            </p>
          </div>
        </div>

        {/* Level Switcher Quick Dropdown */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Link
              key={num}
              href={`/course/hsk${num}`}
              className={`px-3 py-1.5 rounded-xl font-cartoon text-xs font-bold border-2 border-stone-800 transition-all ${
                book.levelNumber === num
                  ? 'bg-[#c53428] text-white shadow-[2px_2px_0px_#292524]'
                  : 'bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-300 hover:bg-amber-200 shadow-xs'
              }`}
            >
              HSK {num}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. KỸ NĂNG TAB SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="font-cartoon text-xs font-black uppercase text-stone-500 mr-1">
            KỸ NĂNG
          </span>

          <button
            onClick={() => setActiveSkillTab('vocab')}
            className={`px-4 py-2 rounded-xl font-cartoon text-xs font-bold border-2 border-stone-800 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSkillTab === 'vocab'
                ? 'bg-stone-900 text-white shadow-[2px_2px_0px_#292524]'
                : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
            }`}
          >
            <span>文A</span>
            <span>Từ vựng • 词汇</span>
          </button>

          <button
            onClick={() => setActiveSkillTab('grammar')}
            className={`px-4 py-2 rounded-xl font-cartoon text-xs font-bold border-2 border-stone-800 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSkillTab === 'grammar'
                ? 'bg-stone-900 text-white shadow-[2px_2px_0px_#292524]'
                : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Ngữ pháp • 语法</span>
          </button>

          <Link
            href="/practice/hanzi-writer"
            className="px-4 py-2 rounded-xl font-cartoon text-xs font-bold border-2 border-stone-800 bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs transition-all flex items-center gap-1.5"
          >
            <PenTool className="w-3.5 h-3.5 text-[#c53428]" />
            <span>Chữ Hán • 汉字</span>
          </Link>
        </div>

        <Link
          href={`/course/${levelSlug}/bai-1`}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all self-start sm:self-auto"
        >
          Học Bài 1 Ngay ➔
        </Link>
      </div>

      {/* 4. PROGRESS BAR */}
      <div className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-4 box-sketch-sm space-y-2">
        <div className="flex items-center justify-between font-cartoon text-xs text-stone-700 dark:text-stone-300 font-bold">
          <span>Tiến độ học</span>
          <span className="font-mono">0/{book.lessonCount} bài • 0%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-800 overflow-hidden p-0.5">
          <div className="h-full bg-amber-400 rounded-full border-r border-stone-800" style={{ width: '0%' }} />
        </div>
      </div>

      {/* 5. LESSON LIST (BÀI HỌC) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-cartoon text-xs font-black uppercase text-stone-500">
            DANH SÁCH BÀI HỌC ({book.lessons.length} BÀI)
          </span>
        </div>

        <div className="space-y-2.5">
          {book.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/course/${levelSlug}/${lesson.id}`}
              className="group bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl p-4 box-sketch-sm flex items-center justify-between hover:bg-[#fff9ea] dark:hover:bg-stone-900 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Number Box */}
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border-2 border-stone-800 flex items-center justify-center font-cartoon font-bold text-sm text-stone-900 dark:text-white shrink-0 group-hover:bg-amber-300 transition-colors">
                  {lesson.lessonNumber}
                </div>

                <div className="min-w-0">
                  <h3 className="font-cartoon text-sm sm:text-base font-bold text-stone-900 dark:text-white group-hover:text-[#c53428] transition-colors truncate">
                    {lesson.title}
                  </h3>
                  <p className="font-hand text-xs text-stone-500 mt-0.5">
                    {lesson.wordCount} từ vựng HSK • Có bài tập trắc nghiệm & gõ từ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
