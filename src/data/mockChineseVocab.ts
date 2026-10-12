import hsk1Data from './chinese/hsk1.json';
import hsk2Data from './chinese/hsk2.json';
import hsk3Data from './chinese/hsk3.json';
import hsk4Data from './chinese/hsk4.json';
import hsk5Data from './chinese/hsk5.json';
import hsk6Data from './chinese/hsk6.json';

export interface ChineseWordItem {
  id: string;
  hanzi: string; // Chữ Hán
  pinyin: string; // Pinyin có thanh điệu
  sinoVietnamese: string; // Âm Hán-Việt
  meaning: string; // Nghĩa tiếng Việt
  hskLevel: number; // 1, 2, 3, 4, 5, 6
  topic?: string;
  exampleZh?: string;
  examplePinyin?: string;
  exampleVi?: string;
  radical?: string; // Bộ thủ
  strokeCount?: number; // Số nét
  audioText?: string;
  level?: number; // SRS level (0-5)
  nextReviewDate?: string;
}

// 6 Bộ từ vựng HSK 1 - 6 chính thức
export const hsk1Words: ChineseWordItem[] = hsk1Data as ChineseWordItem[];
export const hsk2Words: ChineseWordItem[] = hsk2Data as ChineseWordItem[];
export const hsk3Words: ChineseWordItem[] = hsk3Data as ChineseWordItem[];
export const hsk4Words: ChineseWordItem[] = hsk4Data as ChineseWordItem[];
export const hsk5Words: ChineseWordItem[] = hsk5Data as ChineseWordItem[];
export const hsk6Words: ChineseWordItem[] = hsk6Data as ChineseWordItem[];

// Toàn bộ 5.400+ từ vựng HSK 1 - 6 chuẩn hóa theo mô hình nhaihsk.com
export const allHskWords: ChineseWordItem[] = [
  ...hsk1Words,
  ...hsk2Words,
  ...hsk3Words,
  ...hsk4Words,
  ...hsk5Words,
  ...hsk6Words,
];

// Alias tương thích ngược cho các màn hình đã dùng mockChineseVocabulary
export const mockChineseVocabulary: ChineseWordItem[] = allHskWords;

// Hàm tiện ích lấy từ vựng theo cấp độ
export function getChineseVocabByLevel(level: number): ChineseWordItem[] {
  switch (level) {
    case 1:
      return hsk1Words;
    case 2:
      return hsk2Words;
    case 3:
      return hsk3Words;
    case 4:
      return hsk4Words;
    case 5:
      return hsk5Words;
    case 6:
      return hsk6Words;
    default:
      return allHskWords;
  }
}

// Danh mục các bộ HSK phục vụ giao diện Sổ Từ Vựng
export const hskDecks = [
  {
    id: 'hsk-1',
    name: 'HSK 1 - 300 Từ Căn Bản',
    level: 'HSK 1',
    hskLevelNum: 1,
    count: hsk1Words.length,
    description: 'Từ vựng căn bản cho người mới bắt đầu học tiếng Trung theo chuẩn NhaiHSK, giao tiếp đời thường.',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
  },
  {
    id: 'hsk-2',
    name: 'HSK 2 - 200 Từ Sơ Cấp',
    level: 'HSK 2',
    hskLevelNum: 2,
    count: hsk2Words.length,
    description: 'Nắm vững các chủ đề sinh hoạt, mua sắm, gọi món, đi lại và hỏi đường theo chuẩn sư phạm.',
    color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/40 text-teal-400',
  },
  {
    id: 'hsk-3',
    name: 'HSK 3 - 500 Từ Trung Cấp Nhẹ',
    level: 'HSK 3',
    hskLevelNum: 3,
    count: hsk3Words.length,
    description: 'Tự tin giao tiếp và diễn đạt quan điểm cá nhân trong học tập và công việc hàng ngày.',
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-400',
  },
  {
    id: 'hsk-4',
    name: 'HSK 4 - 1000 Từ Trung Cấp Chuẩn',
    level: 'HSK 4',
    hskLevelNum: 4,
    count: hsk4Words.length,
    description: 'Thảo luận các chủ đề sâu rộng, chuẩn bị du học hoặc làm việc tại doanh nghiệp Trung Quốc.',
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/40 text-indigo-400',
  },
  {
    id: 'hsk-5',
    name: 'HSK 5 - 1600 Từ Cao Cấp',
    level: 'HSK 5',
    hskLevelNum: 5,
    count: hsk5Words.length,
    description: 'Đọc hiểu báo chí, tiểu thuyết, xem phim không phụ đề và thuyết trình chuyên nghiệp.',
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-400',
  },
  {
    id: 'hsk-6',
    name: 'HSK 6 - 1800 Từ Thành Thạo',
    level: 'HSK 6',
    hskLevelNum: 6,
    count: hsk6Words.length,
    description: 'Sử dụng tiếng Trung nhuần nhuyễn như người bản xứ, viết luận văn và nghiên cứu học thuật.',
    color: 'from-rose-500/20 to-red-500/10 border-rose-500/40 text-rose-400',
  },
];
