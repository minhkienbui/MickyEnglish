'use client';

import { useState } from 'react';
import { ExamQuestion } from '@/lib/types';
import { Bookmark, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface QuestionNavProps {
  questions: ExamQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  flaggedQuestions: string[];
  onSelectQuestion: (index: number) => void;
}

export default function QuestionNav({
  questions,
  currentQuestionIndex,
  userAnswers,
  flaggedQuestions,
  onSelectQuestion,
}: QuestionNavProps) {
  const pageSize = 50;
  const [currentPage, setCurrentPage] = useState(() => Math.floor(currentQuestionIndex / pageSize));
  const [jumpInput, setJumpInput] = useState('');

  const totalPages = Math.ceil(questions.length / pageSize);
  const startIdx = currentPage * pageSize;
  const endIdx = Math.min(startIdx + pageSize, questions.length);
  const currentSlice = questions.slice(startIdx, endIdx);

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= questions.length) {
      onSelectQuestion(num - 1);
      setCurrentPage(Math.floor((num - 1) / pageSize));
      setJumpInput('');
    }
  };

  return (
    <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-white uppercase tracking-wider">
          Danh sách câu hỏi ({questions.length})
        </h4>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
          {Object.keys(userAnswers).length}/{questions.length} đã làm
        </span>
      </div>

      {/* Quick Jump Input */}
      {questions.length > pageSize && (
        <div className="space-y-2">
          <form onSubmit={handleJump} className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={questions.length}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={`Nhảy đến câu (1-${questions.length})...`}
              className="flex-1 bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shrink-0 cursor-pointer"
            >
              Đi
            </button>
          </form>

          {/* Pagination bar for question chunks */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 bg-[#0e1726] p-2 rounded-xl border border-[#1e2d42]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span>
              Câu {startIdx + 1} - {endIdx} (Trang {currentPage + 1}/{totalPages})
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Question Bubbles Grid */}
      <div className="grid grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
        {currentSlice.map((q, localIdx) => {
          const globalIdx = startIdx + localIdx;
          const isAnswered = userAnswers[q.id] !== undefined;
          const isCurrent = currentQuestionIndex === globalIdx;
          const isFlagged = flaggedQuestions.includes(String(q.id));

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(globalIdx)}
              className={`relative h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center cursor-pointer ${
                isCurrent
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-md scale-105'
                  : isAnswered
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60'
                  : 'bg-[#0e1726] text-slate-300 border border-[#1e2d42] hover:bg-[#182638] hover:text-white'
              }`}
            >
              <span>{globalIdx + 1}</span>
              {isFlagged && (
                <Bookmark className="w-3 h-3 text-orange-400 fill-orange-400 absolute -top-1 -right-1" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-[#1e2d42]">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Đang làm
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-600 inline-block" /> Đã chọn
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#0e1726] border border-[#1e2d42] inline-block" /> Chưa làm
        </span>
      </div>
    </div>
  );
}
