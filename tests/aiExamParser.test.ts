import { describe, it, expect } from 'vitest';
import { parseRawExamText } from '../src/lib/aiExamParser';

describe('AI Raw Exam Text Parser with Color Detection', () => {
  it('detects colored answers tagged from Word document [CORRECT] markers', () => {
    const raw = `
Title: Đề thi tiếng Anh Word với chữ màu

Part 5: Vocabulary
1. What is the antonym of abundant?
A. Plentiful
B. [CORRECT]Scarce[/CORRECT]
C. Generous
D. Large
Giải thích: Scarce mang nghĩa khan hiếm, trái nghĩa với abundant.

2. Choose the correct spelling:
A. [CORRECT]Accommodate[/CORRECT]   B. Acommodate   C. Accomodate   D. Acomodate
`;

    const result = parseRawExamText(raw);
    expect(result.title).toBe('Đề thi tiếng Anh Word với chữ màu');
    expect(result.sections[0].questions.length).toBe(2);

    const q1 = result.sections[0].questions[0];
    expect(q1.options[1]).toBe('Scarce');
    expect(q1.correctAnswer).toBe(1); // Option B
    expect(q1.hasColoredAnswer).toBe(true);

    const q2 = result.sections[0].questions[1];
    expect(q2.options[0]).toBe('Accommodate');
    expect(q2.correctAnswer).toBe(0); // Option A
    expect(q2.hasColoredAnswer).toBe(true);
  });

  it('detects Vietnamese text color indicators like (chữ đỏ), (màu xanh), (highlight)', () => {
    const raw = `
1. She decided to _______ the contract.
A. reject (chữ đỏ)
B. rejecting
C. rejected
D. rejection
`;

    const result = parseRawExamText(raw);
    const q1 = result.sections[0].questions[0];
    expect(q1.options[0]).toBe('reject');
    expect(q1.correctAnswer).toBe(0); // Option A
  });
});
