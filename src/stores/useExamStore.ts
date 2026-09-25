import { create } from 'zustand';
import { ExamPaper } from '@/lib/types';
import { mockExams } from '@/data/mockExams';

export type ExamMode = 'exam' | 'practice';

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
  mode: ExamMode; // 'exam' (Thi thử) | 'practice' (Ôn luyện tức thì)
  customDurationMinutes: number | null; // null = unlimited, number = minutes
  userAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  flaggedQuestions: string[];
  remainingSeconds: number;
  isUnlimitedTime: boolean;
  isCompleted: boolean;
  result: ExamResult | null;

  setMode: (mode: ExamMode) => void;
  setCustomDuration: (minutes: number | null) => void;
  startExam: (exam: ExamPaper, customMinutes?: number | null, customMode?: ExamMode) => void;
  selectAnswer: (questionId: string, optionIndex: number) => void;
  toggleFlagQuestion: (questionId: string) => void;
  setRemainingSeconds: (sec: number | ((prev: number) => number)) => void;
  submitExam: () => ExamResult;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()((set, get) => ({
  exams: mockExams,
  activeExam: null,
  mode: 'practice', // Default to practice mode for instant learning!
  customDurationMinutes: null,
  userAnswers: {},
  flaggedQuestions: [],
  remainingSeconds: 0,
  isUnlimitedTime: false,
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

  startExam: (exam, customMinutes, customMode) => {
    const currentMode = customMode !== undefined ? customMode : get().mode;
    const duration = customMinutes !== undefined ? customMinutes : get().customDurationMinutes;
    const isUnlimited = duration === null || duration <= 0;
    const examMinutes = exam.durationMinutes || exam.duration || 45;
    const initialSeconds = isUnlimited
      ? (examMinutes > 0 ? examMinutes * 60 : 0)
      : (duration || 45) * 60;

    set({
      activeExam: exam,
      mode: currentMode,
      customDurationMinutes: duration,
      isUnlimitedTime: isUnlimited && duration === 0,
      userAnswers: {},
      flaggedQuestions: [],
      remainingSeconds: initialSeconds,
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

  submitExam: () => {
    const { activeExam, userAnswers, remainingSeconds, isUnlimitedTime, customDurationMinutes } = get();
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
    const examMinutes = activeExam.durationMinutes || activeExam.duration || 45;
    const allocatedSec = (customDurationMinutes || examMinutes) * 60;
    const timeSpentSeconds = isUnlimitedTime ? 0 : Math.max(0, allocatedSec - remainingSeconds);
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
    set({
      activeExam: null,
      userAnswers: {},
      flaggedQuestions: [],
      remainingSeconds: 0,
      isCompleted: false,
      result: null,
    });
  },
}));
