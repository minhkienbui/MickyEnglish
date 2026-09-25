export interface ErrorFindQuestion {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  topic: string;
  imageUrl: string;
  imageAlt: string;
  sentence: string;
  hasError: boolean;
  tokens?: string[];
  errorWord?: string;
  errorTokenIndex?: number;
  correctSentence: string;
  translation: string;
  replacementOptions?: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctReplacementKey?: 'A' | 'B' | 'C' | 'D';
  explanationVi: string;
  tip: string;
}

export const ERROR_FIND_QUESTIONS: ErrorFindQuestion[] = [
  {
    id: 'ef-1',
    level: 'B1',
    topic: 'TRAVEL',
    imageUrl:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Airplane window view overlooking clouds at sunset',
    sentence: 'The scenery from the hotel is breathtaking.',
    hasError: false,
    correctSentence: 'The scenery from the hotel is breathtaking.',
    translation: 'Phong cảnh từ khách sạn đẹp đến nghẹt thở.',
    explanationVi:
      "Câu sử dụng đúng danh từ không đếm được 'scenery' đi với động từ to be số ít 'is' và tính từ 'breathtaking' để miêu tả cảnh quan đẹp ngoạn mục.",
    tip: "Nhớ rằng 'scenery' là danh từ không đếm được, không bao giờ dùng 'a scenery' hoặc 'sceneries'.",
  },
  {
    id: 'ef-2',
    level: 'A2',
    topic: 'COMMUNICATION',
    imageUrl:
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Two people engaged in a casual conversation outdoors',
    sentence: "I don't know nothing.",
    hasError: true,
    tokens: ['I', "don't", 'know', 'nothing.'],
    errorWord: 'nothing.',
    errorTokenIndex: 3,
    correctSentence: "I don't know anything.",
    translation: 'Tôi không biết gì cả.',
    replacementOptions: [
      { key: 'A', text: 'anything.' },
      { key: 'B', text: 'nothing.' },
      { key: 'C', text: 'something.' },
      { key: 'D', text: 'everything.' },
    ],
    correctReplacementKey: 'A',
    explanationVi:
      "Lỗi phủ định kép (double negative) xảy ra khi sử dụng hai từ phủ định trong cùng một mệnh đề. Vì đã có trợ động từ phủ định 'don't', từ 'nothing' phải được thay thế bằng 'anything' để câu mang nghĩa phủ định chính xác. Trong tiếng Anh chuẩn, không sử dụng 'not' đi kèm với các từ phủ định như 'nothing', 'nobody', hay 'never'.",
    tip: 'Tránh sử dụng hai từ mang nghĩa phủ định trong cùng một mệnh đề.',
  },
  {
    id: 'ef-3',
    level: 'B1',
    topic: 'LIFESTYLE',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern city apartment building in daylight',
    sentence: 'She has lived here since five years.',
    hasError: true,
    tokens: ['She', 'has', 'lived', 'here', 'since', 'five', 'years.'],
    errorWord: 'since',
    errorTokenIndex: 4,
    correctSentence: 'She has lived here for five years.',
    translation: 'Cô ấy đã sống ở đây được 5 năm.',
    replacementOptions: [
      { key: 'A', text: 'for' },
      { key: 'B', text: 'since' },
      { key: 'C', text: 'during' },
      { key: 'D', text: 'from' },
    ],
    correctReplacementKey: 'A',
    explanationVi:
      "Dùng 'for' khi nói về một khoảng thời gian (a period of time: five years, two months, a long time). Dùng 'since' khi chỉ một mốc thời gian bắt đầu trong quá khứ (a point in time: 2019, last Monday, yesterday).",
    tip: "Ghi nhớ: 'for + khoảng thời gian', còn 'since + mốc thời gian'.",
  },
  {
    id: 'ef-4',
    level: 'A2',
    topic: 'EDUCATION',
    imageUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Student reading books in a quiet library',
    sentence: 'He is interested in learning foreign languages.',
    hasError: false,
    correctSentence: 'He is interested in learning foreign languages.',
    translation: 'Anh ấy rất hứng thú với việc học ngoại ngữ.',
    explanationVi:
      "Cấu trúc 'to be interested in + V-ing/noun' (có hứng thú với cái gì) được dùng hoàn toàn chính xác. Giới từ 'in' luôn đi kèm với danh động từ 'learning'.",
    tip: "Sau các giới từ như in, on, at, about, for, of, luôn dùng động từ ở dạng V-ing.",
  },
  {
    id: 'ef-5',
    level: 'A1',
    topic: 'COMMUNICATION',
    imageUrl:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Group of people standing and waiting in an office hall',
    sentence: 'There is many people waiting outside the station.',
    hasError: true,
    tokens: ['There', 'is', 'many', 'people', 'waiting', 'outside', 'the', 'station.'],
    errorWord: 'is',
    errorTokenIndex: 1,
    correctSentence: 'There are many people waiting outside the station.',
    translation: 'Có rất nhiều người đang đứng đợi bên ngoài nhà ga.',
    replacementOptions: [
      { key: 'A', text: 'are' },
      { key: 'B', text: 'is' },
      { key: 'C', text: 'was' },
      { key: 'D', text: 'be' },
    ],
    correctReplacementKey: 'A',
    explanationVi:
      "'People' là danh từ số nhiều (plural noun) của 'person'. Do đó, động từ to be theo sau cấu trúc 'There...' phải chia ở số nhiều là 'are' thay vì số ít 'is'.",
    tip: "Lưu ý các danh từ bất quy tắc luôn là số nhiều: people, children, mice, teeth, feet.",
  },
  {
    id: 'ef-6',
    level: 'B1',
    topic: 'TRAVEL',
    imageUrl:
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Camping tent under pine trees in rainy weather',
    sentence: 'Although it was raining heavily, we went camping.',
    hasError: false,
    correctSentence: 'Although it was raining heavily, we went camping.',
    translation: 'Mặc dù trời mưa rất to, chúng tôi vẫn đi cắm trại.',
    explanationVi:
      "Liên từ 'Although' kết nối hai mệnh đề chỉ sự tương phản một cách chính xác. Lưu ý rằng không dùng 'but' ở mệnh đề sau khi đã có 'although' ở mệnh đề trước.",
    tip: "Đừng bao giờ dùng cả 'Although' và 'But' trong cùng một câu.",
  },
  {
    id: 'ef-7',
    level: 'A2',
    topic: 'WORK',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Empty business meeting room with table and chairs',
    sentence: "She didn't went to the meeting yesterday.",
    hasError: true,
    tokens: ['She', "didn't", 'went', 'to', 'the', 'meeting', 'yesterday.'],
    errorWord: 'went',
    errorTokenIndex: 2,
    correctSentence: "She didn't go to the meeting yesterday.",
    translation: 'Hôm qua cô ấy đã không tham dự cuộc họp.',
    replacementOptions: [
      { key: 'A', text: 'go' },
      { key: 'B', text: 'went' },
      { key: 'C', text: 'gone' },
      { key: 'D', text: 'going' },
    ],
    correctReplacementKey: 'A',
    explanationVi:
      "Trong thì quá khứ đơn ở thể phủ định, trợ động từ 'did' (didn't) đã chia ở quá khứ. Động từ chính theo sau phải ở dạng nguyên mẫu không 'to' (bare infinitive) là 'go', không dùng 'went'.",
    tip: "Quy tắc vàng: Sau did/didn't, động từ luôn trở về dạng nguyên mẫu.",
  },
  {
    id: 'ef-8',
    level: 'A2',
    topic: 'FOOD',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Fresh hot pizza with cheese and basil',
    sentence: 'This restaurant serves delicious traditional Italian pizza.',
    hasError: false,
    correctSentence: 'This restaurant serves delicious traditional Italian pizza.',
    translation: 'Nhà hàng này phục vụ món pizza Ý truyền thống rất ngon.',
    explanationVi:
      "Trật tự tính từ tuân thủ đúng quy tắc OSASCOMP: Opinion (delicious) -> Age (traditional) -> Origin (Italian) trước danh từ 'pizza'. Chủ ngữ 'This restaurant' số ít chia động từ 'serves' thêm 's' hoàn toàn đúng.",
    tip: "Trật tự tính từ thường gặp: Quan điểm (delicious) đứng trước xuất xứ (Italian).",
  },
  {
    id: 'ef-9',
    level: 'B2',
    topic: 'WORK',
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Resume and interview papers on wooden table',
    sentence: 'Neither of the candidates have sufficient experience.',
    hasError: true,
    tokens: ['Neither', 'of', 'the', 'candidates', 'have', 'sufficient', 'experience.'],
    errorWord: 'have',
    errorTokenIndex: 4,
    correctSentence: 'Neither of the candidates has sufficient experience.',
    translation: 'Cả hai ứng viên đều không có đủ kinh nghiệm.',
    replacementOptions: [
      { key: 'A', text: 'has' },
      { key: 'B', text: 'have' },
      { key: 'C', text: 'having' },
      { key: 'D', text: 'are having' },
    ],
    correctReplacementKey: 'A',
    explanationVi:
      "Trong ngữ pháp tiếng Anh chuẩn (formal English), đại từ 'Neither of + danh từ số nhiều' đóng vai trò là chủ ngữ số ít, nghĩa là 'không ai trong hai người'. Vì vậy động từ phải chia ở ngôi thứ ba số ít là 'has'.",
    tip: "'Neither of' và 'Either of' trong văn viết học thuật luôn đi với động từ số ít.",
  },
  {
    id: 'ef-10',
    level: 'B2',
    topic: 'WORK',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Professional businesswoman smiling in office suit',
    sentence: 'If I were you, I would accept the job offer immediately.',
    hasError: false,
    correctSentence: 'If I were you, I would accept the job offer immediately.',
    translation: 'Nếu tôi là bạn, tôi sẽ nhận lời mời làm việc đó ngay lập tức.',
    explanationVi:
      "Câu điều kiện loại 2 (giả định trái với hiện tại) sử dụng cấu trúc giả định thức 'If I were you, I would + V'. Dùng 'were' cho tất cả các ngôi trong mệnh đề If là chuẩn mực ngữ pháp cao cấp.",
    tip: "Trong câu điều kiện loại 2 giả định lời khuyên, luôn dùng 'If I were you'.",
  },
  {
    id: 'ef-11',
    level: 'B2',
    topic: 'CULTURE',
    imageUrl:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Crowd celebrating and enjoying an outdoor festival with lights',
    sentence: 'Despite of the cold weather, they enjoyed the outdoor festival.',
    hasError: true,
    tokens: ['Despite', 'of', 'the', 'cold', 'weather,', 'they', 'enjoyed', 'the', 'outdoor', 'festival.'],
    errorWord: 'of',
    errorTokenIndex: 1,
    correctSentence: 'Despite the cold weather, they enjoyed the outdoor festival.',
    translation: 'Bất chấp thời tiết giá lạnh, họ vẫn tận hưởng lễ hội ngoài trời.',
    replacementOptions: [
      { key: 'A', text: '(bỏ từ "of")' },
      { key: 'B', text: 'of' },
      { key: 'C', text: 'in' },
      { key: 'D', text: 'at' },
    ],
    correctReplacementKey: 'A',
    explanationVi:
      "Từ 'Despite' đi trực tiếp với danh từ/cụm danh từ mà KHÔNG có giới từ 'of' (Despite + Noun phrase). Chỉ có cụm từ 'In spite of' mới có 'of'. Vì vậy viết 'Despite of' là một lỗi nhầm lẫn rất phổ biến.",
    tip: "Nhớ nằm lòng: 'Despite + N' hoặc 'In spite of + N', không bao giờ dùng 'Despite of'.",
  },
  {
    id: 'ef-12',
    level: 'B2',
    topic: 'TECHNOLOGY',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Circuit board and high tech digital glowing lines',
    sentence: 'The team made significant progress in developing the software.',
    hasError: false,
    correctSentence: 'The team made significant progress in developing the software.',
    translation: 'Đội ngũ đã đạt được tiến bộ đáng kể trong việc phát triển phần mềm.',
    explanationVi:
      "Collocation 'make progress' (tiến bộ, đạt được tiến triển) được kết hợp chính xác. 'Progress' là danh từ không đếm được nên không dùng mạo từ 'a' trước 'significant progress'. Giới từ 'in' đi với V-ing 'developing' hoàn toàn chuẩn xác.",
    tip: "'Progress' không đếm được, dùng 'make progress' chứ không dùng 'do progress' hay 'make a progress'.",
  },
];
