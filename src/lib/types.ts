export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  fullName?: string;
  name?: string; // alias for fullName
  avatar?: string;
  avatarUrl?: string;
  image?: string;
  role?: UserRole;
  googleId?: string | null;
  diamonds?: number; // Đá Quý (default 100)
  gems?: number; // alias for diamonds
  streak: number; // chuỗi ngày học
  createdAt?: string;
  lastLogin?: string;
  lastActive?: string;
  isVerified?: boolean;
  isBanned?: boolean;
  isVip?: boolean;
  vipExpiresAt?: string;
  wordsLearned: number;
  dictationMinutes: number;
  shadowingMinutes?: number;
  examsCompleted: number;
}

export interface WordItem {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  exampleEn: string;
  exampleVi: string;
  audioUrl?: string;
  topic: string;
  notes?: string;
  level: number; // 0 to 5 for Leitner boxes
  nextReviewDate: string; // ISO string
}

export interface DictationSentence {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  phonetic?: string;
  vietnameseMeaning?: string;
  words?: string[];
}

export type VideoLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Beginner' | 'Intermediate' | 'Advanced' | string;
export type VideoStatus = 'published' | 'hidden' | 'draft' | 'deleted';

export interface DictationLesson {
  id: string;
  youtubeUrl?: string;
  youtubeId?: string;
  videoId?: string; // alias for youtubeId
  title: string;
  topic: string;
  level: VideoLevel;
  audioUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  duration: number; // seconds
  sentences: DictationSentence[];
  totalSentences?: number;
  tags?: string[];
  views?: number;
  status?: VideoStatus;
  isPinned?: boolean;
  order?: number;
  createdAt?: number | string;
  deletedAt?: number | string | null;
  createdBy?: string;
  isCustom?: boolean;
  allowComments?: boolean;
  requireLogin?: boolean;
  unlockDiamonds?: number;
  publishDate?: string;
  speaker?: string;
  channel?: string;
  channelLogo?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface SkillExercise {
  id: string;
  title: string;
  category: 'Reading' | 'Writing' | 'Pronunciation' | 'Interactive';
  level: string;
  content: string; // Passage or prompt
  questions?: {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
}

export interface ExamQuestion {
  id: string;
  questionNumber?: number;
  text?: string;
  questionText?: string;
  question?: string;
  audioUrl?: string;
  passage?: string;
  part?: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  [key: string]: any;
}

export interface ExamSection {
  id: string;
  title: string;
  name?: string;
  order?: number;
  description?: string;
  passage?: string;
  audioUrl?: string;
  questions: ExamQuestion[];
}

export interface ExamPaper {
  id: string;
  title: string;
  type: 'TOEIC' | 'IELTS' | 'VSTEP' | 'THPTQG' | 'Oxford 3000' | string;
  level?: string;
  description?: string;
  duration?: number; // minutes
  durationMinutes?: number;
  totalQuestions: number;
  sections?: ExamSection[];
  questions: ExamQuestion[];
  attempts?: number;
  createdAt?: string;
  [key: string]: any;
}

export type Exam = ExamPaper;
