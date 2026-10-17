import radicals214Data from './chinese/radicals214.json';

export interface PinyinItem {
  symbol: string;
  ipa: string;
  vietnameseGuide: string;
  exampleWord: string;
  examplePinyin: string;
  audioSample: string;
}

export interface RadicalItem {
  id: number;
  radical: string;
  baseRadical?: string;
  strokes: number;
  pinyin: string;
  sinoVietnamese: string;
  traditional?: string;
  meaning: string;
  exampleWords: string[];
}

export interface StrokeRule {
  id: number;
  nameVi: string;
  nameZh: string;
  description: string;
  exampleWords: string[];
  animationHint?: string;
}

// 23 Thanh mẫu (Initials)
export const pinyinInitials: PinyinItem[] = [
  { symbol: 'b', ipa: '[p]', vietnameseGuide: 'Đọc giống "p" tiếng Việt nhưng không bật hơi (VD: ba -> pa)', exampleWord: '爸爸', examplePinyin: 'bàba', audioSample: 'b' },
  { symbol: 'p', ipa: '[pʰ]', vietnameseGuide: 'Đọc giống "p" nhưng BẬT HƠI thật mạnh từ môi', exampleWord: '朋友', examplePinyin: 'péngyou', audioSample: 'p' },
  { symbol: 'm', ipa: '[m]', vietnameseGuide: 'Đọc giống "m" tiếng Việt', exampleWord: '妈妈', examplePinyin: 'māma', audioSample: 'm' },
  { symbol: 'f', ipa: '[f]', vietnameseGuide: 'Đọc giống "ph" tiếng Việt', exampleWord: '发财', examplePinyin: 'fācái', audioSample: 'f' },
  { symbol: 'd', ipa: '[t]', vietnameseGuide: 'Đọc giống "t" tiếng Việt, không bật hơi', exampleWord: '大', examplePinyin: 'dà', audioSample: 'd' },
  { symbol: 't', ipa: '[tʰ]', vietnameseGuide: 'Đọc giống "th" tiếng Việt, BẬT HƠI mạnh', exampleWord: '天', examplePinyin: 'tiān', audioSample: 't' },
  { symbol: 'n', ipa: '[n]', vietnameseGuide: 'Đọc giống "n" tiếng Việt', exampleWord: '你', examplePinyin: 'nǐ', audioSample: 'n' },
  { symbol: 'l', ipa: '[l]', vietnameseGuide: 'Đọc giống "l" tiếng Việt', exampleWord: '老师', examplePinyin: 'lǎoshī', audioSample: 'l' },
  { symbol: 'g', ipa: '[k]', vietnameseGuide: 'Đọc giống "c/k" tiếng Việt, không bật hơi', exampleWord: '哥哥', examplePinyin: 'gēge', audioSample: 'g' },
  { symbol: 'k', ipa: '[kʰ]', vietnameseGuide: 'Đọc giống "kh" tiếng Việt nhưng cuống họng BẬT HƠI', exampleWord: '看', examplePinyin: 'kàn', audioSample: 'k' },
  { symbol: 'h', ipa: '[x]', vietnameseGuide: 'Đọc nằm giữa âm "h" và "kh" tiếng Việt', exampleWord: '好', examplePinyin: 'hǎo', audioSample: 'h' },
  { symbol: 'j', ipa: '[tɕ]', vietnameseGuide: 'Đọc giống "ch" tiếng Việt, đầu lưỡi chạm răng dưới', exampleWord: '家', examplePinyin: 'jiā', audioSample: 'j' },
  { symbol: 'q', ipa: '[tɕʰ]', vietnameseGuide: 'Đọc giống "ch" nhưng BẬT HƠI rất mạnh', exampleWord: '去', examplePinyin: 'qù', audioSample: 'q' },
  { symbol: 'x', ipa: '[ɕ]', vietnameseGuide: 'Đọc giống "x" tiếng Việt nhẹ, khép môi bẹt miệng', exampleWord: '谢谢', examplePinyin: 'xièxie', audioSample: 'x' },
  { symbol: 'zh', ipa: '[ʈʂ]', vietnameseGuide: 'Uốn cong đầu lưỡi lên vòm họng, đọc giống "tr"', exampleWord: '中国', examplePinyin: 'zhōngguó', audioSample: 'zh' },
  { symbol: 'ch', ipa: '[ʈʂʰ]', vietnameseGuide: 'Uốn lưỡi đọc giống "tr" và BẬT HƠI mạnh', exampleWord: '吃', examplePinyin: 'chī', audioSample: 'ch' },
  { symbol: 'sh', ipa: '[ʂ]', vietnameseGuide: 'Uốn lưỡi đọc giống "s" nặng tiếng Việt', exampleWord: '是', examplePinyin: 'shì', audioSample: 'sh' },
  { symbol: 'r', ipa: '[ʐ]', vietnameseGuide: 'Uốn cong đầu lưỡi, đọc giữa âm "r" và "d"', exampleWord: '人', examplePinyin: 'rén', audioSample: 'r' },
  { symbol: 'z', ipa: '[ts]', vietnameseGuide: 'Đầu lưỡi thẳng chạm mặt trong răng cửa, đọc giống "ch/tr"', exampleWord: '在', examplePinyin: 'zài', audioSample: 'z' },
  { symbol: 'c', ipa: '[tsʰ]', vietnameseGuide: 'Đầu lưỡi thẳng chạm răng cửa và BẬT HƠI mạnh', exampleWord: '从', examplePinyin: 'cóng', audioSample: 'c' },
  { symbol: 's', ipa: '[s]', vietnameseGuide: 'Đọc giống "x" nhẹ tiếng Việt, răng khép hờ', exampleWord: '四', examplePinyin: 'sì', audioSample: 's' },
  { symbol: 'y', ipa: '[j]', vietnameseGuide: 'Thanh mẫu nửa phụ âm, đọc giống "i/d" nhẹ', exampleWord: '有', examplePinyin: 'yǒu', audioSample: 'y' },
  { symbol: 'w', ipa: '[w]', vietnameseGuide: 'Thanh mẫu nửa phụ âm, đọc giống "u/o"', exampleWord: '我', examplePinyin: 'wǒ', audioSample: 'w' },
];

// 7 Quy tắc thuần bút (Thứ tự nét viết chữ Hán)
export const strokeRules: StrokeRule[] = [
  {
    id: 1,
    nameVi: 'Ngang trước sổ sau',
    nameZh: '先横后竖',
    description: 'Nét ngang viết trước, nét thẳng đứng (sổ) viết xuyên qua sau.',
    exampleWords: ['十 (Thập - Số 10)', '干 (Can - Làm việc)', '丰 (Phong - Phong phú)'],
  },
  {
    id: 2,
    nameVi: 'Phẩy trước mác sau',
    nameZh: '先撇后捺',
    description: 'Nét xiên sang trái (phẩy) viết trước, nét xiên sang phải (mác) viết sau.',
    exampleWords: ['八 (Bát - Số 8)', '人 (Nhân - Con người)', '入 (Nhập - Đi vào)'],
  },
  {
    id: 3,
    nameVi: 'Trên trước dưới sau',
    nameZh: '从上到下',
    description: 'Các bộ phận và nét ở phía trên viết trước, phía dưới viết sau.',
    exampleWords: ['三 (Tam - Số 3)', '二 (Nhị - Số 2)', '早 (Tảo - Buổi sáng)'],
  },
  {
    id: 4,
    nameVi: 'Trái trước phải sau',
    nameZh: '从左到右',
    description: 'Bộ phận bên trái viết trước, bộ phận bên phải viết sau.',
    exampleWords: ['川 (Xuyên - Dòng sông)', '你 (Nhĩ - Bạn)', '好 (Hảo - Tốt)'],
  },
  {
    id: 5,
    nameVi: 'Ngoài trước trong sau',
    nameZh: '从外到内',
    description: 'Khung bao bọc bên ngoài viết trước, các nét bên trong viết sau.',
    exampleWords: ['月 (Nguyệt - Mặt trăng)', '同 (Đồng - Cùng nhau)', '问 (Vấn - Hỏi)'],
  },
  {
    id: 6,
    nameVi: 'Vào trước đóng sau',
    nameZh: '先进入后关门',
    description: 'Vẽ khung 3 cạnh ngoài -> Viết các nét bên trong -> Viết nét ngang đáy để đóng khung lại.',
    exampleWords: ['回 (Hồi - Quay về)', '国 (Quốc - Đất nước)', '日 (Nhật - Mặt trời)'],
  },
  {
    id: 7,
    nameVi: 'Giữa trước hai bên sau',
    nameZh: '先中间后两边',
    description: 'Nét trục chính ở giữa viết trước, hai nét đối xứng hai bên viết sau.',
    exampleWords: ['小 (Tiểu - Nhỏ)', '水 (Thủy - Nước)', '木 (Mộc - Cây cối)'],
  },
];

// TOÀN BỘ 214 BỘ THỦ KHANG HY (CHUẨN HỌC BỘ THỦ TIẾNG TRUNG NHAI HSK)
export const allChineseRadicals214: RadicalItem[] = radicals214Data as RadicalItem[];

// Giữ lại tên export cũ để tương thích 100% với các component
export const topChineseRadicals: RadicalItem[] = allChineseRadicals214;
