export type DiffStatus = 'correct' | 'typo' | 'missing' | 'extra';

export interface DiffToken {
  word: string;
  userWord?: string;
  status: DiffStatus;
  explanation?: string;
}

export interface DiffSummary {
  correct: number;
  typo: number;
  missing: number;
  extra: number;
}

export interface DiffResult {
  tokens: DiffToken[];
  accuracy: number; // 0 - 100%
  correctCount: number;
  totalOriginalWords: number;
  summary: DiffSummary;
  errorTaxonomy: string[];
}

export function cleanWord(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9']/g, '');
}

export function tokenizeWords(text: string): string[] {
  return text
    .trim()
    .split(/[\s,.;:!?()"]+/)
    .filter(Boolean);
}

/**
 * Levenshtein distance calculation
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isLevenshteinClose(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 2) return false;
  return levenshteinDistance(a, b) <= 2;
}

function lookAheadMatch(orig: string[], user: string[], origIdx: number, userIdx: number): boolean {
  if (userIdx >= user.length) return true;
  const currentUser = cleanWord(user[userIdx]);
  for (let i = origIdx + 1; i < Math.min(origIdx + 4, orig.length); i++) {
    if (cleanWord(orig[i]) === currentUser) return true;
  }
  return false;
}

/**
 * Thuật toán so sánh từng từ giữa transcript gốc và text học viên nhập vào.
 */
export function compareText(original: string, userInput: string): DiffResult {
  const origWords = original.trim().split(/\s+/).filter(Boolean);
  const userWords = userInput.trim().split(/\s+/).filter(Boolean);

  const tokens: DiffToken[] = [];
  const errorsFound: string[] = [];

  let origIdx = 0;
  let userIdx = 0;

  const summary: DiffSummary = {
    correct: 0,
    typo: 0,
    missing: 0,
    extra: 0,
  };

  while (origIdx < origWords.length || userIdx < userWords.length) {
    const origRaw = origWords[origIdx] || '';
    const userRaw = userWords[userIdx] || '';

    const origClean = cleanWord(origRaw);
    const userClean = cleanWord(userRaw);

    if (origClean && userClean && origClean === userClean) {
      tokens.push({
        word: origRaw,
        userWord: userRaw,
        status: 'correct',
      });
      summary.correct++;
      origIdx++;
      userIdx++;
    } else if (origClean && userClean && isLevenshteinClose(origClean, userClean)) {
      tokens.push({
        word: origRaw,
        userWord: userRaw,
        status: 'typo',
        explanation: `Gõ sai chính tả ("${userRaw}" thay vì "${origRaw}")`,
      });
      summary.typo++;

      // Error taxonomy classification
      if ((origClean.endsWith('s') || origClean.endsWith('es')) && !userClean.endsWith('s')) {
        errorsFound.push('Thiếu âm cuối /s/ hoặc /es/');
      } else if (origClean.endsWith('ed') && !userClean.endsWith('ed')) {
        errorsFound.push('Thiếu đuôi quá khứ /ed/');
      } else {
        errorsFound.push('Sai chính tả từ vựng');
      }

      origIdx++;
      userIdx++;
    } else if (
      origIdx < origWords.length &&
      (userIdx >= userWords.length || lookAheadMatch(origWords, userWords, origIdx, userIdx))
    ) {
      tokens.push({
        word: origRaw,
        status: 'missing',
        explanation: `Bỏ sót từ "${origRaw}"`,
      });
      summary.missing++;
      errorsFound.push('Bỏ sót từ trong câu');
      origIdx++;
    } else if (userIdx < userWords.length) {
      tokens.push({
        word: userRaw,
        userWord: userRaw,
        status: 'extra',
        explanation: `Gõ thừa từ "${userRaw}"`,
      });
      summary.extra++;
      errorsFound.push('Gõ thừa từ không có trong audio');
      userIdx++;
    }
  }

  const accuracy = Math.round((summary.correct / Math.max(1, origWords.length)) * 100);
  const errorTaxonomy = Array.from(new Set(errorsFound));

  return {
    tokens,
    accuracy,
    correctCount: summary.correct,
    totalOriginalWords: origWords.length,
    summary,
    errorTaxonomy,
  };
}
