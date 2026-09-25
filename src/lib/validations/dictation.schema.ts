import { z } from 'zod';

export const submitDictationSchema = z.object({
  lessonId: z.string().min(1, { message: 'Mã bài học không được để trống' }),
  userText: z.string().min(1, { message: 'Vui lòng nhập nội dung đã nghe được' }),
  timeSpent: z.number().nonnegative().default(0), // in seconds
});

export type SubmitDictationInput = z.infer<typeof submitDictationSchema>;
