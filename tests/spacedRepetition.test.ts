import { expect, test } from 'vitest';
import { calculateNextReview, isDueToday } from '../src/lib/spacedRepetition';

test('calculateNextReview returns correct interval and level for rating', () => {
  // Rating 'again' resets level to 0
  const againRes = calculateNextReview(3, 'again');
  expect(againRes.newLevel).toBe(0);
  expect(againRes.daysToAdd).toBe(0);

  // Rating 'good' increments level
  const goodRes = calculateNextReview(1, 'good');
  expect(goodRes.newLevel).toBe(2);
  expect(goodRes.daysToAdd).toBe(3);

  // Rating 'easy' advances level by 2
  const easyRes = calculateNextReview(1, 'easy');
  expect(easyRes.newLevel).toBe(3);
  expect(easyRes.daysToAdd).toBe(7);
});

test('isDueToday checks if word review date is today or past', () => {
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();

  expect(isDueToday(yesterday)).toBe(true);
  expect(isDueToday(nextWeek)).toBe(false);
});
