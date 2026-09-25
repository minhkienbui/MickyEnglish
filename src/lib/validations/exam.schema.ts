import { z } from 'zod';

export const submitExamAnswerItemSchema = z.object({
  questionId: z.string().min(1),
  userAnswer: z.number().int().min(0).max(3),
});

export const submitExamSchema = z.object({
  examId: z.string().min(1, { message: 'Mã đề thi không được để trống' }),
  answers: z.array(submitExamAnswerItemSchema).min(1, { message: 'Vui lòng hoàn thành ít nhất 1 câu hỏi' }),
  startedAt: z.string().optional(),
});

export type SubmitExamInput = z.infer<typeof submitExamSchema>;
