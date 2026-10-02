'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
  Users,
  GraduationCap,
  Layers,
  Zap,
  BookOpen,
  Plus,
  Upload,
  FolderDown,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useExamStore } from '@/stores/useExamStore';
import { curatedExams } from '@/data/exams';
import { ExamPaper } from '@/lib/types';
import ExamStartModal from '@/components/exam/ExamStartModal';
import AddExamModal from '@/components/exam/AddExamModal';

export default function ExamBankPage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const { user } = useAuthStore();
  const { customExams } = useExamStore();

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamForModal, setSelectedExamForModal] = useState<ExamPaper | null>(null);
  const [showAddExamModal, setShowAddExamModal] = useState(false);

  const categories = [
    'Tất cả',
    'Đề của tôi (Tải lên)',
    'Căn bản (A1 - A2)',
    'Trung cấp (B1 - B2)',
    'Nâng cao (C1)',
    'TOEIC',
    'IELTS',
    'VSTEP',
  ];

  // Hợp nhất các đề thi được tạo / tải lên với đề thi mặc định
  const allExams = useMemo(() => {
    return [...customExams, ...curatedExams];
  }, [customExams]);

  const filteredExams = useMemo(() => {
    return allExams.filter((exam) => {
      // Tìm kiếm
      const matchesSearch =
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        exam.type.toLowerCase().includes(searchQuery.toLowerCase());

      // Danh mục
      let matchesCat = true;
      if (activeCategory === 'Đề của tôi (Tải lên)') {
        matchesCat = Boolean(exam.fileUrl || exam.fileName || customExams.some((c) => c.id === exam.id));
      } else if (activeCategory === 'Căn bản (A1 - A2)') {
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

      return matchesSearch && matchesCat;
    });
  }, [allExams, customExams, activeCategory, searchQuery]);

  // Đề thi đặc biệt (Master 3544 câu)
  const masterExam = allExams.find((e) => e.id === 'oxford-3000-master-exam');
  const regularExams = filteredExams.filter((e) => e.id !== 'oxford-3000-master-exam');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ========================================================================= */}
      {/* 1. HEADER KHU VỰC THI THỬ & LUYỆN ĐỀ                                      */}
      {/* ========================================================================= */}
      <div
        className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-colors ${
          isLight
            ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border-slate-200 text-slate-900'
            : 'bg-gradient-to-r from-[#121c2b] via-[#101927] to-[#142338] border-[#1e2d42] text-white'
        }`}
      >
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Phòng Thi Trắc Nghiệm Thông Minh</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Kho Đề Thi & <span className="text-emerald-500">Luyện Đề Chuẩn Hóa</span>
          </h1>

          <p className={`text-xs sm:text-sm font-semibold max-w-2xl leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Chọn đề vừa sức từ 20 đến 50 câu (15 – 30 phút). Nhấp vào đề để chọn chế độ: <strong>Luyện đề (tự do, hiện đáp án & giải thích tức thì)</strong> hoặc <strong>Thi thử (bấm giờ & tự động nộp bài)</strong>.
          </p>
        </div>

        {/* Nút thêm đề thi PDF/Word + Thống kê cá nhân */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddExamModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm đề thi (PDF / Word)</span>
          </button>

          <div className={`p-3.5 rounded-2xl border text-center space-y-0.5 shadow-md min-w-[140px] ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0d1420] border-[#1e2d42]'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 block">Đề đã làm</span>
            <div className="text-xl font-black text-emerald-500 font-mono">
              {user?.examsCompleted ?? 0} đề
            </div>
            <span className="text-[9px] text-amber-400 font-bold block">+50 XP / đề</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THANH TÌM KIẾM & BỘ LỌC CẤP ĐỘ                                         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Ô tìm kiếm */}
          <div className={`relative flex items-center border rounded-2xl px-3.5 py-2 w-full sm:w-80 shadow-xs focus-within:border-emerald-500 transition-all ${
            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#121c2b] border-[#1e2d42] text-slate-200'
          }`}>
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm đề thi, cấp độ, TOEIC..."
              className="bg-transparent border-none outline-none text-xs w-full font-medium"
            />
          </div>

          <span className="text-xs text-slate-400 font-bold self-end sm:self-center">
            Hiển thị {filteredExams.length} đề thi phù hợp
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
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00c950] text-white shadow-md shadow-emerald-500/25 scale-105'
                    : isLight
                    ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638] border border-[#1e2d42]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION RIÊNG: ĐỀ THI DO BẠN TẢI LÊN (NẾU CÓ)                          */}
      {/* ========================================================================= */}
      {customExams.length > 0 && (activeCategory === 'Tất cả' || activeCategory === 'Đề của tôi (Tải lên)') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
              <FolderDown className="w-5 h-5 text-emerald-400" />
              <span>📁 Đề thi của bạn (Đã lưu & đồng bộ trên website)</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
              {customExams.length} đề thi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                isLight={isLight}
                onSelectExam={(selected) => setSelectedExamForModal(selected)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. LƯỚI BỘ ĐỀ THI GỌN GÀNG, THÂN THIỆN (GRID 3 CỘT)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            isLight={isLight}
            onSelectExam={(selected) => setSelectedExamForModal(selected)}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 5. ĐẠI THỬ THÁCH TRỌN BỘ OXFORD MASTER CHALLENGE                          */}
      {/* ========================================================================= */}
      {masterExam && (activeCategory === 'Tất cả' || activeCategory.includes('Oxford')) && (
        <div
          className={`rounded-3xl border p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden transition-colors ${
            isLight
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-300 text-slate-900'
              : 'bg-gradient-to-r from-[#112338] via-[#101b2c] to-[#121e30] border-emerald-500/40 text-white'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                  🏆 Master Challenge
                </span>
                <span className="badge-micky-green text-[10px]">Đầy đủ 3.544 câu hỏi</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black">
                Đại Thử Thách Trọn Bộ 3544 Từ Vựng Oxford
              </h3>

              <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-3xl ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                Tổng hợp trọn vẹn 3.544 câu hỏi chuẩn Oxford quét từ trang 1 đến 296 có âm thanh MP3 & hình ảnh. Bạn có thể chọn Luyện đề tự do hoặc Thi thử bấm giờ, chọn đảo câu hỏi & đảo đáp án thông minh.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" /> 3.544 câu hỏi đầy đủ
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> Tự do chọn số câu & thời gian
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" /> 4.210+ lượt thi
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setSelectedExamForModal(masterExam)}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Bắt đầu thử thách</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẤU HÌNH BẮT ĐẦU: CHỌN LUYỆN ĐỀ HOẶC THI THỬ */}
      <ExamStartModal
        exam={selectedExamForModal}
        isOpen={Boolean(selectedExamForModal)}
        onClose={() => setSelectedExamForModal(null)}
      />

      {/* MODAL THÊM ĐỀ THI TỪ PDF / WORD */}
      <AddExamModal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
      />
    </div>
  );
}

// Subcomponent: Card Đề thi thân thiện, bo góc đẹp mắt
function ExamCard({
  exam,
  isLight,
  onSelectExam,
}: {
  exam: ExamPaper;
  isLight: boolean;
  onSelectExam: (exam: ExamPaper) => void;
}) {
  const isUploaded = Boolean(exam.fileUrl || exam.fileName);

  const levelColor =
    exam.level === 'A1'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      : exam.level === 'A2'
      ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
      : exam.level === 'B1'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
      : exam.level === 'B2'
      ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
      : 'bg-rose-500/20 text-rose-400 border-rose-500/40';

  return (
    <div
      className={`rounded-3xl border p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative ${
        isUploaded
          ? 'border-emerald-500/70 ring-1 ring-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-transparent'
          : isLight
          ? 'bg-white border-slate-200 hover:border-emerald-500/60'
          : 'bg-[#121c2b] border-[#1e2d42] hover:border-emerald-500/60'
      }`}
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUploaded && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black shadow-xs flex items-center gap-1">
                <span>📁 Tải lên</span>
              </span>
            )}
            {exam.level && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${levelColor}`}>
                {exam.level}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
              {exam.type}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{exam.durationMinutes || exam.duration || 20} phút</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-base font-black line-clamp-2 leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {exam.title}
        </h3>

        {/* Description */}
        <p className={`text-xs leading-relaxed line-clamp-2 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {exam.description || 'Bài thi trắc nghiệm khách quan 4 lựa chọn có đáp án và giải thích chi tiết.'}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-700/20">
        {/* Meta Stats */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1 text-emerald-500 font-black">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {exam.totalQuestions || exam.questions?.length || 30} câu hỏi
          </span>

          <span className="flex items-center gap-1 text-slate-400">
            <Users className="w-3.5 h-3.5" />
            {(exam.attempts || 120).toLocaleString()} lượt thi
          </span>
        </div>

        {/* Action Button: Nhấp để mở Modal chọn Luyện Đề hoặc Thi Thử */}
        <button
          type="button"
          onClick={() => onSelectExam(exam)}
          className="w-full py-2.5 px-4 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
        >
          <span>Vào thi ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
