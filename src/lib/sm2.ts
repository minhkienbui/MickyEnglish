export interface SM2Input {
  quality: number; // 0 to 5
  repetitions: number;
  previousInterval: number; // in days
  previousEaseFactor: number;
}

export interface SM2Result {
  easeFactor: number;
  interval: number; // in days
  repetitions: number;
  nextReviewDate: Date;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy' | 0 | 1 | 2 | 3 | 4 | 5;

export function ratingToQuality(rating: ReviewRating): number {
  if (typeof rating === 'number') {
    return Math.max(0, Math.min(5, Math.round(rating)));
  }
  switch (rating) {
    case 'again':
      return 1;
    case 'hard':
      return 3;
    case 'good':
      return 4;
    case 'easy':
      return 5;
    default:
      return 3;
  }
}

/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm Implementation
 */
export function calculateSM2({
  quality,
  repetitions,
  previousInterval,
  previousEaseFactor,
}: SM2Input): SM2Result {
  const q = Math.max(0, Math.min(5, quality));

  // Calculate new Ease Factor (EF)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const deltaEF = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  let newEaseFactor = previousEaseFactor + deltaEF;
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  let newRepetitions = repetitions;
  let newInterval = previousInterval;

  if (q < 3) {
    // Failed recall: reset repetitions and start over with 1 day interval
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Successful recall
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(previousInterval * newEaseFactor);
    }
    newRepetitions += 1;
  }

  // Calculate next review date
  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}
