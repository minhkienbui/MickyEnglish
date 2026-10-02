'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExamStore } from '@/stores/useExamStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ExamTimer from '@/components/exam/ExamTimer';
import QuestionNav from '@/components/exam/QuestionNav';
import ExamResultView from '@/components/exam/ExamResultView';
import Link from 'next/link';
import { ExamPaper } from '@/lib/types';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Volume2,
  GraduationCap,
  Timer,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function ExamSessionPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const {
    exams,
    customExams,
    activeExam,
    mode,
    remainingSeconds,
    elapsedSeconds,
    userAnswers,
    flaggedQuestions,
    isCompleted,
    startExam,
    selectAnswer,
    toggleFlagQuestion,
    setRemainingSeconds,
    setElapsedSeconds,
    submitExam,
  } = useExamStore();

  const { incrementProgress } = useAuthStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dbLoading, setDbLoading] = useState(false);

  const allKnownExams = useMemo(() => {
    return [...customExams, ...exams];
  }, [customExams, exams]);

  const targetExam = allKnownExams.find((e) => e.id === examId);

  // Khởi tạo đề thi nếu chưa có trong activeExam
  useEffect(() => {
    if (activeExam && activeExam.id === examId) {
      return;
    }
    if (targetExam) {
      startExam(targetExam, { mode: 'practice' });
      return;
    }

    // Nếu không có trong store, thử tìm trong database qua API /api/exams/[id]
    if (examId && !targetExam) {
      setDbLoading(true);
      fetch(`/api/exams/${examId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.exam) {
            const dbEx = data.exam;
            const questionsList = (dbEx.sections || []).flatMap((sec: any) =>
              (sec.questions || []).map((q: any) => ({
                id: q.id,
                order: q.order,
                questionText: q.questionText,
                options: q.options || ['A', 'B', 'C', 'D'],
                correctAnswer: q.correctAnswer ?? 0,
                explanation: q.explanation || '',
                part: sec.name || 'Phần 1',
              }))
            );
            const fullExam: ExamPaper = {
              id: dbEx.id,
              title: dbEx.title,
              type: dbEx.type,
              description: dbEx.description,
              durationMinutes: dbEx.duration,
              duration: dbEx.duration,
              totalQuestions: questionsList.length,
              questions: questionsList,
            };
            startExam(fullExam, { mode: 'practice' });
          }
        })
        .catch(() => {})
        .finally(() => setDbLoading(false));
    }
  }, [examId, targetExam, activeExam, startExam]);

  if (dbLoading || !activeExam) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-white space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Đang tải và chuẩn bị đề thi...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <ExamResultView
        exam={activeExam}
        userAnswers={userAnswers}
        onRetry={() => startExam(activeExam, { mode })}
      />
    );
  }

  const currentQuestion = activeExam.questions[currentQuestionIndex] || activeExam.questions[0];
  const isFlagged = flaggedQuestions.includes(currentQuestion.id);
  const selectedAnswer = userAnswers[currentQuestion.id];
  const hasAnswered = selectedAnswer !== undefined;
  const isCorrect = hasAnswered && selectedAnswer === currentQuestion.correctAnswer;

  const playAudio = (url?: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch((err) => console.log('Audio playback error:', err));
  };

  const handleSubmit = async () => {
    const unansweredCount = activeExam.questions.length - Object.keys(userAnswers).length;
    const confirmMsg = unansweredCount > 0
      ? `Bạn còn ${unansweredCount} câu chưa làm. Bạn có chắc chắn muốn nộp bài ngay?`
      : 'Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?';

    if (confirm(confirmMsg)) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    submitExam();
    incrementProgress({ examsCompleted: 1 });

    try {
      const answersPayload = Object.entries(userAnswers).map(([qId, ansIdx]) => ({
        questionId: qId,
        userAnswer: ansIdx,
        isCorrect: activeExam.questions.find((q) => q.id === qId)?.correctAnswer === ansIdx,
      }));

      if (answersPayload.length > 0) {
        fetch('/api/exams/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examId: activeExam.id,
            answers: answersPayload,
          }),
        }).catch(() => {});
      }
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* ========================================================================= */}
      {/* EXAM HEADER: GỌN GÀNG, TẬP TRUNG (ĐÃ XÓA NÚT CHỌN CHẾ ĐỘ & CHỌN GIỜ)      */}
      {/* ========================================================================= */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/kho-de"
            className="text-slate-400 hover:text-emerald-400 transition-colors p-1.5 rounded-xl hover:bg-[#1a273a] shrink-0"
            title="Quay lại kho đề"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-white truncate">{activeExam.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="badge-micky-green text-[10px]">{activeExam.type}</span>
              <span className="text-[11px] font-bold text-slate-400">
                {activeExam.questions.length} câu hỏi
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Badge Chế Độ + Đồng Hồ (Đếm Xuôi / Đếm Ngược) + Nộp Bài */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
          {/* Badge Chế độ hiện tại */}
          {mode === 'practice' ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black flex items-center gap-1.5 shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Luyện Đề (Tự do)</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md">
              <Timer className="w-3.5 h-3.5 fill-slate-950" />
              <span>Thi Thử (Bấm giờ)</span>
            </div>
          )}

          {/* Timer Display */}
          <ExamTimer
            mode={mode}
            remainingSeconds={remainingSeconds}
            elapsedSeconds={elapsedSeconds}
            onTickRemaining={() => setRemainingSeconds((prev) => Math.max(0, prev - 1))}
            onTickElapsed={() => setElapsedSeconds((prev) => prev + 1)}
            onTimeUp={() => {
              alert('Hết giờ làm bài thi! Hệ thống tự động nộp bài.');
              handleFinalSubmit();
            }}
          />

          {/* Nút Nộp Bài */}
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-micky-primary py-2 px-5 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer hover:scale-105 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN EXAM WORKSPACE                                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* KHUNG CÂU HỎI VÀ ĐÁP ÁN */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 bg-[#0e1726] border border-[#1e2d42] px-3 py-1 rounded-full">
                {currentQuestion.part || `Câu hỏi ${currentQuestionIndex + 1}`}
              </span>
              <button
                type="button"
                onClick={() => toggleFlagQuestion(currentQuestion.id)}
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border cursor-pointer transition-all ${
                  isFlagged
                    ? 'bg-orange-950/80 text-orange-400 border-orange-600'
                    : 'bg-[#0e1726] text-slate-400 border-[#1e2d42] hover:bg-[#1b2738]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-orange-400 text-orange-400' : ''}`} />
                {isFlagged ? 'Đã đánh dấu xem lại' : 'Đánh dấu xem lại'}
              </button>
            </div>

            {/* Media: Image + Audio nếu có (Ẩn ảnh nếu lỗi để không hiện icon vỡ) */}
            {((currentQuestion as any).imageUrl || (currentQuestion as any).audioUrl) && (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#0e1726] rounded-2xl border border-[#1e2d42]">
                {(currentQuestion as any).imageUrl && (
                  <img
                    src={(currentQuestion as any).imageUrl}
                    alt={(currentQuestion as any).word || 'Minh họa'}
                    onError={(e) => {
                      // Ẩn ảnh nếu đường link ngoài bị 404 hoặc không load được
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-32 h-24 object-cover rounded-xl border border-slate-700 shrink-0"
                  />
                )}

                <div className="space-y-2 flex-1 w-full">
                  {(currentQuestion as any).audioUrl && (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playAudio((currentQuestion as any).audioUrl)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" /> Nghe Audio Phát Âm
                      </button>
                      <audio controls className="h-8 max-w-[220px]" src={(currentQuestion as any).audioUrl}>
                        Your browser does not support audio.
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Đoạn văn (Passage) nếu có */}
            {currentQuestion.passage && (
              <div className="p-4 bg-[#0e1726] rounded-xl border border-[#1e2d42] text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {currentQuestion.passage}
              </div>
            )}

            {/* Nội dung câu hỏi */}
            <p className="text-base sm:text-lg font-black text-white leading-relaxed">
              Câu {currentQuestionIndex + 1}: {currentQuestion.questionText || currentQuestion.text}
            </p>

            {/* Danh sách đáp án */}
            <div className="space-y-2.5 pt-1">
              {currentQuestion.options.map((opt: string, optIdx: number) => {
                const isSelected = selectedAnswer === optIdx;
                const isThisCorrect = optIdx === currentQuestion.correctAnswer;

                let optionStyles = 'bg-[#0e1726] text-slate-200 border-[#1e2d42] hover:bg-[#152236]';

                if (mode === 'practice' && hasAnswered) {
                  // Chế độ Luyện đề: Hiển thị ngay đúng / sai
                  if (isThisCorrect) {
                    optionStyles = 'bg-emerald-950/90 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md';
                  } else if (isSelected && !isThisCorrect) {
                    optionStyles = 'bg-rose-950/90 text-rose-300 border-rose-500 ring-2 ring-rose-500/50';
                  } else {
                    optionStyles = 'bg-[#0e1726]/60 text-slate-500 border-[#1e2d42] opacity-60';
                  }
                } else if (isSelected) {
                  // Chế độ Thi thử: Chỉ đánh dấu lựa chọn đang chọn
                  optionStyles = 'bg-amber-950/80 text-amber-300 border-amber-500 ring-2 ring-amber-500/40 shadow-sm';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => selectAnswer(currentQuestion.id, optIdx)}
                    className={`w-full p-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${optionStyles}`}
                  >
                    <span>
                      <strong className={`mr-2.5 font-mono ${mode === 'exam' && isSelected ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {String.fromCharCode(65 + optIdx)}.
                      </strong>{' '}
                      {opt}
                    </span>

                    {/* Biểu tượng đúng/sai ở chế độ Luyện đề */}
                    {mode === 'practice' && hasAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {mode === 'practice' && hasAnswered && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Giải thích chi tiết ở chế độ Luyện đề */}
            {mode === 'practice' && hasAnswered && (
              <div
                className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-rose-950/40 border-rose-500/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-black text-emerald-300">Chính xác! Làm rất tốt!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-xs font-black text-rose-300">
                        Chưa chính xác! Đáp án đúng là:{' '}
                        <strong>
                          {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
                        </strong>
                      </span>
                    </>
                  )}
                </div>

                {currentQuestion.explanation && (
                  <div className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-[#1e2d42]">
                    <p className="font-semibold">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="btn-micky-secondary py-2.5 px-5 text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Câu trước
            </button>

            <button
              type="button"
              onClick={() => setCurrentQuestionIndex(Math.min(activeExam.questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === activeExam.questions.length - 1}
              className="btn-micky-primary py-2.5 px-5 text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Câu tiếp <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BẢNG ĐIỀU HƯỚNG CÂU HỎI */}
        <div>
          <QuestionNav
            questions={activeExam.questions}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onSelectQuestion={setCurrentQuestionIndex}
          />
        </div>
      </div>
    </div>
  );
}
