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

// 15 BÀI HỌC CHUẨN GIÁO TRÌNH HSK 1 (KHỚP 100% ẢNH THỰC TẾ NHAIHSK)
export const HSK1_CURRICULUM: { title: string; titleZh: string; words: HskLessonWord[] }[] = [
  // BÀI 1: Xin chào! (Exact 13 words from NhaiHSK Screenshots 3, 4, 5, 8, 11)
  {
    title: 'Xin chào!',
    titleZh: '你好！',
    words: [
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
    ],
  },

  // BÀI 2: Tôi tên là NhaiHSK
  {
    title: 'Tôi tên là NhaiHSK',
    titleZh: '我叫NhaiHSK',
    words: [
      { id: 'zh-hsk1-l2-01', hanzi: '叫', pinyin: 'jiào', sinoVietnamese: 'KHIẾU', meaning: 'Gọi, tên là', hskLevel: 1, posBadge: 'Động từ', exampleZh: '我叫李明。', examplePinyin: 'wǒ jiào lǐ míng.', exampleVi: 'Tôi tên là Lý Minh.' },
      { id: 'zh-hsk1-l2-02', hanzi: '什么', pinyin: 'shénme', sinoVietnamese: 'THẬP MA', meaning: 'Cái gì, gì', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '你叫什么名字？', examplePinyin: 'nǐ jiào shénme míngzi?', exampleVi: 'Bạn tên là gì?' },
      { id: 'zh-hsk1-l2-03', hanzi: '名字', pinyin: 'míngzi', sinoVietnamese: 'DANH TỰ', meaning: 'Tên, họ tên', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我的名字叫大伟。', examplePinyin: 'wǒ de míngzi jiào dàwěi.', exampleVi: 'Tên của tôi là Đại Vĩ.' },
      { id: 'zh-hsk1-l2-04', hanzi: '我', pinyin: 'wǒ', sinoVietnamese: 'NGÃ', meaning: 'Tôi, mình, tao', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '我是新学生。', examplePinyin: 'wǒ shì xīn xuéshēng.', exampleVi: 'Tôi là học sinh mới.' },
      { id: 'zh-hsk1-l2-05', hanzi: '是', pinyin: 'shì', sinoVietnamese: 'THỊ', meaning: 'Là, đúng', hskLevel: 1, posBadge: 'Động từ', exampleZh: '他是中国人。', examplePinyin: 'tā shì zhōngguó rén.', exampleVi: 'Anh ấy là người Trung Quốc.' },
      { id: 'zh-hsk1-l2-06', hanzi: '中国人', pinyin: 'zhōngguó rén', sinoVietnamese: 'TRUNG QUỐC NHÂN', meaning: 'Người Trung Quốc', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我是中国人。', examplePinyin: 'wǒ shì zhōngguó rén.', exampleVi: 'Tôi là người Trung Quốc.' },
      { id: 'zh-hsk1-l2-07', hanzi: '人', pinyin: 'rén', sinoVietnamese: 'NHÂN', meaning: 'Người', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这里人很多。', examplePinyin: 'zhèlǐ rén hěn duō.', exampleVi: 'Ở đây rất đông người.' },
      { id: 'zh-hsk1-l2-08', hanzi: '不', pinyin: 'bù', sinoVietnamese: 'BẤT', meaning: 'Không, chẳng', hskLevel: 1, posBadge: 'Phó từ', exampleZh: '我不是老师。', examplePinyin: 'wǒ bú shì lǎoshī.', exampleVi: 'Tôi không phải là giáo viên.' },
      { id: 'zh-hsk1-l2-09', hanzi: '吗', pinyin: 'ma', sinoVietnamese: 'MA', meaning: 'Phải không, à, ư', hskLevel: 1, posBadge: 'Trợ từ', exampleZh: '你好吗？', examplePinyin: 'nǐ hǎo ma?', exampleVi: 'Bạn có khỏe không?' },
      { id: 'zh-hsk1-l2-10', hanzi: '也', pinyin: 'yě', sinoVietnamese: 'DÃ', meaning: 'Cũng', hskLevel: 1, posBadge: 'Phó từ', exampleZh: '我也是学生。', examplePinyin: 'wǒ yě shì xuéshēng.', exampleVi: 'Tôi cũng là học sinh.' },
      { id: 'zh-hsk1-l2-11', hanzi: '很', pinyin: 'hěn', sinoVietnamese: 'HẨN', meaning: 'Rất, lắm', hskLevel: 1, posBadge: 'Phó từ', exampleZh: '我很好，谢谢！', examplePinyin: 'wǒ hěn hǎo, xièxie!', exampleVi: 'Tôi rất khỏe, cảm ơn!' },
      { id: 'zh-hsk1-l2-12', hanzi: '高兴', pinyin: 'gāoxìng', sinoVietnamese: 'CAO HỨNG', meaning: 'Vui vẻ, hân hạnh', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '很高兴认识你。', examplePinyin: 'hěn gāoxìng rènshí nǐ.', exampleVi: 'Rất vui được quen biết bạn.' },
      { id: 'zh-hsk1-l2-13', hanzi: '认识', pinyin: 'rènshí', sinoVietnamese: 'NHẬN THỨC', meaning: 'Biết, làm quen', hskLevel: 1, posBadge: 'Động từ', exampleZh: '认识你很高兴。', examplePinyin: 'rènshí nǐ hěn gāoxìng.', exampleVi: 'Làm quen với bạn rất vui.' },
      { id: 'zh-hsk1-l2-14', hanzi: '李明', pinyin: 'Lǐ Míng', sinoVietnamese: 'LÝ MINH', meaning: 'Lý Minh (tên riêng)', hskLevel: 1, posBadge: 'Danh từ riêng', exampleZh: '他叫李明。', examplePinyin: 'tā jiào lǐ míng.', exampleVi: 'Anh ấy tên là Lý Minh.' },
      { id: 'zh-hsk1-l2-15', hanzi: '大伟', pinyin: 'Dàwěi', sinoVietnamese: 'ĐẠI VĨ', meaning: 'Đại Vĩ (tên riêng)', hskLevel: 1, posBadge: 'Danh từ riêng', exampleZh: '大伟是美国人。', examplePinyin: 'dàwěi shì měiguó rén.', exampleVi: 'Đại Vĩ là người Mỹ.' },
    ],
  },

  // BÀI 3: Tôi là người Việt Nam
  {
    title: 'Tôi là người Việt Nam',
    titleZh: '我是越南人',
    words: [
      { id: 'zh-hsk1-l3-01', hanzi: '越南', pinyin: 'Yuènán', sinoVietnamese: 'VIỆT NAM', meaning: 'Nước Việt Nam', hskLevel: 1, posBadge: 'Danh từ riêng', exampleZh: '我来自越南。', examplePinyin: 'wǒ láizì yuènán.', exampleVi: 'Tôi đến từ Việt Nam.' },
      { id: 'zh-hsk1-l3-02', hanzi: '越南人', pinyin: 'yuènán rén', sinoVietnamese: 'VIỆT NAM NHÂN', meaning: 'Người Việt Nam', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我们都是越南人。', examplePinyin: 'wǒmen dōu shì yuènán rén.', exampleVi: 'Chúng tôi đều là người Việt Nam.' },
      { id: 'zh-hsk1-l3-03', hanzi: '中国', pinyin: 'Zhōngguó', sinoVietnamese: 'TRUNG QUỐC', meaning: 'Nước Trung Quốc', hskLevel: 1, posBadge: 'Danh từ riêng', exampleZh: '中国很大。', examplePinyin: 'zhōngguó hěn dà.', exampleVi: 'Trung Quốc rất rộng lớn.' },
      { id: 'zh-hsk1-l3-04', hanzi: '美国', pinyin: 'Měiguó', sinoVietnamese: 'MỸ QUỐC', meaning: 'Nước Mỹ, Hoa Kỳ', hskLevel: 1, posBadge: 'Danh từ riêng', exampleZh: '他是美国人。', examplePinyin: 'tā shì měiguó rén.', exampleVi: 'Anh ấy là người Mỹ.' },
      { id: 'zh-hsk1-l3-05', hanzi: '国', pinyin: 'guó', sinoVietnamese: 'QUỐC', meaning: 'Quốc gia, đất nước', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '你是哪国人？', examplePinyin: 'nǐ shì nǎ guó rén?', exampleVi: 'Bạn là người nước nào?' },
      { id: 'zh-hsk1-l3-06', hanzi: '哪', pinyin: 'nǎ', sinoVietnamese: 'NẢ', meaning: 'Nào, đâu', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '哪本书是你的？', examplePinyin: 'nǎ běn shū shì nǐ de?', exampleVi: 'Cuốn sách nào là của bạn?' },
      { id: 'zh-hsk1-l3-07', hanzi: '呢', pinyin: 'ne', sinoVietnamese: 'NI', meaning: 'Còn... thì sao?', hskLevel: 1, posBadge: 'Trợ từ', exampleZh: '我是学生，你呢？', examplePinyin: 'wǒ shì xuéshēng, nǐ ne?', exampleVi: 'Tôi là học sinh, còn bạn thì sao?' },
      { id: 'zh-hsk1-l3-08', hanzi: '他', pinyin: 'tā', sinoVietnamese: 'THA', meaning: 'Anh ấy, cậu ấy', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '他是我的同学。', examplePinyin: 'tā shì wǒ de tóngxué.', exampleVi: 'Anh ấy là bạn học của tôi.' },
      { id: 'zh-hsk1-l3-09', hanzi: '她', pinyin: 'tā', sinoVietnamese: 'THA', meaning: 'Cô ấy, bà ấy', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '她是我的汉语老师。', examplePinyin: 'tā shì wǒ de hànyǔ lǎoshī.', exampleVi: 'Cô ấy là giáo viên tiếng Trung của tôi.' },
      { id: 'zh-hsk1-l3-10', hanzi: '谁', pinyin: 'shéi', sinoVietnamese: 'THÙY', meaning: 'Ai, người nào', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '他是谁？', examplePinyin: 'tā shì shéi?', exampleVi: 'Anh ấy là ai?' },
      { id: 'zh-hsk1-l3-11', hanzi: '朋友', pinyin: 'péngyou', sinoVietnamese: 'BẰNG HỮU', meaning: 'Bạn bè', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我们是好朋友。', examplePinyin: 'wǒmen shì hǎo péngyou.', exampleVi: 'Chúng tôi là bạn tốt.' },
      { id: 'zh-hsk1-l3-12', hanzi: '的', pinyin: 'de', sinoVietnamese: 'ĐÍCH', meaning: 'Của (sở hữu)', hskLevel: 1, posBadge: 'Trợ từ', exampleZh: '这是我的书。', examplePinyin: 'zhè shì wǒ de shū.', exampleVi: 'Đây là sách của tôi.' },
    ],
  },

  // BÀI 4: Cô ấy là giáo viên tiếng Trung của tôi
  {
    title: 'Cô ấy là giáo viên tiếng Trung của tôi',
    titleZh: '她是我的汉语老师',
    words: [
      { id: 'zh-hsk1-l4-01', hanzi: '汉语', pinyin: 'Hànyǔ', sinoVietnamese: 'HÁN NGỮ', meaning: 'Tiếng Hán, tiếng Trung', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我学汉语。', examplePinyin: 'wǒ xué hànyǔ.', exampleVi: 'Tôi học tiếng Trung.' },
      { id: 'zh-hsk1-l4-02', hanzi: '学习', pinyin: 'xuéxí', sinoVietnamese: 'HỌC TẬP', meaning: 'Học tập, học', hskLevel: 1, posBadge: 'Động từ', exampleZh: '天天学习。', examplePinyin: 'tiāntiān xuéxí.', exampleVi: 'Ngày ngày học tập.' },
      { id: 'zh-hsk1-l4-03', hanzi: '学', pinyin: 'xué', sinoVietnamese: 'HỌC', meaning: 'Học', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你在学什么？', examplePinyin: 'nǐ zài xué shénme?', exampleVi: 'Bạn đang học gì vậy?' },
      { id: 'zh-hsk1-l4-04', hanzi: '汉字', pinyin: 'Hànzì', sinoVietnamese: 'HÁN TỰ', meaning: 'Chữ Hán', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '汉字很有意思。', examplePinyin: 'hànzì hěn yǒu yìsi.', exampleVi: 'Chữ Hán rất thú vị.' },
      { id: 'zh-hsk1-l4-05', hanzi: '字', pinyin: 'zì', sinoVietnamese: 'TỰ', meaning: 'Chữ, từ', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这个字怎么读？', examplePinyin: 'zhè ge zì zěnme dú?', exampleVi: 'Chữ này đọc như thế nào?' },
      { id: 'zh-hsk1-l4-06', hanzi: '说', pinyin: 'shuō', sinoVietnamese: 'THUYẾT', meaning: 'Nói', hskLevel: 1, posBadge: 'Động từ', exampleZh: '他说汉语很好。', examplePinyin: 'tā shuō hànyǔ hěn hǎo.', exampleVi: 'Anh ấy nói tiếng Trung rất giỏi.' },
      { id: 'zh-hsk1-l4-07', hanzi: '读', pinyin: 'dú', sinoVietnamese: 'ĐỘC', meaning: 'Đọc', hskLevel: 1, posBadge: 'Động từ', exampleZh: '请跟我读。', examplePinyin: 'qǐng gēn wǒ dú.', exampleVi: 'Xin mời đọc theo tôi.' },
      { id: 'zh-hsk1-l4-08', hanzi: '写', pinyin: 'xiě', sinoVietnamese: 'TẢ', meaning: 'Viết', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你会写汉字吗？', examplePinyin: 'nǐ huì xiě hànzì ma?', exampleVi: 'Bạn biết viết chữ Hán không?' },
      { id: 'zh-hsk1-l4-09', hanzi: '听', pinyin: 'tīng', sinoVietnamese: 'THÍNH', meaning: 'Nghe', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你听我说。', examplePinyin: 'nǐ tīng wǒ shuō.', exampleVi: 'Bạn nghe tôi nói này.' },
      { id: 'zh-hsk1-l4-10', hanzi: '书', pinyin: 'shū', sinoVietnamese: 'THƯ', meaning: 'Sách', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我看书呢。', examplePinyin: 'wǒ kàn shū ne.', exampleVi: 'Tôi đang đọc sách.' },
      { id: 'zh-hsk1-l4-11', hanzi: '本', pinyin: 'běn', sinoVietnamese: 'BẢN', meaning: 'Cuốn, quyển (sách)', hskLevel: 1, posBadge: 'Lượng từ', exampleZh: '两本书。', examplePinyin: 'liǎng běn shū.', exampleVi: 'Hai cuốn sách.' },
      { id: 'zh-hsk1-l4-12', hanzi: '看', pinyin: 'kàn', sinoVietnamese: 'KHÁN', meaning: 'Nhìn, xem, đọc', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你看，这是什么？', examplePinyin: 'nǐ kàn, zhè shì shénme?', exampleVi: 'Bạn nhìn xem, đây là cái gì?' },
    ],
  },

  // BÀI 5: Gia đình tôi có 4 người
  {
    title: 'Gia đình tôi có 4 người',
    titleZh: '我家有四口人',
    words: [
      { id: 'zh-hsk1-l5-01', hanzi: '家', pinyin: 'jiā', sinoVietnamese: 'GIA', meaning: 'Nhà, gia đình', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这是我的家。', examplePinyin: 'zhè shì wǒ de jiā.', exampleVi: 'Đây là nhà của tôi.' },
      { id: 'zh-hsk1-l5-02', hanzi: '有', pinyin: 'yǒu', sinoVietnamese: 'HỮU', meaning: 'Có', hskLevel: 1, posBadge: 'Động từ', exampleZh: '我有三个苹果。', examplePinyin: 'wǒ yǒu sān gè píngguǒ.', exampleVi: 'Tôi có ba quả táo.' },
      { id: 'zh-hsk1-l5-03', hanzi: '没有', pinyin: 'méiyǒu', sinoVietnamese: 'MỘT HỮU', meaning: 'Không có', hskLevel: 1, posBadge: 'Động từ', exampleZh: '我没有哥哥。', examplePinyin: 'wǒ méiyǒu gēge.', exampleVi: 'Tôi không có anh trai.' },
      { id: 'zh-hsk1-l5-04', hanzi: '口', pinyin: 'kǒu', sinoVietnamese: 'KHẨU', meaning: 'Người (lượng từ đếm nhân khẩu)', hskLevel: 1, posBadge: 'Lượng từ', exampleZh: '你家有几口人？', examplePinyin: 'nǐ jiā yǒu jǐ kǒu rén?', exampleVi: 'Nhà bạn có mấy người?' },
      { id: 'zh-hsk1-l5-05', hanzi: '几', pinyin: 'jǐ', sinoVietnamese: 'KỶ', meaning: 'Mấy (số lượng ít < 10)', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '你有几个朋友？', examplePinyin: 'nǐ yǒu jǐ gè péngyou?', exampleVi: 'Bạn có mấy người bạn?' },
      { id: 'zh-hsk1-l5-06', hanzi: '爸爸', pinyin: 'bàba', sinoVietnamese: 'BA BA', meaning: 'Bố, cha', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我爸爸是医生。', examplePinyin: 'wǒ bàba shì yīshēng.', exampleVi: 'Bố tôi là bác sĩ.' },
      { id: 'zh-hsk1-l5-07', hanzi: '妈妈', pinyin: 'māma', sinoVietnamese: 'MA MA', meaning: 'Mẹ, má', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我妈妈很漂亮。', examplePinyin: 'wǒ māma hěn piàoliang.', exampleVi: 'Mẹ tôi rất xinh đẹp.' },
      { id: 'zh-hsk1-l5-08', hanzi: '哥哥', pinyin: 'gēge', sinoVietnamese: 'CA CA', meaning: 'Anh trai', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '哥哥比我大。', examplePinyin: 'gēge bǐ wǒ dà.', exampleVi: 'Anh trai lớn hơn tôi.' },
      { id: 'zh-hsk1-l5-09', hanzi: '姐姐', pinyin: 'jiějie', sinoVietnamese: 'TỶ TỶ', meaning: 'Chị gái', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '姐姐在大学学习。', examplePinyin: 'jiějie zài dàxué xuéxí.', exampleVi: 'Chị gái học ở trường đại học.' },
      { id: 'zh-hsk1-l5-10', hanzi: '儿子', pinyin: 'érzi', sinoVietnamese: 'NHI TỬ', meaning: 'Con trai', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '他儿子五岁了。', examplePinyin: 'tā érzi wǔ suì le.', exampleVi: 'Con trai anh ấy năm tuổi rồi.' },
      { id: 'zh-hsk1-l5-11', hanzi: '女儿', pinyin: 'nǚ\'ér', sinoVietnamese: 'NỮ NHI', meaning: 'Con gái', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '女儿很喜欢猫。', examplePinyin: 'nǚ\'ér hěn xǐhuan māo.', exampleVi: 'Con gái rất thích mèo.' },
      { id: 'zh-hsk1-l5-12', hanzi: '岁', pinyin: 'suì', sinoVietnamese: 'TUẾ', meaning: 'Tuổi', hskLevel: 1, posBadge: 'Lượng từ', exampleZh: '你今年多大？我二十岁。', examplePinyin: 'nǐ jīnnián duōdà? wǒ èrshí suì.', exampleVi: 'Năm nay bạn bao nhiêu tuổi? Tôi 20 tuổi.' },
      { id: 'zh-hsk1-l5-13', hanzi: '今年', pinyin: 'jīnnián', sinoVietnamese: 'KIM NIÊN', meaning: 'Năm nay', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '今年天气很热。', examplePinyin: 'jīnnián tiānqì hěn rè.', exampleVi: 'Năm nay thời tiết rất nóng.' },
      { id: 'zh-hsk1-l5-14', hanzi: '多大', pinyin: 'duō dà', sinoVietnamese: 'ĐA ĐẠI', meaning: 'Bao nhiêu tuổi', hskLevel: 1, posBadge: 'Cụm từ', exampleZh: '小明多大了？', examplePinyin: 'xiǎomíng duō dà le?', exampleVi: 'Tiểu Minh bao nhiêu tuổi rồi?' },
    ],
  },

  // BÀI 6: Tôi biết nói tiếng Trung
  {
    title: 'Tôi biết nói tiếng Trung',
    titleZh: '我会说汉语',
    words: [
      { id: 'zh-hsk1-l6-01', hanzi: '会', pinyin: 'huì', sinoVietnamese: 'HỘI', meaning: 'Biết (qua học hỏi), sẽ', hskLevel: 1, posBadge: 'Động từ năng nguyện', exampleZh: '我会做中国菜。', examplePinyin: 'wǒ huì zuò zhōngguó cài.', exampleVi: 'Tôi biết nấu món ăn Trung Quốc.' },
      { id: 'zh-hsk1-l6-02', hanzi: '菜', pinyin: 'cài', sinoVietnamese: 'THÁI', meaning: 'Món ăn, rau', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '中国菜很好吃。', examplePinyin: 'zhōngguó cài hěn hǎochī.', exampleVi: 'Món ăn Trung Quốc rất ngon.' },
      { id: 'zh-hsk1-l6-03', hanzi: '做', pinyin: 'zuò', sinoVietnamese: 'TỐ', meaning: 'Làm, nấu', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你在做什么？', examplePinyin: 'nǐ zài zuò shénme?', exampleVi: 'Bạn đang làm gì vậy?' },
      { id: 'zh-hsk1-l6-04', hanzi: '好吃', pinyin: 'hǎochī', sinoVietnamese: 'HẢO NGẬP', meaning: 'Ngon (ăn ngon)', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '这个苹果很好吃。', examplePinyin: 'zhè ge píngguǒ hěn hǎochī.', exampleVi: 'Quả táo này rất ngon.' },
      { id: 'zh-hsk1-l6-05', hanzi: '怎么', pinyin: 'zěnme', sinoVietnamese: 'CHẨM MA', meaning: 'Như thế nào, sao', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '这个字怎么写？', examplePinyin: 'zhè ge zì zěnme xiě?', exampleVi: 'Chữ này viết thế nào?' },
      { id: 'zh-hsk1-l6-06', hanzi: '漂亮', pinyin: 'piàoliang', sinoVietnamese: 'PHIÊU LƯỢNG', meaning: 'Xinh đẹp, đẹp', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '她的衣服真漂亮。', examplePinyin: 'tā de yīfu zhēn piàoliang.', exampleVi: 'Quần áo của cô ấy thật đẹp.' },
      { id: 'zh-hsk1-l6-07', hanzi: '喜欢', pinyin: 'xǐhuan', sinoVietnamese: 'HỈ HOAN', meaning: 'Thích, yêu thích', hskLevel: 1, posBadge: 'Động từ', exampleZh: '我喜欢学中文。', examplePinyin: 'wǒ xǐhuan xué zhōngwén.', exampleVi: 'Tôi thích học tiếng Trung.' },
      { id: 'zh-hsk1-l6-08', hanzi: '太', pinyin: 'tài', sinoVietnamese: 'THÁI', meaning: 'Quá, lắm', hskLevel: 1, posBadge: 'Phó từ', exampleZh: '太好了！', examplePinyin: 'tài hǎo le!', exampleVi: 'Tốt quá rồi!' },
      { id: 'zh-hsk1-l6-09', hanzi: '了', pinyin: 'le', sinoVietnamese: 'LIỄU', meaning: 'Rồi (trợ từ ngữ khí)', hskLevel: 1, posBadge: 'Trợ từ', exampleZh: '下雨了。', examplePinyin: 'xià yǔ le.', exampleVi: 'Trời mưa rồi.' },
    ],
  },

  // BÀI 7: Hôm nay là ngày mấy?
  {
    title: 'Hôm nay là ngày mấy?',
    titleZh: '今天几月几号？',
    words: [
      { id: 'zh-hsk1-l7-01', hanzi: '今天', pinyin: 'jīntiān', sinoVietnamese: 'KIM THIÊN', meaning: 'Hôm nay', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '今天星期五。', examplePinyin: 'jīntiān xīngqīwǔ.', exampleVi: 'Hôm nay là thứ sáu.' },
      { id: 'zh-hsk1-l7-02', hanzi: '明天', pinyin: 'míngtiān', sinoVietnamese: 'MINH THIÊN', meaning: 'Ngày mai', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '明天见！', examplePinyin: 'míngtiān jiàn!', exampleVi: 'Ngày mai gặp lại!' },
      { id: 'zh-hsk1-l7-03', hanzi: '昨天', pinyin: 'zuótiān', sinoVietnamese: 'TÁC THIÊN', meaning: 'Hôm qua', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '昨天我很忙。', examplePinyin: 'zuótiān wǒ hěn máng.', exampleVi: 'Hôm qua tôi rất bận.' },
      { id: 'zh-hsk1-l7-04', hanzi: '月', pinyin: 'yuè', sinoVietnamese: 'NGUYỆT', meaning: 'Tháng, mặt trăng', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '现在是五月。', examplePinyin: 'xiànzài shì wǔ yuè.', exampleVi: 'Bây giờ là tháng năm.' },
      { id: 'zh-hsk1-l7-05', hanzi: '号', pinyin: 'hào', sinoVietnamese: 'HIỆU', meaning: 'Ngày (trong tháng), số', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '今天几号？今天八号。', examplePinyin: 'jīntiān jǐ hào? jīntiān bā hào.', exampleVi: 'Hôm nay ngày mấy? Hôm nay ngày tám.' },
      { id: 'zh-hsk1-l7-06', hanzi: '星期', pinyin: 'xīngqī', sinoVietnamese: 'TINH KỲ', meaning: 'Tuần, thứ', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '一个星期有七天。', examplePinyin: 'yí gè xīngqī yǒu qī tiān.', exampleVi: 'Một tuần có bảy ngày.' },
      { id: 'zh-hsk1-l7-07', hanzi: '星期天', pinyin: 'xīngqītiān', sinoVietnamese: 'TINH KỲ THIÊN', meaning: 'Chủ nhật', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '星期天我不上班。', examplePinyin: 'xīngqītiān wǒ bù shàngbān.', exampleVi: 'Chủ nhật tôi không đi làm.' },
      { id: 'zh-hsk1-l7-08', hanzi: '去', pinyin: 'qù', sinoVietnamese: 'KHỨ', meaning: 'Đi', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你去哪儿？', examplePinyin: 'nǐ qù nǎr?', exampleVi: 'Bạn đi đâu vậy?' },
      { id: 'zh-hsk1-l7-09', hanzi: '学校', pinyin: 'xuéxiào', sinoVietnamese: 'HỌC HIỆU', meaning: 'Trường học', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我去学校看书。', examplePinyin: 'wǒ qù xuéxiào kàn shū.', exampleVi: 'Tôi đến trường đọc sách.' },
    ],
  },

  // BÀI 8: Tôi muốn uống trà
  {
    title: 'Tôi muốn uống trà',
    titleZh: '我想喝茶',
    words: [
      { id: 'zh-hsk1-l8-01', hanzi: '想', pinyin: 'xiǎng', sinoVietnamese: 'TƯỞNG', meaning: 'Muốn, nghĩ, nhớ', hskLevel: 1, posBadge: 'Động từ', exampleZh: '我想喝水。', examplePinyin: 'wǒ xiǎng hē shuǐ.', exampleVi: 'Tôi muốn uống nước.' },
      { id: 'zh-hsk1-l8-02', hanzi: '喝', pinyin: 'hē', sinoVietnamese: 'HÁT', meaning: 'Uống', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你想喝茶吗？', examplePinyin: 'nǐ xiǎng hē chá ma?', exampleVi: 'Bạn muốn uống trà không?' },
      { id: 'zh-hsk1-l8-03', hanzi: '茶', pinyin: 'chá', sinoVietnamese: 'TRÀ', meaning: 'Trà, chè', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '中国绿茶很好喝。', examplePinyin: 'zhōngguó lǜchá hěn hǎohē.', exampleVi: 'Trà xanh Trung Quốc rất ngon.' },
      { id: 'zh-hsk1-l8-04', hanzi: '吃', pinyin: 'chī', sinoVietnamese: 'NGẬP', meaning: 'Ăn', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你想吃什么？', examplePinyin: 'nǐ xiǎng chī shénme?', exampleVi: 'Bạn muốn ăn món gì?' },
      { id: 'zh-hsk1-l8-05', hanzi: '米饭', pinyin: 'mǐfàn', sinoVietnamese: 'MỄ PHẠN', meaning: 'Cơm', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我吃一碗米饭。', examplePinyin: 'wǒ chī yì wǎn mǐfàn.', exampleVi: 'Tôi ăn một bát cơm.' },
      { id: 'zh-hsk1-l8-06', hanzi: '商店', pinyin: 'shāngdiàn', sinoVietnamese: 'THƯƠNG ĐIẾM', meaning: 'Cửa hàng, tiệm', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我去商店买东西。', examplePinyin: 'wǒ qù shāngdiàn mǎi dōngxi.', exampleVi: 'Tôi đến cửa hàng mua đồ.' },
      { id: 'zh-hsk1-l8-07', hanzi: '买', pinyin: 'mǎi', sinoVietnamese: 'MÃI', meaning: 'Mua', hskLevel: 1, posBadge: 'Động từ', exampleZh: '这个杯子多少钱？', examplePinyin: 'zhè ge bēizi duōshao qián?', exampleVi: 'Cái cốc này bao nhiêu tiền?' },
      { id: 'zh-hsk1-l8-08', hanzi: '个', pinyin: 'gè', sinoVietnamese: 'CÁ', meaning: 'Cái, chiếc (lượng từ chung)', hskLevel: 1, posBadge: 'Lượng từ', exampleZh: '一个人。', examplePinyin: 'yí gè rén.', exampleVi: 'Một người.' },
      { id: 'zh-hsk1-l8-09', hanzi: '杯子', pinyin: 'bēizi', sinoVietnamese: 'BÔI TỬ', meaning: 'Cái cốc, cái ly', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这里有一个杯子。', examplePinyin: 'zhèlǐ yǒu yí gè bēizi.', exampleVi: 'Ở đây có một chiếc cốc.' },
      { id: 'zh-hsk1-l8-10', hanzi: '这', pinyin: 'zhè', sinoVietnamese: 'GIÁ', meaning: 'Đây, này', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '这是谁的书？', examplePinyin: 'zhè shì shéi de shū?', exampleVi: 'Đây là sách của ai?' },
      { id: 'zh-hsk1-l8-11', hanzi: '多少', pinyin: 'duōshao', sinoVietnamese: 'ĐA THIỂU', meaning: 'Bao nhiêu', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '这本汉语书多少钱？', examplePinyin: 'zhè běn hànyǔ shū duōshao qián?', exampleVi: 'Cuốn sách tiếng Trung này bao nhiêu tiền?' },
      { id: 'zh-hsk1-l8-12', hanzi: '钱', pinyin: 'qián', sinoVietnamese: 'TIỀN', meaning: 'Tiền', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我没有钱。', examplePinyin: 'wǒ méiyǒu qián.', exampleVi: 'Tôi không có tiền.' },
      { id: 'zh-hsk1-l8-13', hanzi: '块', pinyin: 'kuài', sinoVietnamese: 'KHỐI', meaning: 'Đồng tệ (đơn vị tiền tệ khẩu ngữ)', hskLevel: 1, posBadge: 'Lượng từ', exampleZh: '五块钱。', examplePinyin: 'wǔ kuài qián.', exampleVi: 'Năm đồng tệ.' },
    ],
  },

  // BÀI 9: Con trai bạn làm việc ở đâu?
  {
    title: 'Con trai bạn làm việc ở đâu?',
    titleZh: '你儿子在哪儿工作？',
    words: [
      { id: 'zh-hsk1-l9-01', hanzi: '在', pinyin: 'zài', sinoVietnamese: 'TẠI', meaning: 'Ở, tại, đang', hskLevel: 1, posBadge: 'Giới từ', exampleZh: '他在家吗？', examplePinyin: 'tā zài jiā ma?', exampleVi: 'Anh ấy ở nhà không?' },
      { id: 'zh-hsk1-l9-02', hanzi: '哪儿', pinyin: 'nǎr', sinoVietnamese: 'NẢ NHI', meaning: 'Ở đâu, chỗ nào', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '医院在哪儿？', examplePinyin: 'yīyuàn zài nǎr?', exampleVi: 'Bệnh viện ở đâu?' },
      { id: 'zh-hsk1-l9-03', hanzi: '工作', pinyin: 'gōngzuò', sinoVietnamese: 'CÔNG TÁC', meaning: 'Công việc, làm việc', hskLevel: 1, posBadge: 'Động từ/Danh từ', exampleZh: '他在医院工作。', examplePinyin: 'tā zài yīyuàn gōngzuò.', exampleVi: 'Anh ấy làm việc ở bệnh viện.' },
      { id: 'zh-hsk1-l9-04', hanzi: '医院', pinyin: 'yīyuàn', sinoVietnamese: 'Y VIỆN', meaning: 'Bệnh viện', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这是北京最好的医院。', examplePinyin: 'zhè shì běijīng zuì hǎo de yīyuàn.', exampleVi: 'Đây là bệnh viện tốt nhất Bắc Kinh.' },
      { id: 'zh-hsk1-l9-05', hanzi: '医生', pinyin: 'yīshēng', sinoVietnamese: 'Y SINH', meaning: 'Bác sĩ', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我妈妈是医生。', examplePinyin: 'wǒ māma shì yīshēng.', exampleVi: 'Mẹ tôi là bác sĩ.' },
      { id: 'zh-hsk1-l9-06', hanzi: '小', pinyin: 'xiǎo', sinoVietnamese: 'TIỂU', meaning: 'Nhỏ, bé', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '小猫很可爱。', examplePinyin: 'xiǎo māo hěn kě\'ài.', exampleVi: 'Mèo con rất đáng yêu.' },
      { id: 'zh-hsk1-l9-07', hanzi: '猫', pinyin: 'māo', sinoVietnamese: 'MIÊU', meaning: 'Con mèo', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '树上有一只猫。', examplePinyin: 'shù shàng yǒu yì zhī māo.', exampleVi: 'Trên cây có một con mèo.' },
      { id: 'zh-hsk1-l9-08', hanzi: '狗', pinyin: 'gǒu', sinoVietnamese: 'CẨU', meaning: 'Con chó', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '那只小狗真漂亮。', examplePinyin: 'nà zhī xiǎogǒu zhēn piàoliang.', exampleVi: 'Con chó con kia thật đẹp.' },
      { id: 'zh-hsk1-l9-09', hanzi: '椅子', pinyin: 'yǐzi', sinoVietnamese: 'Y TỬ', meaning: 'Cái ghế', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '小狗在椅子下面。', examplePinyin: 'xiǎogǒu zài yǐzi xiàmian.', exampleVi: 'Con chó con ở dưới ghế.' },
      { id: 'zh-hsk1-l9-10', hanzi: '下面', pinyin: 'xiàmian', sinoVietnamese: 'HẠ DIỆN', meaning: 'Phía dưới, bên dưới', hskLevel: 1, posBadge: 'Danh từ phương vị', exampleZh: '椅子下面有什么？', examplePinyin: 'yǐzi xiàmian yǒu shénme?', exampleVi: 'Dưới ghế có cái gì?' },
    ],
  },

  // BÀI 10: Tôi có thể ngồi đây không?
  {
    title: 'Tôi có thể ngồi đây không?',
    titleZh: '我能坐这儿吗？',
    words: [
      { id: 'zh-hsk1-l10-01', hanzi: '桌子', pinyin: 'zhuōzi', sinoVietnamese: 'TRÁC TỬ', meaning: 'Cái bàn', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '桌子上有一本书。', examplePinyin: 'zhuōzi shang yǒu yì běn shū.', exampleVi: 'Trên bàn có một cuốn sách.' },
      { id: 'zh-hsk1-l10-02', hanzi: '上', pinyin: 'shàng', sinoVietnamese: 'THƯỢNG', meaning: 'Trên, lên', hskLevel: 1, posBadge: 'Danh từ phương vị', exampleZh: '电脑在桌子上。', examplePinyin: 'diànnǎo zài zhuōzi shang.', exampleVi: 'Máy tính ở trên bàn.' },
      { id: 'zh-hsk1-l10-03', hanzi: '电脑', pinyin: 'diànnǎo', sinoVietnamese: 'ĐIỆN NÃO', meaning: 'Máy tính', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我的电脑很好用。', examplePinyin: 'wǒ de diànnǎo hěn hǎoyòng.', exampleVi: 'Máy tính của tôi dùng rất tốt.' },
      { id: 'zh-hsk1-l10-04', hanzi: '里面', pinyin: 'lǐmian', sinoVietnamese: 'LÝ DIỆN', meaning: 'Bên trong', hskLevel: 1, posBadge: 'Danh từ phương vị', exampleZh: '房间里面没有人。', examplePinyin: 'fángjiān lǐmian méiyǒu rén.', exampleVi: 'Bên trong phòng không có người.' },
      { id: 'zh-hsk1-l10-05', hanzi: '能', pinyin: 'néng', sinoVietnamese: 'NĂNG', meaning: 'Có thể', hskLevel: 1, posBadge: 'Động từ năng nguyện', exampleZh: '我能坐这儿吗？', examplePinyin: 'wǒ néng zuò zhèr ma?', exampleVi: 'Tôi có thể ngồi đây không?' },
      { id: 'zh-hsk1-l10-06', hanzi: '坐', pinyin: 'zuò', sinoVietnamese: 'TỌA', meaning: 'Ngồi', hskLevel: 1, posBadge: 'Động từ', exampleZh: '请坐，喝茶。', examplePinyin: 'qǐng zuò, hē chá.', exampleVi: 'Xin mời ngồi, uống trà.' },
      { id: 'zh-hsk1-l10-07', hanzi: '请', pinyin: 'qǐng', sinoVietnamese: 'THỈNH', meaning: 'Xin, mời', hskLevel: 1, posBadge: 'Động từ', exampleZh: '请进！', examplePinyin: 'qǐng jìn!', exampleVi: 'Mời vào!' },
      { id: 'zh-hsk1-l10-08', hanzi: '这儿', pinyin: 'zhèr', sinoVietnamese: 'GIÁ NHI', meaning: 'Ở đây, chỗ này', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '这儿没有人。', examplePinyin: 'zhèr méiyǒu rén.', exampleVi: 'Ở đây không có ai.' },
      { id: 'zh-hsk1-l10-09', hanzi: '那儿', pinyin: 'nàr', sinoVietnamese: 'NA NHI', meaning: 'Chỗ kia, nơi đó', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '请坐那儿。', examplePinyin: 'qǐng zuò nàr.', exampleVi: 'Xin mời ngồi đằng kia.' },
      { id: 'zh-hsk1-l10-10', hanzi: '没有', pinyin: 'méiyǒu', sinoVietnamese: 'MỘT HỮU', meaning: 'Không có', hskLevel: 1, posBadge: 'Động từ', exampleZh: '这儿没有人坐。', examplePinyin: 'zhèr méiyǒu rén zuò.', exampleVi: 'Ở đây không có ai ngồi.' },
    ],
  },

  // BÀI 11: Bây giờ là mấy giờ?
  {
    title: 'Bây giờ là mấy giờ?',
    titleZh: '现在几点？',
    words: [
      { id: 'zh-hsk1-l11-01', hanzi: '现在', pinyin: 'xiànzài', sinoVietnamese: 'HIỆN TẠI', meaning: 'Bây giờ, hiện nay', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '现在几点了？', examplePinyin: 'xiànzài jǐ diǎn le?', exampleVi: 'Bây giờ là mấy giờ rồi?' },
      { id: 'zh-hsk1-l11-02', hanzi: '点', pinyin: 'diǎn', sinoVietnamese: 'ĐIỂM', meaning: 'Giờ', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '现在八点了。', examplePinyin: 'xiànzài bā diǎn le.', exampleVi: 'Bây giờ tám giờ rồi.' },
      { id: 'zh-hsk1-l11-03', hanzi: '分', pinyin: 'fēn', sinoVietnamese: 'PHÂN', meaning: 'Phút', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '八点十五分。', examplePinyin: 'bā diǎn shíwǔ fēn.', exampleVi: 'Tám giờ mười lăm phút.' },
      { id: 'zh-hsk1-l11-04', hanzi: '中午', pinyin: 'zhōngwǔ', sinoVietnamese: 'TRUNG NGỌ', meaning: 'Buổi trưa', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '中午我们一起吃饭。', examplePinyin: 'zhōngwǔ wǒmen yìqǐ chīfàn.', exampleVi: 'Buổi trưa chúng mình cùng ăn cơm nhé.' },
      { id: 'zh-hsk1-l11-05', hanzi: '吃饭', pinyin: 'chīfàn', sinoVietnamese: 'NGẬP PHẠN', meaning: 'Ăn cơm, dùng bữa', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你吃饭了吗？', examplePinyin: 'nǐ chīfàn le ma?', exampleVi: 'Bạn ăn cơm chưa?' },
      { id: 'zh-hsk1-l11-06', hanzi: '时候', pinyin: 'shíhou', sinoVietnamese: 'THỜI HẬU', meaning: 'Lúc, khi', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '你什么时候回家？', examplePinyin: 'nǐ shénme shíhou huí jiā?', exampleVi: 'Khi nào bạn về nhà?' },
      { id: 'zh-hsk1-l11-07', hanzi: '回', pinyin: 'huí', sinoVietnamese: 'HỒI', meaning: 'Về, quay lại', hskLevel: 1, posBadge: 'Động từ', exampleZh: '五点回学校。', examplePinyin: 'wǔ diǎn huí xuéxiào.', exampleVi: 'Năm giờ về trường.' },
      { id: 'zh-hsk1-l11-08', hanzi: '我们', pinyin: 'wǒmen', sinoVietnamese: 'NGÃ MÔN', meaning: 'Chúng tôi, chúng ta', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '我们都是好学生。', examplePinyin: 'wǒmen dōu shì hǎo xuéshēng.', exampleVi: 'Chúng tôi đều là học sinh chăm ngoan.' },
      { id: 'zh-hsk1-l11-09', hanzi: '电影', pinyin: 'diànyǐng', sinoVietnamese: 'ĐIỆN ẢNH', meaning: 'Phim ảnh', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '晚上去看电影。', examplePinyin: 'wǎnshang qù kàn diànyǐng.', exampleVi: 'Buổi tối đi xem phim.' },
      { id: 'zh-hsk1-l11-10', hanzi: '住', pinyin: 'zhù', sinoVietnamese: 'TRÚ', meaning: 'Ở, sinh sống', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你住在哪里？', examplePinyin: 'nǐ zhù zài nǎlǐ?', exampleVi: 'Bạn ở đâu?' },
      { id: 'zh-hsk1-l11-11', hanzi: '前', pinyin: 'qián', sinoVietnamese: 'TIỀN', meaning: 'Trước', hskLevel: 1, posBadge: 'Danh từ phương vị', exampleZh: '三天前。', examplePinyin: 'sān tiān qián.', exampleVi: 'Ba ngày trước.' },
    ],
  },

  // BÀI 12: Thời tiết ngày mai thế nào?
  {
    title: 'Thời tiết ngày mai thế nào?',
    titleZh: '明天天气怎么样？',
    words: [
      { id: 'zh-hsk1-l12-01', hanzi: '天气', pinyin: 'tiānqì', sinoVietnamese: 'THIÊN KHÍ', meaning: 'Thời tiết', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '今天天气真好。', examplePinyin: 'jīntiān tiānqì zhēn hǎo.', exampleVi: 'Hôm nay thời tiết thật đẹp.' },
      { id: 'zh-hsk1-l12-02', hanzi: '怎么样', pinyin: 'zěnmeyàng', sinoVietnamese: 'CHẨM MA DẠNG', meaning: 'Thế nào, ra sao', hskLevel: 1, posBadge: 'Đại từ', exampleZh: '你最近怎么样？', examplePinyin: 'nǐ zuìjìn zěnmeyàng?', exampleVi: 'Dạo này bạn thế nào?' },
      { id: 'zh-hsk1-l12-03', hanzi: '热', pinyin: 'rè', sinoVietnamese: 'NHIỆT', meaning: 'Nóng', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '夏天很热。', examplePinyin: 'xiàtiān hěn rè.', exampleVi: 'Mùa hè rất nóng.' },
      { id: 'zh-hsk1-l12-04', hanzi: '冷', pinyin: 'lěng', sinoVietnamese: 'LÃNH', meaning: 'Lạnh', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '今天有点儿冷。', examplePinyin: 'jīntiān yǒudiǎnr lěng.', exampleVi: 'Hôm nay hơi lạnh một chút.' },
      { id: 'zh-hsk1-l12-05', hanzi: '下雨', pinyin: 'xià yǔ', sinoVietnamese: 'HẠ VŨ', meaning: 'Mưa, đổ mưa', hskLevel: 1, posBadge: 'Động từ', exampleZh: '明天会下雨吗？', examplePinyin: 'míngtiān huì xià yǔ ma?', exampleVi: 'Ngày mai có mưa không?' },
      { id: 'zh-hsk1-l12-06', hanzi: '雨', pinyin: 'yǔ', sinoVietnamese: 'VŨ', meaning: 'Mưa', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '雨下得很大。', examplePinyin: 'yǔ xià de hěn dà.', exampleVi: 'Mưa rơi rất to.' },
      { id: 'zh-hsk1-l12-07', hanzi: '水', pinyin: 'shuǐ', sinoVietnamese: 'THỦY', meaning: 'Nước', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '多喝水对身体好。', examplePinyin: 'duō hē shuǐ duì shēntǐ hǎo.', exampleVi: 'Uống nhiều nước rất tốt cho cơ thể.' },
      { id: 'zh-hsk1-l12-08', hanzi: '水果', pinyin: 'shuǐguǒ', sinoVietnamese: 'THỦY QUẢ', meaning: 'Hoa quả, trái cây', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '多吃水果。', examplePinyin: 'duō chī shuǐguǒ.', exampleVi: 'Ăn nhiều hoa quả.' },
      { id: 'zh-hsk1-l12-09', hanzi: '身体', pinyin: 'shēntǐ', sinoVietnamese: 'THÂN THỂ', meaning: 'Thân thể, sức khỏe', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '你身体好吗？', examplePinyin: 'nǐ shēntǐ hǎo ma?', exampleVi: 'Sức khỏe bạn có tốt không?' },
      { id: 'zh-hsk1-l12-10', hanzi: '多', pinyin: 'duō', sinoVietnamese: 'ĐA', meaning: 'Nhiều', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '多看书。', examplePinyin: 'duō kàn shū.', exampleVi: 'Đọc nhiều sách.' },
      { id: 'zh-hsk1-l12-11', hanzi: '少', pinyin: 'shǎo', sinoVietnamese: 'THIỂU', meaning: 'Ít', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '话少一点。', examplePinyin: 'huà shǎo yìdiǎn.', exampleVi: 'Nói ít một chút.' },
      { id: 'zh-hsk1-l12-12', hanzi: '些', pinyin: 'xiē', sinoVietnamese: 'TIẾP', meaning: 'Một vài, một số', hskLevel: 1, posBadge: 'Lượng từ', exampleZh: '这些苹果很大。', examplePinyin: 'zhèxiē píngguǒ hěn dà.', exampleVi: 'Những quả táo này rất to.' },
    ],
  },

  // BÀI 13: Anh ấy đang học nấu món ăn Trung Quốc
  {
    title: 'Anh ấy đang học nấu món ăn Trung Quốc',
    titleZh: '他在学做中国菜呢',
    words: [
      { id: 'zh-hsk1-l13-01', hanzi: '喂', pinyin: 'wèi', sinoVietnamese: 'ỦY', meaning: 'A lô (khi nghe điện thoại)', hskLevel: 1, posBadge: 'Thán từ', exampleZh: '喂，王老师在吗？', examplePinyin: 'wèi, wáng lǎoshī zài ma?', exampleVi: 'A lô, cô Vương có ở đó không ạ?' },
      { id: 'zh-hsk1-l13-02', hanzi: '打电话', pinyin: 'dǎ diànhuà', sinoVietnamese: 'ĐẢ ĐIỆN THOẠI', meaning: 'Gọi điện thoại', hskLevel: 1, posBadge: 'Cụm động từ', exampleZh: '他在打电话呢。', examplePinyin: 'tā zài dǎ diànhuà ne.', exampleVi: 'Anh ấy đang gọi điện thoại đấy.' },
      { id: 'zh-hsk1-l13-03', hanzi: '电话', pinyin: 'diànhuà', sinoVietnamese: 'ĐIỆN THOẠI', meaning: 'Điện thoại', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '你的电话号码是多少？', examplePinyin: 'nǐ de diànhuà hàomǎ shì duōshao?', exampleVi: 'Số điện thoại của bạn là bao nhiêu?' },
      { id: 'zh-hsk1-l13-04', hanzi: '做', pinyin: 'zuò', sinoVietnamese: 'TỐ', meaning: 'Làm, nấu', hskLevel: 1, posBadge: 'Động từ', exampleZh: '做饭。', examplePinyin: 'zuò fàn.', exampleVi: 'Nấu cơm.' },
      { id: 'zh-hsk1-l13-05', hanzi: '睡觉', pinyin: 'shuì jiào', sinoVietnamese: 'THỤY GIÁC', meaning: 'Ngủ, đi ngủ', hskLevel: 1, posBadge: 'Động từ', exampleZh: '快去睡觉吧。', examplePinyin: 'kuài qù shuì jiào ba.', exampleVi: 'Mau đi ngủ đi.' },
      { id: 'zh-hsk1-l13-06', hanzi: '没', pinyin: 'méi', sinoVietnamese: 'MỘT', meaning: 'Chưa, không', hskLevel: 1, posBadge: 'Phó từ', exampleZh: '我没看那部电影。', examplePinyin: 'wǒ méi kàn nà bù diànyǐng.', exampleVi: 'Tôi chưa xem bộ phim đó.' },
      { id: 'zh-hsk1-l13-07', hanzi: '电视', pinyin: 'diànshì', sinoVietnamese: 'ĐIỆN THỊ', meaning: 'Tivi, truyền hình', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我们看电视吧。', examplePinyin: 'wǒmen kàn diànshì ba.', exampleVi: 'Chúng mình cùng xem tivi nhé.' },
      { id: 'zh-hsk1-l13-08', hanzi: '喜欢', pinyin: 'xǐhuan', sinoVietnamese: 'HỈ HOAN', meaning: 'Thích', hskLevel: 1, posBadge: 'Động từ', exampleZh: '我喜欢听音乐。', examplePinyin: 'wǒ xǐhuan tīng yīnyuè.', exampleVi: 'Tôi thích nghe âm nhạc.' },
      { id: 'zh-hsk1-l13-09', hanzi: '给', pinyin: 'gěi', sinoVietnamese: 'CẤP', meaning: 'Cho, gửi cho', hskLevel: 1, posBadge: 'Động từ/Giới từ', exampleZh: '我给他打电话。', examplePinyin: 'wǒ gěi tā dǎ diànhuà.', exampleVi: 'Tôi gọi điện thoại cho anh ấy.' },
    ],
  },

  // BÀI 14: Cô ấy đã mua không ít quần áo
  {
    title: 'Cô ấy đã mua không ít quần áo',
    titleZh: '她买了不少衣服',
    words: [
      { id: 'zh-hsk1-l14-01', hanzi: '东西', pinyin: 'dōngxi', sinoVietnamese: 'ĐÔNG TÂY', meaning: 'Đồ vật, thứ, đồ đạc', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这是什么东西？', examplePinyin: 'zhè shì shénme dōngxi?', exampleVi: 'Đây là đồ vật gì?' },
      { id: 'zh-hsk1-l14-02', hanzi: '一点儿', pinyin: 'yìdiǎnr', sinoVietnamese: 'NHẤT ĐIỂM NHI', meaning: 'Một chút, một ít', hskLevel: 1, posBadge: 'Lượng từ', exampleZh: '我想买一点儿水果。', examplePinyin: 'wǒ xiǎng mǎi yìdiǎnr shuǐguǒ.', exampleVi: 'Tôi muốn mua một ít trái cây.' },
      { id: 'zh-hsk1-l14-03', hanzi: '苹果', pinyin: 'píngguǒ', sinoVietnamese: 'BÌNH QUẢ', meaning: 'Quả táo', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '红苹果很好吃。', examplePinyin: 'hóng píngguǒ hěn hǎochī.', exampleVi: 'Táo đỏ rất ngon.' },
      { id: 'zh-hsk1-l14-04', hanzi: '看见', pinyin: 'kànjiàn', sinoVietnamese: 'KHÁN KIẾN', meaning: 'Nhìn thấy, trông thấy', hskLevel: 1, posBadge: 'Động từ', exampleZh: '我看见张老师了。', examplePinyin: 'wǒ kànjiàn zhāng lǎoshī le.', exampleVi: 'Tôi nhìn thấy thầy Trương rồi.' },
      { id: 'zh-hsk1-l14-05', hanzi: '先生', pinyin: 'xiānsheng', sinoVietnamese: 'TIÊN SINH', meaning: 'Ông, ngài, thầy, chồng', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '王先生不在家。', examplePinyin: 'wáng xiānsheng bú zài jiā.', exampleVi: 'Ông Vương không có ở nhà.' },
      { id: 'zh-hsk1-l14-06', hanzi: '衣服', pinyin: 'yīfu', sinoVietnamese: 'Y PHỤC', meaning: 'Quần áo', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '新衣服很漂亮。', examplePinyin: 'xīn yīfu hěn piàoliang.', exampleVi: 'Quần áo mới rất đẹp.' },
      { id: 'zh-hsk1-l14-07', hanzi: '开', pinyin: 'kāi', sinoVietnamese: 'KHAI', meaning: 'Mở, lái (xe)', hskLevel: 1, posBadge: 'Động từ', exampleZh: '开门 / 开车。', examplePinyin: 'kāi mén / kāi chē.', exampleVi: 'Mở cửa / Lái xe.' },
      { id: 'zh-hsk1-l14-08', hanzi: '车', pinyin: 'chē', sinoVietnamese: 'XA', meaning: 'Xe cộ, xe', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这辆车是谁的？', examplePinyin: 'zhè liàng chē shì shéi de?', exampleVi: 'Chiếc xe này là của ai?' },
      { id: 'zh-hsk1-l14-09', hanzi: '回来', pinyin: 'huílái', sinoVietnamese: 'HỒI LAI', meaning: 'Trở về, về đây', hskLevel: 1, posBadge: 'Động từ', exampleZh: '他下午回来。', examplePinyin: 'tā xiàwǔ huílái.', exampleVi: 'Anh ấy chiều nay trở về.' },
      { id: 'zh-hsk1-l14-10', hanzi: '分钟', pinyin: 'fēnzhōng', sinoVietnamese: 'PHÂN CHUNG', meaning: 'Phút (khoảng thời gian)', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '等我十分钟。', examplePinyin: 'děng wǒ shí fēnzhōng.', exampleVi: 'Đợi tôi mười phút.' },
      { id: 'zh-hsk1-l14-11', hanzi: '后', pinyin: 'hòu', sinoVietnamese: 'HẬU', meaning: 'Sau, phía sau', hskLevel: 1, posBadge: 'Danh từ phương vị', exampleZh: '五分钟后见。', examplePinyin: 'wǔ fēnzhōng hòu jiàn.', exampleVi: 'Năm phút nữa gặp lại.' },
    ],
  },

  // BÀI 15: Tôi đi máy bay đến
  {
    title: 'Tôi đi máy bay đến',
    titleZh: '我是坐飞机来的',
    words: [
      { id: 'zh-hsk1-l15-01', hanzi: '飞机', pinyin: 'fēijī', sinoVietnamese: 'PHI CƠ', meaning: 'Máy bay', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '坐飞机去北京。', examplePinyin: 'zuò fēijī qù běijīng.', exampleVi: 'Đi máy bay đến Bắc Kinh.' },
      { id: 'zh-hsk1-l15-02', hanzi: '出租车', pinyin: 'chūzūchē', sinoVietnamese: 'XUẤT TÔ XA', meaning: 'Xe taxi', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我们打出租车去吧。', examplePinyin: 'wǒmen dǎ chūzūchē qù ba.', exampleVi: 'Chúng mình bắt xe taxi đi nhé.' },
      { id: 'zh-hsk1-l15-03', hanzi: '高兴', pinyin: 'gāoxìng', sinoVietnamese: 'CAO HỨNG', meaning: 'Vui vẻ', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '今天很高兴。', examplePinyin: 'jīntiān hěn gāoxìng.', exampleVi: 'Hôm nay rất vui.' },
      { id: 'zh-hsk1-l15-04', hanzi: '听', pinyin: 'tīng', sinoVietnamese: 'THÍNH', meaning: 'Nghe', hskLevel: 1, posBadge: 'Động từ', exampleZh: '听音乐。', examplePinyin: 'tīng yīnyuè.', exampleVi: 'Nghe nhạc.' },
      { id: 'zh-hsk1-l15-05', hanzi: '饭馆', pinyin: 'fànguǎn', sinoVietnamese: 'PHẠN QUÁN', meaning: 'Nhà hàng, quán ăn', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '这家饭馆菜很好吃。', examplePinyin: 'zhè jiā fànguǎn cài hěn hǎochī.', exampleVi: 'Quán ăn này món nấu rất ngon.' },
      { id: 'zh-hsk1-l15-06', hanzi: '北京', pinyin: 'Běijīng', sinoVietnamese: 'BẮC KINH', meaning: 'Thủ đô Bắc Kinh', hskLevel: 1, posBadge: 'Danh từ riêng', exampleZh: '北京非常大。', examplePinyin: 'běijīng fēicháng dà.', exampleVi: 'Bắc Kinh cực kỳ rộng lớn.' },
      { id: 'zh-hsk1-l15-07', hanzi: '大学', pinyin: 'dàxué', sinoVietnamese: 'ĐẠI HỌC', meaning: 'Trường đại học', hskLevel: 1, posBadge: 'Danh từ', exampleZh: '我在北京大学学习。', examplePinyin: 'wǒ zài běijīng dàxué xuéxí.', exampleVi: 'Tôi học tập ở Đại học Bắc Kinh.' },
      { id: 'zh-hsk1-l15-08', hanzi: '大', pinyin: 'dà', sinoVietnamese: 'ĐẠI', meaning: 'To, lớn', hskLevel: 1, posBadge: 'Tính từ', exampleZh: '这个苹果很大。', examplePinyin: 'zhè ge píngguǒ hěn dà.', exampleVi: 'Quả táo này rất to.' },
      { id: 'zh-hsk1-l15-09', hanzi: '都', pinyin: 'dōu', sinoVietnamese: 'ĐÔ', meaning: 'Đều, tất cả', hskLevel: 1, posBadge: 'Phó từ', exampleZh: '我们都是好朋友。', examplePinyin: 'wǒmen dōu shì hǎo péngyou.', exampleVi: 'Chúng tôi đều là bạn tốt.' },
      { id: 'zh-hsk1-l15-10', hanzi: '来', pinyin: 'lái', sinoVietnamese: 'LAI', meaning: 'Đến, tới', hskLevel: 1, posBadge: 'Động từ', exampleZh: '你来我家玩吧。', examplePinyin: 'nǐ lái wǒ jiā wán ba.', exampleVi: 'Bạn đến nhà tôi chơi nhé.' },
    ],
  },
];

// Helper to chunk remaining levels (HSK 2-6)
function createLessonsForOtherLevels(
  level: number,
  words: ChineseWordItem[],
  lessonTitles: string[]
): HskLesson[] {
  const lessons: HskLesson[] = [];
  const wordsPerLesson = Math.ceil(words.length / lessonTitles.length);

  lessonTitles.forEach((title, idx) => {
    const lessonNum = idx + 1;
    const start = idx * wordsPerLesson;
    const end = start + wordsPerLesson;
    const slice = words.slice(start, end);
    const lessonWords: HskLessonWord[] = slice.map((w) => ({
      ...w,
      posBadge: w.topic || 'Từ vựng',
    }));

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

const HSK2_LESSON_TITLES = [
  'Đi máy bay đến Bắc Kinh', 'Sinh nhật vui vẻ!', 'Chúng ta đi xem phim nhé',
  'Công việc mới của bạn thế nào?', 'Tôi thích chơi bóng rổ', 'Bên ngoài trời đang mưa',
  'Bạn uống trà hay cà phê?', 'Căn phòng này rất sạch sẽ', 'Tôi bị cảm rồi',
  'Hãy giúp tôi một chút', 'Đi bằng tàu điện ngầm nhanh hơn', 'Chiếc áo này đắt quá',
  'Bạn học tiếng Trung bao lâu rồi?', 'Món vịt quay Bắc Kinh rất ngon', 'Hẹn gặp lại ở sân bay',
];

const HSK3_LESSON_TITLES = [
  'Kế hoạch du lịch mùa hè', 'Môi trường sống xung quanh ta', 'Thói quen sinh hoạt lành mạnh',
  'Phỏng vấn xin việc làm thêm', 'Văn hóa uống trà của người Hoa', 'Phương tiện giao thông hiện đại',
  'Mua sắm trực tuyến tiện lợi', 'Tình bạn thời đại học', 'Nỗ lực để đạt ước mơ',
  'Khám phá ẩm thực Tứ Xuyên', 'Bảo vệ động vật hoang dã', 'Thể thao nâng cao sức khỏe',
  'Âm nhạc và cuộc sống', 'Học tiếng Trung qua bài hát', 'Thành công bắt đầu từ kiên trì',
];

const HSK4_LESSON_TITLES = [
  'Tình yêu và hôn nhân', 'Bí quyết phỏng vấn thành công', 'Áp lực công việc và cách vượt qua',
  'Khoa học công nghệ và tương lai', 'Bảo vệ môi trường sinh thái', 'Nghệ thuật giao tiếp ứng xử',
  'Đọc sách mở mang trí tuệ', 'Hạnh phúc thực sự là gì?', 'Sự phát triển của kinh tế số',
  'Khám phá di sản Vạn Lý Trường Thành', 'Giáo dục trẻ em hiện đại', 'Sức mạnh của thái độ tích cực',
  'Văn hóa kinh doanh phương Đông', 'Khởi nghiệp trong thời đại mới', 'Chinh phục đỉnh cao HSK 4',
];

const HSK5_LESSON_TITLES = [
  'Triết lý nhân sinh Trung Hoa', 'Thương mại quốc tế và hội nhập', 'Tâm lý học hành vi con người',
  'Bảo tồn di sản văn hóa phi vật thể', 'Trí tuệ nhân tạo và việc làm', 'Nghệ thuật thư pháp và hội họa',
  'Chiến lược quản trị doanh nghiệp', 'Y học cổ truyền phương Đông', 'Biến đổi khí hậu toàn cầu',
  'Truyền thông đa phương tiện', 'Đô thị thông minh tương lai', 'Sức mạnh của tư duy phản biện',
  'Thành ngữ và điển tích lịch sử', 'Hùng biện và thuyết trình', 'Thành thạo văn phong học thuật',
];

const HSK6_LESSON_TITLES = [
  'Bác đại tinh thâm của Hán tự', 'Kinh tế chính trị vĩ mô', 'Văn học cổ điển và hiện đại',
  'Nghiên cứu ngôn ngữ học so sánh', 'Phân tích diễn ngôn học thuật', 'Triết học Lão Trang và Nho gia',
  'Nghệ thuật đàm phán cấp cao', 'Đổi mới sáng tạo công nghệ cao', 'Văn hóa Trà Đạo và Thiền tông',
  'Phê bình văn học nghệ thuật', 'Địa lý nhân văn và dân tộc học', 'Chính sách kinh tế xanh',
  'Luận bàn về giáo dục đại học', 'Dịch thuật nâng cao Trung - Việt', 'Chinh phục cấp độ HSK 6 xuất sắc',
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
    lessons: HSK1_CURRICULUM.map((item, idx) => ({
      id: `bai-${idx + 1}`,
      lessonNumber: idx + 1,
      title: item.title,
      titleZh: item.titleZh,
      wordCount: item.words.length,
      words: item.words,
    })),
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
    lessons: createLessonsForOtherLevels(2, hsk2Data as ChineseWordItem[], HSK2_LESSON_TITLES),
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
    lessons: createLessonsForOtherLevels(3, hsk3Data as ChineseWordItem[], HSK3_LESSON_TITLES),
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
    lessons: createLessonsForOtherLevels(4, hsk4Data as ChineseWordItem[], HSK4_LESSON_TITLES),
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
    lessons: createLessonsForOtherLevels(5, hsk5Data as ChineseWordItem[], HSK5_LESSON_TITLES),
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
    lessons: createLessonsForOtherLevels(6, hsk6Data as ChineseWordItem[], HSK6_LESSON_TITLES),
  },
};
