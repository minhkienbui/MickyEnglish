'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExamPaper } from '@/lib/types';
import { useExamStore, ExamMode } from '@/stores/useExamStore';
import {
  X,
  GraduationCap,
  Timer,
  Clock,
  Shuffle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
} from 'lucide-react';

interface ExamStartModalProps {
  exam: ExamPaper | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamStartModal({ exam, isOpen, onClose }: ExamStartModalProps) {
  const router = useRouter();
  const { startExam } = useExamStore();

  const [selectedMode, setSelectedMode] = useState<ExamMode>('practice');

  // Option states
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(true);

  // Exam mode duration
  const defaultDuration = exam?.durationMinutes || exam?.duration || 20;
  const [durationMinutes, setDurationMinutes] = useState<number>(defaultDuration);
  const [customTimeInput, setCustomTimeInput] = useState<string>('');

  // Question count
  const totalAvailable = exam?.questions?.length || 30;
  const [questionCount, setQuestionCount] = useState<number>(() => {
    return totalAvailable > 50 ? 50 : totalAvailable;
  });

  if (!isOpen || !exam) return null;

  const handleStart = () => {
    const finalMinutes = customTimeInput && parseInt(customTimeInput, 10) > 0
      ? parseInt(customTimeInput, 10)
      : durationMinutes;

    startExam(exam, {
      mode: selectedMode,
      durationMinutes: selectedMode === 'exam' ? finalMinutes : null,
      shuffleQuestions,
      shuffleAnswers,
      questionCount,
    });

    onClose();
    router.push(`/kho-de/${exam.id}`);
  };

  const timePresets = [10, 15, 20, 30, 45, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-[#1e2d42] flex items-center justify-between bg-[#121c2b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                {exam.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {exam.type} • {exam.level ? `Trình độ: ${exam.level}` : 'Đề thi chuẩn hóa'} • {exam.totalQuestions} câu hỏi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1e2d42] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* CHỌN 2 OPTION: LUYỆN ĐỀ vs THI THỬ */}
          <div className="space-y-3">
            <label className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
              <span className="text-emerald-400 font-extrabold">1</span> Chọn Chế Độ Làm Bài:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* OPTION 1: LUYỆN ĐỀ */}
              <div
                onClick={() => setSelectedMode('practice')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2.5 relative flex flex-col justify-between ${
                  selectedMode === 'practice'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/50'
                    : 'bg-[#0e1726] border-[#1e2d42] hover:border-slate-600'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                      Tự Do • Không Giới Hạn Giờ
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMode === 'practice' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                    }`}>
                      {selectedMode === 'practice' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    Luyện Đề
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Chỉ đếm giờ xuôi, <strong>không bị giới hạn thời gian</strong>. Hiển thị đáp án đúng/sai và <strong>giải thích chi tiết</strong> ngay sau khi chọn đáp án!
                  </p>
                </div>

                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Phù hợp để ôn tập kiến thức
                </div>
              </div>

              {/* OPTION 2: THI THỬ */}
              <div
                onClick={() => setSelectedMode('exam')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2.5 relative flex flex-col justify-between ${
                  selectedMode === 'exam'
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/50'
                    : 'bg-[#0e1726] border-[#1e2d42] hover:border-slate-600'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/40">
                      Bấm Giờ • Tự Động Nộp
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMode === 'exam' ? 'border-amber-500 bg-amber-500' : 'border-slate-600'
                    }`}>
                      {selectedMode === 'exam' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <Timer className="w-5 h-5 text-amber-400" />
                    Thi Thử
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Mô phỏng phòng thi chuẩn hóa có <strong>đồng hồ đếm ngược</strong>. Tự động thu và nộp bài khi hết giờ. Chỉ chấm điểm tổng kết sau khi nộp.
                  </p>
                </div>

                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Thử sức áp lực phòng thi thật
                </div>
              </div>
            </div>
          </div>

          {/* NẾU CHỌN THI THỬ: HIỆN PHẦN CHỌN THỜI GIAN THI */}
          {selectedMode === 'exam' && (
            <div className="p-4 rounded-2xl bg-[#0e1726] border border-amber-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Chọn Thời Gian Thi (Phút):
                </label>
                <span className="text-xs font-black text-amber-400 font-mono">
                  {customTimeInput ? `${customTimeInput} phút` : `${durationMinutes} phút`}
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {timePresets.map((mins) => {
                  const isSelected = !customTimeInput && durationMinutes === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setDurationMinutes(mins);
                        setCustomTimeInput('');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-105'
                          : 'bg-[#121c2b] text-slate-300 hover:text-white border border-[#1e2d42]'
                      }`}
                    >
                      {mins} phút
                    </button>
                  );
                })}
              </div>

              {/* Custom input */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-medium">Hoặc nhập số phút tùy chỉnh:</span>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={customTimeInput}
                  onChange={(e) => setCustomTimeInput(e.target.value)}
                  placeholder="VD: 25"
                  className="w-20 bg-[#121c2b] border border-[#1e2d42] focus:border-amber-400 rounded-xl px-2.5 py-1 text-xs text-white font-mono text-center outline-none"
                />
                <span className="text-slate-400">phút</span>
              </div>
            </div>
          )}

          {/* TÙY CHỌN NÂNG CAO: ĐẢO CÂU HỎI & ĐẢO ĐÁP ÁN */}
          <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-3">
            <label className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              Tùy Chọn Đảo Đề Thông Minh:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Đảo câu hỏi */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#121c2b] border border-[#1e2d42] cursor-pointer hover:border-slate-600 transition-colors">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">🔀 Đảo thứ tự câu hỏi</span>
                  <span className="text-[10px] text-slate-400 block">Xáo trộn ngẫu nhiên vị trí các câu</span>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 rounded-sm bg-[#0e1726] border-[#1e2d42] text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </label>

              {/* Đảo đáp án */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#121c2b] border border-[#1e2d42] cursor-pointer hover:border-slate-600 transition-colors">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">🔀 Đảo thứ tự đáp án (A/B/C/D)</span>
                  <span className="text-[10px] text-slate-400 block">Tránh thói quen nhớ vị trí nút bấm</span>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleAnswers}
                  onChange={(e) => setShuffleAnswers(e.target.checked)}
                  className="w-4 h-4 rounded-sm bg-[#0e1726] border-[#1e2d42] text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* SỐ LƯỢNG CÂU HỎI (NẾU ĐỀ DÀI > 40 CÂU) */}
          {totalAvailable > 40 && (
            <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Số lượng câu muốn làm:</span>
                <span className="font-black text-emerald-400 font-mono">{questionCount} câu</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[20, 30, 40, 50, 100].map((num) => {
                  if (num > totalAvailable) return null;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        questionCount === num
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#121c2b] text-slate-400 hover:text-white border border-[#1e2d42]'
                      }`}
                    >
                      {num} câu
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setQuestionCount(totalAvailable)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    questionCount === totalAvailable
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#121c2b] text-slate-400 hover:text-white border border-[#1e2d42]'
                  }`}
                >
                  Tất cả ({totalAvailable} câu)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t border-[#1e2d42] bg-[#121c2b] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#1e2d42] hover:bg-[#1a293d] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleStart}
            className={`px-7 py-3 rounded-2xl text-xs sm:text-sm font-black text-white flex items-center gap-2 shadow-xl transition-all hover:scale-105 cursor-pointer ${
              selectedMode === 'practice'
                ? 'bg-[#00c950] hover:bg-[#00b046] shadow-emerald-500/30'
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
            }`}
          >
            {selectedMode === 'practice' ? (
              <>
                <GraduationCap className="w-4 h-4" />
                <span>Bắt Đầu Luyện Đề Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Timer className="w-4 h-4" />
                <span>Bắt Đầu Thi Thử ({customTimeInput || durationMinutes}p)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
