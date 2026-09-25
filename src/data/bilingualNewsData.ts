export interface BilingualParagraph {
  tag: string; // e.g. '[A]', '[B]', '[C]'
  en: string;
  vi: string;
  isHeadline?: boolean;
  hasIllustration?: boolean;
}

export interface QuizQuestionAI {
  id: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  evidenceTag: string; // e.g. '[B]' or '[C]'
  evidenceText: string;
  explanationVi: string;
  explanationEn: string;
  difficulty?: string; // e.g. 'Band 6.5', 'TOEIC 650+'
}

export interface BilingualNewsArticle {
  id: string;
  slug: string;
  titleEn: string;
  titleVi: string;
  publisher: 'Reuters' | 'The Atlantic' | 'The Guardian' | 'The Conversation' | 'The New York Times' | 'Substack';
  category: 'Kinh tế & Chính trị' | 'Khoa học & Công nghệ' | 'Đời sống & Xã hội' | 'Sức khỏe & Môi trường';
  readingTime: string; // e.g. '3 phút'
  readingTimeMinutes: number;
  readersCount: number;
  ieltsLevel: string; // e.g. '12 IELTS'
  toeicLevel: string; // e.g. '5 TOEIC'
  imageUrl: string;
  imageAlt: string;
  sourceUrl: string;
  publishedDate: string;
  paragraphs: BilingualParagraph[];
  quizzes: {
    ielts: QuizQuestionAI[];
    toeic: QuizQuestionAI[];
    quick: QuizQuestionAI[];
  };
}

export const BILINGUAL_NEWS_ARTICLES: BilingualNewsArticle[] = [
  {
    id: 'mini-retirements',
    slug: 'why-more-young-people-are-taking-mini-retirements',
    titleEn: 'Why More Young People Are Taking Mini-Retirements',
    titleVi: 'Vì sao ngày càng nhiều người trẻ chọn "nghỉ hưu ngắn hạn"',
    publisher: 'Reuters',
    category: 'Kinh tế & Chính trị',
    readingTime: '3 phút',
    readingTimeMinutes: 3,
    readersCount: 187,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Collage illustration of hands holding banknotes and coins',
    sourceUrl: 'https://www.reuters.com',
    publishedDate: '2026-03-15',
    paragraphs: [
      {
        tag: '[A]',
        en: 'Why More Young People Are Taking Mini-Retirements',
        vi: 'Tại Sao Giới Trẻ Ngày Càng Ưa Chuộng "Nghỉ Hưu Nhỏ"',
        isHeadline: true,
        hasIllustration: true,
      },
      {
        tag: '[B]',
        en: 'Like most people, Ali Rosli is saving for retirement. But he isn’t waiting decades to reap the benefits.',
        vi: 'Giống như nhiều người khác, Ali Rosli đang tiết kiệm cho tuổi nghỉ hưu. Nhưng anh không chờ đợi hàng thập kỷ để tận hưởng thành quả.',
      },
      {
        tag: '[C]',
        en: 'The 33-year-old, an interim finance lead, has taken two “mini-retirements” over the past seven years — in 2019 for two months, and again in November 2025 for four. The first followed a demanding career as an assistant audit manager in Malaysia, including 80-hour weeks that Rosli says led to burnout.',
        vi: 'Người đàn ông 33 tuổi, hiện là trưởng nhóm tài chính tạm thời, đã có hai lần "nghỉ hưu nhỏ" trong bảy năm qua — lần đầu vào năm 2019 kéo dài hai tháng, và lần thứ hai vào tháng 11 năm 2025 dự kiến bốn tháng. Lần nghỉ đầu tiên diễn ra sau một giai đoạn làm việc căng thẳng với vai trò trợ lý quản lý kiểm toán ở Malaysia, với những tuần làm việc 80 giờ mà Rosli cho rằng đã dẫn đến tình trạng kiệt sức.',
      },
      {
        tag: '[D]',
        en: '“I thought, while having a rest and thinking about my career path, why not take a long trip for two months?” he says.',
        vi: '“Tôi nghĩ, trong lúc nghỉ ngơi và suy ngẫm về con đường sự nghiệp của mình, tại sao không dành ra một chuyến đi dài hai tháng?” anh chia sẻ.',
      },
      {
        tag: '[E]',
        en: 'Mini-retirements are intentional career breaks taken during one’s working years, lasting anywhere from several weeks to a few months. Advocates say they prevent chronic burnout, allow individuals to pursue passions while young and physically active, and often lead to renewed career clarity and productivity.',
        vi: 'Nghỉ hưu nhỏ là những quãng nghỉ có chủ đích diễn ra trong những năm tháng làm việc, kéo dài từ vài tuần đến vài tháng. Những người ủng hộ cho rằng chúng giúp ngăn ngừa kiệt sức mãn tính, cho phép mọi người theo đuổi đam mê khi còn trẻ khỏe, và thường mang lại sự sáng suốt cũng như hiệu suất mới cho sự nghiệp.',
      },
      {
        tag: '[F]',
        en: 'Financial advisors caution that careful budgeting is indispensable. Taking extended unpaid leaves requires accounting not only for day-to-day living expenses and emergency buffers, but also maintaining health insurance coverage and absorbing the compounding impact of paused retirement contributions.',
        vi: 'Các chuyên gia cố vấn tài chính cảnh báo rằng việc lập ngân sách cẩn thận là không thể thiếu. Việc nghỉ không lương kéo dài đòi hỏi phải tính toán không chỉ chi phí sinh hoạt hàng ngày và quỹ dự phòng khẩn cấp, mà còn phải duy trì bảo hiểm y tế và hấp thụ tác động tích lũy của các khoản đóng góp hưu trí bị tạm dừng.',
      },
    ],
    quizzes: {
      ielts: [
        {
          id: 'ielts-mr-1',
          question: 'According to Paragraph [B], what distinguishes Ali Rosli from conventional retirement savers?',
          options: [
            { key: 'A', text: 'He has decided to abandon retirement savings completely.' },
            { key: 'B', text: 'He aims to enjoy the fruits of his labor intermittently rather than waiting until old age.' },
            { key: 'C', text: 'He plans to retire permanently before reaching age 35.' },
            { key: 'D', text: 'He relies primarily on government subsidies instead of personal funds.' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[B]',
          evidenceText: 'Like most people, Ali Rosli is saving for retirement. But he isn’t waiting decades to reap the benefits.',
          explanationVi: 'Đoạn [B] chỉ ra rằng Rosli vẫn tiết kiệm cho hưu trí nhưng không muốn chờ đợi hàng thập kỷ sau mới hưởng thụ lợi ích, mà phân bổ để tận hưởng ngay trong tuổi trẻ.',
          explanationEn: 'Paragraph [B] indicates that while Rosli still saves for retirement, he rejects waiting decades to reap the benefits, choosing to take periodic restorative breaks.',
          difficulty: 'Band 6.5',
        },
        {
          id: 'ielts-mr-2',
          question: 'In Paragraph [C], which of the following is cited as a primary catalyst for Rosli’s first mini-retirement?',
          options: [
            { key: 'A', text: 'Being laid off during corporate restructuring.' },
            { key: 'B', text: 'Severe exhaustion brought about by 80-hour workweeks.' },
            { key: 'C', text: 'Receiving an unexpected financial inheritance.' },
            { key: 'D', text: 'The desire to pursue formal academic degrees full-time.' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[C]',
          evidenceText: 'The first followed a demanding career as an assistant audit manager in Malaysia, including 80-hour weeks that Rosli says led to burnout.',
          explanationVi: 'Đoạn [C] nêu rõ công việc trợ lý kiểm toán áp lực cao với 80 giờ làm việc mỗi tuần đã dẫn đến kiệt sức (burnout), thôi thúc anh nghỉ 2 tháng.',
          explanationEn: 'The text in Paragraph [C] explicitly notes that 80-hour workweeks led to burnout, triggering his first two-month leave.',
          difficulty: 'Band 7.0',
        },
        {
          id: 'ielts-mr-3',
          question: 'Based on Paragraph [E], what major benefit do proponents attribute to mini-retirements?',
          options: [
            { key: 'A', text: 'A guaranteed executive promotion upon returning to the firm.' },
            { key: 'B', text: 'Exploring life aspirations while possessing youth and vitality.' },
            { key: 'C', text: 'Exemption from personal income taxes during the break.' },
            { key: 'D', text: 'Total elimination of routine household expenses.' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[E]',
          evidenceText: 'Advocates say they prevent chronic burnout, allow individuals to pursue passions while young and physically active, and often lead to renewed career clarity...',
          explanationVi: 'Đoạn [E] nhấn mạnh lợi ích: cho phép cá nhân theo đuổi đam mê khi còn trẻ và sung sức (while young and physically active).',
          explanationEn: 'Paragraph [E] highlights that career breaks allow people to pursue passions while young and physically active, alongside preventing burnout.',
          difficulty: 'Band 7.0',
        },
        {
          id: 'ielts-mr-4',
          question: 'What caveat do financial advisors emphasize in Paragraph [F] regarding mini-retirements?',
          options: [
            { key: 'A', text: 'They are legally restricted in most Southeast Asian countries.' },
            { key: 'B', text: 'They necessitate meticulous financial planning beyond mere routine living expenses.' },
            { key: 'C', text: 'Employers invariably terminate pension contracts immediately.' },
            { key: 'D', text: 'Health insurers permanently deny coverage to individuals on career breaks.' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[F]',
          evidenceText: 'Financial advisors caution that careful budgeting is indispensable. Taking extended unpaid leaves requires accounting not only for day-to-day living expenses...',
          explanationVi: 'Đoạn [F] cảnh báo rằng việc lập ngân sách cẩn trọng là không thể thiếu vì phải tính toán cả bảo hiểm y tế và sự gián đoạn của quỹ hưu trí.',
          explanationEn: 'Paragraph [F] warns that careful budgeting is indispensable to account for insurance and paused retirement contributions.',
          difficulty: 'Band 7.5',
        },
      ],
      toeic: [
        {
          id: 'toeic-mr-1',
          question: 'What is Ali Rosli’s current professional title?',
          options: [
            { key: 'A', text: 'Senior audit manager' },
            { key: 'B', text: 'Interim finance lead' },
            { key: 'C', text: 'Human resources consultant' },
            { key: 'D', text: 'Commercial banker' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[C]',
          evidenceText: 'The 33-year-old, an interim finance lead, has taken two “mini-retirements”...',
          explanationVi: 'Đoạn [C] nêu rõ chức danh hiện tại của anh là "interim finance lead" (trưởng nhóm tài chính tạm thời).',
          explanationEn: 'Paragraph [C] states Ali Rosli is an "interim finance lead".',
          difficulty: 'TOEIC 550',
        },
        {
          id: 'toeic-mr-2',
          question: 'How long was Mr. Rosli’s first career hiatus in 2019?',
          options: [
            { key: 'A', text: 'Two weeks' },
            { key: 'B', text: 'Two months' },
            { key: 'C', text: 'Four months' },
            { key: 'D', text: 'Seven years' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[C]',
          evidenceText: '...in 2019 for two months, and again in November 2025 for four.',
          explanationVi: 'Đoạn [C] xác nhận lần đầu tiên vào năm 2019 kéo dài hai tháng (two months).',
          explanationEn: 'Paragraph [C] specifies that the 2019 break lasted for two months.',
          difficulty: 'TOEIC 600',
        },
        {
          id: 'toeic-mr-3',
          question: 'The word "indispensable" in Paragraph [F] is closest in meaning to:',
          options: [
            { key: 'A', text: 'essential' },
            { key: 'B', text: 'optional' },
            { key: 'C', text: 'burdensome' },
            { key: 'D', text: 'temporary' },
          ],
          correctAnswer: 'A',
          evidenceTag: '[F]',
          evidenceText: 'Financial advisors caution that careful budgeting is indispensable.',
          explanationVi: '"indispensable" mang nghĩa là tuyệt đối cần thiết, không thể thiếu = "essential".',
          explanationEn: '"Indispensable" means absolutely necessary or essential.',
          difficulty: 'TOEIC 750',
        },
        {
          id: 'toeic-mr-4',
          question: 'What financial implication must individuals consider during extended leaves according to Paragraph [F]?',
          options: [
            { key: 'A', text: 'Increased tax withholding rates' },
            { key: 'B', text: 'The compounding loss of paused retirement contributions' },
            { key: 'C', text: 'Automatic mortgage foreclosures' },
            { key: 'D', text: 'Fixed-term employment contract cancellations' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[F]',
          evidenceText: '...and absorbing the compounding impact of paused retirement contributions.',
          explanationVi: 'Đoạn [F] nhắc nhở người lao động phải tính đến tác động tích lũy từ việc tạm ngưng đóng góp vào quỹ hưu trí.',
          explanationEn: 'Paragraph [F] mentions accounting for the compounding impact of paused retirement contributions.',
          difficulty: 'TOEIC 700',
        },
      ],
      quick: [
        {
          id: 'quick-mr-1',
          question: 'What is a "mini-retirement"?',
          options: [
            { key: 'A', text: 'Permanent retirement at age 30' },
            { key: 'B', text: 'An intentional career break lasting weeks to months' },
            { key: 'C', text: 'A mandatory corporate dismissal' },
            { key: 'D', text: 'A short weekend family vacation' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[E]',
          evidenceText: 'Mini-retirements are intentional career breaks taken during one’s working years...',
          explanationVi: 'Nghỉ hưu nhỏ là quãng nghỉ có chủ đích diễn ra trong các năm làm việc.',
          explanationEn: 'It is defined as an intentional career break lasting from weeks to months.',
          difficulty: 'Quick Review',
        },
        {
          id: 'quick-mr-2',
          question: 'Why did Rosli take his initial leave?',
          options: [
            { key: 'A', text: 'To avoid 80-hour week work burnout' },
            { key: 'B', text: 'To launch a retail business' },
            { key: 'C', text: 'He was fired from his job' },
            { key: 'D', text: 'His employer required all staff to take leave' },
          ],
          correctAnswer: 'A',
          evidenceTag: '[C]',
          evidenceText: '...including 80-hour weeks that Rosli says led to burnout.',
          explanationVi: 'Anh bị kiệt sức do làm việc 80 tiếng một tuần.',
          explanationEn: 'He suffered from burnout caused by 80-hour workweeks.',
          difficulty: 'Quick Review',
        },
      ],
    },
  },
  {
    id: 'why-reading-is-now-restless',
    slug: 'why-reading-is-now-restless',
    titleEn: 'Why Reading Is Now Restless',
    titleVi: 'Vì sao việc đọc ngày nay lại thiếu kiên nhẫn?',
    publisher: 'The Atlantic',
    category: 'Đời sống & Xã hội',
    readingTime: '6 phút',
    readingTimeMinutes: 6,
    readersCount: 71,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Child reading book under ambient light',
    sourceUrl: 'https://www.theatlantic.com',
    publishedDate: '2026-03-12',
    paragraphs: [
      {
        tag: '[A]',
        en: 'Why Reading Is Now Restless',
        vi: 'Vì Sao Việc Đọc Ngày Nay Lại Thiếu Kiên Nhẫn?',
        isHeadline: true,
      },
      {
        tag: '[B]',
        en: 'In an era dominated by hyper-condensed digital media and endless notifications, the tranquil art of deep reading has come under immense pressure.',
        vi: 'Trong kỷ nguyên bị chi phối bởi các phương tiện kỹ thuật số cô đọng và thông báo liên tục, nghệ thuật đọc sâu trầm lắng đang phải chịu áp lực nặng nề.',
      },
      {
        tag: '[C]',
        en: 'Cognitive neuroscientists demonstrate that our brains are rewiring for rapid browsing, skim-reading, and keyword scanning at the expense of sustained contemplation.',
        vi: 'Các nhà thần kinh học nhận thức chỉ ra rằng não bộ của chúng ta đang tái cấu trúc để duyệt nhanh, đọc lướt và quét từ khóa nhưng phải đánh đổi bằng sự suy ngẫm sâu sắc.',
      },
      {
        tag: '[D]',
        en: 'Recovering the capacity for prolonged immersion in literature requires deliberate behavioral boundaries, such as scheduled offline reading hours and analog paper books.',
        vi: 'Để lấy lại khả năng đắm chìm lâu dài vào văn học đòi hỏi phải có những ranh giới hành vi có chủ đích, chẳng hạn như lên lịch đọc sách ngoại tuyến và đọc sách giấy truyền thống.',
      },
    ],
    quizzes: {
      ielts: [
        {
          id: 'ielts-rr-1',
          question: 'According to Paragraph [C], how is modern media consumption affecting human brain function?',
          options: [
            { key: 'A', text: 'It completely damages language acquisition centres permanently.' },
            { key: 'B', text: 'It trains neural pathways for skimming rather than sustained intellectual reflection.' },
            { key: 'C', text: 'It expands long-term memory capacity for complex narratives.' },
            { key: 'D', text: 'It eliminates the desire to learn foreign vocabulary.' },
          ],
          correctAnswer: 'B',
          evidenceTag: '[C]',
          evidenceText: '...our brains are rewiring for rapid browsing, skim-reading, and keyword scanning at the expense of sustained contemplation.',
          explanationVi: 'Đoạn [C] khẳng định não bộ đang tái định hình để lướt nhanh thay vì duy trì sự suy ngẫm sâu.',
          explanationEn: 'The passage highlights that brains are rewiring for rapid skimming at the expense of contemplation.',
          difficulty: 'Band 7.0',
        },
      ],
      toeic: [],
      quick: [],
    },
  },
  {
    id: 'ai-has-ruined-job-market',
    slug: 'ai-has-ruined-the-job-market',
    titleEn: 'AI Has Ruined the Job Market',
    titleVi: 'AI Đã Phá Hoại Thị Trường Việc Làm',
    publisher: 'The Atlantic',
    category: 'Khoa học & Công nghệ',
    readingTime: '4 phút',
    readingTimeMinutes: 4,
    readersCount: 25,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Two business figures in suits with humanoid robot',
    sourceUrl: 'https://www.theatlantic.com',
    publishedDate: '2026-03-10',
    paragraphs: [
      {
        tag: '[A]',
        en: 'AI Has Ruined the Job Market',
        vi: 'AI Đã Phá Hoại Thị Trường Việc Làm',
        isHeadline: true,
      },
      {
        tag: '[B]',
        en: 'Generative algorithms and automated screening systems have radically distorted modern recruitment pipelines across white-collar sectors.',
        vi: 'Các thuật toán sinh và hệ thống lọc hồ sơ tự động đã làm biến dạng sâu sắc quy trình tuyển dụng hiện đại trong các lĩnh vực lao động trí óc.',
      },
      {
        tag: '[C]',
        en: 'Job seekers increasingly utilize AI to generate hundreds of customized applications, while employers deploy AI agents to filter out thousands of submissions.',
        vi: 'Ứng viên ngày càng sử dụng AI để tạo ra hàng trăm đơn xin việc tùy biến, trong khi nhà tuyển dụng triển khai các agent AI để loại bỏ hàng nghìn hồ sơ nộp về.',
      },
    ],
    quizzes: {
      ielts: [],
      toeic: [],
      quick: [],
    },
  },
  {
    id: 'democrats-must-learn-sports',
    slug: 'democrats-must-learn-to-talk-sports',
    titleEn: 'Democrats Must Learn to Talk Sports',
    titleVi: 'Dân Chủ Phải Học Nói Về Thể Thao',
    publisher: 'The Atlantic',
    category: 'Kinh tế & Chính trị',
    readingTime: '5 phút',
    readingTimeMinutes: 5,
    readersCount: 13,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Variety of sports balls on grassy athletic field',
    sourceUrl: 'https://www.theatlantic.com',
    publishedDate: '2026-03-08',
    paragraphs: [
      {
        tag: '[A]',
        en: 'Democrats Must Learn to Talk Sports',
        vi: 'Dân Chủ Phải Học Nói Về Thể Thao',
        isHeadline: true,
      },
      {
        tag: '[B]',
        en: 'Sports culture remains one of the few remaining collective arenas where cultural and political divisions dissolve into shared civic passion.',
        vi: 'Văn hóa thể thao vẫn là một trong số ít đấu trường tập thể còn lại nơi sự chia rẽ văn hóa và chính trị tan biến vào niềm đam mê dân sự chung.',
      },
    ],
    quizzes: { ielts: [], toeic: [], quick: [] },
  },
  {
    id: 'use-it-or-lose-it',
    slug: 'use-it-or-lose-it',
    titleEn: 'Use It or Lose It',
    titleVi: 'Sử dụng hoặc mất đi',
    publisher: 'The Atlantic',
    category: 'Đời sống & Xã hội',
    readingTime: '10 phút',
    readingTimeMinutes: 10,
    readersCount: 16,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Graffiti Freedom of Speech with artwork stencil',
    sourceUrl: 'https://www.theatlantic.com',
    publishedDate: '2026-03-05',
    paragraphs: [
      {
        tag: '[A]',
        en: 'Use It or Lose It',
        vi: 'Sử Dụng Hoặc Mất Đi',
        isHeadline: true,
      },
      {
        tag: '[B]',
        en: 'Civil liberties and democratic speech norms do not survive through passive assumption; they thrive solely through vigorous exercise in public discourse.',
        vi: 'Các quyền tự do dân sự và chuẩn mực tự do ngôn luận dân chủ không thể tồn tại nhờ sự thừa nhận thụ động; chúng chỉ phát triển mạnh mẽ thông qua việc thực thi tích cực trong đối thoại công cộng.',
      },
    ],
    quizzes: { ielts: [], toeic: [], quick: [] },
  },
  {
    id: 'words-of-war',
    slug: 'words-of-war',
    titleEn: 'Words of War',
    titleVi: 'Ngôn từ của chiến tranh',
    publisher: 'The Atlantic',
    category: 'Kinh tế & Chính trị',
    readingTime: '6 phút',
    readingTimeMinutes: 6,
    readersCount: 5,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Artillery cannons and silhouette soldiers on battlefield',
    sourceUrl: 'https://www.theatlantic.com',
    publishedDate: '2026-03-02',
    paragraphs: [
      {
        tag: '[A]',
        en: 'Words of War',
        vi: 'Ngôn Từ Của Chiến Tranh',
        isHeadline: true,
      },
      {
        tag: '[B]',
        en: 'The rhetoric deployed during international conflicts often prefigures military aggression, framing geopolitics through dangerous linguistic metaphors.',
        vi: 'Những luận điệu được triển khai trong các cuộc xung đột quốc tế thường báo trước sự leo thang quân sự, đóng khung địa chính trị thông qua những ẩn dụ ngôn ngữ đầy nguy hiểm.',
      },
    ],
    quizzes: { ielts: [], toeic: [], quick: [] },
  },
  {
    id: 'ai-education-technology-2026',
    slug: 'ai-education-technology-2026',
    titleEn: 'How Generative AI Is Transforming Language Acquisition',
    titleVi: 'Trí Tuệ Nhân Tạo Sinh Đang Cách Mạng Hóa Việc Học Ngoại Ngữ',
    publisher: 'The Conversation',
    category: 'Khoa học & Công nghệ',
    readingTime: '4 phút',
    readingTimeMinutes: 4,
    readersCount: 342,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Digital glowing tech circuit lines',
    sourceUrl: 'https://theconversation.com',
    publishedDate: '2026-03-01',
    paragraphs: [
      {
        tag: '[A]',
        en: 'How Generative AI Is Transforming Language Acquisition',
        vi: 'Trí Tuệ Nhân Tạo Sinh Đang Cách Mạng Hóa Việc Học Ngoại Ngữ',
        isHeadline: true,
      },
      {
        tag: '[B]',
        en: 'Artificial intelligence is fundamentally revolutionizing modern language learning by providing personalized real-time tutoring and immediate phonetic feedback.',
        vi: 'Trí tuệ nhân tạo đang cách mạng hóa căn bản việc học ngôn ngữ hiện đại bằng cách cung cấp sự kèm cặp cá nhân hóa theo thời gian thực và phản hồi ngữ âm tức thì.',
      },
    ],
    quizzes: { ielts: [], toeic: [], quick: [] },
  },
  {
    id: 'healthy-sleep-habits',
    slug: 'circadian-rhythms-and-cognitive-performance',
    titleEn: 'Circadian Rhythms and Cognitive Performance',
    titleVi: 'Nhịp Sinh Học và Hiệu Suất Nhận Thức',
    publisher: 'The Guardian',
    category: 'Sức khỏe & Môi trường',
    readingTime: '5 phút',
    readingTimeMinutes: 5,
    readersCount: 88,
    ieltsLevel: '12 IELTS',
    toeicLevel: '5 TOEIC',
    imageUrl:
      'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Alarm clock and calm sleeping room light',
    sourceUrl: 'https://theguardian.com',
    publishedDate: '2026-02-28',
    paragraphs: [
      {
        tag: '[A]',
        en: 'Circadian Rhythms and Cognitive Performance',
        vi: 'Nhịp Sinh Học Và Hiệu Suất Nhận Thức',
        isHeadline: true,
      },
      {
        tag: '[B]',
        en: 'Aligning intellectual tasks with personal chronotypes enhances focus, memory retention, and creative problem-solving capabilities.',
        vi: 'Việc sắp xếp các nhiệm vụ trí tuệ phù hợp với đồng hồ sinh học cá nhân giúp tăng cường sự tập trung, ghi nhớ và khả năng giải quyết vấn đề sáng tạo.',
      },
    ],
    quizzes: { ielts: [], toeic: [], quick: [] },
  },
];
