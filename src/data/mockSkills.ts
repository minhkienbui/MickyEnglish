import { SkillExercise } from '@/lib/types';

export const mockReadingExercises: SkillExercise[] = [
  {
    id: 'r-1',
    title: 'Đọc hiểu IELTS: Renewable Energy Technologies',
    category: 'Reading',
    level: 'Intermediate',
    content: `Solar energy technologies use the sun's energy and light to provide heat, light, hot water, electricity, and even cooling, for homes, businesses, and industry. Photovoltaic (PV) systems convert sunlight directly into electricity using solar cells. As technology improves and production scales up, the cost of solar power has decreased significantly over the last decade, making it a viable alternative to traditional fossil fuels.`,
    questions: [
      {
        id: 'rq-1',
        questionText: 'What do Photovoltaic (PV) systems convert sunlight into?',
        options: ['Hot water only', 'Direct electricity', 'Wind energy', 'Fossil fuel gas'],
        correctAnswer: 1,
        explanation: 'Đoạn văn nêu rõ: "Photovoltaic (PV) systems convert sunlight directly into electricity".',
      },
      {
        id: 'rq-2',
        questionText: 'How has the cost of solar power changed over the last decade?',
        options: ['Increased dramatically', 'Remained unchanged', 'Decreased significantly', 'Doubled in price'],
        correctAnswer: 2,
        explanation: 'Đoạn văn đề cập: "the cost of solar power has decreased significantly over the last decade".',
      },
    ],
  },
];

export const mockWritingPrompts = [
  {
    id: 'w-1',
    title: 'Viết đoạn văn mô tả sở thích cá nhân (Personal Hobbies)',
    topic: 'Daily Conversation',
    prompt: 'Write a short paragraph (80-120 words) about your favorite hobby. Explain why you like it and how often you practice it.',
    sampleAnswer: `My favorite hobby is reading books, especially science fiction novels. I enjoy reading because it expands my imagination and helps me relax after a long working day. I usually read for about thirty minutes before going to bed. Reading has also improved my vocabulary and focus.`,
    checklist: [
      'Đoạn văn có độ dài từ 80 - 120 từ',
      'Nêu rõ tên sở thích và lý do yêu thích',
      'Đề cập tần suất thực hiện sở thích (VD: every day, twice a week)',
      'Dùng thì hiện tại đơn (Present Simple) chuẩn xác',
    ],
  },
];

export const mockPronunciationDrills = [
  {
    id: 'p-1',
    title: 'Phân biệt cặp âm /s/ và /ʃ/ (Sun vs Shin)',
    wordA: 'Sea',
    phoneticA: '/siː/',
    wordB: 'She',
    phoneticB: '/ʃiː/',
    explanation: 'Âm /s/ phát âm với đầu lưỡi gần răng cửa; âm /ʃ/ chu môi nhẹ và đưa lưỡi lùi về sau.',
  },
  {
    id: 'p-2',
    title: 'Phân biệt cặp âm /p/ và /b/ (Pen vs Ben)',
    wordA: 'Pen',
    phoneticA: '/pen/',
    wordB: 'Ben',
    phoneticB: '/ben/',
    explanation: 'Âm /p/ là âm vô thanh có bật hơi mạnh; âm /b/ là âm hữu thanh không bật hơi mạnh.',
  },
];

export const mockInteractiveWidgets = {
  matchPairs: [
    { en: 'Accommodate', vi: 'Đáp ứng nơi ở / yêu cầu' },
    { en: 'Substantial', vi: 'Đáng kể, quan trọng' },
    { en: 'Collaborate', vi: 'Hợp tác cùng làm việc' },
    { en: 'Ambiguous', vi: 'Mơ hồ, không rõ ràng' },
  ],
  sentenceOrder: [
    {
      words: ['English', 'every', 'I', 'learn', 'day'],
      correctOrder: 'I learn English every day',
    },
    {
      words: ['practice', 'Makes', 'perfect', 'habit'],
      correctOrder: 'Practice makes perfect habit',
    },
  ],
};
