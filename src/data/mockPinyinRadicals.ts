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

// Bộ thủ thường gặp nhất (Top 50 bộ thủ cốt lõi cấu tạo 80% chữ Hán)
export const topChineseRadicals: RadicalItem[] = [
  { id: 1, radical: '一', strokes: 1, pinyin: 'yī', sinoVietnamese: 'Nhất', meaning: 'Một, số một, khởi đầu', exampleWords: ['七', '三', '下'] },
  { id: 2, radical: '丨', strokes: 1, pinyin: 'gǔn', sinoVietnamese: 'Cổn', meaning: 'Nét sổ thẳng đứng từ trên xuống', exampleWords: ['中', '丰', '串'] },
  { id: 3, radical: '丶', strokes: 1, pinyin: 'zhǔ', sinoVietnamese: 'Chủ', meaning: 'Dấu chấm, điểm xuyết', exampleWords: ['丸', '丹', '主'] },
  { id: 4, radical: '丿', strokes: 1, pinyin: 'piě', sinoVietnamese: 'Phiệt', meaning: 'Nét phẩy, uốn cong sang trái', exampleWords: ['九', '久', '乏'] },
  { id: 5, radical: '乙', strokes: 1, pinyin: 'yǐ', sinoVietnamese: 'Ất', meaning: 'Can thứ 2 trong thiên can', exampleWords: ['九', '乞', '也'] },
  { id: 6, radical: '亅', strokes: 1, pinyin: 'jué', sinoVietnamese: 'Quyết', meaning: 'Nét móc thẳng đứng', exampleWords: ['了', '矛', '事'] },
  { id: 7, radical: '二', strokes: 2, pinyin: 'èr', sinoVietnamese: 'Nhị', meaning: 'Hai, số 2', exampleWords: ['于', '云', '互'] },
  { id: 9, radical: '人 (亻)', strokes: 2, pinyin: 'rén', sinoVietnamese: 'Nhân', meaning: 'Người, con người, hành vi con người', exampleWords: ['你', '他', '休', '们'] },
  { id: 10, radical: '儿', strokes: 2, pinyin: 'ér', sinoVietnamese: 'Nhi', meaning: 'Trẻ con, con người bước đi', exampleWords: ['先', '光', '免'] },
  { id: 12, radical: '八', strokes: 2, pinyin: 'bā', sinoVietnamese: 'Bát', meaning: 'Tám, số 8, phân tách', exampleWords: ['公', '六', '分'] },
  { id: 13, radical: '冂', strokes: 2, pinyin: 'jiōng', sinoVietnamese: 'Quynh', meaning: 'Vùng đất xa xôi, biên giới rộng', exampleWords: ['同', '周', '冈'] },
  { id: 15, radical: '冫', strokes: 2, pinyin: 'bīng', sinoVietnamese: 'Băng', meaning: 'Băng tuyết, giá lạnh', exampleWords: ['冷', '冻', '冰', '凉'] },
  { id: 18, radical: '刀 (刂)', strokes: 2, pinyin: 'dāo', sinoVietnamese: 'Đao', meaning: 'Con dao, vũ khí chém cắt', exampleWords: ['分', '别', '利', '切'] },
  { id: 19, radical: '力', strokes: 2, pinyin: 'lì', sinoVietnamese: 'Lực', meaning: 'Sức mạnh, cơ bắp, lao động', exampleWords: ['动', '努', '勇', '加'] },
  { id: 24, radical: '十', strokes: 2, pinyin: 'shí', sinoVietnamese: 'Thập', meaning: 'Mười, số 10, vẹn toàn', exampleWords: ['千', '升', '午'] },
  { id: 30, radical: '口', strokes: 3, pinyin: 'kǒu', sinoVietnamese: 'Khẩu', meaning: 'Miệng, lời nói, ăn uống', exampleWords: ['吃', '喝', '叫', '问'] },
  { id: 31, radical: '囗', strokes: 3, pinyin: 'wéi', sinoVietnamese: 'Vi', meaning: 'Vây quanh, bao bọc kín 4 góc', exampleWords: ['国', '回', '因', '圆'] },
  { id: 32, radical: '土', strokes: 3, pinyin: 'tǔ', sinoVietnamese: 'Thổ', meaning: 'Đất, đất đai, bùn đất', exampleWords: ['地', '在', '场', '城'] },
  { id: 37, radical: '大', strokes: 3, pinyin: 'dà', sinoVietnamese: 'Đại', meaning: 'To lớn, người dang tay', exampleWords: ['太', '天', '头', '夫'] },
  { id: 38, radical: '女', strokes: 3, pinyin: 'nǚ', sinoVietnamese: 'Nữ', meaning: 'Phụ nữ, con gái, giới nữ', exampleWords: ['好', '妈', '妹', '姐'] },
  { id: 39, radical: '子', strokes: 3, pinyin: 'zǐ', sinoVietnamese: 'Tử', meaning: 'Đứa con, con nít', exampleWords: ['字', '学', '孩', '孙'] },
  { id: 40, radical: '宀', strokes: 3, pinyin: 'mián', sinoVietnamese: 'Miên', meaning: 'Mái nhà, che chở', exampleWords: ['家', '安', '室', '定'] },
  { id: 46, radical: '山', strokes: 3, pinyin: 'shān', sinoVietnamese: 'Sơn', meaning: 'Núi non, ngọn núi', exampleWords: ['岁', '岛', '岭', '峰'] },
  { id: 60, radical: '彳', strokes: 3, pinyin: 'chì', sinoVietnamese: 'Xích', meaning: 'Bước chân trái, đường đi', exampleWords: ['行', '很', '律', '微'] },
  { id: 61, radical: '心 (忄)', strokes: 4, pinyin: 'xīn', sinoVietnamese: 'Tâm', meaning: 'Trái tim, tình cảm, suy nghĩ', exampleWords: ['想', '忘', '怕', '快'] },
  { id: 64, radical: '手 (扌)', strokes: 4, pinyin: 'shǒu', sinoVietnamese: 'Thủ', meaning: 'Bàn tay, động tác của tay', exampleWords: ['打', '找', '提', '拿'] },
  { id: 72, radical: '日', strokes: 4, pinyin: 'rì', sinoVietnamese: 'Nhật', meaning: 'Mặt trời, ban ngày, thời gian', exampleWords: ['时', '明', '早', '昨'] },
  { id: 74, radical: '月', strokes: 4, pinyin: 'yuè', sinoVietnamese: 'Nguyệt', meaning: 'Mặt trăng, thịt, cơ thể', exampleWords: ['朋', '期', '服', '脚'] },
  { id: 75, radical: '木', strokes: 4, pinyin: 'mù', sinoVietnamese: 'Mộc', meaning: 'Cây cối, gỗ', exampleWords: ['林', '杯', '校', '本'] },
  { id: 85, radical: '水 (氵)', strokes: 4, pinyin: 'shuǐ', sinoVietnamese: 'Thủy', meaning: 'Nước, chất lỏng, sông hồ', exampleWords: ['河', '海', '洗', '汉'] },
  { id: 86, radical: '火 (灬)', strokes: 4, pinyin: 'huǒ', sinoVietnamese: 'Hỏa', meaning: 'Lửa, nhiệt độ, nấu nướng', exampleWords: ['热', '点', '黑', '照'] },
  { id: 96, radical: '玉 (王)', strokes: 5, pinyin: 'yù', sinoVietnamese: 'Ngọc', meaning: 'Đá quý, vua chúa, quý giá', exampleWords: ['玩', '现', '理', '环'] },
  { id: 104, radical: '疒', strokes: 5, pinyin: 'nè', sinoVietnamese: 'Nạch', meaning: 'Bệnh tật, đau ốm', exampleWords: ['病', '疼', '痛', '瘦'] },
  { id: 109, radical: '目', strokes: 5, pinyin: 'mù', sinoVietnamese: 'Mục', meaning: 'Mắt, nhìn ngắm', exampleWords: ['眼', '看', '睡', '睛'] },
  { id: 112, radical: '石', strokes: 5, pinyin: 'shí', sinoVietnamese: 'Thạch', meaning: 'Hòn đá, khoáng vật', exampleWords: ['破', '码', '确', '硬'] },
  { id: 115, radical: '禾', strokes: 5, pinyin: 'hé', sinoVietnamese: 'Hòa', meaning: 'Cây lúa, hoa màu', exampleWords: ['秋', '科', '和', '种'] },
  { id: 120, radical: '糸 (纟)', strokes: 6, pinyin: 'mì', sinoVietnamese: 'Mịch', meaning: 'Sợi tơ, dây nhợ, vải vóc', exampleWords: ['红', '绿', '给', '结'] },
  { id: 130, radical: '肉 (⺼)', strokes: 6, pinyin: 'ròu', sinoVietnamese: 'Nhục', meaning: 'Thịt, bắp thịt cơ thể', exampleWords: ['肌', '肚', '肩', '肥'] },
  { id: 140, radical: '艸 (艹)', strokes: 6, pinyin: 'cǎo', sinoVietnamese: 'Thảo', meaning: 'Cỏ cây, thảo mộc, hoa lá', exampleWords: ['茶', '草', '花', '药'] },
  { id: 149, radical: '言 (讠)', strokes: 7, pinyin: 'yán', sinoVietnamese: 'Ngôn', meaning: 'Lời nói, ngôn ngữ', exampleWords: ['话', '说', '语', '读'] },
  { id: 162, radical: '辵 (辶)', strokes: 7, pinyin: 'chuò', sinoVietnamese: 'Xước', meaning: 'Chân bước đi, di chuyển', exampleWords: ['进', '这', '道', '运'] },
  { id: 167, radical: '金 (钅)', strokes: 8, pinyin: 'jīn', sinoVietnamese: 'Kim', meaning: 'Kim loại, tiền bạc', exampleWords: ['钱', '银', '铁', '钟'] },
  { id: 169, radical: '门 (門)', strokes: 8, pinyin: 'mén', sinoVietnamese: 'Môn', meaning: 'Cửa ra vào, cổng chào', exampleWords: ['间', '开', '关', '闭'] },
  { id: 172, radical: '隹', strokes: 8, pinyin: 'zhuī', sinoVietnamese: 'Chuy', meaning: 'Chim đuôi ngắn', exampleWords: ['难', '谁', '集', '准'] },
  { id: 173, radical: '雨', strokes: 8, pinyin: 'yǔ', sinoVietnamese: 'Vũ', meaning: 'Mưa, hiện tượng thời tiết', exampleWords: ['雪', '零', '雷', '需'] },
  { id: 184, radical: '食 (饣)', strokes: 9, pinyin: 'shí', sinoVietnamese: 'Thực', meaning: 'Thức ăn, ẩm thực', exampleWords: ['饭', '饮', '饱', '饿'] },
];
