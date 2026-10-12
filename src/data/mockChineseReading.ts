export interface ReadingWordToken {
  text: string;
  pinyin: string;
  sinoVi: string;
  meaning: string;
  audio?: string;
}

export interface ChineseReadingStory {
  id: string;
  titleZh: string;
  titleVi: string;
  hskLevel: string;
  durationMinutes: number;
  wordCount: number;
  coverImage: string;
  summary: string;
  paragraphs: {
    zh: string;
    pinyin: string;
    vi: string;
    tokens: ReadingWordToken[];
  }[];
  questions: {
    id: string;
    questionZh: string;
    questionVi: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export const mockChineseReadingStories: ChineseReadingStory[] = [
  {
    id: 'zh-read-hsk1-daily',
    titleZh: '我的中国朋友大伟',
    titleVi: 'Bạn Người Trung Quốc Của Tôi - Đại Vĩ',
    hskLevel: 'HSK 1',
    durationMinutes: 5,
    wordCount: 120,
    coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    summary: 'Câu chuyện giới thiệu về một người bạn Trung Quốc yêu thích ẩm thực và học ngoại ngữ.',
    paragraphs: [
      {
        zh: '你好！我叫李明。我有一个中国朋友，他的名字叫大伟。',
        pinyin: 'Nǐ hǎo! Wǒ jiào Lǐ Míng. Wǒ yǒu yí gè Zhōngguó péngyou, tā de míngzi jiào Dàwěi.',
        vi: 'Xin chào! Tôi tên là Lý Minh. Tôi có một người bạn Trung Quốc, tên của cậu ấy là Đại Vĩ.',
        tokens: [
          { text: '你好', pinyin: 'nǐ hǎo', sinoVi: 'Nhĩ hảo', meaning: 'Xin chào' },
          { text: '我', pinyin: 'wǒ', sinoVi: 'Ngã', meaning: 'Tôi, mình' },
          { text: '叫', pinyin: 'jiào', sinoVi: 'Khiếu', meaning: 'Tên là, gọi là' },
          { text: '朋友', pinyin: 'péngyou', sinoVi: 'Bằng hữu', meaning: 'Bạn bè' },
          { text: '中国', pinyin: 'zhōngguó', sinoVi: 'Trung Quốc', meaning: 'Nước Trung Quốc' },
          { text: '名字', pinyin: 'míngzi', sinoVi: 'Danh tự', meaning: 'Tên' },
        ],
      },
      {
        zh: '大伟是北京人，现在在河内大学学习越南语。他非常喜欢吃越南河粉。',
        pinyin: 'Dàwěi shì Běijīng rén, xiànzài zài Hénèi Dàxué xuéxí Yuènányǔ. Tā fēicháng xǐhuan chī Yuènán héfěn.',
        vi: 'Đại Vĩ là người Bắc Kinh, hiện đang học tiếng Việt tại Đại học Hà Nội. Cậu ấy cực kỳ thích ăn phở Việt Nam.',
        tokens: [
          { text: '现在', pinyin: 'xiànzài', sinoVi: 'Hiện tại', meaning: 'Bây giờ, hiện nay' },
          { text: '大学', pinyin: 'dàxué', sinoVi: 'Đại học', meaning: 'Trường đại học' },
          { text: '学习', pinyin: 'xuéxí', sinoVi: 'Học tập', meaning: 'Học tập' },
          { text: '非常', pinyin: 'fēicháng', sinoVi: 'Phi thường', meaning: 'Rất, vô cùng' },
          { text: '喜欢', pinyin: 'xǐhuan', sinoVi: 'Hỉ hoan', meaning: 'Thích, yêu thích' },
          { text: '吃', pinyin: 'chī', sinoVi: 'Ngật', meaning: 'Ăn' },
        ],
      },
      {
        zh: '我们常常一起喝茶聊天。他教我汉语，我教他越南语。我们都很高兴。',
        pinyin: 'Wǒmen chángcháng yìqǐ hē chá liáotiān. Tā jiāo wǒ hànyǔ, wǒ jiāo tā yuènányǔ. Wǒmen dōu hěn gāoxìng.',
        vi: 'Chúng tôi thường cùng nhau uống trà trò chuyện. Cậu ấy dạy tôi tiếng Trung, tôi dạy cậu ấy tiếng Việt. Chúng tôi đều rất vui.',
        tokens: [
          { text: '常常', pinyin: 'chángcháng', sinoVi: 'Thường thường', meaning: 'Thường xuyên' },
          { text: '一起', pinyin: 'yìqǐ', sinoVi: 'Nhất khởi', meaning: 'Cùng nhau' },
          { text: '喝茶', pinyin: 'hē chá', sinoVi: 'Hát trà', meaning: 'Uống trà' },
          { text: '汉语', pinyin: 'hànyǔ', sinoVi: 'Hán ngữ', meaning: 'Tiếng Trung' },
          { text: '高兴', pinyin: 'gāoxìng', sinoVi: 'Cao hứng', meaning: 'Vui vẻ, phấn khởi' },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        questionZh: '大伟现在在哪里学习？',
        questionVi: 'Đại Vĩ hiện đang học tập ở đâu?',
        options: ['北京大学', '河内大学', '上海大学', '广州大学'],
        correctAnswer: 1,
        explanation: 'Trong bài có câu: "现在在河内大学学习越南语" (Hiện đang học tại Đại học Hà Nội).',
      },
      {
        id: 'q2',
        questionZh: '大伟非常喜欢吃什么？',
        questionVi: 'Đại Vĩ rất thích ăn món gì?',
        options: ['北京烤鸭', '中国菜', '越南河粉', '水饺'],
        correctAnswer: 2,
        explanation: 'Bài viết nêu rõ: "他非常喜欢吃越南河粉" (Cậu ấy cực kỳ thích ăn phở Việt Nam).',
      },
    ],
  },
  {
    id: 'zh-read-hsk2-tea',
    titleZh: '中国悠久的茶文化',
    titleVi: 'Văn Hóa Trà Lâu Đời Của Trung Quốc',
    hskLevel: 'HSK 2',
    durationMinutes: 7,
    wordCount: 180,
    coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    summary: 'Tìm hiểu về thói quen thưởng trà, các loại trà nổi tiếng và ý nghĩa trà đạo trong đời sống phương Đông.',
    paragraphs: [
      {
        zh: '在中国，茶不仅是一种健康的饮品，更是一种深厚的文化。',
        pinyin: 'Zài Zhōngguó, chá bùjǐn shì yì zhǒng jiànkāng de yǐnpǐn, gèng shì yì zhǒng shēnhòu de wénhuà.',
        vi: 'Ở Trung Quốc, trà không chỉ là một thức uống có lợi cho sức khỏe, mà còn là một nét văn hóa sâu sắc.',
        tokens: [
          { text: '不仅', pinyin: 'bùjǐn', sinoVi: 'Bất cận', meaning: 'Không những, không chỉ' },
          { text: '健康', pinyin: 'jiànkāng', sinoVi: 'Kiện khang', meaning: 'Sức khỏe, lành mạnh' },
          { text: '文化', pinyin: 'wénhuà', sinoVi: 'Văn hóa', meaning: 'Văn hóa' },
        ],
      },
      {
        zh: '中国人有客人来访时，第一件事往往就是泡上一壶热茶。茶香四溢，拉近了人与人之间的距离。',
        pinyin: 'Zhōngguó rén yǒu kèrén láifǎng shí, dì yī jiàn shì wǎngwǎng jiù shì pào shàng yì hú rè chá. Chá xiāng sì yì, lājìn le rén yǔ rén zhījiān de jùlí.',
        vi: 'Khi có khách đến thăm, việc đầu tiên người Trung Quốc làm thường là pha một ấm trà nóng. Hương trà lan tỏa, rút ngắn khoảng cách giữa mọi người.',
        tokens: [
          { text: '客人', pinyin: 'kèrén', sinoVi: 'Khách nhân', meaning: 'Khách, khách khứa' },
          { text: '往往', pinyin: 'wǎngwǎng', sinoVi: 'Vãng vãng', meaning: 'Thường, hay' },
          { text: '距离', pinyin: 'jùlí', sinoVi: 'Cự ly', meaning: 'Khoảng cách' },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        questionZh: '客人来访时，中国人的习惯是什么？',
        questionVi: 'Khi khách đến thăm, thói quen của người Trung Quốc là gì?',
        options: ['做饭', '泡热茶', '出门旅游', '去商店'],
        correctAnswer: 1,
        explanation: 'Bài viết cho biết: "第一件事往往就是泡上一壶热茶" (Việc đầu tiên thường là pha một ấm trà nóng).',
      },
    ],
  },
];
