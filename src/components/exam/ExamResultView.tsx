'use client';

import { ExamPaper } from '@/lib/types';
import { Award, CheckCircle, XCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ExamResultViewProps {
  exam: ExamPaper;
  userAnswers: Record<string, number>;
  onRetry: () => void;
}

export default function ExamResultView({ exam, userAnswers, onRetry }: any) {
  let correctCount = 0;
  const questionsList = exam.questions || [];
  questionsList.forEach((q: any) => {
    if (userAnswers[q.id] === q.correctAnswer) correctCount++;
  });

  const scorePercent = Math.round((correctCount / exam.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Result Overview Header Card */}
      <div className="card-bibung bg-gradient-to-r from-green-700 to-emerald-600 text-white p-8 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black">Kết quả làm bài thi</h2>
        <p className="text-sm text-green-100">{exam.title}</p>

        <div className="inline-flex items-center gap-6 bg-white text-[#17261c] px-6 py-3 rounded-2xl shadow-lg">
          <div>
            <span className="text-xs text-[#5b6a60] font-bold block">Điểm số</span>
            <span className="text-3xl font-black text-green-600">{scorePercent}%</span>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <span className="text-xs text-[#5b6a60] font-bold block">Số câu đúng</span>
            <span className="text-2xl font-black text-[#17261c]">
              {correctCount} / {exam.questions.length}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={onRetry} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
            <RefreshCw className="w-4 h-4" /> Làm lại bài này
          </button>
          <Link href="/kho-de" className="bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Về kho đề thi
          </Link>
        </div>
      </div>

      {/* Detailed Questions Review */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-[#17261c]">Xem lại chi tiết từng câu hỏi & Đáp án giải thích</h3>

        {(exam.questions || []).map((q: any, qIdx: number) => {
          const userChoice = userAnswers[q.id];
          const isCorrect = userChoice === q.correctAnswer;

          return (
            <div key={q.id} className="card-bibung bg-white p-6 space-y-4 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="badge-green">{q.part}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {isCorrect ? 'Đúng' : 'Chưa đúng'}
                </span>
              </div>

              {q.passage && (
                <div className="p-4 bg-gray-50 rounded-xl text-xs sm:text-sm text-[#17261c] leading-relaxed font-medium">
                  {q.passage}
                </div>
              )}

              <p className="text-sm font-bold text-[#17261c]">
                Câu {qIdx + 1}: {q.questionText}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(q.options || []).map((opt: any, optIdx: number) => {
                  const isUserSelected = userChoice === optIdx;
                  const isRightAnswer = q.correctAnswer === optIdx;

                  let style = 'bg-gray-50 text-gray-700 border-gray-200';
                  if (isRightAnswer) {
                    style = 'bg-green-100 text-green-900 border-green-400 font-black';
                  } else if (isUserSelected && !isRightAnswer) {
                    style = 'bg-red-100 text-red-900 border-red-400 font-bold line-through';
                  }

                  return (
                    <div key={optIdx} className={`p-3 rounded-xl text-xs border ${style} flex items-center justify-between`}>
                      <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                      {isRightAnswer && <span className="text-green-700 font-black">✓ Đáp án đúng</span>}
                      {isUserSelected && !isRightAnswer && <span className="text-red-600 font-bold">✕ Lựa chọn của bạn</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Giải thích chi tiết tiếng Việt:
                </p>
                <p className="font-medium text-amber-900">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
