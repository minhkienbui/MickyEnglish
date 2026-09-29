import { create } from 'zustand';
import { ExamPaper, ExamQuestion } from '@/lib/types';
import { mockExams } from '@/data/mockExams';

export type ExamMode = 'exam' | 'practice';

export interface StartExamOptions {
  mode?: ExamMode;
  durationMinutes?: number | null;
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  questionCount?: number;
}

interface ExamResult {
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  weakParts: string[];
}

interface ExamState {
  exams: ExamPaper[];
  activeExam: ExamPaper | null;
  mode: ExamMode; // 'exam' (Thi thử) | 'practice' (Luyện đề)
  customDurationMinutes: number | null; // null = unlimited, number = minutes
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  userAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  flaggedQuestions: string[];
  remainingSeconds: number; // for exam mode countdown
  elapsedSeconds: number; // for practice mode stopwatch
  isUnlimitedTime: boolean;
  isCompleted: boolean;
  result: ExamResult | null;

  setMode: (mode: ExamMode) => void;
  setCustomDuration: (minutes: number | null) => void;
  startExam: (exam: ExamPaper, options?: StartExamOptions) => void;
  selectAnswer: (questionId: string, optionIndex: number) => void;
  toggleFlagQuestion: (questionId: string) => void;
  setRemainingSeconds: (sec: number | ((prev: number) => number)) => void;
  setElapsedSeconds: (sec: number | ((prev: number) => number)) => void;
  submitExam: () => ExamResult;
  resetExam: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function prepareQuestions(
  rawQuestions: ExamQuestion[],
  shouldShuffleQ = false,
  shouldShuffleA = false
): ExamQuestion[] {
  let questions = rawQuestions.map((q) => {
    if (!shouldShuffleA || !q.options || q.options.length <= 1) return q;

    const originalOptions = q.options;
    const correctText = originalOptions[q.correctAnswer];
    const shuffledOptions = shuffleArray(originalOptions);
    const newCorrectIndex = shuffledOptions.indexOf(correctText);

    return {
      ...q,
      options: shuffledOptions,
      correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : q.correctAnswer,
    };
  });

  if (shouldShuffleQ) {
    questions = shuffleArray(questions);
  }

  return questions;
}

export const useExamStore = create<ExamState>()((set, get) => ({
  exams: mockExams,
  activeExam: null,
  mode: 'practice',
  customDurationMinutes: null,
  shuffleQuestions: false,
  shuffleAnswers: false,
  userAnswers: {},
  flaggedQuestions: [],
  remainingSeconds: 0,
  elapsedSeconds: 0,
  isUnlimitedTime: true,
  isCompleted: false,
  result: null,

  setMode: (mode) => set({ mode }),

  setCustomDuration: (minutes) => {
    const isUnlimited = minutes === null || minutes <= 0;
    set({
      customDurationMinutes: minutes,
      isUnlimitedTime: isUnlimited,
      remainingSeconds: isUnlimited ? 0 : (minutes || 45) * 60,
    });
  },

  startExam: (exam, options) => {
    const selectedMode: ExamMode = options?.mode || get().mode || 'practice';
    const shouldShuffleQ = options?.shuffleQuestions ?? false;
    const shouldShuffleA = options?.shuffleAnswers ?? false;

    // Slice question count if provided
    let rawList = exam.questions || [];
    if (options?.questionCount && options.questionCount > 0 && options.questionCount < rawList.length) {
      rawList = rawList.slice(0, options.questionCount);
    }

    // Apply shuffling
    const processedQuestions = prepareQuestions(rawList, shouldShuffleQ, shouldShuffleA);

    const preparedExam: ExamPaper = {
      ...exam,
      questions: processedQuestions,
      totalQuestions: processedQuestions.length,
    };

    // Duration setup
    const isExamMode = selectedMode === 'exam';
    const examDuration = options?.durationMinutes !== undefined
      ? options.durationMinutes
      : (exam.durationMinutes || exam.duration || 20);

    const initialRemaining = isExamMode && examDuration && examDuration > 0
      ? examDuration * 60
      : 0;

    set({
      activeExam: preparedExam,
      mode: selectedMode,
      customDurationMinutes: isExamMode ? examDuration : null,
      shuffleQuestions: shouldShuffleQ,
      shuffleAnswers: shouldShuffleA,
      userAnswers: {},
      flaggedQuestions: [],
      remainingSeconds: initialRemaining,
      elapsedSeconds: 0,
      isUnlimitedTime: !isExamMode,
      isCompleted: false,
      result: null,
    });
  },

  selectAnswer: (questionId, optionIndex) => {
    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        [questionId]: optionIndex,
      },
    }));
  },

  toggleFlagQuestion: (questionId) => {
    set((state) => {
      const isFlagged = state.flaggedQuestions.includes(questionId);
      return {
        flaggedQuestions: isFlagged
          ? state.flaggedQuestions.filter((id) => id !== questionId)
          : [...state.flaggedQuestions, questionId],
      };
    });
  },

  setRemainingSeconds: (action) => {
    set((state) => ({
      remainingSeconds: typeof action === 'function' ? action(state.remainingSeconds) : action,
    }));
  },

  setElapsedSeconds: (action) => {
    set((state) => ({
      elapsedSeconds: typeof action === 'function' ? action(state.elapsedSeconds) : action,
    }));
  },

  submitExam: () => {
    const { activeExam, userAnswers, remainingSeconds, elapsedSeconds, mode, customDurationMinutes } = get();
    if (!activeExam) {
      return { scorePercentage: 0, correctCount: 0, totalQuestions: 0, timeSpentSeconds: 0, weakParts: [] };
    }

    let correctCount = 0;
    const weakPartCounts: Record<string, number> = {};

    const questionsList = activeExam.questions || [];
    questionsList.forEach((q: any) => {
      const userSelected = userAnswers[q.id];
      if (userSelected === q.correctAnswer) {
        correctCount++;
      } else {
        weakPartCounts[q.part] = (weakPartCounts[q.part] || 0) + 1;
      }
    });

    const totalQuestions = questionsList.length;
    const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

    let timeSpentSeconds = elapsedSeconds;
    if (mode === 'exam') {
      const examMinutes = customDurationMinutes || activeExam.durationMinutes || 20;
      const allocatedSec = examMinutes * 60;
      timeSpentSeconds = Math.max(0, allocatedSec - remainingSeconds);
    }

    const weakParts = Object.keys(weakPartCounts);

    const examResult: ExamResult = {
      scorePercentage,
      correctCount,
      totalQuestions,
      timeSpentSeconds,
      weakParts,
    };

    set({
      isCompleted: true,
      result: examResult,
    });

    return examResult;
  },

  resetExam: () => {
    const { activeExam } = get();
    if (activeExam) {
      get().startExam(activeExam);
    }
  },
}));
