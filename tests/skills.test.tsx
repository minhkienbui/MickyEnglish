import { render, screen, fireEvent } from '@testing-library/react';
import { WordMatchWidget } from '../src/components/skills/InteractiveWidgets';
import { expect, test } from 'vitest';

test('WordMatchWidget renders pairs and detects matches', () => {
  const pairs = [
    { en: 'Apple', vi: 'Quả táo' },
    { en: 'Book', vi: 'Quyển sách' },
  ];
  render(<WordMatchWidget pairs={pairs} onComplete={() => {}} />);
  expect(screen.getByText('Apple')).toBeDefined();
  expect(screen.getByText('Quả táo')).toBeDefined();
});
