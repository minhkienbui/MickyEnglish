export interface ParsedQuestion {
  order: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hasColoredAnswer?: boolean;
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
  type: 'TOEIC' | 'IELTS' | 'VSTEP';
  duration: number;
  description: string;
  sections: ParsedSection[];
  coloredAnswersCount?: number;
}

/**
 * Intelligent Parser for unstructured / raw exam text with Color & Format Detection
 */
export function parseRawExamText(
  rawText: string,
  defaultType: 'TOEIC' | 'IELTS' | 'VSTEP' = 'TOEIC'
): ParsedExamResult {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  let title = 'Đề thi tự động quét bằng AI';
  let type = defaultType;
  let duration = 30;
  let description = 'Đề thi được quét và chuẩn hóa từ văn bản / file tài liệu.';
  let coloredAnswersCount = 0;

  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection = {
    name: 'Phần 1',
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

    // Check [CORRECT] tag from docx color detection
    if (/\[CORRECT\][\s\S]*?\[\/CORRECT\]/i.test(cleanText)) {
      isCorrect = true;
      cleanText = cleanText.replace(/\[\/?CORRECT\]/gi, '').trim();
    }

    // Check (đỏ), (chữ đỏ), (màu đỏ), (highlight), (vàng), (đáp án đúng)
    if (/\((?:đỏ|chữ đỏ|màu đỏ|xanh|chữ xanh|màu xanh|vàng|bôi vàng|highlight|đáp án đúng|dung)\)/i.test(cleanText)) {
      isCorrect = true;
      cleanText = cleanText.replace(/\((?:đỏ|chữ đỏ|màu đỏ|xanh|chữ xanh|màu xanh|vàng|bôi vàng|highlight|đáp án đúng|dung)\)/gi, '').trim();
    }

    // Check asterisk or [x] prefix
    if (/^(\*|\[x\])\s*/i.test(cleanText)) {
      isCorrect = true;
      cleanText = cleanText.replace(/^(\*|\[x\])\s*/i, '').trim();
    }

    return { cleanText: cleanText.replace(/\s+/g, ' ').trim(), isCorrect };
  }

  function commitCurrentQuestion() {
    if (currentQuestion && currentQuestion.questionText) {
      while (currentOptions.length < 4) {
        currentOptions.push(`Lựa chọn ${String.fromCharCode(65 + currentOptions.length)}`);
      }

      const q: ParsedQuestion = {
        order: currentQuestion.order || questionCounter++,
        questionText: currentQuestion.questionText.replace(/\[\/?CORRECT\]/gi, '').trim(),
        options: currentOptions.slice(0, 4).map((o) => o.replace(/\[\/?CORRECT\]/gi, '').trim()),
        correctAnswer: currentQuestion.correctAnswer ?? 0,
        explanation: currentQuestion.explanation?.trim() || 'Chưa có giải thích.',
        hasColoredAnswer: currentQuestion.hasColoredAnswer || false,
      };

      if (q.hasColoredAnswer) {
        coloredAnswersCount++;
      }

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

    // Detect Title
    if (/^(Đề thi|Test|Exam|Tiêu đề|Title)[:\s]/i.test(line)) {
      title = line.replace(/^(Đề thi|Test|Exam|Tiêu đề|Title)[:\s]+/i, '').trim() || title;
      continue;
    }

    // Detect Exam Type
    if (/\b(TOEIC|IELTS|VSTEP)\b/i.test(line)) {
      const match = line.match(/\b(TOEIC|IELTS|VSTEP)\b/i);
      if (match) type = match[1].toUpperCase() as any;
    }

    // Detect Section Header (Part 1, Passage 1, Section 1, Phần 1)
    const sectionMatch = line.match(/^(Part|Passage|Section|Phần)\s*(\d+|[A-ZIVX]+)[:\.\-]?\s*(.*)/i);
    if (sectionMatch) {
      commitCurrentSection();
      currentSection.name = line;
      continue;
    }

    // Detect Passage explicit marker
    if (/^(Đoạn văn|Bài đọc|Passage|Read the text|Read the following)[:\s]/i.test(line)) {
      commitCurrentQuestion();
      const content = line.replace(/^(Đoạn văn|Bài đọc|Passage|Read the text|Read the following)[:\s]+/i, '').trim();
      if (content) currentPassageLines.push(content);
      continue;
    }

    // Detect Question start (e.g. "1.", "1)", "Câu 1:", "Question 1:", "[1]")
    const questionMatch = line.match(/^(?:Câu\s*|Question\s*)?(\d+)[\.\:\)\s\]]\s*(.*)/i);
    if (questionMatch && !/^[A-D][\.\:\)\s]/i.test(line) && !/^(?:Đáp án|Answer|Key|ĐA)[:\s]/i.test(line)) {
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
      };
      currentOptions = [];
      continue;
    }

    // Detect single-line multiple options (e.g. "A. option1   B. option2   C. option3   D. option4")
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
        }
      });
      continue;
    }

    // Detect single option line (e.g. "A. Accept", "B) Decline", "*C. Offer", "[x] D. Receive", "A. [CORRECT]Accept[/CORRECT]")
    const optionMatch = line.match(/^(\*|\[x\])?\s*([A-D])[\.\:\)\s]\s*(.*)/i);
    if (optionMatch) {
      const letter = optionMatch[2].toUpperCase();
      const rawText = (optionMatch[1] ? optionMatch[1] + ' ' : '') + optionMatch[3].trim();
      const index = letter.charCodeAt(0) - 65;

      const { cleanText, isCorrect } = cleanOptionText(rawText);

      if (currentOptions.length < 4) {
        currentOptions.push(cleanText);
      }
      if (isCorrect && currentQuestion) {
        currentQuestion.correctAnswer = index;
        currentQuestion.hasColoredAnswer = true;
      }
      continue;
    }

    // Detect Answer key (e.g. "Đáp án: B", "Answer: C", "Key: 2", "ĐA: A")
    const answerMatch = line.match(/^(?:Đáp án|Answer|Key|ĐA|Correct Answer)[:\s]*([A-D]|[1-4])/i);
    if (answerMatch && currentQuestion) {
      const ansChar = answerMatch[1].toUpperCase();
      let ansIndex = 0;
      if (['A', 'B', 'C', 'D'].includes(ansChar)) {
        ansIndex = ansChar.charCodeAt(0) - 65;
      } else if (['1', '2', '3', '4'].includes(ansChar)) {
        ansIndex = parseInt(ansChar, 10) - 1;
      }
      currentQuestion.correctAnswer = ansIndex;

      const expInline = line
        .replace(/^(?:Đáp án|Answer|Key|ĐA|Correct Answer)[:\s]*([A-D]|[1-4])[\.\:\s\-]*/i, '')
        .trim();
      if (expInline) {
        currentQuestion.explanation = expInline;
      }
      continue;
    }

    // Detect Explanation (e.g. "Giải thích: ...", "Explanation: ...", "HD: ...")
    const expMatch = line.match(/^(?:Giải thích|Explanation|Exp|Hướng dẫn|HD)[:\s]*(.*)/i);
    if (expMatch && currentQuestion) {
      currentQuestion.explanation = expMatch[1].trim();
      continue;
    }

    // If we have an active question with options, append to explanation or question text
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

  if (sections.length === 0) {
    sections.push({
      name: 'Phần 1: Trắc nghiệm',
      order: 1,
      questions: [
        {
          order: 1,
          questionText: 'Vui lòng kiểm tra lại cấu trúc văn bản hoặc tải lên file Word/PDF hợp lệ.',
          options: ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
          correctAnswer: 0,
          explanation: 'Chưa nhận diện được câu hỏi.',
        },
      ],
    });
  }

  return {
    title,
    type,
    duration,
    description,
    sections,
    coloredAnswersCount,
  };
}
