import { describe, it, expect } from 'vitest';
import { submitExamSchema } from '../src/lib/validations/exam.schema';

describe('Exam Validation & Grading Calculation', () => {
  it('validates exam submission schema', () => {
    const valid = {
      examId: 'exam-toeic-1',
      answers: [
        { questionId: 'q-1', userAnswer: 0 },
        { questionId: 'q-2', userAnswer: 2 },
      ],
    };
    expect(submitExamSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty examId or invalid answers', () => {
    expect(submitExamSchema.safeParse({ examId: '', answers: [] }).success).toBe(false);
  });
});
