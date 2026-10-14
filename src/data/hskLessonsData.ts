import hsk1Data from './chinese/hsk1.json';
import hsk2Data from './chinese/hsk2.json';
import hsk3Data from './chinese/hsk3.json';
import hsk4Data from './chinese/hsk4.json';
import hsk5Data from './chinese/hsk5.json';
import hsk6Data from './chinese/hsk6.json';
import { ChineseWordItem } from './mockChineseVocab';

export interface HskLessonWord extends ChineseWordItem {
  posBadge?: string;
  flagged?: boolean;
  starred?: boolean;
}

export interface HskLesson {
  id: string; // e.g. 'bai-1'
  lessonNumber: number;
  title: string;
  titleZh?: string;
  wordCount: number;
  words: HskLessonWord[];
}

export interface HskBookCourse {
  slug: string; // 'hsk1', 'hsk2', ...
  levelNumber: number;
  title: string;
  coverTitle: string;
  standardTitle: string;
  wordCountTotal: number;
  patternCountTotal: number;
  lessonCount: number;
  lessons: HskLesson[];
}

// Lesson 1 specifically matches exact words from NhaiHSK screenshots (Ảnh 3, 4, 5, 8, 11)
const HSK1_LESSON_1_WORDS: HskLessonWord[] = [
  {
    id: 'zh-hsk1-l1-01',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    sinoVietnamese: 'NỄ HẢO',
    meaning: 'Xin chào',
    hskLevel: 1,
    topic: 'Chào hỏi',
    posBadge: 'Cụm từ',
    exampleZh: '李明，你好',
    examplePinyin: 'lǐ míng nǐ hǎo',
    exampleVi: 'Chào Lý Minh',
  },
  {
    id: 'zh-hsk1-l1-02',
    hanzi: '王老师',
    pinyin: 'Wáng lǎoshī',
    sinoVietnamese: 'VƯƠNG LÃO SƯ',
    meaning: 'Cô Vương, Thầy Vương',
    hskLevel: 1,
    topic: 'Xưng hô',
    posBadge: 'Danh từ',
    exampleZh: '王老师，您好',
    examplePinyin: 'wáng lǎo shī nín hǎo',
    exampleVi: 'Xin chào cô Vương',
  },
  {
    id: 'zh-hsk1-l1-03',
    hanzi: '大家',
    pinyin: 'dàjiā',
    sinoVietnamese: 'ĐẠI GIA',
    meaning: 'Mọi người, cả nhà',
    hskLevel: 1,
    topic: 'Đại từ',
    posBadge: 'Đại từ',
    exampleZh: '大家好，我是新学生',
    examplePinyin: 'dà jiā hǎo wǒ shì xīn xuéshēng',
    exampleVi: 'Chào mọi người, tôi là học sinh mới',
  },
  {
    id: 'zh-hsk1-l1-04',
    hanzi: '好',
    pinyin: 'hǎo',
    sinoVietnamese: 'HẢO',
    meaning: 'Tốt, khỏe, đẹp',
    hskLevel: 1,
    topic: 'Tính từ',
    posBadge: 'Tính từ',
    exampleZh: '老师，您好',
    examplePinyin: 'lǎo shī nín hǎo',
    exampleVi: 'Xin chào thầy',
  },
  {
    id: 'zh-hsk1-l1-05',
    hanzi: '学生',
    pinyin: 'xuéshēng',
    sinoVietnamese: 'HỌC SINH',
    meaning: 'Học sinh, sinh viên',
    hskLevel: 1,
    topic: 'Trường học',
    posBadge: 'Danh từ',
    exampleZh: '我是这里的学生',
    examplePinyin: 'wǒ shì zhè lǐ de xuéshēng',
    exampleVi: 'Tôi là học sinh ở đây',
  },
  {
    id: 'zh-hsk1-l1-06',
    hanzi: '们',
    pinyin: 'men',
    sinoVietnamese: 'MÔN',
    meaning: 'Các, những (hậu tố chỉ số nhiều)',
    hskLevel: 1,
    topic: 'Ngữ pháp',
    posBadge: 'Hậu tố',
    exampleZh: '老师们好',
    examplePinyin: 'lǎo shī men hǎo',
    exampleVi: 'Chào các thầy cô',
  },
  {
    id: 'zh-hsk1-l1-07',
    hanzi: '老师',
    pinyin: 'lǎoshī',
    sinoVietnamese: 'LÃO SƯ',
    meaning: 'Giáo viên, thầy cô',
    hskLevel: 1,
    topic: 'Nghề nghiệp',
    posBadge: 'Danh từ',
    exampleZh: '张老师，你好',
    examplePinyin: 'zhāng lǎoshī, nǐ hǎo',
    exampleVi: 'Thầy Trương, xin chào thầy',
  },
  {
    id: 'zh-hsk1-l1-08',
    hanzi: '您',
    pinyin: 'nín',
    sinoVietnamese: 'NẪM',
    meaning: 'Ngài, ông, bà (xưng hô trang trọng)',
    hskLevel: 1,
    topic: 'Đại từ',
    posBadge: 'Đại từ',
    exampleZh: '您是老师吗',
    examplePinyin: 'nín shì lǎoshī ma',
    exampleVi: 'Ngài là giáo viên phải không',
  },
  {
    id: 'zh-hsk1-l1-09',
    hanzi: '你们',
    pinyin: 'nǐmen',
    sinoVietnamese: 'NỄ MÔN',
    meaning: 'Các bạn, các anh chị',
    hskLevel: 1,
    topic: 'Đại từ',
    posBadge: 'Đại từ',
    exampleZh: '你们好！',
    examplePinyin: 'nǐmen hǎo!',
    exampleVi: 'Chào các bạn!',
  },
  {
    id: 'zh-hsk1-l1-10',
    hanzi: '同学',
    pinyin: 'tóngxué',
    sinoVietnamese: 'ĐỒNG HỌC',
    meaning: 'Bạn học, bạn cùng lớp',
    hskLevel: 1,
    topic: 'Trường học',
    posBadge: 'Danh từ',
    exampleZh: '同学们好！',
    examplePinyin: 'tóngxuémen hǎo!',
    exampleVi: 'Chào các bạn học sinh!',
  },
  {
    id: 'zh-hsk1-l1-11',
    hanzi: '谢谢',
    pinyin: 'xièxie',
    sinoVietnamese: 'TẠ TẠ',
    meaning: 'Cảm ơn',
    hskLevel: 1,
    topic: 'Giao tiếp',
    posBadge: 'Động từ',
    exampleZh: '谢谢你的帮助。',
    examplePinyin: 'xièxie nǐ de bāngzhù.',
    exampleVi: 'Cảm ơn sự giúp đỡ của bạn.',
  },
  {
    id: 'zh-hsk1-l1-12',
    hanzi: '不客气',
    pinyin: 'bú kèqi',
    sinoVietnamese: 'BẤT KHÁCH KHÍ',
    meaning: 'Đừng khách sáo, không có chi',
    hskLevel: 1,
    topic: 'Giao tiếp',
    posBadge: 'Cụm từ',
    exampleZh: '别客气，快请进。',
    examplePinyin: 'bié kèqi, kuài qǐng jìn.',
    exampleVi: 'Đừng khách sáo, mời vào nhanh.',
  },
  {
    id: 'zh-hsk1-l1-13',
    hanzi: '再见',
    pinyin: 'zàijiàn',
    sinoVietnamese: 'TÁI KIẾN',
    meaning: 'Tạm biệt, hẹn gặp lại',
    hskLevel: 1,
    topic: 'Giao tiếp',
    posBadge: 'Cụm từ',
    exampleZh: '明天见，再见！',
    examplePinyin: 'míngtiān jiàn, zàijiàn!',
    exampleVi: 'Hẹn ngày mai gặp lại, tạm biệt!',
  },
];

// Helper to chunk an array of words into lessons
function createLessonsForLevel(
  level: number,
  words: ChineseWordItem[],
  lessonTitles: string[],
  firstLessonOverride?: HskLessonWord[]
): HskLesson[] {
  const lessons: HskLesson[] = [];
  const wordsPerLesson = Math.ceil(words.length / lessonTitles.length);

  lessonTitles.forEach((title, idx) => {
    const lessonNum = idx + 1;
    let lessonWords: HskLessonWord[] = [];

    if (level === 1 && lessonNum === 1 && firstLessonOverride) {
      lessonWords = firstLessonOverride;
    } else {
      const start = idx * wordsPerLesson;
      const end = start + wordsPerLesson;
      const slice = words.slice(start, end);
      lessonWords = slice.map((w, wIdx) => ({
        ...w,
        posBadge: w.topic || 'Từ vựng',
      }));
    }

    lessons.push({
      id: `bai-${lessonNum}`,
      lessonNumber: lessonNum,
      title,
      wordCount: lessonWords.length,
      words: lessonWords,
    });
  });

  return lessons;
}

const HSK1_LESSON_TITLES = [
  'Xin chào!',
  'Tôi tên là NhaiHSK',
  'Tôi là người Việt Nam',
  'Hôm nay là thứ mấy?',
  'Gia đình tôi có 4 người',
  'Bây giờ là mấy giờ?',
  'Bạn thích ăn món gì?',
  'Hôm nay thời tiết thế nào?',
  'Bạn đang làm gì đấy?',
  'Tôi đi siêu thị mua táo',
  'Bệnh viện ở đâu?',
  'Ngày mai bạn rảnh không?',
  'Bạn biết nói tiếng Trung không?',
  'Cuốn sách này bao nhiêu tiền?',
  'Rất vui được làm quen với bạn',
];

const HSK2_LESSON_TITLES = [
  'Đi máy bay đến Bắc Kinh',
  'Sinh nhật vui vẻ!',
  'Chúng ta đi xem phim nhé',
  'Công việc mới của bạn thế nào?',
  'Tôi thích chơi bóng rổ',
  'Bên ngoài trời đang mưa',
  'Bạn uống trà hay cà phê?',
  'Căn phòng này rất sạch sẽ',
  'Tôi bị cảm rồi',
  'Hãy giúp tôi một chút',
  'Đi bằng tàu điện ngầm nhanh hơn',
  'Chiếc áo này đắt quá',
  'Bạn học tiếng Trung bao lâu rồi?',
  'Món vịt quay Bắc Kinh rất ngon',
  'Hẹn gặp lại ở sân bay',
];

const HSK3_LESSON_TITLES = [
  'Kế hoạch du lịch mùa hè',
  'Môi trường sống xung quanh ta',
  'Thói quen sinh hoạt lành mạnh',
  'Phỏng vấn xin việc làm thêm',
  'Văn hóa uống trà của người Hoa',
  'Phương tiện giao thông hiện đại',
  'Mua sắm trực tuyến tiện lợi',
  'Tình bạn thời đại học',
  'Nỗ lực để đạt ước mơ',
  'Khám phá ẩm thực Tứ Xuyên',
  'Bảo vệ động vật hoang dã',
  'Thể thao nâng cao sức khỏe',
  'Âm nhạc và cuộc sống',
  'Học tiếng Trung qua bài hát',
  'Thành công bắt đầu từ kiên trì',
];

const HSK4_LESSON_TITLES = [
  'Tình yêu và hôn nhân',
  'Bí quyết phỏng vấn thành công',
  'Áp lực công việc và cách vượt qua',
  'Khoa học công nghệ và tương lai',
  'Bảo vệ môi trường sinh thái',
  'Nghệ thuật giao tiếp ứng xử',
  'Đọc sách mở mang trí tuệ',
  'Hạnh phúc thực sự là gì?',
  'Sự phát triển của kinh tế số',
  'Khám phá di sản Vạn Lý Trường Thành',
  'Giáo dục trẻ em hiện đại',
  'Sức mạnh của thái độ tích cực',
  'Văn hóa kinh doanh phương Đông',
  'Khởi nghiệp trong thời đại mới',
  'Chinh phục đỉnh cao HSK 4',
];

const HSK5_LESSON_TITLES = [
  'Triết lý nhân sinh Trung Hoa',
  'Thương mại quốc tế và hội nhập',
  'Tâm lý học hành vi con người',
  'Bảo tồn di sản văn hóa phi vật thể',
  'Trí tuệ nhân tạo và việc làm',
  'Nghệ thuật thư pháp và hội họa',
  'Chiến lược quản trị doanh nghiệp',
  'Y học cổ truyền phương Đông',
  'Biến đổi khí hậu toàn cầu',
  'Truyền thông đa phương tiện',
  'Đô thị thông minh tương lai',
  'Sức mạnh của tư duy phản biện',
  'Thành ngữ và điển tích lịch sử',
  'Hùng biện và thuyết trình',
  'Thành thạo văn phong học thuật',
];

const HSK6_LESSON_TITLES = [
  'Bác đại tinh thâm của Hán tự',
  'Kinh tế chính trị vĩ mô',
  'Văn học cổ điển và hiện đại',
  'Nghiên cứu ngôn ngữ học so sánh',
  'Phân tích diễn ngôn học thuật',
  'Triết học Lão Trang và Nho gia',
  'Nghệ thuật đàm phán cấp cao',
  'Đổi mới sáng tạo công nghệ cao',
  'Văn hóa Trà Đạo và Thiền tông',
  'Phê bình văn học nghệ thuật',
  'Địa lý nhân văn và dân tộc học',
  'Chính sách kinh tế xanh',
  'Luận bàn về giáo dục đại học',
  'Dịch thuật nâng cao Trung - Việt',
  'Chinh phục cấp độ HSK 6 xuất sắc',
];

export const HSK_BOOKS: Record<string, HskBookCourse> = {
  hsk1: {
    slug: 'hsk1',
    levelNumber: 1,
    title: 'Nhai HSK 1',
    coverTitle: 'Nhai HSK 1',
    standardTitle: '标准教程 HSK 1 • 3.0',
    wordCountTotal: 330,
    patternCountTotal: 41,
    lessonCount: 15,
    lessons: createLessonsForLevel(1, hsk1Data as ChineseWordItem[], HSK1_LESSON_TITLES, HSK1_LESSON_1_WORDS),
  },
  hsk2: {
    slug: 'hsk2',
    levelNumber: 2,
    title: 'Nhai HSK 2',
    coverTitle: 'Nhai HSK 2',
    standardTitle: '标准教程 HSK 2 • 3.0',
    wordCountTotal: 213,
    patternCountTotal: 45,
    lessonCount: 15,
    lessons: createLessonsForLevel(2, hsk2Data as ChineseWordItem[], HSK2_LESSON_TITLES),
  },
  hsk3: {
    slug: 'hsk3',
    levelNumber: 3,
    title: 'Nhai HSK 3',
    coverTitle: 'Nhai HSK 3',
    standardTitle: '标准教程 HSK 3 • 3.0',
    wordCountTotal: 483,
    patternCountTotal: 63,
    lessonCount: 15,
    lessons: createLessonsForLevel(3, hsk3Data as ChineseWordItem[], HSK3_LESSON_TITLES),
  },
  hsk4: {
    slug: 'hsk4',
    levelNumber: 4,
    title: 'Nhai HSK 4',
    coverTitle: 'Nhai HSK 4',
    standardTitle: '标准教程 HSK 4 • 3.0',
    wordCountTotal: 1000,
    patternCountTotal: 80,
    lessonCount: 15,
    lessons: createLessonsForLevel(4, hsk4Data as ChineseWordItem[], HSK4_LESSON_TITLES),
  },
  hsk5: {
    slug: 'hsk5',
    levelNumber: 5,
    title: 'Nhai HSK 5',
    coverTitle: 'Nhai HSK 5',
    standardTitle: '标准教程 HSK 5 • 3.0',
    wordCountTotal: 1600,
    patternCountTotal: 105,
    lessonCount: 15,
    lessons: createLessonsForLevel(5, hsk5Data as ChineseWordItem[], HSK5_LESSON_TITLES),
  },
  hsk6: {
    slug: 'hsk6',
    levelNumber: 6,
    title: 'Nhai HSK 6',
    coverTitle: 'Nhai HSK 6',
    standardTitle: '标准教程 HSK 6 • 3.0',
    wordCountTotal: 1800,
    patternCountTotal: 120,
    lessonCount: 15,
    lessons: createLessonsForLevel(6, hsk6Data as ChineseWordItem[], HSK6_LESSON_TITLES),
  },
};
