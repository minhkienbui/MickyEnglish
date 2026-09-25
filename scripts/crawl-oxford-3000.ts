import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

export interface OxfordWordItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  exampleEn: string;
  exampleVi: string;
  imageUrl: string;
  audioUrl: string;
  page: number;
}

function parseTrumTuVungHtml(html: string, pageNum: number): OxfordWordItem[] {
  const $ = cheerio.load(html);
  const items: OxfordWordItem[] = [];

  $('.service-item').each((i, el) => {
    const heading = $(el).find('h4.media-heading');
    const phonetic = heading.find('span').text().trim();
    heading.find('span').remove();
    const word = heading.text().trim();

    const imageUrl = $(el).find('img.vocabulary-image').attr('src') || '';
    const audioUrl = $(el).find('audio source').attr('src') || `https://trumtuvung.com/audio/8/${encodeURIComponent(word.toLowerCase().replace(/\s+/g, '_'))}.mp3`;

    const bodyHtml = $(el).find('.media-body').html() || '';

    // Meaning & part of speech
    const meaningMatch = bodyHtml.match(/fa-headphones[^>]*><\/i>\s*(\([^\)]+\))?:\s*([^<]+)<br/i);
    const partOfSpeech = meaningMatch && meaningMatch[1] ? meaningMatch[1].trim() : '';
    const meaning = meaningMatch && meaningMatch[2] ? meaningMatch[2].trim() : '';

    // Example English & Vietnamese
    const exampleMatch = bodyHtml.match(/fa-hand-o-right[^>]*><\/i>\s*Example:\s*([^<]+)<br\s*\/?>([^<]+)<br/i);
    const exampleEn = exampleMatch ? exampleMatch[1].trim() : '';
    const exampleVi = exampleMatch ? exampleMatch[2].trim() : '';

    if (word) {
      items.push({
        id: `oxford-p${pageNum}-${i + 1}`,
        word,
        phonetic,
        partOfSpeech: partOfSpeech || '(từ vựng)',
        meaning: meaning || word,
        exampleEn,
        exampleVi,
        imageUrl,
        audioUrl,
        page: pageNum,
      });
    }
  });

  return items;
}

function generateOxfordExamFiles(words: OxfordWordItem[]) {
  console.log(`📝 Generating 100% UNABRIDGED Exam for ALL ${words.length} Oxford words (No capping)...`);

  const masterQuestions = [];
  const totalExamQuestions = words.length; // ALL 3544 questions

  for (let idx = 0; idx < totalExamQuestions; idx++) {
    const current = words[idx];

    // Distractors
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const randIdx = Math.floor(Math.random() * words.length);
      const randWord = words[randIdx];
      if (randWord.word !== current.word && !distractors.includes(randWord.meaning) && randWord.meaning !== current.meaning) {
        distractors.push(randWord.meaning);
      }
    }

    const options = [current.meaning, ...distractors].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(current.meaning);

    masterQuestions.push({
      id: `ox-master-${idx + 1}`,
      part: `Oxford 3000 (${current.partOfSpeech || 'Từ vựng'} - Trang ${current.page})`,
      questionNumber: idx + 1,
      audioUrl: current.audioUrl,
      imageUrl: current.imageUrl,
      word: current.word,
      phonetic: current.phonetic,
      questionText: `Từ vựng "${current.word}" ${current.phonetic ? `(${current.phonetic})` : ''} có nghĩa là gì?`,
      options: options,
      correctAnswer: correctIndex,
      explanation: `Từ "${current.word}" ${current.partOfSpeech} mang nghĩa là: "${current.meaning}". Ví dụ: ${current.exampleEn} (${current.exampleVi})`,
    });
  }

  const examFileContent = `import { ExamPaper } from '@/lib/types';
import rawDataset from '../oxford3000Dataset.json';

export const oxford3000RawDataset = rawDataset;
export const totalOxfordWordsCount = ${words.length};

export const oxford3000FullExam: ExamPaper = {
  id: 'oxford-3000-master-exam',
  title: 'Bộ Đề Thi 3000 Từ Vựng Oxford Đầy Đủ (Đúng ${words.length} Câu Hỏi - Có Audio & Hình Ảnh)',
  type: 'TOEIC',
  durationMinutes: 180,
  totalQuestions: ${masterQuestions.length},
  questions: ${JSON.stringify(masterQuestions, null, 2)},
};
`;

  const examFilePath = path.join(__dirname, '../src/data/exams/oxford-3000-full-exam.ts');
  fs.writeFileSync(examFilePath, examFileContent, 'utf-8');
  console.log(`✅ Generated FULL ${masterQuestions.length}-QUESTION Exam file at: ${examFilePath}`);
}

// Load existing dataset if already saved to quickly regenerate without re-crawling
const datasetPath = path.join(__dirname, '../src/data/oxford3000Dataset.json');
if (fs.existsSync(datasetPath)) {
  console.log('📂 Found existing dataset, regenerating 3544 questions...');
  const words: OxfordWordItem[] = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  console.log(`Loaded ${words.length} words.`);
  generateOxfordExamFiles(words);
}
