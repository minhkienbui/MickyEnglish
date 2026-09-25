import { describe, it, expect } from 'vitest';
import { calculateSM2, ratingToQuality } from '../src/lib/sm2';

describe('SM-2 Spaced Repetition Algorithm', () => {
  it('converts text ratings to numerical quality (0-5)', () => {
    expect(ratingToQuality('again')).toBe(1);
    expect(ratingToQuality('hard')).toBe(3);
    expect(ratingToQuality('good')).toBe(4);
    expect(ratingToQuality('easy')).toBe(5);
  });

  it('resets interval and repetitions on failure (quality < 3)', () => {
    const result = calculateSM2({
      quality: 1, // failed
      repetitions: 4,
      previousInterval: 15,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
    // Ease factor should decrease on poor recall
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it('sets interval to 1 on first successful review', () => {
    const result = calculateSM2({
      quality: 4,
      repetitions: 0,
      previousInterval: 0,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBeCloseTo(2.5, 1);
  });

  it('sets interval to 6 on second successful review', () => {
    const result = calculateSM2({
      quality: 4,
      repetitions: 1,
      previousInterval: 1,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(2);
    expect(result.interval).toBe(6);
  });

  it('multiplies interval by ease factor on third successful review', () => {
    const result = calculateSM2({
      quality: 5,
      repetitions: 2,
      previousInterval: 6,
      previousEaseFactor: 2.5,
    });

    expect(result.repetitions).toBe(3);
    expect(result.easeFactor).toBeGreaterThan(2.5);
    expect(result.interval).toBe(Math.round(6 * result.easeFactor));
  });

  it('ensures ease factor never drops below 1.3', () => {
    let ef = 1.4;
    for (let i = 0; i < 5; i++) {
      const res = calculateSM2({
        quality: 0,
        repetitions: 0,
        previousInterval: 1,
        previousEaseFactor: ef,
      });
      ef = res.easeFactor;
    }
    expect(ef).toBe(1.3);
  });
});
