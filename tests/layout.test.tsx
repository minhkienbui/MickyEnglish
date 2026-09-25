import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/layout/Navbar';
import { expect, test } from 'vitest';

test('renders logo MickyEnglish and navigation elements', () => {
  render(<Navbar />);
  expect(screen.getByText(/Micky/i)).toBeDefined();
  expect(screen.getByText(/English/i)).toBeDefined();
});
