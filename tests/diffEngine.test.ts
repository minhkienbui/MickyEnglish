import { expect, test } from 'vitest';
import { compareText } from '../src/lib/diffEngine';

test('compareText identifies correct words, typos, and missing words', () => {
  const original = "The quick brown fox jumps over the lazy dog";
  const userInput = "The quik brown fox jumps the lazy dog";
  const result = compareText(original, userInput);

  expect(result.accuracy).toBeGreaterThan(70);
  expect(result.tokens.filter((t) => t.status === 'correct').length).toBeGreaterThan(5);
  expect(result.tokens.some((t) => t.status === 'typo')).toBe(true); // quik vs quick
  expect(result.tokens.some((t) => t.status === 'missing')).toBe(true); // 'over' missing
});

test('compareText categorizes common errors', () => {
  const original = "He walks to school every morning";
  const userInput = "He walk to school every morning";
  const result = compareText(original, userInput);

  expect(result.errorTaxonomy).toBeDefined();
  expect(result.errorTaxonomy.some((e) => e.includes('s/es') || e.includes('âm cuối'))).toBe(true);
});
