export interface ParsedQuestion {
  id?: string;
  order: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hasColoredAnswer?: boolean;
  hasDetectedAnswer?: boolean;
}

export interface ParsedSection {
  name: string;
  order: number;
  passage?: string;
  audioUrl?: string;
  questions: ParsedQuestion[];
}

export interface ParsedExamResult {
  title: string;
  type: 'TOEIC' | 'IELTS' | 'VSTEP' | 'THPTQG' | 'Oxford 3000' | string;
  level?: string;
  duration: number;
  description: string;
  sections: ParsedSection[];
  totalQuestions: number;
  coloredAnswersCount?: number;
  detectedAnswersCount?: number;
}

/**
 * Tách và trích xuất bảng đáp án ở cuối đề thi (nếu có)
 */
export function extractEndOfDocAnswerKeys(rawText: string): {
  answers: Map<number, number>;
  explanations: Map<number, string>;
  contentWithoutKeys: string;
} {
  const answers = new Map<number, number>();
  const explanations = new Map<number, string>();

  // Dấu hiệu nhận biết mục BẢNG ĐÁP ÁN ở cuối tài liệu
  const answerSectionRegex = /(?:^|\n)\s*(?:[-=*#]+\s*)?(?:BẢNG\s+ĐÁP\s+ÁN|ĐÁP\s+ÁN\s+(?:CHI\s+TIẾT|THAM\s+KHẢO|CHÍNH\s+XÁC|ĐÚNG)?|ANSWER\s+KEY|KEYS?|HƯỚNG\s+DẪN\s+CHẤM|ĐÁP\s+ÁN\s+VÀ\s+GIẢI\s+THÍCH)[:\s\-–\n]+/i;

  const match = rawText.search(answerSectionRegex);
  if (match === -1) {
    return { answers, explanations, contentWithoutKeys: rawText };
  }

  const contentWithoutKeys = rawText.slice(0, match).trim();
  const answerSectionText = rawText.slice(match);

  // Pattern 1: Từng dòng có giải thích: "1. A - Giải thích: ..." hoặc "Câu 1: B (Vì ...)"
  const lines = answerSectionText.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const lineMatch = line.match(/^(?:Câu\s*)?(\d+)[\s.:)\-–=]+([A-D]|[1-4])(?:\s*[\-–:]\s*(.+))?$/i);
    if (lineMatch) {
      const qNum = parseInt(lineMatch[1], 10);
      const letter = lineMatch[2].toUpperCase();
      const ansIdx = ['A', 'B', 'C', 'D'].includes(letter)
        ? letter.charCodeAt(0) - 65
        : parseInt(letter, 10) - 1;

      if (qNum > 0 && qNum <= 1000) {
        answers.set(qNum, ansIdx);
        if (lineMatch[3]?.trim()) {
          explanations.set(qNum, lineMatch[3].trim());
        }
      }
    }
  }

  // Pattern 2: Dạng bảng hoặc hàng ngang: "1.A  2.B  3.C  4.D" hoặc "1 - A, 2 - B" hoặc "Câu 1: A | Câu 2: B"
  const inlinePattern = /(?:Câu\s*)?(\d+)[\s.:)\-–=]+([A-D]|[1-4])(?![a-zA-Z0-9])/gi;
  let m;
  while ((m = inlinePattern.exec(answerSectionText)) !== null) {
    const qNum = parseInt(m[1], 10);
    const letter = m[2].toUpperCase();
    const ansIdx = ['A', 'B', 'C', 'D'].includes(letter)
      ? letter.charCodeAt(0) - 65
      : parseInt(letter, 10) - 1;

    if (qNum > 0 && qNum <= 1000 && !answers.has(qNum)) {
      answers.set(qNum, ansIdx);
    }
  }

  // Pattern 3: Dạng cô đọng không dấu cách: "1A  2B  3C  4D  5A"
  if (answers.size === 0) {
    const compactPattern = /\b(\d+)([A-D])\b/gi;
    while ((m = compactPattern.exec(answerSectionText)) !== null) {
      const qNum = parseInt(m[1], 10);
      const letter = m[2].toUpperCase();
      const ansIdx = letter.charCodeAt(0) - 65;
      if (qNum > 0 && qNum <= 1000 && !answers.has(qNum)) {
        answers.set(qNum, ansIdx);
      }
    }
  }

  return { answers, explanations, contentWithoutKeys };
}

/**
 * Bộ Phân Tích Thông Minh Tự Động Nhận Dạng Đề Thi (AI Exam Parser)
 * - Tự động bóc tách Câu hỏi, 4 Lựa chọn A/B/C/D
 * - Tự động nhận diện Đáp án đúng (qua Highlight Word, Chữ đỏ, Dấu *, Đáp án theo câu hoặc Bảng đáp án cuối file)
 */
export function parseRawExamText(
  rawText: string,
  defaultType: 'TOEIC' | 'IELTS' | 'VSTEP' | 'THPTQG' | 'Oxford 3000' | string = 'TOEIC'
): ParsedExamResult {
  if (!rawText || !rawText.trim()) {
    return {
      title: 'Đề thi rỗng',
      type: defaultType,
      duration: 30,
      description: 'Chưa có nội dung đề thi.',
      sections: [],
      totalQuestions: 0,
      coloredAnswersCount: 0,
      detectedAnswersCount: 0,
    };
  }

  // Bước 1: Trích xuất bảng đáp án cuối tài liệu (nếu có)
  const { answers: endDocAnswers, explanations: endDocExplanations, contentWithoutKeys } =
    extractEndOfDocAnswerKeys(rawText);

  const lines = contentWithoutKeys.split('\n').map((l) => l.trim()).filter(Boolean);

  let title = 'Đề thi tự động quét bằng AI';
  let type = defaultType;
  let duration = 30;
  let description = 'Đề thi được quét và phân loại tự động từ tài liệu PDF/Word.';
  let coloredAnswersCount = 0;
  let detectedAnswersCount = 0;

  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection = {
    name: 'Phần 1: Trắc nghiệm',
    order: 1,
    passage: '',
    questions: [],
  };

  let currentPassageLines: string[] = [];
  let currentQuestion: Partial<ParsedQuestion> | null = null;
  let currentOptions: string[] = [];
  let questionCounter = 1;

  function cleanOptionText(text: string): { cleanText: string; isCorrect: boolean } {
    let isCorrect = false;
    let cleanText = text;

    // Check [CORRECT] tag từ docx color / highlight detection
    if (/\[CORRECT\][\s\S]*?\[\/CORRECT\]/i.test(cleanText)) {
      isCorrect = true;
      cleanText = cleanText.replace(/\[\/?CORRECT\]/gi, '').trim();
    }

    // Check các nhãn chú thích (đáp án đúng), (chữ đỏ), (highlight)...
    if (/\((?:đỏ|chữ đỏ|màu đỏ|xanh|chữ xanh|màu xanh|vàng|bôi vàng|highlight|đáp án đúng|đúng|dung|correct)\)/i.test(cleanText)) {
      isCorrect = true;
      cleanText = cleanText.replace(/\((?:đỏ|chữ đỏ|màu đỏ|xanh|chữ xanh|màu xanh|vàng|bôi vàng|highlight|đáp án đúng|đúng|dung|correct)\)/gi, '').trim();
    }

    // Check tiền tố * hoặc [x] hoặc (x)
    if (/^(\*|\[x\]|\(x\)|✓|✔)\s*/i.test(cleanText)) {
      isCorrect = true;
      cleanText = cleanText.replace(/^(\*|\[x\]|\(x\)|✓|✔)\s*/i, '').trim();
    }

    // Check hậu tố * hoặc [x]
    if (/\s*(\*|\[x\]|\(x\)|✓|✔)$/i.test(cleanText)) {
      isCorrect = true;
      cleanText = cleanText.replace(/\s*(\*|\[x\]|\(x\)|✓|✔)$/i, '').trim();
    }

    return { cleanText: cleanText.replace(/\s+/g, ' ').trim(), isCorrect };
  }

  function commitCurrentQuestion() {
    if (currentQuestion && currentQuestion.questionText) {
      // Đảm bảo đủ 4 phương án lựa chọn
      while (currentOptions.length < 4) {
        currentOptions.push(`Lựa chọn ${String.fromCharCode(65 + currentOptions.length)}`);
      }

      const qOrder = currentQuestion.order || questionCounter++;
      let finalCorrectAnswer = currentQuestion.correctAnswer ?? 0;
      let hasDetected = currentQuestion.hasDetectedAnswer || currentQuestion.hasColoredAnswer || false;
      let finalExplanation = currentQuestion.explanation?.trim() || '';

      // Áp dụng bảng đáp án cuối tài liệu nếu câu này chưa có đáp án inline
      if (!hasDetected && endDocAnswers.has(qOrder)) {
        finalCorrectAnswer = endDocAnswers.get(qOrder)!;
        hasDetected = true;
      }

      if (!finalExplanation && endDocExplanations.has(qOrder)) {
        finalExplanation = endDocExplanations.get(qOrder)!;
      }

      const q: ParsedQuestion = {
        id: `q-${qOrder}-${Date.now().toString().slice(-4)}`,
        order: qOrder,
        questionText: currentQuestion.questionText.replace(/\[\/?CORRECT\]/gi, '').trim(),
        options: currentOptions.slice(0, 4).map((o) => o.replace(/\[\/?CORRECT\]/gi, '').trim()),
        correctAnswer: finalCorrectAnswer,
        explanation: finalExplanation || (hasDetected ? 'Đáp án đã được AI tự động phân loại từ tài liệu.' : 'Chưa có giải thích chi tiết.'),
        hasColoredAnswer: currentQuestion.hasColoredAnswer || false,
        hasDetectedAnswer: hasDetected,
      };

      if (q.hasColoredAnswer) coloredAnswersCount++;
      if (q.hasDetectedAnswer) detectedAnswersCount++;

      currentSection.questions.push(q);
      currentQuestion = null;
      currentOptions = [];
    }
  }

  function commitCurrentSection() {
    commitCurrentQuestion();
    if (currentPassageLines.length > 0) {
      currentSection.passage = currentPassageLines.join('\n').replace(/\[\/?CORRECT\]/gi, '').trim();
      currentPassageLines = [];
    }
    if (currentSection.questions.length > 0 || currentSection.passage) {
      sections.push(currentSection);
      currentSection = {
        name: `Phần ${sections.length + 1}`,
        order: sections.length + 1,
        passage: '',
        questions: [],
      };
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Phát hiện Tiêu đề đề thi
    if (/^(Đề thi|Test|Exam|Tiêu đề|Title|BÀI THI|ĐỀ KIỂM TRA)[:\s]/i.test(line)) {
      title = line.replace(/^(Đề thi|Test|Exam|Tiêu đề|Title|BÀI THI|ĐỀ KIỂM TRA)[:\s]+/i, '').trim() || title;
      continue;
    }

    // Nhận diện Loại kỳ thi (TOEIC, IELTS, VSTEP, THPTQG, Oxford)
    if (/\b(TOEIC|IELTS|VSTEP|THPTQG|THPT\s*QUỐC\s*GIA|OXFORD)\b/i.test(line)) {
      const match = line.match(/\b(TOEIC|IELTS|VSTEP|THPTQG|THPT\s*QUỐC\s*GIA|OXFORD)\b/i);
      if (match) {
        const found = match[1].toUpperCase();
        if (found.includes('THPT')) type = 'THPTQG';
        else if (found.includes('OXFORD')) type = 'Oxford 3000';
        else type = found as any;
      }
    }

    // Phát hiện Phần thi / Section Header (Part 1, Passage 1, Section 1, Phần 1)
    const sectionMatch = line.match(/^(?:Part|Passage|Section|Phần)\s*(\d+|[A-ZIVX]+)[:\.\-]?\s*(.*)/i);
    if (sectionMatch) {
      commitCurrentSection();
      currentSection.name = line;
      continue;
    }

    // Phát hiện Đoạn văn đọc hiểu (Passage)
    if (/^(?:Đoạn văn|Bài đọc|Passage|Read the text|Read the following|Read passage)[:\s]/i.test(line)) {
      commitCurrentQuestion();
      const content = line.replace(/^(?:Đoạn văn|Bài đọc|Passage|Read the text|Read the following|Read passage)[:\s]+/i, '').trim();
      if (content) currentPassageLines.push(content);
      continue;
    }

    // Phát hiện Bắt đầu câu hỏi (VD: "Câu 1:", "Question 1.", "1.", "1)", "[1]")
    const questionMatch = line.match(/^(?:Câu\s*|Question\s*|Q\s*)?(\d+)[\.\:\)\s\]]\s*(.*)/i);
    if (
      questionMatch &&
      !/^[A-D][\.\:\)\s]/i.test(line) &&
      !/^(?:Đáp án|Answer|Key|ĐA|Hướng dẫn)[:\s]/i.test(line)
    ) {
      commitCurrentQuestion();
      if (currentPassageLines.length > 0) {
        currentSection.passage = currentPassageLines.join('\n').trim();
        currentPassageLines = [];
      }
      const qNum = parseInt(questionMatch[1], 10);
      const qText = questionMatch[2] || '';

      currentQuestion = {
        order: qNum || questionCounter++,
        questionText: qText,
        options: [],
        correctAnswer: 0,
        explanation: '',
        hasColoredAnswer: false,
        hasDetectedAnswer: false,
      };
      currentOptions = [];
      continue;
    }

    // Phát hiện nhiều lựa chọn trên 1 dòng: "A. opt1   B. opt2   C. opt3   D. opt4"
    const inlineOptionsMatch = line.match(
      /A[\.\:\)]\s*(.*?)\s+B[\.\:\)]\s*(.*?)\s+C[\.\:\)]\s*(.*?)\s+D[\.\:\)]\s*(.*)/i
    );
    if (inlineOptionsMatch) {
      const rawOpts = [
        inlineOptionsMatch[1].trim(),
        inlineOptionsMatch[2].trim(),
        inlineOptionsMatch[3].trim(),
        inlineOptionsMatch[4].trim(),
      ];

      currentOptions = [];
      rawOpts.forEach((optStr, idx) => {
        const { cleanText, isCorrect } = cleanOptionText(optStr);
        currentOptions.push(cleanText);
        if (isCorrect && currentQuestion) {
          currentQuestion.correctAnswer = idx;
          currentQuestion.hasColoredAnswer = true;
          currentQuestion.hasDetectedAnswer = true;
        }
      });
      continue;
    }

    // Phát hiện 2 lựa chọn trên 1 dòng: "A. opt1   B. opt2" hoặc "C. opt3   D. opt4"
    const twoOptionsMatch = line.match(
      /([A-D])[\.\:\)]\s*(.*?)\s+([A-D])[\.\:\)]\s*(.*)/i
    );
    if (twoOptionsMatch) {
      const letter1 = twoOptionsMatch[1].toUpperCase();
      const letter2 = twoOptionsMatch[3].toUpperCase();
      const idx1 = letter1.charCodeAt(0) - 65;
      const idx2 = letter2.charCodeAt(0) - 65;

      const { cleanText: text1, isCorrect: isCorr1 } = cleanOptionText(twoOptionsMatch[2]);
      const { cleanText: text2, isCorrect: isCorr2 } = cleanOptionText(twoOptionsMatch[4]);

      while (currentOptions.length < idx1) currentOptions.push('');
      currentOptions[idx1] = text1;
      while (currentOptions.length < idx2) currentOptions.push('');
      currentOptions[idx2] = text2;

      if (isCorr1 && currentQuestion) {
        currentQuestion.correctAnswer = idx1;
        currentQuestion.hasDetectedAnswer = true;
      }
      if (isCorr2 && currentQuestion) {
        currentQuestion.correctAnswer = idx2;
        currentQuestion.hasDetectedAnswer = true;
      }
      continue;
    }

    // Phát hiện 1 lựa chọn trên 1 dòng: "A. Accept", "B) Decline", "*C. Offer", "[CORRECT]D. Receive[/CORRECT]"
    const optionMatch = line.match(/^(\*|\[x\]|\(x\)|✓|✔)?\s*([A-D])[\.\:\)\s]\s*(.*)/i);
    if (optionMatch) {
      const letter = optionMatch[2].toUpperCase();
      const rawText = (optionMatch[1] ? optionMatch[1] + ' ' : '') + optionMatch[3].trim();
      const index = letter.charCodeAt(0) - 65;

      const { cleanText, isCorrect } = cleanOptionText(rawText);

      while (currentOptions.length < index) {
        currentOptions.push('');
      }
      currentOptions[index] = cleanText;

      if (isCorrect && currentQuestion) {
        currentQuestion.correctAnswer = index;
        currentQuestion.hasColoredAnswer = true;
        currentQuestion.hasDetectedAnswer = true;
      }
      continue;
    }

    // Phát hiện Đáp án ngay dưới câu: "Đáp án: B", "Answer: C", "Key: 2", "ĐA đúng: A"
    const answerMatch = line.match(/^(?:Đáp án(?:\s*đúng)?|Answer|Key|ĐA|Correct Answer)[:\s]*([A-D]|[1-4])/i);
    if (answerMatch && currentQuestion) {
      const ansChar = answerMatch[1].toUpperCase();
      let ansIndex = 0;
      if (['A', 'B', 'C', 'D'].includes(ansChar)) {
        ansIndex = ansChar.charCodeAt(0) - 65;
      } else if (['1', '2', '3', '4'].includes(ansChar)) {
        ansIndex = parseInt(ansChar, 10) - 1;
      }
      currentQuestion.correctAnswer = ansIndex;
      currentQuestion.hasDetectedAnswer = true;

      const expInline = line
        .replace(/^(?:Đáp án(?:\s*đúng)?|Answer|Key|ĐA|Correct Answer)[:\s]*([A-D]|[1-4])[\.\:\s\-]*/i, '')
        .trim();
      if (expInline) {
        currentQuestion.explanation = expInline;
      }
      continue;
    }

    // Phát hiện Giải thích: "Giải thích: ...", "Hướng dẫn: ...", "Explanation: ..."
    const expMatch = line.match(/^(?:Giải thích|Explanation|Exp|Hướng dẫn|HD)[:\s]*(.*)/i);
    if (expMatch && currentQuestion) {
      currentQuestion.explanation = expMatch[1].trim();
      continue;
    }

    // Nếu đang trong câu hỏi mà chưa có đáp án, nối thêm text vào câu hỏi
    if (currentQuestion) {
      if (currentOptions.length === 0) {
        currentQuestion.questionText = (currentQuestion.questionText ? currentQuestion.questionText + ' ' : '') + line;
      }
    } else {
      currentPassageLines.push(line);
    }
  }

  commitCurrentSection();

  if (sections.length === 0 && currentSection.questions.length > 0) {
    sections.push(currentSection);
  }

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);

  // Tính thời gian đề xuất: khoảng 1 - 1.5 phút/câu
  duration = Math.max(15, Math.min(180, Math.round(totalQuestions * 1.2)));

  return {
    title,
    type,
    duration,
    description,
    sections,
    totalQuestions,
    coloredAnswersCount,
    detectedAnswersCount,
  };
}
