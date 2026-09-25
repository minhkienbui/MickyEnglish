# Bibung English Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng website học tiếng Anh trực tuyến Bibung English bằng tiếng Việt 100% cho người Việt tự học Nghe - Nói - Đọc - Viết & Luyện thi TOEIC/IELTS/VSTEP với 99% phong cách Bibung.com.

**Architecture:** Next.js 16 (App Router) + React 19 + TailwindCSS v4 với font Nunito & tông xanh lá `#16a34a`, Zustand state management, Prisma database model, Web Audio API / MediaRecorder API cho shadowing và audio dictation.

**Tech Stack:** Next.js, React, TailwindCSS, Lucide React, Zustand, Prisma, Vitest.

---

## File Map & Responsibilities

- `src/app/globals.css` - Design tokens, Nunito font setup, green color palette (`#16a34a`), micro-animations, glassmorphism utilities.
- `src/app/layout.tsx` - Main app layout with Navbar, Footer, Mobile Navigation Bar, Toast provider.
- `src/components/layout/Navbar.tsx` - Responsive top header bar with logo, menu links, profile icon.
- `src/components/layout/MobileNav.tsx` - Bottom navigation bar for mobile users.
- `src/components/layout/Footer.tsx` - Footer with links, social icons, copyright.
- `src/lib/types.ts` - TypeScript interfaces for Users, Vocab, Dictation, Skills, Exams, Progress.
- `src/stores/useAuthStore.ts` - User state, login/logout, progress tracking, streak counter.
- `src/stores/useVocabStore.ts` - Vocabulary lists, flashcard state, Spaced Repetition calculation (SM-2/Leitner).
- `src/stores/useDictationStore.ts` - Dictation lessons, audio player state, transcript diffing, voice recording.
- `src/stores/useExamStore.ts` - Exam bank, timer countdown, answer recording, auto-grading & explanations.
- `src/lib/diffEngine.ts` - Text diffing algorithm for dictation (green: correct, red: typo, yellow: missing, gray: extra).
- `src/lib/spacedRepetition.ts` - Spaced repetition interval calculator for Flashcards.
- `src/data/mockData.ts` - Pre-populated seed data for lessons, vocab sets, exam questions, reading/writing drills.
- `src/app/page.tsx` - Trang chủ (Hero, 3 khối tính năng chính, CTA).
- `src/app/tai-khoan/page.tsx` - Trang cá nhân & tiến độ học tập.
- `src/app/dang-nhap/page.tsx` - Trang đăng nhập / đăng ký.
- `src/app/tuvung/page.tsx` - Trang danh sách bộ từ vựng & quản lý từ.
- `src/app/tuvung/on-tap/page.tsx` - Trang học Flashcard & "Từ cần ôn hôm nay".
- `src/app/dictation-shadowing/page.tsx` - Trang danh sách bài nghe.
- `src/app/dictation-shadowing/[id]/page.tsx` - Trình luyện chép chính tả & Shadowing.
- `src/app/ky-nang/page.tsx` - Trang bài tập Đọc, Viết, Phát âm & Câu hỏi tương tác.
- `src/app/kho-de/page.tsx` - Trang kho đề thi TOEIC, IELTS, VSTEP.
- `src/app/kho-de/[id]/page.tsx` - Giao diện làm bài thi đếm ngược & xem đáp án giải thích.
- `src/app/tinh-nang/page.tsx` - Trang liệt kê chi tiết tính năng.
- `src/app/huong-dan/page.tsx` - Trang bài viết hướng dẫn học.

---

### Task 1: Project Setup & Design System Foundation (Bibung Theme)

**Files:**
- Create: `src/lib/types.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/layout/Footer.tsx`
- Test: `tests/layout.test.tsx`

- [ ] **Step 1: Write failing test for Layout and Navigation components**

```tsx
import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/layout/Navbar';
import { expect, test } from 'vitest';

test('renders logo Bibung English and navigation links', () => {
  render(<Navbar />);
  expect(screen.getByText(/Bibung English/i)).toBeDefined();
  expect(screen.getByText(/Trang chủ/i)).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/layout.test.tsx`
Expected: FAIL with "Cannot find module" or missing components.

- [ ] **Step 3: Define TypeScript interfaces in `src/lib/types.ts`**

```ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  wordsLearned: number;
  dictationMinutes: number;
  examsCompleted: number;
  lastActive: string;
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
  nextReviewDate: string; // ISO date string
}

export interface DictationLesson {
  id: string;
  title: string;
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  audioUrl: string;
  duration: number; // in seconds
  sentences: {
    id: string;
    startTime: number;
    endTime: number;
    text: string;
  }[];
}

export interface ExamQuestion {
  id: string;
  part: string;
  questionNumber: number;
  passage?: string;
  audioUrl?: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  type: 'TOEIC' | 'IELTS' | 'VSTEP';
  durationMinutes: number;
  totalQuestions: number;
  questions: ExamQuestion[];
}
```

- [ ] **Step 4: Update `src/app/globals.css` with Nunito font, Green `#16a34a` color palette & CSS utilities**

```css
@import "tailwindcss";

@layer base {
  :root {
    --primary: #16a34a;
    --primary-hover: #15803d;
    --primary-light: #f0fdf4;
    --bg-page: #f8faf9;
    --card-bg: #ffffff;
    --text-primary: #17261c;
    --text-muted: #5b6a60;
    --border-color: #dfe7e1;
  }
  
  body {
    background-color: var(--bg-page);
    color: var(--text-primary);
    font-family: 'Nunito', system-ui, -apple-system, sans-serif;
  }
}

.btn-primary {
  background-color: #16a34a;
  color: #ffffff;
  font-weight: 700;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease-in-out;
}
.btn-primary:hover {
  background-color: #15803d;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
}

.card-bibung {
  background-color: #ffffff;
  border: 1px solid #dfe7e1;
  border-radius: 1.25rem;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-bibung:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}
```

- [ ] **Step 5: Create Navbar, MobileNav, Footer & Root Layout**

Build `src/components/layout/Navbar.tsx`, `MobileNav.tsx`, `Footer.tsx` with logo, links, green color accents and responsive mobile drawer.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/layout.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/types.ts src/app/globals.css src/app/layout.tsx src/components/layout/ tests/layout.test.tsx
git commit -m "feat: setup project layout, design system and types for Bibung English"
```

---

### Task 2: Module 1 - User Authentication & Profile System

**Files:**
- Create: `src/stores/useAuthStore.ts`
- Create: `src/app/dang-nhap/page.tsx`
- Create: `src/app/tai-khoan/page.tsx`
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/profile/ProgressChart.tsx`
- Test: `tests/auth.test.ts`

- [ ] **Step 1: Write failing unit test for `useAuthStore`**

```ts
import { expect, test, beforeEach } from 'vitest';
import { useAuthStore } from '../src/stores/useAuthStore';

beforeEach(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

test('logs in user successfully and sets streak', () => {
  const { login } = useAuthStore.getState();
  login('hocvien@gmail.com', '123456');
  const state = useAuthStore.getState();
  expect(state.isAuthenticated).toBe(true);
  expect(state.user?.email).toBe('hocvien@gmail.com');
  expect(state.user?.streak).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/auth.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `useAuthStore.ts`**

Support login, registration, logout, streak calculation, and progress increment methods (words learned, listening minutes, exams taken). Persist in localStorage.

- [ ] **Step 4: Create Login/Register page (`src/app/dang-nhap/page.tsx`)**

Build tabs for Đăng Nhập / Đăng Ký, Email + Password validation, Google login simulation, and smooth green UI button actions.

- [ ] **Step 5: Create User Profile page (`src/app/tai-khoan/page.tsx`)**

Display user avatar, streak badge (🔥 Chuỗi X ngày học), progress statistics cards (Số từ đã thuộc, Phút nghe, Đề đã thi), progress chart SVG/CSS, and history log of past study activities.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/auth.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/stores/useAuthStore.ts src/app/dang-nhap/ src/app/tai-khoan/ src/components/auth/ src/components/profile/ tests/auth.test.ts
git commit -m "feat: implement user authentication and profile progress dashboard"
```

---

### Task 3: Module 2 - Smart Vocabulary & Spaced Repetition (Flashcard)

**Files:**
- Create: `src/lib/spacedRepetition.ts`
- Create: `src/stores/useVocabStore.ts`
- Create: `src/data/mockVocab.ts`
- Create: `src/app/tuvung/page.tsx`
- Create: `src/app/tuvung/on-tap/page.tsx`
- Create: `src/components/vocab/Flashcard.tsx`
- Test: `tests/spacedRepetition.test.ts`

- [ ] **Step 1: Write failing unit test for Spaced Repetition algorithm**

```ts
import { expect, test } from 'vitest';
import { calculateNextReview } from '../src/lib/spacedRepetition';

test('calculates next review date based on rating score', () => {
  const level0Next = calculateNextReview(0, 'again');
  expect(level0Next.newLevel).toBe(0);
  expect(level0Next.daysToAdd).toBe(0);

  const level1Good = calculateNextReview(1, 'good');
  expect(level1Good.newLevel).toBe(2);
  expect(level1Good.daysToAdd).toBeGreaterThanOrEqual(3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/spacedRepetition.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/spacedRepetition.ts`**

Leitner / SM-2 algorithm implementation mapping ratings ('again', 'hard', 'good', 'easy') to level changes and next review dates in ISO format.

- [ ] **Step 4: Create seed data in `src/data/mockVocab.ts` & Implement `useVocabStore.ts`**

Add preset vocabulary topics: TOEIC Essential 600, IELTS Academic Vocab, Giao Tiếp Hàng Ngày. Support custom word addition, search filtering, and updating Leitner review status.

- [ ] **Step 5: Build Vocabulary List UI (`src/app/tuvung/page.tsx`)**

Topic cards, search bar, add custom word modal, word card list with IPA audio playback (using SpeechSynthesis API / HTML5 Audio).

- [ ] **Step 6: Build Flashcard & "Từ cần ôn hôm nay" UI (`src/app/tuvung/on-tap/page.tsx`)**

Interactive 3D flip card component showing word/phonetic on front, meaning/examples on back. Rating buttons: "Cần ôn lại" (Đỏ), "Tạm nhớ" (Vàng), "Đã thuộc" (Xanh). Filter words due today (`nextReviewDate <= today`).

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run tests/spacedRepetition.test.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/lib/spacedRepetition.ts src/stores/useVocabStore.ts src/data/mockVocab.ts src/app/tuvung/ src/components/vocab/ tests/spacedRepetition.test.ts
git commit -m "feat: implement smart vocabulary module with Leitner spaced repetition flashcards"
```

---

### Task 4: Module 3 - Dictation & Shadowing Engine

**Files:**
- Create: `src/lib/diffEngine.ts`
- Create: `src/stores/useDictationStore.ts`
- Create: `src/data/mockDictation.ts`
- Create: `src/app/dictation-shadowing/page.tsx`
- Create: `src/app/dictation-shadowing/[id]/page.tsx`
- Create: `src/components/dictation/AudioPlayer.tsx`
- Create: `src/components/dictation/DictationDiff.tsx`
- Create: `src/components/dictation/ShadowingRecorder.tsx`
- Test: `tests/diffEngine.test.ts`

- [ ] **Step 1: Write failing test for Dictation diffing algorithm**

```ts
import { expect, test } from 'vitest';
import { compareText } from '../src/lib/diffEngine';

test('diffs user input with original transcript correctly', () => {
  const original = "The weather is very nice today";
  const userInput = "The wether is nice today";
  const result = compareText(original, userInput);

  expect(result.accuracy).toBeGreaterThan(70);
  expect(result.tokens.some(t => t.status === 'correct')).toBe(true);
  expect(result.tokens.some(t => t.status === 'typo')).toBe(true);
  expect(result.tokens.some(t => t.status === 'missing')).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/diffEngine.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/diffEngine.ts`**

Word tokenization, case-insensitive comparison, Levy/Myers diff algorithm to label words as `correct` (green), `typo` (red), `missing` (yellow), or `extra` (gray). Provide accuracy percentage & error taxonomy summary (e.g. s/es ending errors, missing connecting words).

- [ ] **Step 4: Build Audio Player (`src/components/dictation/AudioPlayer.tsx`)**

HTML5 Audio controls: Play/Pause, Rewind 5s (`-5s`), Speed dropdown (0.75x, 1x, 1.25x), sentence loping & waveform visualization preview.

- [ ] **Step 5: Build Dictation Page & Shadowing Recorder (`src/app/dictation-shadowing/[id]/page.tsx`)**

- Tab 1: **Chép chính tả (Dictation)**: Text input box, real-time submission, instant color-coded word diff display.
- Tab 2: **Nói theo (Shadowing)**: Sentence transcript sync, browser audio recording with `navigator.mediaDevices.getUserMedia` & `MediaRecorder`, audio playback for self-comparison.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/diffEngine.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/diffEngine.ts src/stores/useDictationStore.ts src/data/mockDictation.ts src/app/dictation-shadowing/ src/components/dictation/ tests/diffEngine.test.ts
git commit -m "feat: implement Dictation text diffing engine, audio player and Shadowing voice recorder"
```

---

### Task 5: Module 4 - Skills Practice (Đọc, Viết, Phát âm & Interactive Drills)

**Files:**
- Create: `src/data/mockSkills.ts`
- Create: `src/app/ky-nang/page.tsx`
- Create: `src/components/skills/ReadingPractice.tsx`
- Create: `src/components/skills/WritingPractice.tsx`
- Create: `src/components/skills/PronunciationDrill.tsx`
- Create: `src/components/skills/InteractiveWidgets.tsx`
- Test: `tests/skills.test.tsx`

- [ ] **Step 1: Write failing test for Interactive Exercise Widgets**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WordMatchWidget } from '../src/components/skills/InteractiveWidgets';
import { expect, test } from 'vitest';

test('allows matching english words with vietnamese meanings', () => {
  const pairs = [{ en: 'Apple', vi: 'Quả táo' }, { en: 'Book', vi: 'Quyển sách' }];
  render(<WordMatchWidget pairs={pairs} onComplete={() => {}} />);
  expect(screen.getByText('Apple')).toBeDefined();
  expect(screen.getByText('Quả táo')).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/skills.test.tsx`
Expected: FAIL

- [ ] **Step 3: Create Reading, Writing & Pronunciation content in `src/data/mockSkills.ts`**

Add reading passages with MCQs, writing prompts with sample answers & self-assessment checklist, pronunciation minimal pairs drills (e.g. /s/ vs /ʃ/, /p/ vs /b/).

- [ ] **Step 4: Build Interactive Question Widgets (`src/components/skills/InteractiveWidgets.tsx`)**

- **Fill-in-the-blanks**: Input fields embedded within paragraph text.
- **Sentence Ordering**: Drag/Click words to arrange them into correct sentence order.
- **Word Matching**: Match English terms with Vietnamese definitions.

- [ ] **Step 5: Build Skills Master Page (`src/app/ky-nang/page.tsx`)**

Tabbed interface for **Luyện Đọc**, **Luyện Viết**, **Phát Âm** & **Tương Tác**. Score tracking & feedback indicators.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/skills.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/data/mockSkills.ts src/app/ky-nang/ src/components/skills/ tests/skills.test.tsx
git commit -m "feat: implement reading, writing, pronunciation and interactive exercise widgets"
```

---

### Task 6: Module 5 - Exam Bank (TOEIC, IELTS, VSTEP Exam Simulator)

**Files:**
- Create: `src/stores/useExamStore.ts`
- Create: `src/data/mockExams.ts`
- Create: `src/app/kho-de/page.tsx`
- Create: `src/app/kho-de/[id]/page.tsx`
- Create: `src/components/exam/ExamTimer.tsx`
- Create: `src/components/exam/QuestionNav.tsx`
- Create: `src/components/exam/ExamResultView.tsx`
- Test: `tests/exam.test.ts`

- [ ] **Step 1: Write failing test for `useExamStore` auto-grading**

```ts
import { expect, test } from 'vitest';
import { useExamStore } from '../src/stores/useExamStore';
import { mockExams } from '../src/data/mockExams';

test('grades exam answers correctly and calculates score percentage', () => {
  const exam = mockExams[0];
  const { startExam, selectAnswer, submitExam } = useExamStore.getState();
  
  startExam(exam);
  selectAnswer(exam.questions[0].id, exam.questions[0].correctAnswer);
  
  const result = submitExam();
  expect(result.score).toBeGreaterThan(0);
  expect(result.totalQuestions).toBe(exam.questions.length);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/exam.test.ts`
Expected: FAIL

- [ ] **Step 3: Create exam mock data in `src/data/mockExams.ts`**

Full TOEIC Mini Test, IELTS Reading Test, VSTEP Reading/Listening questions with passages, options, correct answer indices, and detailed Vietnamese explanations.

- [ ] **Step 4: Implement `useExamStore.ts` & Timed Exam UI (`src/app/kho-de/[id]/page.tsx`)**

- Top bar: Exam Title, **ExamTimer** countdown with warning color when < 5 mins remain.
- Sidebar: **QuestionNav** grid highlighting answered, current, and flagged questions.
- Main area: Passage/Audio + Question text + Option radio buttons.

- [ ] **Step 5: Build Exam Results & Explanations (`src/components/exam/ExamResultView.tsx`)**

Total score summary, accuracy percentage, time spent. Question-by-question review with correct answer green highlight, user wrong selection red highlight, detailed Vietnamese explanation box, and topic weakness recommendations.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/exam.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/stores/useExamStore.ts src/data/mockExams.ts src/app/kho-de/ src/components/exam/ tests/exam.test.ts
git commit -m "feat: implement exam bank with countdown timer, auto-grading and detailed answer review"
```

---

### Task 7: Information Pages, Home Page Polish & Comprehensive End-to-End Verification

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/features/page.tsx` (Tính năng)
- Create: `src/app/guides/page.tsx` (Hướng dẫn học)
- Create: `src/app/about/page.tsx` (Giới thiệu)
- Create: `src/app/contact/page.tsx` (Liên hệ)
- Create: `src/app/privacy/page.tsx` (Quyền riêng tư)
- Create: `src/app/terms/page.tsx` (Điều khoản)

- [ ] **Step 1: Polish Home Page (`src/app/page.tsx`)**

Hero section: "Học tiếng Anh chủ động cùng Bibung English", catchy subtitle, CTA "Bắt đầu học miễn phí" leading to `/dictation-shadowing`. 3 feature cards matching Bibung.com:
1. Luyện nghe có phản hồi (Dictation & Shadowing)
2. Ôn từ vựng đúng lúc (Spaced Repetition Flashcards)
3. Luyện đề có hệ thống (TOEIC, IELTS, VSTEP Exam Bank)
User feedback section, stats counter, clean footer.

- [ ] **Step 2: Create Informational Pages**

Build `/features`, `/guides`, `/about`, `/contact`, `/privacy`, and `/terms` with rich markdown formatting, clean green typography, and helpful study tips for Vietnamese English learners.

- [ ] **Step 3: Run project build and test suite verification**

Run commands:
- `npm run lint`
- `npx vitest run`
- `npm run build`

Verify all tests pass and production build succeeds without errors.

- [ ] **Step 4: Commit final changes**

```bash
git add src/app/
git commit -m "feat: finalize Bibung English website with home hero, info pages and full build validation"
```

---

## Execution Choice Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-18-bibung-english-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
