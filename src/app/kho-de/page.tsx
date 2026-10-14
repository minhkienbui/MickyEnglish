'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Headphones,
  CheckCircle2,
  Search,
  Filter,
  Users,
  GraduationCap,
  Layers,
  Zap,
  BookOpen,
  Upload,
  FileText,
  Download,
  Trash2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useExamStore } from '@/stores/useExamStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { mockHskExams } from '@/data/mockHskExams';
import { ExamPaper } from '@/lib/types';
import ExamStartModal from '@/components/exam/ExamStartModal';
import AddExamModal from '@/components/exam/AddExamModal';

export default function ExamBankPage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const { user } = useAuthStore();
  const { exams, deleteCustomExam } = useExamStore();
  const { targetLanguage } = useLanguageStore();
  const isChinese = targetLanguage === 'zh';

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamForModal, setSelectedExamForModal] = useState<ExamPaper | null>(null);
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);

  const englishCategories = [
    'Tất cả',
    '📁 Đề của tôi',
    'Căn bản (A1 - A2)',
    'Trung cấp (B1 - B2)',
    'Nâng cao (C1)',
    'TOEIC',
    'IELTS',
    'VSTEP',
  ];

  const chineseCategories = [
    'Tất cả',
    '📁 Đề của tôi',
    'HSK 1',
    'HSK 2',
    'HSK 3',
    'HSK 4',
    'HSKK Khẩu ngữ',
  ];

  const categories = isChinese ? chineseCategories : englishCategories;

  // Hợp nhất đề thi theo ngôn ngữ đang chọn
  const baseExams = useMemo(() => {
    if (isChinese) {
      const customZh = exams.filter((e) => e.isCustom && (e.type === 'HSK' || e.type === 'HSKK' || e.level?.includes('HSK')));
      return [...mockHskExams, ...customZh];
    }
    return exams;
  }, [isChinese, exams]);

  const filteredExams = useMemo(() => {
    return baseExams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        exam.type.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCat = true;
      if (activeCategory === '📁 Đề của tôi') {
        matchesCat = Boolean(exam.isCustom || exam.fileUrl);
      } else if (isChinese) {
        if (activeCategory === 'HSKK Khẩu ngữ') {
          matchesCat = exam.type === 'HSKK';
        } else if (activeCategory.startsWith('HSK')) {
          matchesCat = exam.level === activeCategory || exam.title.includes(activeCategory);
        }
      } else {
        if (activeCategory === 'Căn bản (A1 - A2)') {
          matchesCat = exam.level === 'A1' || exam.level === 'A2';
        } else if (activeCategory === 'Trung cấp (B1 - B2)') {
          matchesCat = exam.level === 'B1' || exam.level === 'B2';
        } else if (activeCategory === 'Nâng cao (C1)') {
          matchesCat = exam.level === 'C1';
        } else if (activeCategory === 'TOEIC') {
          matchesCat = exam.type === 'TOEIC';
        } else if (activeCategory === 'IELTS') {
          matchesCat = exam.type === 'IELTS';
        } else if (activeCategory === 'VSTEP') {
          matchesCat = exam.type === 'VSTEP';
        }
      }

      return matchesSearch && matchesCat;
    });
  }, [baseExams, isChinese, activeCategory, searchQuery]);

  const masterExam = !isChinese ? exams.find((e) => e.id === 'oxford-3000-master-exam') : null;
  const regularExams = filteredExams.filter((e) => e.id !== 'oxford-3000-master-exam');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* 1. HEADER KHU VỰC THI THỬ & LUYỆN ĐỀ (NOTEBOOK CARTOON STYLE)            */}
      {/* ========================================================================= */}
      <div className="relative bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 sm:p-8 box-sketch flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        {/* Washi tape sticker label */}
        <div className="absolute -top-3 left-8 washi-tape-yellow px-4 py-1 rounded rotate-[-1.5deg] z-10 flex items-center gap-1.5">
          <span className="text-sm">🎓</span>
          <span className="font-cartoon text-xs font-black text-stone-900 uppercase tracking-wider">
            {isChinese ? 'Phòng Thi HSK 3.0 & HSKK' : 'Phòng Thi Trắc Nghiệm Thông Minh'}
          </span>
        </div>

        <div className="space-y-2 text-center md:text-left pt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#292524] shrink-0">
              🐼
            </div>
            <h1 className="font-cartoon text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              {isChinese ? (
                <>
                  Kho Đề Thi <span className="text-[#c53428]">HSK 1 - 6 & Khẩu Ngữ</span>
                </>
              ) : (
                <>
                  Kho Đề Thi & <span className="text-amber-500">Luyện Đề Chuẩn Hóa</span>
                </>
              )}
            </h1>
          </div>

          <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
            {isChinese
              ? 'Mô phỏng 100% format đề thi HSK Đọc - Nghe - Viết và khẩu ngữ HSKK. Hỗ trợ Luyện đề (tự do, giải thích ngay) và Thi thử (bấm giờ & tự động nộp bài).'
              : 'Chọn đề vừa sức từ 20 đến 50 câu (15 – 30 phút). Nhấp vào đề để chọn: Luyện đề (tự do, hiện đáp án & giải thích tức thì) hoặc Thi thử (bấm giờ & tự động nộp bài).'}
          </p>
        </div>

        {/* Nút Thêm đề thi PDF / Word & Thống kê cá nhân */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsAddExamModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3 bg-amber-300 hover:bg-amber-400 text-stone-900 font-cartoon font-bold text-xs sm:text-sm rounded-xl border-2 border-stone-800 shadow-[3px_3px_0px_#292524] btn-press flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-stone-900" />
            <span>+ Thêm Đề Thi (PDF / Word)</span>
          </button>

          <div className="p-3 rounded-xl border-2 border-stone-800 bg-[#fff9ea] dark:bg-[#221c17] text-center space-y-0.5 shadow-[2px_2px_0px_#292524] min-w-[130px] w-full sm:w-auto">
            <span className="font-cartoon text-[10px] font-bold text-stone-500 dark:text-stone-400 block uppercase">
              Đã hoàn thành
            </span>
            <div className="font-cartoon text-xl font-black text-[#c53428] dark:text-amber-400">
              {user?.examsCompleted ?? 0} đề
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THANH TÌM KIẾM & BỘ LỌC CẤP ĐỘ                                         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Ô tìm kiếm */}
          <div className="relative flex items-center border-2 border-stone-800 rounded-xl px-3.5 py-2 w-full sm:w-80 bg-white dark:bg-stone-900 shadow-[2px_2px_0px_#292524] focus-within:border-amber-500 transition-all">
            <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm đề thi, cấp độ, TOEIC, HSK..."
              className="bg-transparent border-none outline-none text-xs w-full font-semibold text-stone-900 dark:text-white placeholder-stone-400"
            />
          </div>

          <span className="font-hand text-sm text-stone-600 dark:text-stone-400 font-bold self-end sm:self-center">
            Hiển thị {filteredExams.length} đề thi phù hợp 📝
          </span>
        </div>

        {/* Danh mục lọc (Category Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-cartoon font-bold transition-all cursor-pointer whitespace-nowrap border-2 border-stone-800 ${
                  isActive
                    ? isChinese
                      ? 'bg-[#c53428] text-white shadow-[2px_2px_0px_#292524] scale-105'
                      : 'bg-amber-300 text-stone-900 shadow-[2px_2px_0px_#292524] scale-105'
                    : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 shadow-xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LƯỚI BỘ ĐỀ THI GỌN GÀNG, THÂN THIỆN (GRID 3 CỘT)                      */}
      {/* ========================================================================= */}
      {regularExams.length === 0 ? (
        <div className="p-12 text-center space-y-3 rounded-2xl border-2 border-dashed border-stone-800 bg-[#fffdfa] dark:bg-stone-900/60">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h4 className="font-cartoon text-sm font-bold text-stone-700 dark:text-stone-300">
            Chưa có đề thi nào trong mục này
          </h4>
          <p className="font-hand text-sm text-stone-500 max-w-sm mx-auto">
            Bạn có thể bấm nút bên dưới để tải lên đề thi từ file PDF hoặc Word của mình!
          </p>
          <button
            type="button"
            onClick={() => setIsAddExamModalOpen(true)}
            className="px-5 py-2.5 bg-amber-300 hover:bg-amber-400 text-stone-900 font-cartoon text-xs font-bold rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
          >
            + Tải Lên Đề Thi Ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regularExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isChinese={isChinese}
              isLight={isLight}
              onSelectExam={(selected) => setSelectedExamForModal(selected)}
              onDeleteExam={(id) => {
                if (confirm(`Bạn có chắc muốn xóa đề thi "${exam.title}"?`)) {
                  deleteCustomExam(id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ĐẠI THỬ THÁCH TRỌN BỘ OXFORD MASTER CHALLENGE                          */}
      {/* ========================================================================= */}
      {masterExam && (activeCategory === 'Tất cả' || activeCategory.includes('Oxford')) && (
        <div className="rounded-2xl p-6 sm:p-8 space-y-4 box-sketch bg-[#fff9ea] dark:bg-[#1a1714] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="washi-tape-yellow px-2.5 py-0.5 rounded font-cartoon text-xs font-black text-stone-900 uppercase">
                  🏆 Master Challenge
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 border border-stone-800 font-cartoon text-xs font-bold text-stone-900">
                  Đầy đủ 3.544 câu hỏi
                </span>
              </div>

              <h3 className="font-cartoon text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                Đại Thử Thách Trọn Bộ 3544 Từ Vựng Oxford
              </h3>

              <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
                Tổng hợp trọn vẹn 3.544 câu hỏi chuẩn Oxford quét từ trang 1 đến 296 có âm thanh MP3 & hình ảnh. Bạn có thể chọn Luyện đề tự do hoặc Thi thử bấm giờ, chọn đảo câu hỏi & đảo đáp án thông minh.
              </p>

              <div className="flex flex-wrap items-center gap-4 font-cartoon text-xs font-bold text-stone-600 dark:text-stone-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> 3.544 câu hỏi đầy đủ
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Tự do chọn số câu & thời gian
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" /> 4.210+ lượt thi
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setSelectedExamForModal(masterExam)}
                className="w-full sm:w-auto px-7 py-3 bg-[#c53428] hover:bg-[#b02c21] text-white font-cartoon text-xs sm:text-sm font-bold rounded-xl border-2 border-stone-800 shadow-[3px_3px_0px_#292524] btn-press flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Bắt đầu thử thách</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CẤU HÌNH BẮT ĐẦU */}
      <ExamStartModal
        exam={selectedExamForModal}
        isOpen={Boolean(selectedExamForModal)}
        onClose={() => setSelectedExamForModal(null)}
      />

      {/* MODAL 2: THÊM ĐỀ THI TỪ PDF / WORD */}
      <AddExamModal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        onExamCreated={(newExam) => {
          setSelectedExamForModal(newExam);
        }}
      />
    </div>
  );
}

// Subcomponent: Card Đề thi phong cách Sổ tay hoạt hình 3D
function ExamCard({
  exam,
  isChinese,
  isLight,
  onSelectExam,
  onDeleteExam,
}: {
  exam: ExamPaper;
  isChinese: boolean;
  isLight: boolean;
  onSelectExam: (exam: ExamPaper) => void;
  onDeleteExam?: (id: string) => void;
}) {
  return (
    <div className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-5 box-sketch flex flex-col justify-between space-y-4 transition-all hover:-translate-y-0.5 group">
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {exam.isCustom && (
              <span className="px-2 py-0.5 rounded font-cartoon text-[10px] font-bold bg-amber-200 border border-stone-800 text-stone-900">
                📁 Đề của bạn
              </span>
            )}
            {exam.level && (
              <span className="px-2 py-0.5 rounded font-cartoon text-[10px] font-bold bg-amber-300 border border-stone-800 text-stone-900">
                {exam.level}
              </span>
            )}
            <span className="px-2 py-0.5 rounded border border-stone-800 font-cartoon text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300">
              {exam.type}
            </span>
          </div>

          <div className="flex items-center gap-2 font-cartoon text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{exam.durationMinutes || 20} phút</span>
            </span>

            {exam.isCustom && onDeleteExam && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteExam(exam.id);
                }}
                className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                title="Xóa đề thi này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cartoon text-base font-bold text-stone-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#c53428] transition-colors">
          {exam.title}
        </h3>

        {/* Description */}
        <p className="font-body text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {exam.description || 'Bài thi trắc nghiệm khách quan 4 lựa chọn có đáp án và giải thích chi tiết.'}
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
        {/* Meta Stats */}
        <div className="flex items-center justify-between font-cartoon text-xs text-stone-600 dark:text-stone-400 font-bold">
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {exam.totalQuestions} câu hỏi
          </span>
          <span className="flex items-center gap-1 text-stone-500">
            <Users className="w-3.5 h-3.5" />
            {exam.attemptsCount || 450} lượt thi
          </span>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => onSelectExam(exam)}
          className={`w-full py-2.5 px-4 rounded-xl font-cartoon text-xs font-bold border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isChinese
              ? 'bg-[#c53428] hover:bg-[#b02c21] text-white'
              : 'bg-amber-300 hover:bg-amber-400 text-stone-900'
          }`}
        >
          <span>Vào thi ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
