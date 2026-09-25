import { z } from 'zod';

export const createVocabularySetSchema = z.object({
  name: z.string().min(2, { message: 'Tên bộ từ vựng phải có ít nhất 2 ký tự' }),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export type CreateVocabularySetInput = z.infer<typeof createVocabularySetSchema>;

export const createVocabularyWordSchema = z.object({
  setId: z.string().min(1, { message: 'Mã bộ từ vựng không được để trống' }),
  word: z.string().min(1, { message: 'Từ tiếng Anh không được để trống' }),
  meaning: z.string().min(1, { message: 'Nghĩa tiếng Việt không được để trống' }),
  phonetic: z.string().optional(),
  example: z.string().optional(),
  audioUrl: z.string().optional(),
});

export type CreateVocabularyWordInput = z.infer<typeof createVocabularyWordSchema>;

export const reviewWordSchema = z.object({
  wordId: z.string().min(1, { message: 'Mã từ vựng không được để trống' }),
  rating: z.union([
    z.literal('again'),
    z.literal('hard'),
    z.literal('good'),
    z.literal('easy'),
    z.number().min(0).max(5),
  ]),
});

export type ReviewWordInput = z.infer<typeof reviewWordSchema>;
