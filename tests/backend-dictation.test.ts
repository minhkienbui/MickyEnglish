import { describe, it, expect } from 'vitest';
import { compareText, tokenizeWords } from '../src/lib/diffEngine';

describe('Dictation Diff Engine', () => {
  it('tokenizes words properly stripping punctuation for comparison', () => {
    const tokens = tokenizeWords('Hello, world! How are you?');
    expect(tokens).toEqual(['Hello', 'world', 'How', 'are', 'you']);
  });

  it('calculates 100% accuracy for identical text', () => {
    const transcript = 'Practice makes perfect every single day';
    const userText = 'Practice makes perfect every single day';
    const result = compareText(transcript, userText);

    expect(result.accuracy).toBe(100);
    expect(result.tokens.every((t) => t.status === 'correct')).toBe(true);
    expect(result.summary.correct).toBe(6);
    expect(result.summary.missing).toBe(0);
    expect(result.summary.typo).toBe(0);
  });

  it('detects typos, missing words, and extra words', () => {
    const transcript = 'The quick brown fox jumps over the lazy dog';
    const userText = 'The quik brown fox extra jumped over lazy dog';
    const result = compareText(transcript, userText);

    expect(result.accuracy).toBeLessThan(100);
    expect(result.tokens.some((t) => t.status === 'typo')).toBe(true);
    expect(result.tokens.some((t) => t.status === 'missing')).toBe(true);
    expect(result.tokens.some((t) => t.status === 'extra')).toBe(true);
  });
});
