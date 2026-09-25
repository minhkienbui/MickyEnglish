'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useExamStore, ExamMode } from '@/stores/useExamStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ExamTimer from '@/components/exam/ExamTimer';
import QuestionNav from '@/components/exam/QuestionNav';
import ExamResultView from '@/components/exam/ExamResultView';
import Link from 'next/link';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Volume2,
  Settings2,
  Sparkles,
  GraduationCap,
  Timer,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function ExamSessionPage() {
  const params = useParams();
  const examId = params.id as string;

  const {
    exams,
    activeExam,
    mode,
    isUnlimitedTime,
    remainingSeconds,
    userAnswers,
    flaggedQuestions,
    isCompleted,
    setMode,
    setCustomDuration,
    startExam,
    selectAnswer,
    toggleFlagQuestion,
    setRemainingSeconds,
    submitExam,
  } = useExamStore();

  const { incrementProgress } = useAuthStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Time & Settings Modal State
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempMinutes, setTempMinutes] = useState<number | ''>(45);

  const targetExam = exams.find((e) => e.id === examId) || exams[0];

  useEffect(() => {
    startExam(targetExam);
  }, [examId, targetExam, startExam]);

  if (!activeExam) return null;

  if (isCompleted) {
    return (
      <ExamResultView
        exam={activeExam}
        userAnswers={userAnswers}
        onRetry={() => startExam(activeExam)}
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

  const handleApplyTime = (minutes: number | null) => {
    setCustomDuration(minutes);
    setShowTimeModal(false);
  };

  const handleSubmit = async () => {
    if (confirm('Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?')) {
      submitExam();
      incrementProgress({ examsCompleted: 1 });

      try {
        const answersPayload = Object.entries(userAnswers).map(([qId, ansIdx]) => ({
          questionId: qId,
          userAnswer: ansIdx,
        }));

        if (answersPayload.length > 0) {
          fetch('/api/exams/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              examId: activeExam.id,
              answers: answersPayload,
            }),
          });
        }
      } catch (err) {
        console.error('Error submitting exam to backend:', err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Exam Header Bar */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/kho-de" className="text-slate-400 hover:text-emerald-400 transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white line-clamp-1">{activeExam.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="badge-micky-green text-[10px]">{activeExam.type}</span>
              <span className="text-[11px] font-bold text-slate-400">
                {activeExam.questions.length} câu hỏi
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Mode Switcher + Timer + Settings + Submit */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-[#0e1726] p-1 rounded-2xl border border-[#1e2d42]">
            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'practice'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Ôn Luyện (Hiện đúng/sai)
            </button>

            <button
              type="button"
              onClick={() => setMode('exam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'exam'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" /> Thi Thử
            </button>
          </div>

          {/* Time Selector Button */}
          <button
            type="button"
            onClick={() => setShowTimeModal(true)}
            className="px-3 py-1.5 bg-[#0e1726] hover:bg-[#182638] border border-[#1e2d42] text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chọn thời gian</span>
          </button>

          {/* Timer Display */}
          <ExamTimer
            remainingSeconds={remainingSeconds}
            isUnlimited={isUnlimitedTime}
            onTick={() => setRemainingSeconds((prev) => Math.max(0, prev - 1))}
            onTimeUp={() => {
              alert('Hết giờ làm bài! Hệ thống tự động nộp bài thi.');
              submitExam();
              incrementProgress({ examsCompleted: 1 });
            }}
          />

          <button onClick={handleSubmit} className="btn-micky-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Send className="w-3.5 h-3.5" /> Nộp bài
          </button>
        </div>
      </div>

      {/* Main Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Question & Options Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 bg-[#0e1726] border border-[#1e2d42] px-3 py-1 rounded-full">
                {currentQuestion.part}
              </span>
              <button
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

            {/* Media if available: Image + Audio */}
            {((currentQuestion as any).imageUrl || (currentQuestion as any).audioUrl) && (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#0e1726] rounded-2xl border border-[#1e2d42]">
                {(currentQuestion as any).imageUrl && (
                  <img
                    src={(currentQuestion as any).imageUrl}
                    alt={(currentQuestion as any).word || 'Vocab illustration'}
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
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Passage text if any */}
            {currentQuestion.passage && (
              <div className="p-4 bg-[#0e1726] rounded-xl border border-[#1e2d42] text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {currentQuestion.passage}
              </div>
            )}

            {/* Question Text */}
            <p className="text-base font-black text-white">
              Câu {currentQuestionIndex + 1}: {currentQuestion.questionText}
            </p>

            {/* Options selection */}
            <div className="space-y-2.5 pt-1">
              {currentQuestion.options.map((opt: string, optIdx: number) => {
                const isSelected = selectedAnswer === optIdx;
                const isThisCorrect = optIdx === currentQuestion.correctAnswer;

                let optionStyles = 'bg-[#0e1726] text-slate-200 border-[#1e2d42] hover:bg-[#152236]';

                if (mode === 'practice' && hasAnswered) {
                  if (isThisCorrect) {
                    optionStyles = 'bg-emerald-950/90 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md';
                  } else if (isSelected && !isThisCorrect) {
                    optionStyles = 'bg-rose-950/90 text-rose-300 border-rose-500 ring-2 ring-rose-500/50';
                  } else {
                    optionStyles = 'bg-[#0e1726]/60 text-slate-500 border-[#1e2d42] opacity-60';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-emerald-950/80 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/40 shadow-sm';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => selectAnswer(currentQuestion.id, optIdx)}
                    className={`w-full p-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${optionStyles}`}
                  >
                    <span>
                      <strong className="mr-2 text-emerald-400">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                    </span>

                    {mode === 'practice' && hasAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {mode === 'practice' && hasAnswered && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    {mode === 'exam' && isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* INSTANT PRACTICE MODE FEEDBACK & EXPLANATION BANNER */}
            {mode === 'practice' && hasAnswered && (
              <div
                className={`p-5 rounded-2xl border space-y-2.5 animate-fade-in ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400">Chính xác! Tuyệt vời 🎉</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-400">
                        Chưa chính xác! Đáp án đúng là:{' '}
                        <strong>{String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}</strong>
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

          {/* Prev / Next buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="btn-micky-secondary py-2.5 px-5 text-xs font-bold disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Câu trước
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(Math.min(activeExam.questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === activeExam.questions.length - 1}
              className="btn-micky-primary py-2.5 px-5 text-xs font-bold disabled:opacity-40"
            >
              Câu tiếp <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Question Grid Navigator */}
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

      {/* TIME SELECTION MODAL */}
      {showTimeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121c2b] border border-[#1e2d42] w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1e2d42] pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-400" />
                Chọn Thời Gian Làm Đề & Ôn Tập
              </h3>
              <button
                onClick={() => setShowTimeModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Quick preset buttons */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">Chọn nhanh thời gian:</label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45, 60, 90, 120, 180].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleApplyTime(mins)}
                    className="p-2.5 rounded-xl bg-[#0e1726] hover:bg-emerald-600 border border-[#1e2d42] hover:border-emerald-500 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    {mins} phút
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleApplyTime(null)}
                  className="p-2.5 col-span-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-700/60 hover:border-emerald-500 text-xs font-black text-emerald-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Không giới hạn thời gian
                </button>
              </div>
            </div>

            {/* Custom Minutes Input */}
            <div className="space-y-2 pt-2 border-t border-[#1e2d42]">
              <label className="block text-xs font-bold text-slate-300">Hoặc nhập số phút tùy ý:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={tempMinutes}
                  onChange={(e) => setTempMinutes(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Nhập số phút..."
                  className="flex-1 bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleApplyTime(tempMinutes ? Number(tempMinutes) : 45)}
                  className="btn-micky-primary px-4 py-2 text-xs font-black cursor-pointer shrink-0"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
