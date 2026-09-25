export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SpacedRepetitionResult {
  newLevel: number;
  daysToAdd: number;
  nextReviewDate: string;
}

/**
 * Thuật toán Spaced Repetition kiểu Leitner đơn giản:
 * Level 0: Ôn ngay (0 ngày)
 * Level 1: 1 ngày
 * Level 2: 3 ngày
 * Level 3: 7 ngày
 * Level 4: 14 ngày
 * Level 5: 30 ngày (Đã thuộc lâu dài)
 */
export function calculateNextReview(currentLevel: number, rating: Rating): SpacedRepetitionResult {
  let newLevel = currentLevel;

  switch (rating) {
    case 'again':
      newLevel = 0;
      break;
    case 'hard':
      newLevel = Math.max(0, currentLevel - 1);
      break;
    case 'good':
      newLevel = Math.min(5, currentLevel + 1);
      break;
    case 'easy':
      newLevel = Math.min(5, currentLevel + 2);
      break;
  }

  const intervalDaysMap: Record<number, number> = {
    0: 0,
    1: 1,
    2: 3,
    3: 7,
    4: 14,
    5: 30,
  };

  const daysToAdd = intervalDaysMap[newLevel] ?? 1;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  return {
    newLevel,
    daysToAdd,
    nextReviewDate: nextDate.toISOString(),
  };
}

export function isDueToday(reviewDateIso: string): boolean {
  if (!reviewDateIso) return true;
  const targetDate = new Date(reviewDateIso);
  const now = new Date();
  return targetDate.getTime() <= now.getTime();
}
