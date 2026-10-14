'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Flame,
  Volume2,
  Languages,
  Headphones,
  Edit3,
  BookOpen,
  GraduationCap,
  Sparkles,
  Gamepad2,
  PenTool,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useThemeStore } from '@/stores/useThemeStore';

export default function RoadmapPage() {
  const { targetLanguage, setTargetLanguage } = useLanguageStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const isChinese = targetLanguage === 'zh';

  const [activeStage, setActiveStage] = useState<number>(1);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      {/* 1. TOP BREADCRUMB & SOVEREIGNTY NOTE */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-cartoon text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#c53428] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trang chủ</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fffdfa] dark:bg-stone-900 border-2 border-stone-800 rounded-xl shadow-[2px_2px_0px_#292524]">
          <span className="text-xs">🇻🇳</span>
          <span className="font-cartoon text-xs uppercase tracking-wider text-[#c53428] font-black">
            Hoàng Sa, Trường Sa là của Việt Nam
          </span>
        </div>
      </div>

      {/* 2. ROADMAP TITLE WITH CARTOON STICKER & MASCOT */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-3xl shadow-[3px_3px_0px_#292524] shrink-0">
            🐼
          </div>
          <div className="relative inline-block">
            <span className="bg-[#f6b73c] text-stone-900 font-cartoon text-2xl sm:text-3xl font-black px-4 py-1 rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] -rotate-1 inline-block">
              Lộ trình
            </span>
          </div>
        </div>

        <p className="font-body text-sm sm:text-base text-stone-700 dark:text-stone-300 max-w-3xl leading-relaxed">
          Một con đường liền mạch từ bảng ngữ âm căn bản (IPA & Pinyin) đến phản xạ tự nhiên & thi chứng chỉ TOEIC / HSK.
          Đã có nền tảng? <strong className="text-stone-900 dark:text-white font-bold">Vào thẳng chặng bạn muốn</strong> — không bắt buộc học lại từ đầu.
        </p>

        {/* TRACK SWITCHER TABS (Bilingual Dual Track) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setTargetLanguage('en')}
            className={`px-4 py-2.5 rounded-xl font-cartoon text-xs sm:text-sm font-bold flex items-center gap-2 border-2 border-stone-800 transition-all cursor-pointer ${
              !isChinese
                ? 'bg-amber-300 text-stone-900 shadow-[3px_3px_0px_#292524] scale-[1.02]'
                : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100'
            }`}
          >
            <span>🇬🇧</span>
            <span>Lộ trình Tiếng Anh (IPA → Phản xạ → TOEIC/IELTS)</span>
          </button>

          <button
            onClick={() => setTargetLanguage('zh')}
            className={`px-4 py-2.5 rounded-xl font-cartoon text-xs sm:text-sm font-bold flex items-center gap-2 border-2 border-stone-800 transition-all cursor-pointer ${
              isChinese
                ? 'bg-[#c53428] text-white shadow-[3px_3px_0px_#292524] scale-[1.02]'
                : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-red-50'
            }`}
          >
            <span>🇨🇳</span>
            <span>Lộ trình Tiếng Trung (Pinyin → HSK 1–6)</span>
          </button>
        </div>
      </div>

      {/* 3. HERO PROGRESS CARD: "HÀNH TRÌNH CỦA BẠN 🚩" */}
      <section className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 box-sketch relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">Hành trình của bạn</span>
              <span className="text-xl">🚩</span>
              <span className="px-2 py-0.5 rounded-full bg-[#c53428] text-white font-cartoon text-[11px] font-bold border border-stone-800">
                🔥 Streak 7 ngày
              </span>
            </div>
            <p className="font-hand text-base text-stone-700 dark:text-stone-300">
              Bạn đang ở: <strong className="text-stone-900 dark:text-white font-cartoon text-sm">
                {isChinese ? 'Chặng 1 • Bảng Ngữ Âm Pinyin & 214 Bộ Thủ' : 'Chặng 1 • Bảng Phiên Âm IPA & Nối Âm Căn Bản'}
              </strong>
            </p>
          </div>

          <Link
            href={isChinese ? "/practice/pinyin-radicals" : "/practice"}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-amber-200 hover:bg-[#c53428] hover:text-white font-cartoon text-xs sm:text-sm font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>Tiếp tục học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Progress rail */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-4 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-800 p-0.5 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full border-r border-stone-800 transition-all duration-500" style={{ width: '28%' }} />
          </div>
          <div className="flex items-center justify-between font-hand text-sm text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã hoàn thành 7/25 bài học nhỏ</span>
            </span>
            <span className="font-bold text-stone-900 dark:text-white font-cartoon text-xs">28% toàn lộ trình</span>
          </div>
        </div>
      </section>

      {/* 4. ROADMAP SPINE & MILESTONES (Vertical Path) */}
      <div className="relative pl-6 sm:pl-14 pt-2">
        {/* Connecting central vertical spine line */}
        <div className="absolute left-10 sm:left-18 top-6 bottom-10 w-1.5 bg-stone-300 dark:bg-stone-700 -translate-x-1/2 rounded-full" />

        {/* STAGE 1: BẢNG NGỮ ÂM & PINYIN (CURRENT) */}
        <div className="relative flex items-start gap-4 sm:gap-6 mb-10 group">
          {/* Milestone Left Badge Node */}
          <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-300 border-2 border-stone-800 text-stone-900 flex flex-col items-center justify-center font-cartoon font-bold shadow-[3px_3px_0px_#292524] shrink-0">
            <span className="text-xl sm:text-2xl leading-none">{isChinese ? '拼音' : 'IPA'}</span>
            <span className="text-[10px] tracking-tight opacity-90 font-black">{isChinese ? 'Pinyin' : '44 Âm'}</span>
          </div>

          {/* Main Milestone Card */}
          <div className="w-full bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-5 sm:p-6 box-sketch transition-all hover:-translate-y-0.5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-cartoon text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  Chặng 1: Bảng Ngữ Âm & Phát Âm Căn Bản
                </h2>
                <span className="washi-tape-yellow px-2.5 py-0.5 rounded font-cartoon text-xs font-black text-stone-900 uppercase">
                  Nhập môn
                </span>
              </div>
              <div className="flex items-center gap-2 self-start">
                <span className="px-3 py-1 rounded-xl bg-stone-900 text-amber-200 font-cartoon text-xs font-bold border border-stone-800">
                  Đang học
                </span>
                <Link
                  href={isChinese ? "/practice/pinyin-radicals" : "/practice"}
                  className="w-8 h-8 rounded-xl bg-amber-300 border-2 border-stone-800 flex items-center justify-center text-stone-900 shadow-[1px_1px_0px_#292524] hover:bg-amber-400 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <p className="font-body text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
              {isChinese
                ? 'Nền tảng phát âm chuẩn Bắc Kinh: 23 thanh mẫu, vận mẫu, 4 thanh điệu Pinyin, 214 Bộ thủ Khang Hy và 7 quy tắc nét thuần bút.'
                : 'Nền tảng phát âm chuẩn bản xứ: 44 âm IPA tiếng Anh, nguyên âm đơn, nguyên âm đôi, phụ âm bật hơi và quy tắc nối âm, nuốt âm.'}
            </p>

            {/* Sub-skill Pill Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href={isChinese ? "/practice/pinyin-radicals" : "/practice"}
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Bảng phát âm tương tác</span>
              </Link>

              {isChinese ? (
                <>
                  <Link
                    href="/practice/hanzi-writer"
                    className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#c53428]" />
                    <span>Vở tập viết ô Mễ/Điền A4</span>
                  </Link>

                  <Link
                    href="/practice/pinyin-radicals"
                    className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>214 Bộ thủ & 7 nét bút</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dictation-shadowing"
                    className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
                  >
                    <Headphones className="w-3.5 h-3.5 text-blue-600" />
                    <span>Quy tắc nối âm & trọng âm</span>
                  </Link>

                  <Link
                    href="/vocabulary"
                    className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>500 Từ vựng phát âm mẫu</span>
                  </Link>
                </>
              )}
            </div>

            {/* Progress Bar in Milestone */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-800 overflow-hidden p-0.5">
                <div className="h-full bg-amber-400 rounded-full border-r border-stone-800" style={{ width: '55%' }} />
              </div>
              <span className="font-cartoon text-xs text-stone-600 dark:text-stone-400 font-bold">55% hoàn tất</span>
            </div>
          </div>
        </div>

        {/* STAGE 2: PHẢN XẠ CÂU & NHẠI GIỌNG (SƠ CẤP) */}
        <div className="relative flex items-start gap-4 sm:gap-6 mb-10 group">
          <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-teal-200 border-2 border-stone-800 text-stone-900 flex flex-col items-center justify-center font-cartoon font-bold shadow-[3px_3px_0px_#292524] shrink-0">
            <span className="text-xl sm:text-2xl leading-none">{isChinese ? '1-2级' : 'A1-A2'}</span>
            <span className="text-[10px] tracking-tight opacity-90 font-black">Sơ cấp</span>
          </div>

          <div className="w-full bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-5 sm:p-6 box-sketch transition-all hover:-translate-y-0.5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-cartoon text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  Chặng 2: Phản Xạ Câu & Nhại Giọng Cơ Bản
                </h2>
                <span className="px-2.5 py-0.5 rounded bg-teal-100 border border-stone-800 font-cartoon text-xs font-bold text-teal-950">
                  {isChinese ? 'HSK 1 - 2' : 'CEFR A1 - A2'}
                </span>
              </div>
              <Link
                href="/dictation-shadowing"
                className="px-4 py-1.5 rounded-xl bg-amber-300 text-stone-900 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press self-start"
              >
                Vào học ➔
              </Link>
            </div>

            <p className="font-body text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
              {isChinese
                ? '500 từ vựng cốt lõi HSK 1-2 & 300 mẫu câu giao tiếp đời thường. Luyện dẻo cơ miệng với Shadowing 3 bước theo video đời thực kèm phản xạ sắp xếp từ vựng.'
                : '1.000 từ vựng căn bản Oxford & cấu trúc câu thông dụng. Luyện nghe ngắt quãng Dictation dứt câu và nhại lại giọng người bản xứ không dịch thầm.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href="/dictation-shadowing?mode=shadowing"
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <Languages className="w-3.5 h-3.5 text-teal-600" />
                <span>Luyện nhại giọng (Shadowing)</span>
              </Link>

              <Link
                href="/tro-choi"
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Xếp từ & Phản xạ 3s</span>
              </Link>

              <Link
                href="/dictation-shadowing?mode=dictation"
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#c53428]" />
                <span>Nghe chép chính tả mini</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-800 overflow-hidden p-0.5">
                <div className="h-full bg-teal-500 rounded-full border-r border-stone-800" style={{ width: '20%' }} />
              </div>
              <span className="font-cartoon text-xs text-stone-600 dark:text-stone-400 font-bold">20% hoàn tất</span>
            </div>
          </div>
        </div>

        {/* STAGE 3: GIAO TIẾP ĐỜI SỐNG & BÀI KHOÁ (TRUNG CẤP) */}
        <div className="relative flex items-start gap-4 sm:gap-6 mb-10 group">
          <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-200 border-2 border-stone-800 text-stone-900 flex flex-col items-center justify-center font-cartoon font-bold shadow-[3px_3px_0px_#292524] shrink-0">
            <span className="text-xl sm:text-2xl leading-none">{isChinese ? '3-4级' : 'B1-B2'}</span>
            <span className="text-[10px] tracking-tight opacity-90 font-black">Trung cấp</span>
          </div>

          <div className="w-full bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-5 sm:p-6 box-sketch transition-all hover:-translate-y-0.5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-cartoon text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  Chặng 3: Giao Tiếp Đời Sống & Đọc Hiểu Bài Khoá
                </h2>
                <span className="px-2.5 py-0.5 rounded bg-blue-100 border border-stone-800 font-cartoon text-xs font-bold text-blue-950">
                  {isChinese ? 'HSK 3 - 4' : 'CEFR B1 - B2'}
                </span>
              </div>
              <Link
                href={isChinese ? "/practice/chinese-reading" : "/practice"}
                className="px-4 py-1.5 rounded-xl bg-amber-300 text-stone-900 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press self-start"
              >
                Vào học ➔
              </Link>
            </div>

            <p className="font-body text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
              {isChinese
                ? 'Đọc hiểu bài khoá thực tế với công nghệ tra từ Inline Popover 1-chạm. Xem phim hoạt hình, phỏng vấn, talkshow có phụ đề 3 dòng và ghi nhớ qua thuật toán ngắt quãng SM-2.'
                : 'Đọc truyện song ngữ và báo chí quốc tế tra từ tức thì. Luyện phản xạ See & Write câu dài dưới áp lực thời gian để viết trôi chảy trong công việc.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href={isChinese ? "/practice/chinese-reading" : "/practice/bilingual-news"}
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>{isChinese ? 'Bài khoá HSK tra từ 1-chạm' : 'Truyện song ngữ tra từ'}</span>
              </Link>

              <Link
                href="/vocabulary"
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Sổ từ vựng Flashcard SM-2</span>
              </Link>

              <Link
                href="/practice/see-write"
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <PenTool className="w-3.5 h-3.5 text-[#c53428]" />
                <span>Viết phản xạ See & Write</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-800 overflow-hidden p-0.5">
                <div className="h-full bg-blue-500 rounded-full border-r border-stone-800" style={{ width: '0%' }} />
              </div>
              <span className="font-cartoon text-xs text-stone-600 dark:text-stone-400 font-bold">Chưa bắt đầu</span>
            </div>
          </div>
        </div>

        {/* STAGE 4: THÀNH THẠO & THI CHỨNG CHỈ (CAO CẤP) */}
        <div className="relative flex items-start gap-4 sm:gap-6 mb-4 group">
          <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-rose-200 border-2 border-stone-800 text-stone-900 flex flex-col items-center justify-center font-cartoon font-bold shadow-[3px_3px_0px_#292524] shrink-0">
            <span className="text-xl sm:text-2xl leading-none">🏆</span>
            <span className="text-[10px] tracking-tight opacity-90 font-black">{isChinese ? 'HSK 5-6' : 'IELTS/TOEIC'}</span>
          </div>

          <div className="w-full bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-5 sm:p-6 box-sketch transition-all hover:-translate-y-0.5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-cartoon text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  Chặng 4: Luyện Thi Chứng Chỉ & Thành Thạo Bản Ngữ
                </h2>
                <span className="px-2.5 py-0.5 rounded bg-rose-100 border border-stone-800 font-cartoon text-xs font-bold text-rose-950">
                  {isChinese ? 'HSK 5 - 6 & HSKK' : 'TOEIC 850+ & IELTS 7.5+'}
                </span>
              </div>
              <Link
                href="/kho-de"
                className="px-4 py-1.5 rounded-xl bg-amber-300 text-stone-900 font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press self-start"
              >
                Vào thi thử ➔
              </Link>
            </div>

            <p className="font-body text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
              {isChinese
                ? 'Thi thử chuẩn đề thi HSK 1 - 6 và phòng thi khẩu ngữ HSKK bấm giờ tự nộp. Nắm vững thành ngữ bốn chữ và phân tích văn bản học thuật.'
                : 'Bộ đề thi TOEIC Listening & Reading đầy đủ 200 câu và đề thi IELTS Academic. Đồng hồ đếm ngược, tự động chấm điểm và giải thích chi tiết từng câu.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href="/kho-de"
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                <span>Kho đề thi thử chuẩn format</span>
              </Link>

              <Link
                href="/kho-de"
                className="px-3 py-1.5 rounded-xl bg-[#fff9ea] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 text-xs font-cartoon font-bold shadow-[1.5px_1.5px_0px_#292524] hover:bg-amber-200 transition-all flex items-center gap-1.5"
              >
                <Languages className="w-3.5 h-3.5 text-amber-600" />
                <span>{isChinese ? 'Phòng thi khẩu ngữ HSKK' : 'IELTS Challenge'}</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-800 overflow-hidden p-0.5">
                <div className="h-full bg-rose-500 rounded-full border-r border-stone-800" style={{ width: '0%' }} />
              </div>
              <span className="font-cartoon text-xs text-stone-600 dark:text-stone-400 font-bold">Chưa bắt đầu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
