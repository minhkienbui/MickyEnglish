import hsk1Data from './chinese/hsk1.json';
import hsk2Data from './chinese/hsk2.json';
import hsk3Data from './chinese/hsk3.json';
import hsk4Data from './chinese/hsk4.json';
import hsk5Data from './chinese/hsk5.json';
import hsk6Data from './chinese/hsk6.json';
import hsk79Data from './chinese/hsk7-9.json';
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
  levelNumber: number | string;
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

// 15 BÀI HỌC CHUẨN GIÁO TRÌNH HSK 2 (CHUẨN BẢN QUYỀN HSK 3.0 NHAIHSK)
export const HSK2_CURRICULUM: { title: string; titleZh: string; words: HskLessonWord[] }[] = [
  // BÀI 1: Tháng 9 đi Bắc Kinh du lịch là tốt nhất
  {
    title: 'Tháng 9 đi Bắc Kinh du lịch là tốt nhất',
    titleZh: '九月去北京旅游最好',
    words: [
      { id: 'zh-hsk2-l1-01', hanzi: '旅游', pinyin: 'lǚyóu', sinoVietnamese: 'LỮ DU', meaning: 'Du lịch, đi chơi', hskLevel: 2, posBadge: 'Động từ', exampleZh: '九月去北京旅游最好。', examplePinyin: 'jiǔ yuè qù běijīng lǚyóu zuì hǎo.', exampleVi: 'Tháng chín đi Bắc Kinh du lịch là tốt nhất.' },
      { id: 'zh-hsk2-l1-02', hanzi: '觉得', pinyin: 'juéde', sinoVietnamese: 'GIÁC ĐẮC', meaning: 'Cảm thấy, thấy rằng', hskLevel: 2, posBadge: 'Động từ', exampleZh: '我觉得九月的北京天气最好。', examplePinyin: 'wǒ juéde jiǔ yuè de běijīng tiānqì zuì hǎo.', exampleVi: 'Tôi thấy thời tiết Bắc Kinh tháng chín là đẹp nhất.' },
      { id: 'zh-hsk2-l1-03', hanzi: '最', pinyin: 'zuì', sinoVietnamese: 'TỐI', meaning: 'Nhất (so sánh nhất)', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '我最喜欢吃中国菜。', examplePinyin: 'wǒ zuì xǐhuan chī zhōngguó cài.', exampleVi: 'Tôi thích ăn món ăn Trung Quốc nhất.' },
      { id: 'zh-hsk2-l1-04', hanzi: '为什么', pinyin: 'wèishénme', sinoVietnamese: 'VI THẬP MA', meaning: 'Tại sao, vì sao', hskLevel: 2, posBadge: 'Đại từ', exampleZh: '你为什么喜欢秋天？', examplePinyin: 'nǐ wèishénme xǐhuan qiūtiān?', exampleVi: 'Tại sao bạn thích mùa thu?' },
      { id: 'zh-hsk2-l1-05', hanzi: '运动', pinyin: 'yùndòng', sinoVietnamese: 'VẬN ĐỘNG', meaning: 'Vận động, thể thao', hskLevel: 2, posBadge: 'Danh từ/Động từ', exampleZh: '多运动对身体好。', examplePinyin: 'duō yùndòng duì shēntǐ hǎo.', exampleVi: 'Vận động nhiều rất tốt cho sức khỏe.' },
      { id: 'zh-hsk2-l1-06', hanzi: '踢足球', pinyin: 'tī zúqiú', sinoVietnamese: 'THÍCH TÚC CẦU', meaning: 'Đá bóng, đá banh', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '下午我们一起去踢足球吧。', examplePinyin: 'xiàwǔ wǒmen yìqǐ qù tī zúqiú ba.', exampleVi: 'Chiều nay chúng mình cùng đi đá bóng nhé.' },
      { id: 'zh-hsk2-l1-07', hanzi: '一起', pinyin: 'yìqǐ', sinoVietnamese: 'NHẤT KHỞI', meaning: 'Cùng nhau, cùng', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '我们一起走吧。', examplePinyin: 'wǒmen yìqǐ zǒu ba.', exampleVi: 'Chúng ta cùng đi thôi.' },
      { id: 'zh-hsk2-l1-08', hanzi: '要', pinyin: 'yào', sinoVietnamese: 'YẾU', meaning: 'Muốn, cần, sắp', hskLevel: 2, posBadge: 'Động từ', exampleZh: '我要买两张飞机票。', examplePinyin: 'wǒ yào mǎi liǎng zhāng fēijī piào.', exampleVi: 'Tôi muốn mua hai vé máy bay.' },
      { id: 'zh-hsk2-l1-09', hanzi: '新', pinyin: 'xīn', sinoVietnamese: 'TÂN', meaning: 'Mới', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '这是我的新自行车。', examplePinyin: 'zhè shì wǒ de xīn zìxíngchē.', exampleVi: 'Đây là chiếc xe đạp mới của tôi.' },
      { id: 'zh-hsk2-l1-10', hanzi: '它', pinyin: 'tā', sinoVietnamese: 'THA', meaning: 'Nó (chỉ con vật, đồ vật)', hskLevel: 2, posBadge: 'Đại từ', exampleZh: '小猫在哪里？它在桌子下。', examplePinyin: 'xiǎo māo zài nǎlǐ? tā zài zhuōzi xià.', exampleVi: 'Mèo con ở đâu? Nó ở dưới gầm bàn.' },
      { id: 'zh-hsk2-l1-11', hanzi: '眼睛', pinyin: 'yǎnjing', sinoVietnamese: 'NHÃN TINH', meaning: 'Mắt, đôi mắt', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '它的眼睛真漂亮。', examplePinyin: 'tā de yǎnjing zhēn piàoliang.', exampleVi: 'Đôi mắt của nó thật đẹp.' },
      { id: 'zh-hsk2-l1-12', hanzi: '九月', pinyin: 'jiǔ yuè', sinoVietnamese: 'CỬU NGUYỆT', meaning: 'Tháng chín', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '九月开学。', examplePinyin: 'jiǔ yuè kāixué.', exampleVi: 'Tháng chín bắt đầu khai giảng.' },
    ],
  },

  // BÀI 2: Tôi mỗi ngày 6 giờ thức dậy
  {
    title: 'Tôi mỗi ngày 6 giờ thức dậy',
    titleZh: '我每天六点起床',
    words: [
      { id: 'zh-hsk2-l2-01', hanzi: '生病', pinyin: 'shēng bìng', sinoVietnamese: 'SINH BỆNH', meaning: 'Bị ốm, ngã bệnh', hskLevel: 2, posBadge: 'Động từ', exampleZh: '他生病住院了。', examplePinyin: 'tā shēng bìng zhùyuàn le.', exampleVi: 'Anh ấy bị ốm phải nhập viện rồi.' },
      { id: 'zh-hsk2-l2-02', hanzi: '每', pinyin: 'měi', sinoVietnamese: 'MỖI', meaning: 'Mỗi, từng', hskLevel: 2, posBadge: 'Đại từ', exampleZh: '我每天六点起床。', examplePinyin: 'wǒ měitiān liù diǎn qǐchuáng.', exampleVi: 'Tôi thức dậy lúc sáu giờ mỗi ngày.' },
      { id: 'zh-hsk2-l2-03', hanzi: '早上', pinyin: 'zǎoshang', sinoVietnamese: 'TẢO THƯỢNG', meaning: 'Buổi sáng', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '早上空气很新鲜。', examplePinyin: 'zǎoshang kōngqì hěn xīnxiān.', exampleVi: 'Buổi sáng không khí rất trong lành.' },
      { id: 'zh-hsk2-l2-04', hanzi: '跑步', pinyin: 'pǎo bù', sinoVietnamese: 'BÀO BỘ', meaning: 'Chạy bộ', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '他喜欢在公园跑步。', examplePinyin: 'tā xǐhuan zài gōngyuán pǎo bù.', exampleVi: 'Anh ấy thích chạy bộ trong công viên.' },
      { id: 'zh-hsk2-l2-05', hanzi: '起床', pinyin: 'qǐ chuáng', sinoVietnamese: 'KHỞI SÀNG', meaning: 'Thức dậy, rời giường', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '你几点起床？', examplePinyin: 'nǐ jǐ diǎn qǐ chuáng?', exampleVi: 'Mấy giờ bạn thức dậy?' },
      { id: 'zh-hsk2-l2-06', hanzi: '药', pinyin: 'yào', sinoVietnamese: 'DƯỢC', meaning: 'Thuốc', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '别忘了吃药。', examplePinyin: 'bié wàng le chī yào.', exampleVi: 'Đừng quên uống thuốc nhé.' },
      { id: 'zh-hsk2-l2-07', hanzi: '出院', pinyin: 'chū yuàn', sinoVietnamese: 'XUẤT VIỆN', meaning: 'Xuất viện, ra viện', hskLevel: 2, posBadge: 'Động từ', exampleZh: '医生说下周可以出院。', examplePinyin: 'yīshēng shuō xià zhōu kěyǐ chū yuàn.', exampleVi: 'Bác sĩ bảo tuần sau có thể xuất viện.' },
      { id: 'zh-hsk2-l2-08', hanzi: '高', pinyin: 'gāo', sinoVietnamese: 'CAO', meaning: 'Cao', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '大卫有一米八高。', examplePinyin: 'dàwèi yǒu yì mǐ bā gāo.', exampleVi: 'David cao một mét tám.' },
      { id: 'zh-hsk2-l2-09', hanzi: '米', pinyin: 'mǐ', sinoVietnamese: 'MỄ', meaning: 'Mét (đơn vị đo chiều dài)', hskLevel: 2, posBadge: 'Lượng từ', exampleZh: '一百米跑。', examplePinyin: 'yì bǎi mǐ pǎo.', exampleVi: 'Chạy 100 mét.' },
      { id: 'zh-hsk2-l2-10', hanzi: '知道', pinyin: 'zhīdào', sinoVietnamese: 'TRI ĐẠO', meaning: 'Biết, nắm rõ', hskLevel: 2, posBadge: 'Động từ', exampleZh: '我知道这件事情。', examplePinyin: 'wǒ zhīdào zhè jiàn shìqing.', exampleVi: 'Tôi biết chuyện này rồi.' },
      { id: 'zh-hsk2-l2-11', hanzi: '休息', pinyin: 'xiūxi', sinoVietnamese: 'HƯU TỨC', meaning: 'Nghỉ ngơi', hskLevel: 2, posBadge: 'Động từ', exampleZh: '累了就休息一会儿。', examplePinyin: 'lèi le jiù xiūxi yíhuìr.', exampleVi: 'Mệt rồi thì nghỉ ngơi một lát.' },
      { id: 'zh-hsk2-l2-12', hanzi: '忙', pinyin: 'máng', sinoVietnamese: 'MANG', meaning: 'Bận rộn, bận', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '最近你忙不忙？', examplePinyin: 'zuìjìn nǐ máng bù máng?', exampleVi: 'Dạo này bạn có bận không?' },
      { id: 'zh-hsk2-l2-13', hanzi: '时间', pinyin: 'shíjiān', sinoVietnamese: 'THỜI GIAN', meaning: 'Thời gian', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '我没有时间。', examplePinyin: 'wǒ méiyǒu shíjiān.', exampleVi: 'Tôi không có thời gian.' },
    ],
  },

  // BÀI 3: Cái màu đỏ bên trái là của tôi
  {
    title: 'Cái màu đỏ bên trái là của tôi',
    titleZh: '左边那个红色的是我的',
    words: [
      { id: 'zh-hsk2-l3-01', hanzi: '手表', pinyin: 'shǒubiǎo', sinoVietnamese: 'THỦ BIỂU', meaning: 'Đồng hồ đeo tay', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '这块手表是新买的。', examplePinyin: 'zhè kuài shǒubiǎo shì xīn mǎi de.', exampleVi: 'Chiếc đồng hồ này là mới mua.' },
      { id: 'zh-hsk2-l3-02', hanzi: '千', pinyin: 'qiān', sinoVietnamese: 'THIÊN', meaning: 'Nghìn, ngàn (1.000)', hskLevel: 2, posBadge: 'Số từ', exampleZh: '三千块钱。', examplePinyin: 'sān qiān kuài qián.', exampleVi: 'Ba nghìn đồng tệ.' },
      { id: 'zh-hsk2-l3-03', hanzi: '报纸', pinyin: 'bàozhǐ', sinoVietnamese: 'BÁO CHỈ', meaning: 'Tờ báo, nhật báo', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '我看今天的报纸。', examplePinyin: 'wǒ kàn jīntiān de bàozhǐ.', exampleVi: 'Tôi đọc tờ báo hôm nay.' },
      { id: 'zh-hsk2-l3-04', hanzi: '送', pinyin: 'sòng', sinoVietnamese: 'TỐNG', meaning: 'Tặng, tiễn, giao', hskLevel: 2, posBadge: 'Động từ', exampleZh: '这是送给你的礼物。', examplePinyin: 'zhè shì sòng gěi nǐ de lǐwù.', exampleVi: 'Đây là món quà tặng cho bạn.' },
      { id: 'zh-hsk2-l3-05', hanzi: '一下', pinyin: 'yíxià', sinoVietnamese: 'NHẤT HẠ', meaning: 'Một lát, một chút', hskLevel: 2, posBadge: 'Lượng từ', exampleZh: '等我一下。', examplePinyin: 'děng wǒ yíxià.', exampleVi: 'Đợi tôi một chút.' },
      { id: 'zh-hsk2-l3-06', hanzi: '牛奶', pinyin: 'niúnǎi', sinoVietnamese: 'NGƯU NÃI', meaning: 'Sữa bò', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '每天喝一杯牛奶。', examplePinyin: 'měitiān hē yì bēi niúnǎi.', exampleVi: 'Mỗi ngày uống một cốc sữa bò.' },
      { id: 'zh-hsk2-l3-07', hanzi: '房间', pinyin: 'fángjiān', sinoVietnamese: 'PHÒNG GIAN', meaning: 'Căn phòng', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '房间很干净。', examplePinyin: 'fángjiān hěn gānjìng.', exampleVi: 'Căn phòng rất sạch sẽ.' },
      { id: 'zh-hsk2-l3-08', hanzi: '丈夫', pinyin: 'zhàngfu', sinoVietnamese: 'TRƯỢNG PHU', meaning: 'Chồng', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '她丈夫在北京工作。', examplePinyin: 'tā zhàngfu zài běijīng gōngzuò.', exampleVi: 'Chồng cô ấy làm việc ở Bắc Kinh.' },
      { id: 'zh-hsk2-l3-09', hanzi: '旁边', pinyin: 'pángbiān', sinoVietnamese: 'BÀNG BIÊN', meaning: 'Bên cạnh', hskLevel: 2, posBadge: 'Danh từ phương vị', exampleZh: '学校旁边有一家书店。', examplePinyin: 'xuéxiào pángbiān yǒu yì jiā shūdiàn.', exampleVi: 'Bên cạnh trường học có một hiệu sách.' },
      { id: 'zh-hsk2-l3-10', hanzi: '真', pinyin: 'zhēn', sinoVietnamese: 'CHÂN', meaning: 'Thật, thật là', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '今天真冷啊！', examplePinyin: 'jīntiān zhēn lěng a!', exampleVi: 'Hôm nay thật là lạnh!' },
      { id: 'zh-hsk2-l3-11', hanzi: '颜色', pinyin: 'yánsè', sinoVietnamese: 'NHAN SẮC', meaning: 'Màu sắc', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '你喜欢什么颜色？', examplePinyin: 'nǐ xǐhuan shénme yánsè?', exampleVi: 'Bạn thích màu sắc gì?' },
      { id: 'zh-hsk2-l3-12', hanzi: '粉色', pinyin: 'fěnsè', sinoVietnamese: 'PHẤN SẮC', meaning: 'Màu hồng phấn', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '她穿粉色的衣服。', examplePinyin: 'tā chuān fěnsè de yīfu.', exampleVi: 'Cô ấy mặc chiếc áo màu hồng phấn.' },
      { id: 'zh-hsk2-l3-13', hanzi: '左边', pinyin: 'zuǒbian', sinoVietnamese: 'TẢ BIÊN', meaning: 'Bên trái, phía trái', hskLevel: 2, posBadge: 'Danh từ phương vị', exampleZh: '左边那个人是谁？', examplePinyin: 'zuǒbian nà ge rén shì shéi?', exampleVi: 'Người ở bên trái kia là ai?' },
      { id: 'zh-hsk2-l3-14', hanzi: '红色', pinyin: 'hóngsè', sinoVietnamese: 'HỒNG SẮC', meaning: 'Màu đỏ', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '红色代表喜庆。', examplePinyin: 'hóngsè dàibiǎo xǐqìng.', exampleVi: 'Màu đỏ tượng trưng cho hỷ sự.' },
    ],
  },

  // BÀI 4: Công việc này là anh ấy giới thiệu cho tôi
  {
    title: 'Công việc này là anh ấy giới thiệu cho tôi',
    titleZh: '这个工作是他帮我介绍的',
    words: [
      { id: 'zh-hsk2-l4-01', hanzi: '生日', pinyin: 'shēngrì', sinoVietnamese: 'SINH NHẬT', meaning: 'Ngày sinh nhật', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '祝你生日快乐！', examplePinyin: 'zhù nǐ shēngrì kuàilè!', exampleVi: 'Chúc bạn sinh nhật vui vẻ!' },
      { id: 'zh-hsk2-l4-02', hanzi: '快乐', pinyin: 'kuàilè', sinoVietnamese: 'KHOÁI LẠC', meaning: 'Vui vẻ, hạnh phúc', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '天天快乐。', examplePinyin: 'tiāntiān kuàilè.', exampleVi: 'Mỗi ngày đều vui vẻ.' },
      { id: 'zh-hsk2-l4-03', hanzi: '接', pinyin: 'jiē', sinoVietnamese: 'TIẾP', meaning: 'Đón, nhận (điện thoại)', hskLevel: 2, posBadge: 'Động từ', exampleZh: '我去机场接朋友。', examplePinyin: 'wǒ qù jīchǎng jiē péngyou.', exampleVi: 'Tôi đến sân bay đón bạn.' },
      { id: 'zh-hsk2-l4-04', hanzi: '晚上', pinyin: 'wǎnshang', sinoVietnamese: 'VÃN THƯỢNG', meaning: 'Buổi tối', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '晚上我们在家吃饭。', examplePinyin: 'wǎnshang wǒmen zài jiā chīfàn.', exampleVi: 'Buổi tối chúng tôi ăn cơm ở nhà.' },
      { id: 'zh-hsk2-l4-05', hanzi: '问', pinyin: 'wèn', sinoVietnamese: 'VẤN', meaning: 'Hỏi', hskLevel: 2, posBadge: 'Động từ', exampleZh: '请问，图书馆在哪儿？', examplePinyin: 'qǐngwèn, túshūguǎn zài nǎr?', exampleVi: 'Xin hỏi, thư viện ở đâu ạ?' },
      { id: 'zh-hsk2-l4-06', hanzi: '非常', pinyin: 'fēicháng', sinoVietnamese: 'PHI THƯỜNG', meaning: 'Vô cùng, hết sức, rất', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '我非常喜欢汉语。', examplePinyin: 'wǒ fēicháng xǐhuan hànyǔ.', exampleVi: 'Tôi vô cùng yêu thích tiếng Trung.' },
      { id: 'zh-hsk2-l4-07', hanzi: '开始', pinyin: 'kāishǐ', sinoVietnamese: 'KHAI THỦY', meaning: 'Bắt đầu', hskLevel: 2, posBadge: 'Động từ', exampleZh: '考试开始了。', examplePinyin: 'kǎoshì kāishǐ le.', exampleVi: 'Kỳ thi bắt đầu rồi.' },
      { id: 'zh-hsk2-l4-08', hanzi: '已经', pinyin: 'yǐjīng', sinoVietnamese: 'DĨ KINH', meaning: 'Đã, rồi', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '我已经吃饱了。', examplePinyin: 'wǒ yǐjīng chī bǎo le.', exampleVi: 'Tôi đã ăn no rồi.' },
      { id: 'zh-hsk2-l4-09', hanzi: '长', pinyin: 'cháng', sinoVietnamese: 'TRƯỜNG', meaning: 'Dài', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '这条路很长。', examplePinyin: 'zhè tiáo lù hěn cháng.', exampleVi: 'Con đường này rất dài.' },
      { id: 'zh-hsk2-l4-10', hanzi: '两', pinyin: 'liǎng', sinoVietnamese: 'LƯỠNG', meaning: 'Hai (dùng trước lượng từ)', hskLevel: 2, posBadge: 'Số từ', exampleZh: '两个星期。', examplePinyin: 'liǎng gè xīngqī.', exampleVi: 'Hai tuần lễ.' },
      { id: 'zh-hsk2-l4-11', hanzi: '帮', pinyin: 'bāng', sinoVietnamese: 'BANG', meaning: 'Giúp, đỡ', hskLevel: 2, posBadge: 'Động từ', exampleZh: '请帮帮我。', examplePinyin: 'qǐng bāng bāng wǒ.', exampleVi: 'Xin hãy giúp tôi với.' },
      { id: 'zh-hsk2-l4-12', hanzi: '介绍', pinyin: 'jièshào', sinoVietnamese: 'GIỚI THIỆU', meaning: 'Giới thiệu', hskLevel: 2, posBadge: 'Động từ', exampleZh: '我来介绍一下。', examplePinyin: 'wǒ lái jièshào yíxià.', exampleVi: 'Tôi xin giới thiệu một chút.' },
    ],
  },

  // BÀI 5: Vậy mua chiếc này đi
  {
    title: 'Vậy mua chiếc này đi',
    titleZh: '就买这件吧',
    words: [
      { id: 'zh-hsk2-l5-01', hanzi: '外面', pinyin: 'wàimiàn', sinoVietnamese: 'NGOẠI DIỆN', meaning: 'Bên ngoài, phía ngoài', hskLevel: 2, posBadge: 'Danh từ phương vị', exampleZh: '外面下大雪了。', examplePinyin: 'wàimiàn xià dàxuě le.', exampleVi: 'Bên ngoài tuyết rơi lớn rồi.' },
      { id: 'zh-hsk2-l5-02', hanzi: '准备', pinyin: 'zhǔnbèi', sinoVietnamese: 'CHUẨN BỊ', meaning: 'Chuẩn bị', hskLevel: 2, posBadge: 'Động từ', exampleZh: '准备好了吗？', examplePinyin: 'zhǔnbèi hǎo le ma?', exampleVi: 'Đã chuẩn bị xong chưa?' },
      { id: 'zh-hsk2-l5-03', hanzi: '就', pinyin: 'jiù', sinoVietnamese: 'TỰU', meaning: 'Thì, liền, ngay', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '就买这件吧。', examplePinyin: 'jiù mǎi zhè jiàn ba.', exampleVi: 'Vậy mua chiếc này đi.' },
      { id: 'zh-hsk2-l5-04', hanzi: '鱼', pinyin: 'yú', sinoVietnamese: 'NGƯ', meaning: 'Con cá', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '红烧鱼很好吃。', examplePinyin: 'hóngshāo yú hěn hǎochī.', exampleVi: 'Món cá kho rất ngon.' },
      { id: 'zh-hsk2-l5-05', hanzi: '件', pinyin: 'jiàn', sinoVietnamese: 'KIỆN', meaning: 'Chiếc, cái, vụ (lượng từ quần áo, sự việc)', hskLevel: 2, posBadge: 'Lượng từ', exampleZh: '这件衣服多少钱？', examplePinyin: 'zhè jiàn yīfu duōshao qián?', exampleVi: 'Chiếc áo này bao nhiêu tiền?' },
      { id: 'zh-hsk2-l5-06', hanzi: '还', pinyin: 'hái', sinoVietnamese: 'HOÀN', meaning: 'Còn, vẫn còn', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '他还在教室。', examplePinyin: 'tā hái zài jiàoshì.', exampleVi: 'Anh ấy vẫn còn ở trong lớp học.' },
      { id: 'zh-hsk2-l5-07', hanzi: '可以', pinyin: 'kěyǐ', sinoVietnamese: 'KHẢ DĨ', meaning: 'Có thể, được, tạm ổn', hskLevel: 2, posBadge: 'Động từ năng nguyện', exampleZh: '这件还可以。', examplePinyin: 'zhè jiàn kěyǐ.', exampleVi: 'Chiếc này cũng tạm được.' },
      { id: 'zh-hsk2-l5-08', hanzi: '不错', pinyin: 'búcuò', sinoVietnamese: 'BẤT THÁC', meaning: 'Không tồi, khá tốt', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '他的汉语真不错。', examplePinyin: 'tā de hànyǔ zhēn búcuò.', exampleVi: 'Tiếng Trung của anh ấy khá tốt đấy.' },
      { id: 'zh-hsk2-l5-09', hanzi: '考试', pinyin: 'kǎoshì', sinoVietnamese: 'KHẢO THÍ', meaning: 'Kỳ thi, thi cử', hskLevel: 2, posBadge: 'Danh từ/Động từ', exampleZh: '下周有一场HSK考试。', examplePinyin: 'xià zhōu yǒu yì chǎng HSK kǎoshì.', exampleVi: 'Tuần sau có một kỳ thi HSK.' },
      { id: 'zh-hsk2-l5-10', hanzi: '意思', pinyin: 'yìsi', sinoVietnamese: 'Ý TỨ', meaning: 'Ý nghĩa, thú vị', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '这本书真有意思。', examplePinyin: 'zhè běn shū zhēn yǒu yìsi.', exampleVi: 'Cuốn sách này thật thú vị.' },
      { id: 'zh-hsk2-l5-11', hanzi: '咖啡', pinyin: 'kāfēi', sinoVietnamese: 'CA PHÊ', meaning: 'Cà phê', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '我想喝一杯热咖啡。', examplePinyin: 'wǒ xiǎng hē yì bēi rè kāfēi.', exampleVi: 'Tôi muốn uống một tách cà phê nóng.' },
      { id: 'zh-hsk2-l5-12', hanzi: '对', pinyin: 'duì', sinoVietnamese: 'ĐỐI', meaning: 'Đúng; đối với', hskLevel: 2, posBadge: 'Tính từ/Giới từ', exampleZh: '喝牛奶对身体好。', examplePinyin: 'hē niúnǎi duì shēntǐ hǎo.', exampleVi: 'Uống sữa bò rất tốt cho cơ thể.' },
      { id: 'zh-hsk2-l5-13', hanzi: '以后', pinyin: 'yǐhòu', sinoVietnamese: 'DĨ HẬU', meaning: 'Sau này, sau khi', hskLevel: 2, posBadge: 'Danh từ phương vị', exampleZh: '吃饭以后去散步。', examplePinyin: 'chīfàn yǐhòu qù sànbù.', exampleVi: 'Sau khi ăn cơm thì đi dạo.' },
    ],
  },

  // BÀI 6: Sao bạn không ăn nữa?
  {
    title: 'Sao bạn không ăn nữa?',
    titleZh: '你怎么不吃了？',
    words: [
      { id: 'zh-hsk2-l6-01', hanzi: '门', pinyin: 'mén', sinoVietnamese: 'MÔN', meaning: 'Cánh cửa', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '请把门关上。', examplePinyin: 'qǐng bǎ mén guān shàng.', exampleVi: 'Xin hãy đóng cửa lại.' },
      { id: 'zh-hsk2-l6-02', hanzi: '外', pinyin: 'wài', sinoVietnamese: 'NGOẠI', meaning: 'Bên ngoài', hskLevel: 2, posBadge: 'Danh từ phương vị', exampleZh: '门外有人。', examplePinyin: 'mén wài yǒu rén.', exampleVi: 'Bên ngoài cửa có người.' },
      { id: 'zh-hsk2-l6-03', hanzi: '自行车', pinyin: 'zìxíngchē', sinoVietnamese: 'TỰ HÀNH XA', meaning: 'Xe đạp', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '骑自行车去学校。', examplePinyin: 'qí zìxíngchē qù xuéxiào.', exampleVi: 'Đạp xe đạp đến trường.' },
      { id: 'zh-hsk2-l6-04', hanzi: '羊肉', pinyin: 'yángròu', sinoVietnamese: 'DƯƠNG NHỤC', meaning: 'Thịt dê, thịt cừu', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '北京涮羊肉很出名。', examplePinyin: 'běijīng shuàn yángròu hěn chūmíng.', exampleVi: 'Món lẩu nhúng thịt cừu Bắc Kinh rất nổi tiếng.' },
      { id: 'zh-hsk2-l6-05', hanzi: '面条', pinyin: 'miàntiáo', sinoVietnamese: 'MIẾN ĐIỀU', meaning: 'Mì sợi, bún mì', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '中午我吃面条。', examplePinyin: 'zhōngwǔ wǒ chī miàntiáo.', exampleVi: 'Buổi trưa tôi ăn mì sợi.' },
      { id: 'zh-hsk2-l6-06', hanzi: '打篮球', pinyin: 'dǎ lánqiú', sinoVietnamese: 'ĐẢ LAM CẦU', meaning: 'Chơi bóng rổ', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '星期六去打篮球。', examplePinyin: 'xīngqīliù qù dǎ lánqiú.', exampleVi: 'Thứ bảy đi chơi bóng rổ.' },
      { id: 'zh-hsk2-l6-07', hanzi: '因为', pinyin: 'yīnwèi', sinoVietnamese: 'NHÂN VI', meaning: 'Bởi vì, do', hskLevel: 2, posBadge: 'Liên từ', exampleZh: '因为下雨，所以没去。', examplePinyin: 'yīnwèi xià yǔ, suǒyǐ méi qù.', exampleVi: 'Bởi vì trời mưa nên không đi.' },
      { id: 'zh-hsk2-l6-08', hanzi: '所以', pinyin: 'suǒyǐ', sinoVietnamese: 'SỞ DĨ', meaning: 'Cho nên, vì thế', hskLevel: 2, posBadge: 'Liên từ', exampleZh: '所以我很开心。', examplePinyin: 'suǒyǐ wǒ hěn kāixīn.', exampleVi: 'Cho nên tôi rất vui.' },
      { id: 'zh-hsk2-l6-09', hanzi: '游泳', pinyin: 'yóu yǒng', sinoVietnamese: 'DU VỊNH', meaning: 'Bơi lội, bơi', hskLevel: 2, posBadge: 'Động từ', exampleZh: '夏天去游泳。', examplePinyin: 'xiàtiān qù yóu yǒng.', exampleVi: 'Mùa hè đi bơi lội.' },
      { id: 'zh-hsk2-l6-10', hanzi: '经常', pinyin: 'jīngcháng', sinoVietnamese: 'KINH THƯỜNG', meaning: 'Thường xuyên', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '他经常去图书馆。', examplePinyin: 'tā jīngcháng qù túshūguǎn.', exampleVi: 'Anh ấy thường xuyên đến thư viện.' },
      { id: 'zh-hsk2-l6-11', hanzi: '公斤', pinyin: 'gōngjīn', sinoVietnamese: 'CÔNG CÂN', meaning: 'Kilôgam (kg)', hskLevel: 2, posBadge: 'Lượng từ', exampleZh: '五公斤苹果。', examplePinyin: 'wǔ gōngjīn píngguǒ.', exampleVi: 'Năm kilôgam táo.' },
    ],
  },

  // BÀI 7: Nhà bạn cách công ty có xa không?
  {
    title: 'Nhà bạn cách công ty có xa không?',
    titleZh: '你家离公司远吗？',
    words: [
      { id: 'zh-hsk2-l7-01', hanzi: '教室', pinyin: 'jiàoshì', sinoVietnamese: 'GIÁO THẤT', meaning: 'Phòng học, lớp học', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '请进教室。', examplePinyin: 'qǐng jìn jiàoshì.', exampleVi: 'Xin mời vào phòng học.' },
      { id: 'zh-hsk2-l7-02', hanzi: '机场', pinyin: 'jīchǎng', sinoVietnamese: 'CƠ TRƯỜNG', meaning: 'Sân bay', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '去首都国际机场。', examplePinyin: 'qù shǒudū guójì jīchǎng.', exampleVi: 'Đến sân bay quốc tế Thủ Đô.' },
      { id: 'zh-hsk2-l7-03', hanzi: '路', pinyin: 'lù', sinoVietnamese: 'LỘ', meaning: 'Đường đi, con đường', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '路上车很多。', examplePinyin: 'lù shang chē hěn duō.', exampleVi: 'Trên đường xe cộ rất đông.' },
      { id: 'zh-hsk2-l7-04', hanzi: '离', pinyin: 'lí', sinoVietnamese: 'LY', meaning: 'Cách (khoảng cách)', hskLevel: 2, posBadge: 'Giới từ', exampleZh: '我家离学校不远。', examplePinyin: 'wǒ jiā lí xuéxiào bù yuǎn.', exampleVi: 'Nhà tôi cách trường học không xa.' },
      { id: 'zh-hsk2-l7-05', hanzi: '公司', pinyin: 'gōngsī', sinoVietnamese: 'CÔNG TY', meaning: 'Công ty, hãng', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '他在大公司上班。', examplePinyin: 'tā zài dà gōngsī shàngbān.', exampleVi: 'Anh ấy đi làm ở công ty lớn.' },
      { id: 'zh-hsk2-l7-06', hanzi: '远', pinyin: 'yuǎn', sinoVietnamese: 'VIỄN', meaning: 'Xa', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '路途很远。', examplePinyin: 'lùtú hěn yuǎn.', exampleVi: 'Đường đi rất xa xôi.' },
      { id: 'zh-hsk2-l7-07', hanzi: '公共汽车', pinyin: 'gōnggòng qìchē', sinoVietnamese: 'CÔNG CỘNG KHÍ XA', meaning: 'Xe buýt, xe công cộng', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '坐公共汽车很便宜。', examplePinyin: 'zuò gōnggòng qìchē hěn piányi.', exampleVi: 'Đi xe buýt rất rẻ.' },
      { id: 'zh-hsk2-l7-08', hanzi: '小时', pinyin: 'xiǎoshí', sinoVietnamese: 'TIỂU THỜI', meaning: 'Tiếng đồng hồ, giờ', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '坐车要两个小时。', examplePinyin: 'zuò chē yào liǎng gè xiǎoshí.', exampleVi: 'Đi xe mất hai tiếng đồng hồ.' },
      { id: 'zh-hsk2-l7-09', hanzi: '慢', pinyin: 'màn', sinoVietnamese: 'MẠN', meaning: 'Chậm', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '请慢走。', examplePinyin: 'qǐng màn zǒu.', exampleVi: 'Xin đi thong thả.' },
      { id: 'zh-hsk2-l7-10', hanzi: '快', pinyin: 'kuài', sinoVietnamese: 'KHOÁI', meaning: 'Nhanh', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '高铁真快！', examplePinyin: 'gāotiě zhēn kuài!', exampleVi: 'Tàu cao tốc thật là nhanh!' },
      { id: 'zh-hsk2-l7-11', hanzi: '过', pinyin: 'guò', sinoVietnamese: 'QUÁ', meaning: 'Đón, trải qua; từng', hskLevel: 2, posBadge: 'Động từ', exampleZh: '过生日。', examplePinyin: 'guò shēngrì.', exampleVi: 'Đón sinh nhật.' },
      { id: 'zh-hsk2-l7-12', hanzi: '走', pinyin: 'zǒu', sinoVietnamese: 'TẨU', meaning: 'Đi bộ, đi', hskLevel: 2, posBadge: 'Động từ', exampleZh: '我们走路去吧。', examplePinyin: 'wǒmen zǒulù qù ba.', exampleVi: 'Chúng mình đi bộ đi nhé.' },
      { id: 'zh-hsk2-l7-13', hanzi: '到', pinyin: 'dào', sinoVietnamese: 'ĐÁO', meaning: 'Đến, tới nơi', hskLevel: 2, posBadge: 'Động từ', exampleZh: '到北京了。', examplePinyin: 'dào běijīng le.', exampleVi: 'Đến Bắc Kinh rồi.' },
    ],
  },

  // BÀI 8: Để tôi nghĩ đã rồi nói cho bạn biết
  {
    title: 'Để tôi nghĩ đã rồi nói cho bạn biết',
    titleZh: '让我想想再告诉你',
    words: [
      { id: 'zh-hsk2-l8-01', hanzi: '再', pinyin: 'zài', sinoVietnamese: 'TÁI', meaning: 'Lại, nữa, rồi hãy', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '让我想想再告诉你。', examplePinyin: 'ràng wǒ xiǎng xiǎng zài gàosu nǐ.', exampleVi: 'Để tôi nghĩ đã rồi nói cho bạn biết.' },
      { id: 'zh-hsk2-l8-02', hanzi: '让', pinyin: 'ràng', sinoVietnamese: 'NHƯỢNG', meaning: 'Bảo, cho phép, để', hskLevel: 2, posBadge: 'Động từ', exampleZh: '老师让我回答问题。', examplePinyin: 'lǎoshī ràng wǒ huídá wèntí.', exampleVi: 'Thầy giáo bảo tôi trả lời câu hỏi.' },
      { id: 'zh-hsk2-l8-03', hanzi: '告诉', pinyin: 'gàosu', sinoVietnamese: 'CÁO TỐ', meaning: 'Bảo, kể cho', hskLevel: 2, posBadge: 'Động từ', exampleZh: '请告诉我你的电话。', examplePinyin: 'qǐng gàosu wǒ nǐ de diànhuà.', exampleVi: 'Xin hãy nói cho tôi số điện thoại của bạn.' },
      { id: 'zh-hsk2-l8-04', hanzi: '等', pinyin: 'děng', sinoVietnamese: 'ĐẲNG', meaning: 'Đợi, chờ', hskLevel: 2, posBadge: 'Động từ', exampleZh: '请等我十分钟。', examplePinyin: 'qǐng děng wǒ shí fēnzhōng.', exampleVi: 'Xin hãy đợi tôi mười phút.' },
      { id: 'zh-hsk2-l8-05', hanzi: '找', pinyin: 'zhǎo', sinoVietnamese: 'TRẢO', meaning: 'Tìm kiếm; thối lại tiền', hskLevel: 2, posBadge: 'Động từ', exampleZh: '你在找什么？', examplePinyin: 'nǐ zài zhǎo shénme?', exampleVi: 'Bạn đang tìm cái gì vậy?' },
      { id: 'zh-hsk2-l8-06', hanzi: '事情', pinyin: 'shìqing', sinoVietnamese: 'SỰ TÌNH', meaning: 'Sự việc, chuyện', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '今天有很多事情要做。', examplePinyin: 'jīntiān yǒu hěn duō shìqing yào zuò.', exampleVi: 'Hôm nay có rất nhiều việc phải làm.' },
      { id: 'zh-hsk2-l8-07', hanzi: '服务员', pinyin: 'fúwùyuán', sinoVietnamese: 'PHỤC VỤ VIÊN', meaning: 'Nhân viên phục vụ', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '服务员，请结账。', examplePinyin: 'fúwùyuán, qǐng jiézhàng.', exampleVi: 'Phục vụ ơi, xin tính tiền.' },
      { id: 'zh-hsk2-l8-08', hanzi: '白', pinyin: 'bái', sinoVietnamese: 'BẠCH', meaning: 'Trắng', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '白色的衣服。', examplePinyin: 'báisè de yīfu.', exampleVi: 'Quần áo màu trắng.' },
      { id: 'zh-hsk2-l8-09', hanzi: '黑', pinyin: 'hēi', sinoVietnamese: 'HẮC', meaning: 'Đen', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '黑色的头发。', examplePinyin: 'hēisè de tóufa.', exampleVi: 'Mái tóc màu đen.' },
      { id: 'zh-hsk2-l8-10', hanzi: '贵', pinyin: 'guì', sinoVietnamese: 'QUÝ', meaning: 'Đắt đỏ, quý', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '这块手表太贵了。', examplePinyin: 'zhè kuài shǒubiǎo tài guì le.', exampleVi: 'Chiếc đồng hồ này đắt quá.' },
    ],
  },

  // BÀI 9: Đề nhiều quá, tôi làm không hết
  {
    title: 'Đề nhiều quá, tôi làm không hết',
    titleZh: '题太多，我没做完',
    words: [
      { id: 'zh-hsk2-l9-01', hanzi: '错', pinyin: 'cuò', sinoVietnamese: 'THÁC', meaning: 'Sai, nhầm', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '你做错了一道题。', examplePinyin: 'nǐ zuò cuò le yí dào tí.', exampleVi: 'Bạn làm sai mất một câu rồi.' },
      { id: 'zh-hsk2-l9-02', hanzi: '从', pinyin: 'cóng', sinoVietnamese: 'TÙNG', meaning: 'Từ (thời gian, địa điểm)', hskLevel: 2, posBadge: 'Giới từ', exampleZh: '从北京到上海。', examplePinyin: 'cóng běijīng dào shànghǎi.', exampleVi: 'Từ Bắc Kinh đến Thượng Hải.' },
      { id: 'zh-hsk2-l9-03', hanzi: '跳舞', pinyin: 'tiào wǔ', sinoVietnamese: 'KHIÊU VŨ', meaning: 'Nhảy múa, khiêu vũ', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '她跳舞跳得非常好。', examplePinyin: 'tā tiào wǔ tiào de fēicháng hǎo.', exampleVi: 'Cô ấy khiêu vũ rất đẹp.' },
      { id: 'zh-hsk2-l9-04', hanzi: '第一', pinyin: 'dì-yī', sinoVietnamese: 'ĐỆ NHẤT', meaning: 'Thứ nhất, số 1', hskLevel: 2, posBadge: 'Số từ', exampleZh: '他是第一名。', examplePinyin: 'tā shì dì-yī míng.', exampleVi: 'Cậu ấy đạt hạng nhất.' },
      { id: 'zh-hsk2-l9-05', hanzi: '希望', pinyin: 'xīwàng', sinoVietnamese: 'HI VỌNG', meaning: 'Hi vọng, mong ước', hskLevel: 2, posBadge: 'Động từ/Danh từ', exampleZh: '希望你考试顺利。', examplePinyin: 'xīwàng nǐ kǎoshì shùnlì.', exampleVi: 'Hi vọng kỳ thi của bạn thuận lợi.' },
      { id: 'zh-hsk2-l9-06', hanzi: '问题', pinyin: 'wèntí', sinoVietnamese: 'VẤN ĐỀ', meaning: 'Câu hỏi, vấn đề', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '没问题！', examplePinyin: 'méi wèntí!', exampleVi: 'Không thành vấn đề!' },
      { id: 'zh-hsk2-l9-07', hanzi: '欢迎', pinyin: 'huānyíng', sinoVietnamese: 'HOAN NGHÊNH', meaning: 'Chào mừng, hoan nghênh', hskLevel: 2, posBadge: 'Động từ', exampleZh: '欢迎来到中国！', examplePinyin: 'huānyíng lái dào zhōngguó!', exampleVi: 'Hoan nghênh đến với Trung Quốc!' },
      { id: 'zh-hsk2-l9-08', hanzi: '上班', pinyin: 'shàng bān', sinoVietnamese: 'THƯỢNG BAN', meaning: 'Đi làm', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '八点半上班。', examplePinyin: 'bā diǎn bàn shàng bān.', exampleVi: 'Tám giờ rưỡi đi làm.' },
      { id: 'zh-hsk2-l9-09', hanzi: '懂', pinyin: 'dǒng', sinoVietnamese: 'ĐỐNG', meaning: 'Hiểu, rõ', hskLevel: 2, posBadge: 'Động từ', exampleZh: '你听懂了吗？', examplePinyin: 'nǐ tīng dǒng le ma?', exampleVi: 'Bạn nghe có hiểu không?' },
      { id: 'zh-hsk2-l9-10', hanzi: '完', pinyin: 'wán', sinoVietnamese: 'HOÀN', meaning: 'Xong, hoàn thành, hết', hskLevel: 2, posBadge: 'Động từ', exampleZh: '吃完饭了。', examplePinyin: 'chī wán fàn le.', exampleVi: 'Ăn xong cơm rồi.' },
      { id: 'zh-hsk2-l9-11', hanzi: '题', pinyin: 'tí', sinoVietnamese: 'ĐỀ', meaning: 'Đề bài, câu hỏi bài tập', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '这道题很难。', examplePinyin: 'zhè dào tí hěn nán.', exampleVi: 'Câu hỏi này rất khó.' },
    ],
  },

  // BÀI 10: Đừng tìm nữa, điện thoại ở trên bàn kìa
  {
    title: 'Đừng tìm nữa, điện thoại ở trên bàn kìa',
    titleZh: '别找了，手机在桌子上呢',
    words: [
      { id: 'zh-hsk2-l10-01', hanzi: '别', pinyin: 'bié', sinoVietnamese: 'BIỆT', meaning: 'Đừng, chớ', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '别找了，在这儿呢。', examplePinyin: 'bié zhǎo le, zài zhèr ne.', exampleVi: 'Đừng tìm nữa, ở đây nè.' },
      { id: 'zh-hsk2-l10-02', hanzi: '鸡蛋', pinyin: 'jīdàn', sinoVietnamese: 'KÊ ĐÃN', meaning: 'Trứng gà', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '早上吃两个鸡蛋。', examplePinyin: 'zǎoshang chī liǎng gè jīdàn.', exampleVi: 'Buổi sáng ăn hai quả trứng gà.' },
      { id: 'zh-hsk2-l10-03', hanzi: '西瓜', pinyin: 'xīguā', sinoVietnamese: 'TÂY QUA', meaning: 'Dưa hấu', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '夏天的西瓜很甜。', examplePinyin: 'xiàtiān de xīguā hěn tián.', exampleVi: 'Dưa hấu mùa hè rất ngọt.' },
      { id: 'zh-hsk2-l10-04', hanzi: '正在', pinyin: 'zhèngzài', sinoVietnamese: 'CHÍNH TẠI', meaning: 'Đang (làm gì đó)', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '我正在看书呢。', examplePinyin: 'wǒ zhèngzài kàn shū ne.', exampleVi: 'Tôi đang đọc sách đấy.' },
      { id: 'zh-hsk2-l10-05', hanzi: '手机', pinyin: 'shǒujī', sinoVietnamese: 'THỦ CƠ', meaning: 'Điện thoại di động', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '别玩手机了。', examplePinyin: 'bié wán shǒujī le.', exampleVi: 'Đừng bấm nghịch điện thoại nữa.' },
      { id: 'zh-hsk2-l10-06', hanzi: '洗', pinyin: 'xǐ', sinoVietnamese: 'TẨY', meaning: 'Rửa, giặt', hskLevel: 2, posBadge: 'Động từ', exampleZh: '洗衣服 / 洗手。', examplePinyin: 'xǐ yīfu / xǐ shǒu.', exampleVi: 'Giặt quần áo / Rửa tay.' },
      { id: 'zh-hsk2-l10-07', hanzi: '穿', pinyin: 'chuān', sinoVietnamese: 'XUYÊN', meaning: 'Mặc (quần áo), đi (giày dép)', hskLevel: 2, posBadge: 'Động từ', exampleZh: '穿新衣服。', examplePinyin: 'chuān xīn yīfu.', exampleVi: 'Mặc quần áo mới.' },
      { id: 'zh-hsk2-l10-08', hanzi: '玩', pinyin: 'wán', sinoVietnamese: 'NGOẠN', meaning: 'Chơi, vui chơi', hskLevel: 2, posBadge: 'Động từ', exampleZh: '去外面玩。', examplePinyin: 'qù wàimiàn wán.', exampleVi: 'Ra ngoài chơi.' },
      { id: 'zh-hsk2-l10-09', hanzi: '唱歌', pinyin: 'chàng gē', sinoVietnamese: 'XƯỚNG CA', meaning: 'Hát, ca hát', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '我们一起唱歌吧。', examplePinyin: 'wǒmen yìqǐ chàng gē ba.', exampleVi: 'Chúng mình cùng hát nhé.' },
    ],
  },

  // BÀI 11: Anh ấy lớn hơn tôi 3 tuổi
  {
    title: 'Anh ấy lớn hơn tôi 3 tuổi',
    titleZh: '他比我大三岁',
    words: [
      { id: 'zh-hsk2-l11-01', hanzi: '男', pinyin: 'nán', sinoVietnamese: 'NAM', meaning: 'Nam, đàn ông', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '他是男学生。', examplePinyin: 'tā shì nán xuéshēng.', exampleVi: 'Cậu ấy là học sinh nam.' },
      { id: 'zh-hsk2-l11-02', hanzi: '女', pinyin: 'nǚ', sinoVietnamese: 'NỮ', meaning: 'Nữ, phụ nữ', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '女老师。', examplePinyin: 'nǚ lǎoshī.', exampleVi: 'Cô giáo.' },
      { id: 'zh-hsk2-l11-03', hanzi: '孩子', pinyin: 'háizi', sinoVietnamese: 'HÀI TỬ', meaning: 'Trẻ con, con cái', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '孩子们在玩耍。', examplePinyin: 'háizimen zài wánshuǎ.', exampleVi: 'Lũ trẻ đang nô đùa.' },
      { id: 'zh-hsk2-l11-04', hanzi: '右边', pinyin: 'yòubian', sinoVietnamese: 'HỮU BIÊN', meaning: 'Bên phải, phía phải', hskLevel: 2, posBadge: 'Danh từ phương vị', exampleZh: '右边是医院。', examplePinyin: 'yòubian shì yīyuàn.', exampleVi: 'Bên phải là bệnh viện.' },
      { id: 'zh-hsk2-l11-05', hanzi: '比', pinyin: 'bǐ', sinoVietnamese: 'TỈ', meaning: 'So với, hơn', hskLevel: 2, posBadge: 'Giới từ', exampleZh: '他比我大三岁。', examplePinyin: 'tā bǐ wǒ dà sān suì.', exampleVi: 'Anh ấy lớn hơn tôi ba tuổi.' },
      { id: 'zh-hsk2-l11-06', hanzi: '便宜', pinyin: 'piányi', sinoVietnamese: 'TIỆN NGHI', meaning: 'Rẻ', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '这件衣服很便宜。', examplePinyin: 'zhè jiàn yīfu hěn piányi.', exampleVi: 'Chiếc áo này rất rẻ.' },
      { id: 'zh-hsk2-l11-07', hanzi: '说话', pinyin: 'shuō huà', sinoVietnamese: 'THUYẾT THOẠI', meaning: 'Nói chuyện', hskLevel: 2, posBadge: 'Cụm động từ', exampleZh: '请不要大声说话。', examplePinyin: 'qǐng búyào dàshēng shuō huà.', exampleVi: 'Xin đừng nói chuyện lớn tiếng.' },
      { id: 'zh-hsk2-l11-08', hanzi: '可能', pinyin: 'kěnéng', sinoVietnamese: 'KHẢ NĂNG', meaning: 'Có thể, có lẽ', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '明天可能下雨。', examplePinyin: 'míngtiān kěnéng xià yǔ.', exampleVi: 'Ngày mai có lẽ sẽ mưa.' },
      { id: 'zh-hsk2-l11-09', hanzi: '去年', pinyin: 'qùnián', sinoVietnamese: 'KHỨ NIÊN', meaning: 'Năm ngoái', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '我去年来中国的。', examplePinyin: 'wǒ qùnián lái zhōngguó de.', exampleVi: 'Tôi đến Trung Quốc năm ngoái.' },
    ],
  },

  // BÀI 12: Bạn mặc ít quá rồi
  {
    title: 'Bạn mặc ít quá rồi',
    titleZh: '你穿得太少了',
    words: [
      { id: 'zh-hsk2-l12-01', hanzi: '得', pinyin: 'de', sinoVietnamese: 'ĐẮC', meaning: 'Trợ từ kết cấu (nối động từ và bổ ngữ)', hskLevel: 2, posBadge: 'Trợ từ', exampleZh: '你跑得真快。', examplePinyin: 'nǐ pǎo de zhēn kuài.', exampleVi: 'Bạn chạy thật là nhanh.' },
      { id: 'zh-hsk2-l12-02', hanzi: '早', pinyin: 'zǎo', sinoVietnamese: 'TẢO', meaning: 'Sớm, buổi sáng', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '你起得真早！', examplePinyin: 'nǐ qǐ de zhēn zǎo!', exampleVi: 'Bạn dậy sớm thật đấy!' },
      { id: 'zh-hsk2-l12-03', hanzi: '妻子', pinyin: 'qīzi', sinoVietnamese: 'THÊ TỬ', meaning: 'Vợ', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '这是我的妻子。', examplePinyin: 'zhè shì wǒ de qīzi.', exampleVi: 'Đây là vợ của tôi.' },
      { id: 'zh-hsk2-l12-04', hanzi: '雪', pinyin: 'xuě', sinoVietnamese: 'TUYẾT', meaning: 'Tuyết', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '北京下雪了。', examplePinyin: 'běijīng xià xuě le.', exampleVi: 'Bắc Kinh có tuyết rơi rồi.' },
      { id: 'zh-hsk2-l12-05', hanzi: '零', pinyin: 'líng', sinoVietnamese: 'LINH', meaning: 'Số không (0)', hskLevel: 2, posBadge: 'Số từ', exampleZh: '今天零下五度。', examplePinyin: 'jīntiān língxià wǔ dù.', exampleVi: 'Hôm nay âm 5 độ.' },
      { id: 'zh-hsk2-l12-06', hanzi: '度', pinyin: 'dù', sinoVietnamese: 'ĐỘ', meaning: 'Độ (nhiệt độ)', hskLevel: 2, posBadge: 'Lượng từ', exampleZh: '三十度。', examplePinyin: 'sānshí dù.', exampleVi: 'Ba mươi độ.' },
      { id: 'zh-hsk2-l12-07', hanzi: '进', pinyin: 'jìn', sinoVietnamese: 'TIẾN', meaning: 'Vào, bước vào', hskLevel: 2, posBadge: 'Động từ', exampleZh: '请进！', examplePinyin: 'qǐng jìn!', exampleVi: 'Xin mời vào!' },
      { id: 'zh-hsk2-l12-08', hanzi: '近', pinyin: 'jìn', sinoVietnamese: 'CẬN', meaning: 'Gần', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '学校离这儿很近。', examplePinyin: 'xuéxiào lí zhèr hěn jìn.', exampleVi: 'Trường học cách đây rất gần.' },
      { id: 'zh-hsk2-l12-09', hanzi: '次', pinyin: 'cì', sinoVietnamese: 'THỨ', meaning: 'Lần, lượt', hskLevel: 2, posBadge: 'Lượng từ', exampleZh: '我去过两次北京。', examplePinyin: 'wǒ qù guo liǎng cì běijīng.', exampleVi: 'Tôi từng đến Bắc Kinh hai lần.' },
    ],
  },

  // BÀI 13: Cửa đang mở đấy
  {
    title: 'Cửa đang mở đấy',
    titleZh: '门开着呢',
    words: [
      { id: 'zh-hsk2-l13-01', hanzi: '着', pinyin: 'zhe', sinoVietnamese: 'TRƯỚC', meaning: 'Đang (chỉ trạng thái kéo dài)', hskLevel: 2, posBadge: 'Trợ từ', exampleZh: '门开着呢。', examplePinyin: 'mén kāi zhe ne.', exampleVi: 'Cửa đang mở đấy.' },
      { id: 'zh-hsk2-l13-02', hanzi: '手', pinyin: 'shǒu', sinoVietnamese: 'THỦ', meaning: 'Bàn tay', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '请把手伸出来。', examplePinyin: 'qǐng bǎ shǒu shēn chūlái.', exampleVi: 'Xin đưa tay ra.' },
      { id: 'zh-hsk2-l13-03', hanzi: '拿', pinyin: 'ná', sinoVietnamese: 'NÃ', meaning: 'Cầm, nắm, lấy', hskLevel: 2, posBadge: 'Động từ', exampleZh: '他手里拿着一本书。', examplePinyin: 'tā shǒu lǐ ná zhe yì běn shū.', exampleVi: 'Trong tay anh ấy đang cầm một cuốn sách.' },
      { id: 'zh-hsk2-l13-04', hanzi: '铅笔', pinyin: 'qiānbǐ', sinoVietnamese: 'DUYÊN BÚT', meaning: 'Bút chì', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '这支铅笔是谁的？', examplePinyin: 'zhè zhī qiānbǐ shì shéi de?', exampleVi: 'Chiếc bút chì này của ai?' },
      { id: 'zh-hsk2-l13-05', hanzi: '班', pinyin: 'bān', sinoVietnamese: 'BAN', meaning: 'Lớp học, ca làm', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '我们班有十五个学生。', examplePinyin: 'wǒmen bān yǒu shíwǔ gè xuéshēng.', exampleVi: 'Lớp chúng tôi có mười lăm học sinh.' },
      { id: 'zh-hsk2-l13-06', hanzi: '长', pinyin: 'zhǎng', sinoVietnamese: 'TRƯỞNG', meaning: 'Lớn lên, trông như', hskLevel: 2, posBadge: 'Động từ', exampleZh: '她长得很漂亮。', examplePinyin: 'tā zhǎng de hěn piàoliang.', exampleVi: 'Cô ấy lớn lên trông rất xinh xắn.' },
      { id: 'zh-hsk2-l13-07', hanzi: '笑', pinyin: 'xiào', sinoVietnamese: 'TIẾU', meaning: 'Cười', hskLevel: 2, posBadge: 'Động từ', exampleZh: '别笑了。', examplePinyin: 'bié xiào le.', exampleVi: 'Đừng cười nữa.' },
      { id: 'zh-hsk2-l13-08', hanzi: '宾馆', pinyin: 'bīnguǎn', sinoVietnamese: 'TÂN QUÁN', meaning: 'Khách sạn, nhà khách', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '我们住在国际宾馆。', examplePinyin: 'wǒmen zhù zài guójì bīnguǎn.', exampleVi: 'Chúng tôi ở khách sạn Quốc Tế.' },
      { id: 'zh-hsk2-l13-09', hanzi: '一直', pinyin: 'yìzhí', sinoVietnamese: 'NHẤT TRỰC', meaning: 'Thẳng, liên tục', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '一直往走。', examplePinyin: 'yìzhí wǎng qián zǒu.', exampleVi: 'Cứ đi thẳng về phía trước.' },
      { id: 'zh-hsk2-l13-10', hanzi: '往', pinyin: 'wǎng', sinoVietnamese: 'VÃNG', meaning: 'Về hướng, hướng tới', hskLevel: 2, posBadge: 'Giới từ', exampleZh: '往前走就是地铁站。', examplePinyin: 'wǎng qián zǒu jiù shì dìtiězhàn.', exampleVi: 'Đi về phía trước là ga tàu điện ngầm.' },
    ],
  },

  // BÀI 14: Bạn đã xem bộ phim đó chưa?
  {
    title: 'Bạn đã xem bộ phim đó chưa?',
    titleZh: '你看过那个电影吗？',
    words: [
      { id: 'zh-hsk2-l14-01', hanzi: '过', pinyin: 'guo', sinoVietnamese: 'QUÁ', meaning: 'Từng (trợ từ động thái chỉ kinh nghiệm)', hskLevel: 2, posBadge: 'Trợ từ', exampleZh: '你看过那个电影吗？', examplePinyin: 'nǐ kàn guo nà ge diànyǐng ma?', exampleVi: 'Bạn đã từng xem bộ phim đó chưa?' },
      { id: 'zh-hsk2-l14-02', hanzi: '虽然', pinyin: 'suīrán', sinoVietnamese: 'TUY NHIÊN', meaning: 'Mặc dù, tuy', hskLevel: 2, posBadge: 'Liên từ', exampleZh: '虽然很累，但是很开心。', examplePinyin: 'suīrán hěn lèi, dànshì hěn kāixīn.', exampleVi: 'Mặc dù rất mệt nhưng rất vui.' },
      { id: 'zh-hsk2-l14-03', hanzi: '但是', pinyin: 'dànshì', sinoVietnamese: 'ĐÃN THỊ', meaning: 'Nhưng, thế nhưng', hskLevel: 2, posBadge: 'Liên từ', exampleZh: '但是他没来。', examplePinyin: 'dànshì tā méi lái.', exampleVi: 'Thế nhưng anh ấy không đến.' },
      { id: 'zh-hsk2-l14-04', hanzi: '晴', pinyin: 'qíng', sinoVietnamese: 'TÌNH', meaning: 'Nắng, trời quang đãng', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '今天是个大晴天。', examplePinyin: 'jīntiān shì gè dà qíngtiān.', exampleVi: 'Hôm nay là một ngày nắng to.' },
      { id: 'zh-hsk2-l14-05', hanzi: '百', pinyin: 'bǎi', sinoVietnamese: 'BÁCH', meaning: 'Trăm (100)', hskLevel: 2, posBadge: 'Số từ', exampleZh: '一百个人。', examplePinyin: 'yì bǎi gè rén.', exampleVi: 'Một trăm người.' },
      { id: 'zh-hsk2-l14-06', hanzi: '船', pinyin: 'chuán', sinoVietnamese: 'THUYỀN', meaning: 'Thuyền, tàu thủy', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '坐船去海南岛。', examplePinyin: 'zuò chuán qù hǎinándǎo.', exampleVi: 'Đi thuyền đến đảo Hải Nam.' },
    ],
  },

  // BÀI 15: Năm mới sắp đến rồi
  {
    title: 'Năm mới sắp đến rồi',
    titleZh: '新年就要到了',
    words: [
      { id: 'zh-hsk2-l15-01', hanzi: '新年', pinyin: 'xīnnián', sinoVietnamese: 'TÂN NIÊN', meaning: 'Năm mới, tết', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '新年快乐！', examplePinyin: 'xīnnián kuàilè!', exampleVi: 'Chúc mừng năm mới!' },
      { id: 'zh-hsk2-l15-02', hanzi: '快要', pinyin: 'kuàiyào', sinoVietnamese: 'KHOÁI YẾU', meaning: 'Sắp sửa, sắp', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '新年快要到了。', examplePinyin: 'xīnnián kuàiyào dào le.', exampleVi: 'Năm mới sắp sửa đến rồi.' },
      { id: 'zh-hsk2-l15-03', hanzi: '票', pinyin: 'piào', sinoVietnamese: 'PHIẾU', meaning: 'Vé', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '你买到火车票了吗？', examplePinyin: 'nǐ mǎi dào huǒchē piào le ma?', exampleVi: 'Bạn đã mua được vé tàu hỏa chưa?' },
      { id: 'zh-hsk2-l15-04', hanzi: '火车站', pinyin: 'huǒchēzhàn', sinoVietnamese: 'HỎA XA TRẠM', meaning: 'Ga xe lửa, bến tàu hỏa', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '火车站很多人。', examplePinyin: 'huǒchēzhàn hěn duō rén.', exampleVi: 'Ga tàu hỏa rất đông người.' },
      { id: 'zh-hsk2-l15-05', hanzi: '更', pinyin: 'gèng', sinoVietnamese: 'CANH', meaning: 'Càng, hơn nữa', hskLevel: 2, posBadge: 'Phó từ', exampleZh: '明天天气会更好。', examplePinyin: 'míngtiān tiānqì huì gèng hǎo.', exampleVi: 'Ngày mai thời tiết sẽ còn đẹp hơn.' },
      { id: 'zh-hsk2-l15-06', hanzi: '妹妹', pinyin: 'mèimei', sinoVietnamese: 'MUỘI MUỘI', meaning: 'Em gái', hskLevel: 2, posBadge: 'Danh từ', exampleZh: '妹妹今年七岁了。', examplePinyin: 'mèimei jīnnián qī suì le.', exampleVi: 'Em gái năm nay bảy tuổi rồi.' },
      { id: 'zh-hsk2-l15-07', hanzi: '阴', pinyin: 'yīn', sinoVietnamese: 'ÂM', meaning: 'U ám, nhiều mây, râm', hskLevel: 2, posBadge: 'Tính từ', exampleZh: '今天是阴天。', examplePinyin: 'jīntiān shì yīntiān.', exampleVi: 'Hôm nay là ngày trời râm.' },
    ],
  },
];

// Helper to chunk remaining levels (HSK 3 - 7~9) using Standard Course curriculum
function createLessonsFromCurriculum(
  level: number | string,
  words: ChineseWordItem[],
  curriculum: { title: string; titleZh: string }[]
): HskLesson[] {
  const lessons: HskLesson[] = [];
  const wordsPerLesson = Math.max(1, Math.ceil(words.length / curriculum.length));

  curriculum.forEach((item, idx) => {
    const lessonNum = idx + 1;
    const start = idx * wordsPerLesson;
    const end = Math.min(words.length, start + wordsPerLesson);
    const slice = words.slice(start, end);
    const lessonWords: HskLessonWord[] = slice.map((w, wIdx) => ({
      ...w,
      id: w.id || `zh-hsk${level}-l${lessonNum}-${String(wIdx + 1).padStart(2, '0')}`,
      posBadge: w.topic || 'Từ vựng',
      exampleZh: w.exampleZh || `这是${w.hanzi}。`,
      exampleVi: w.exampleVi || w.meaning,
      examplePinyin: w.examplePinyin || w.pinyin,
    }));

    lessons.push({
      id: `bai-${lessonNum}`,
      lessonNumber: lessonNum,
      title: item.title,
      titleZh: item.titleZh,
      wordCount: lessonWords.length,
      words: lessonWords,
    });
  });

  return lessons;
}

// 20 BÀI HỌC CHUẨN GIÁO TRÌNH HSK 3 (标准教程 HSK 3)
export const HSK3_CURRICULUM = [
  { title: 'Cuối tuần bạn có dự định gì?', titleZh: '周末你有什么打算？' },
  { title: 'Khi nào anh ấy trở về?', titleZh: '他什么时候回来？' },
  { title: 'Trên bàn để rất nhiều đồ uống', titleZh: '桌子上放着很多饮料' },
  { title: 'Cô ấy luôn cười khi nói chuyện với khách', titleZh: '她总是笑着跟客人说话' },
  { title: 'Dạo này tôi ngày càng béo lên', titleZh: '我最近越来越胖了' },
  { title: 'Sao đột nhiên lại tìm không thấy?', titleZh: '怎么突然找不到了？' },
  { title: 'Tôi đi cùng bạn', titleZh: '我跟你一起去' },
  { title: 'Bạn đi đâu tôi đi đó', titleZh: '你去哪儿我就去哪儿' },
  { title: 'Tiếng Trung của cô ấy nói hay như người Trung Quốc', titleZh: '她的汉语说得跟中国人一样好' },
  { title: 'Toán học khó hơn lịch sử nhiều', titleZh: '数学比历史难多了' },
  { title: 'Đừng quên tắt máy điều hòa', titleZh: '别忘了把空调关了' },
  { title: 'Hãy để những đồ quan trọng ở chỗ tôi', titleZh: '把重要的东西放在我这儿吧' },
  { title: 'Tôi là đi bộ về', titleZh: '我是走回来的' },
  { title: 'Bạn mang hoa quả qua đây', titleZh: '你把水果拿过来' },
  { title: 'Những thứ khác đều không có vấn đề gì', titleZh: '其他都没什么问题' },
  { title: 'Bây giờ tôi mệt đến mức tan ca chỉ muốn ngủ', titleZh: '我现在累得下了班就想睡觉' },
  { title: 'Ai cũng có cách chữa khỏi "bệnh" của bạn', titleZh: '谁都有办法看好你的“病”' },
  { title: 'Tôi tin rằng họ sẽ đồng ý', titleZh: '我相信他们会同意的' },
  { title: 'Bạn không nhận ra sao?', titleZh: '你没看出来吗？' },
  { title: 'Tôi đã sống ở đây hơn hai mươi năm rồi', titleZh: '我在这儿生活了二十多年' },
];

// 20 BÀI HỌC CHUẨN GIÁO TRÌNH HSK 4 (标准教程 HSK 4)
export const HSK4_CURRICULUM = [
  { title: 'Tình yêu giản dị', titleZh: '简单的爱情' },
  { title: 'Người bạn thực sự', titleZh: '真正的朋友' },
  { title: 'Ông "suýt soát"', titleZh: '差不多先生' },
  { title: 'Đừng quá coi trọng tiền bạc', titleZh: '不要太在乎钱' },
  { title: 'Chỉ mua cái đúng, không mua cái đắt', titleZh: '只买对的，不买贵的' },
  { title: 'Tiền nào của nấy', titleZh: '一分钱一分货' },
  { title: 'Bác sĩ tốt nhất là chính mình', titleZh: '最好的医生是自己' },
  { title: 'Cuộc sống không thiếu cái đẹp', titleZh: '生活中不缺少美' },
  { title: 'Ánh nắng luôn ở sau mưa gió', titleZh: '阳光总在风雨后' },
  { title: 'Tiêu chuẩn của hạnh phúc', titleZh: '幸福的标准' },
  { title: 'Đọc sách tốt, đọc sách hay, thích đọc sách', titleZh: '读书好，读好书，好读书' },
  { title: 'Dùng trái tim khám phá thế giới', titleZh: '用心发现世界' },
  { title: 'Vừa uống trà vừa xem Kinh kịch', titleZh: '喝着茶看京剧' },
  { title: 'Bảo vệ mẹ Trái Đất', titleZh: '保护地球母亲' },
  { title: 'Nghệ thuật bắt nguồn từ cuộc sống', titleZh: '艺术源于生活' },
  { title: 'Nghề nghiệp lý tưởng', titleZh: '理想的职业' },
  { title: 'Con người và thiên nhiên', titleZh: '人与自然' },
  { title: 'Khoa học công nghệ và đời sống', titleZh: '科技与生活' },
  { title: 'Câu chuyện về mùi vị', titleZh: '味道的故事' },
  { title: 'Bước vào thương trường', titleZh: '步入商海' },
];

// 36 BÀI HỌC CHUẨN GIÁO TRÌNH HSK 5 (标准教程 HSK 5)
export const HSK5_CURRICULUM = [
  { title: 'Chi tiết của tình yêu', titleZh: '爱的细节' },
  { title: 'Mùa đông Tế Nam', titleZh: '济南的冬天' },
  { title: 'Đời người có lựa chọn, mọi thứ đều có thể', titleZh: '人生有选择，一切皆有可能' },
  { title: 'Tử Lộ cõng gạo', titleZh: '子路负米' },
  { title: 'Truyền thuyết Tế Công', titleZh: '济公的传说' },
  { title: 'Nguồn gốc đêm Trừ Tịch', titleZh: '除夕的由来' },
  { title: 'Hai mẩu chuyện thành ngữ', titleZh: '成语故事两则' },
  { title: 'Triết lý "Sáng ba chiều bốn"', titleZh: '“朝三暮四”的哲学' },
  { title: 'Mua bán không thành tình nghĩa còn', titleZh: '买卖不成人情在' },
  { title: 'Kỳ tích của cuộc tranh luận', titleZh: '争论的奇迹' },
  { title: 'Đạo đọc sách', titleZh: '读书之道' },
  { title: 'Khí hậu và cuộc sống con người', titleZh: '气候与人类生活' },
  { title: 'Thể thao và sức khỏe', titleZh: '体育与健康' },
  { title: 'Phỏng vấn nhân vật', titleZh: '人物专访' },
  { title: 'Sức hút của âm nhạc', titleZh: '音乐的魅力' },
  { title: 'Lễ hội truyền thống và tập tục', titleZh: '传统节日与习俗' },
  { title: 'Tiến gần thiên nhiên', titleZh: '走近自然' },
  { title: 'Công nghệ thay đổi tương lai', titleZh: '科技改变未来' },
  { title: 'Hương vị quê hương', titleZh: '家乡的味儿' },
  { title: 'Ngụ ngôn và nhân sinh', titleZh: '寓言与人生' },
  { title: 'Bí ẩn của ngôn ngữ', titleZh: '语言的奥秘' },
  { title: 'Đời sống công nghệ hiện đại', titleZh: '现代科技生活' },
  { title: 'Nghệ thuật giao tiếp ứng xử', titleZh: '人际交往的艺术' },
  { title: 'Con người và đại dương', titleZh: '人类与海洋' },
  { title: 'Trí tuệ và cảm hứng', titleZh: '智慧与灵感' },
  { title: 'Vẻ đẹp nghệ thuật kiến trúc', titleZh: '建筑艺术之美' },
  { title: 'Tiếng vọng lịch sử', titleZh: '历史的回声' },
  { title: 'Suy ngẫm triết lý', titleZh: '哲理思考' },
  { title: 'Ngã rẽ cuộc đời', titleZh: '人生十字路口' },
  { title: 'Con đường sáng tạo nghệ thuật', titleZh: '艺术创作之路' },
  { title: 'Bảo vệ tài nguyên thiên nhiên', titleZh: '自然资源的保护' },
  { title: 'Giao lưu đa văn hóa', titleZh: '跨文化交流' },
  { title: 'Góc nhìn kinh tế hiện đại', titleZh: '现代经济视角' },
  { title: 'Y học và khoa học sự sống', titleZh: '医学与生命科学' },
  { title: 'Khám phá không gian vũ trụ', titleZh: '探索宇宙空间' },
  { title: 'Thách thức hướng tới tương lai', titleZh: '走向未来的挑战' },
];

// 40 BÀI HỌC CHUẨN GIÁO TRÌNH HSK 6 (标准教程 HSK 6)
export const HSK6_CURRICULUM = [
  { title: 'Thể thao thể hình & cuộc sống hiện đại', titleZh: '体育健身与现代生活' },
  { title: 'Ý nghĩa sâu xa của truyện ngụ ngôn', titleZh: '寓言故事的深意' },
  { title: 'Tình cảm cha mẹ & giáo dục gia đình', titleZh: '父母之爱与家庭教育' },
  { title: 'Địa lý cảnh quan & bảo vệ sinh thái', titleZh: '地理风貌与生态保护' },
  { title: 'Thám hiểm khoa học & bí ẩn vũ trụ', titleZh: '科学探索与宇宙奥秘' },
  { title: 'Thẩm mỹ nghệ thuật & bồi dưỡng tâm hồn', titleZh: '艺术审美与心灵陶冶' },
  { title: 'Suy ngẫm nhân sinh & trí tuệ đối nhân xử thế', titleZh: '人生哲思与处世智慧' },
  { title: 'Sự biến đổi ngôn ngữ & sức hút chữ Hán', titleZh: '语言演变与文字魅力' },
  { title: 'Lễ hội truyền thống & phong tục tập quán', titleZh: '传统节日与民俗风情' },
  { title: 'Điển tích lịch sử & nguồn gốc thành ngữ', titleZh: '历史典故与成语源流' },
  { title: 'Khoa học hiện đại & Trí tuệ nhân tạo', titleZh: '现代科技与人工智能' },
  { title: 'Thương mại quốc tế & toàn cầu hóa kinh tế', titleZh: '商业贸易与经济全球化' },
  { title: 'Nhận thức tâm lý & điều tiết cảm xúc', titleZh: '心理认知与情绪调节' },
  { title: 'Đạo đức môi trường & phát triển bền vững', titleZh: '环境伦理与可持续发展' },
  { title: 'Hệ thống pháp luật & công bằng xã hội', titleZh: '法律制度与社会公义' },
  { title: 'Quan hệ quốc tế & giao lưu văn hóa', titleZh: '国际关系与文化交融' },
  { title: 'Văn hóa ẩm thực & đạo dưỡng sinh', titleZh: '饮食文化与养生之道' },
  { title: 'Thiết kế kiến trúc & mỹ học không gian', titleZh: '建筑设计与空间美学' },
  { title: 'Phê bình văn học & thưởng thức kiệt tác', titleZh: '文学批评与名著鉴赏' },
  { title: 'Tư biện triết học & định hướng giá trị', titleZh: '哲学思辨与价值取向' },
  { title: 'Đột phá y học & y tế công cộng', titleZh: '医学突破与公共卫生' },
  { title: 'Triết lý giáo dục & đào tạo nhân tài', titleZh: '教育理念与人才培养' },
  { title: 'Quy hoạch đô thị & môi trường sống', titleZh: '城市规划与人居环境' },
  { title: 'Truyền thông đại chúng & thời đại thông tin', titleZh: '媒体传播与信息时代' },
  { title: 'Đa dạng sinh học & bảo tồn giống loài', titleZh: '生物多样性与物种保护' },
  { title: 'Tư duy đổi mới & hành trình khởi nghiệp', titleZh: '创新思维与创业历程' },
  { title: 'Văn minh lễ nghi & nếp sống xã hội', titleZh: '礼仪文明与社会风气' },
  { title: 'Sân khấu điện ảnh & nghệ thuật đương đại', titleZh: '戏剧影视与当代艺术' },
  { title: 'Biến đổi dân số & xã hội già hóa', titleZh: '人口变迁与老龄社会' },
  { title: 'Chuyển dịch năng lượng & phát thải thấp', titleZh: '能源转型与绿色低碳' },
  { title: 'Triết học khoa học & phương pháp nghiên cứu', titleZh: '科学哲学与探索方法' },
  { title: 'Lý thuyết dịch thuật & truyền bá văn hóa', titleZh: '翻译理论与文化传播' },
  { title: 'Điều tiết vĩ mô & ổn định tài chính', titleZh: '宏观调控与金融稳定' },
  { title: 'Phát hiện khảo cổ & văn minh cổ đại', titleZh: '考古发现与古代文明' },
  { title: 'Đạo đức học & đạo đức sinh học', titleZh: '伦理道德与生命伦理' },
  { title: 'Thơ ca hiện đại & ý cảnh tản văn', titleZh: '现代诗歌与散文意境' },
  { title: 'Đạo đức công nghệ & hố ngăn cách số', titleZh: '科技伦理与数字鸿沟' },
  { title: 'Kinh tế du lịch & di sản văn hóa', titleZh: '旅游经济与文化遗产' },
  { title: 'Nghiên cứu liên ngành & đổi mới toàn diện', titleZh: '跨学科研究与综合创新' },
  { title: 'Đương đại Trung Quốc bước ra thế giới', titleZh: '走向世界的当代中国' },
];

// 24 BÀI HỌC CHUẨN HSK 7–9 CAO CẤP (HSK 7–9 • 3.0 高等)
export const HSK79_CURRICULUM = [
  { title: 'Chính trị quốc tế & ngôn ngữ ngoại giao', titleZh: '国际政治与外交辞令' },
  { title: 'Kinh tế vĩ mô & chính sách tài khóa', titleZh: '宏观经济与财政政策' },
  { title: 'Kinh điển triết học & mô hình tư biện', titleZh: '哲学经典与思辨范式' },
  { title: 'Lý luận luật học & xây dựng pháp quyền', titleZh: '法学理论与法治建设' },
  { title: 'Cách mạng khoa học công nghệ & khám phá tiền tuyến', titleZh: '科技革命与前沿探索' },
  { title: 'Văn hiến học & hiệu đính cổ tịch', titleZh: '文献学与古籍校勘' },
  { title: 'Góc nhìn xã hội học về biến chuyển đương đại', titleZh: '社会学视野下的当代变迁' },
  { title: 'Địa chính trị & chiến lược toàn cầu', titleZh: '地缘政治与全球战略' },
  { title: 'Giám sát tài chính & phòng chống rủi ro', titleZh: '金融监管与风险防范' },
  { title: 'Khoa học thần kinh nhận thức & tâm trí', titleZh: '认知神经科学与心智' },
  { title: 'Thương mại đa quốc gia & trọng tài quốc tế', titleZh: '跨国贸易与国际仲裁' },
  { title: 'Văn minh sinh thái & quản trị khí hậu toàn cầu', titleZh: '生态文明与全球气候治理' },
  { title: 'Lý luận văn nghệ & tranh luận mỹ học', titleZh: '文艺理论与美学争鸣' },
  { title: 'Đánh giá giáo dục đại học & đổi mới học thuật', titleZh: '高等教育评估与学术创新' },
  { title: 'Đạo đức truyền thông báo chí & kiến tạo diễn ngôn', titleZh: '新闻传播伦理与话语建构' },
  { title: 'Triết học lịch sử & giao thoa văn minh', titleZh: '历史哲学与文明互鉴' },
  { title: 'Đạo đức công nghệ sinh học & công nghệ gen', titleZh: '生物技术伦理与基因工程' },
  { title: 'Luật pháp quốc tế & tranh chấp chủ quyền lãnh thổ', titleZh: '国际法与领土主权争端' },
  { title: 'Ngữ pháp học & tu từ học tiếng Hán hiện đại', titleZh: '现代汉语语法学与修辞学' },
  { title: 'Giao tiếp đa văn hóa & đối dịch trong dịch thuật', titleZh: '跨文化交际与翻译对译' },
  { title: 'Liên kết kinh tế khu vực & chuỗi cung ứng', titleZh: '区域经济一体化与供应链' },
  { title: 'Hiến pháp học & bảo đảm quyền con người', titleZh: '宪法学与人权保障' },
  { title: 'Đạo đức trí tuệ nhân tạo & cộng sinh người-máy', titleZh: '人工智能伦理与人机共生' },
  { title: 'Viết luận văn học thuật nâng cao & bảo vệ luận án', titleZh: '高阶学术论文写作与答辩' },
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
    lessons: HSK2_CURRICULUM.map((item, idx) => ({
      id: `bai-${idx + 1}`,
      lessonNumber: idx + 1,
      title: item.title,
      titleZh: item.titleZh,
      wordCount: item.words.length,
      words: item.words,
    })),
  },
  hsk3: {
    slug: 'hsk3',
    levelNumber: 3,
    title: 'Nhai HSK 3',
    coverTitle: 'Nhai HSK 3',
    standardTitle: '标准教程 HSK 3 • 3.0',
    wordCountTotal: 483,
    patternCountTotal: 63,
    lessonCount: 20,
    lessons: createLessonsFromCurriculum(3, hsk3Data as ChineseWordItem[], HSK3_CURRICULUM),
  },
  hsk4: {
    slug: 'hsk4',
    levelNumber: 4,
    title: 'Nhai HSK 4',
    coverTitle: 'Nhai HSK 4',
    standardTitle: '标准教程 HSK 4 • 3.0',
    wordCountTotal: 1000,
    patternCountTotal: 80,
    lessonCount: 20,
    lessons: createLessonsFromCurriculum(4, hsk4Data as ChineseWordItem[], HSK4_CURRICULUM),
  },
  hsk5: {
    slug: 'hsk5',
    levelNumber: 5,
    title: 'Nhai HSK 5',
    coverTitle: 'Nhai HSK 5',
    standardTitle: '标准教程 HSK 5 • 3.0',
    wordCountTotal: 1600,
    patternCountTotal: 105,
    lessonCount: 36,
    lessons: createLessonsFromCurriculum(5, hsk5Data as ChineseWordItem[], HSK5_CURRICULUM),
  },
  hsk6: {
    slug: 'hsk6',
    levelNumber: 6,
    title: 'Nhai HSK 6',
    coverTitle: 'Nhai HSK 6',
    standardTitle: '标准教程 HSK 6 • 3.0',
    wordCountTotal: 1800,
    patternCountTotal: 120,
    lessonCount: 40,
    lessons: createLessonsFromCurriculum(6, hsk6Data as ChineseWordItem[], HSK6_CURRICULUM),
  },
  'hsk7-9': {
    slug: 'hsk7-9',
    levelNumber: '7–9',
    title: 'Nhai HSK 7–9',
    coverTitle: 'Nhai HSK 7–9',
    standardTitle: 'HSK 7–9 • 3.0 高等',
    wordCountTotal: 2200,
    patternCountTotal: 150,
    lessonCount: 24,
    lessons: createLessonsFromCurriculum('7-9', hsk79Data as ChineseWordItem[], HSK79_CURRICULUM),
  },
  // Aliases for seamless routing
  hsk7: {
    slug: 'hsk7-9',
    levelNumber: '7–9',
    title: 'Nhai HSK 7–9',
    coverTitle: 'Nhai HSK 7–9',
    standardTitle: 'HSK 7–9 • 3.0 高等',
    wordCountTotal: 2200,
    patternCountTotal: 150,
    lessonCount: 24,
    lessons: createLessonsFromCurriculum('7-9', hsk79Data as ChineseWordItem[], HSK79_CURRICULUM),
  },
  hsk79: {
    slug: 'hsk7-9',
    levelNumber: '7–9',
    title: 'Nhai HSK 7–9',
    coverTitle: 'Nhai HSK 7–9',
    standardTitle: 'HSK 7–9 • 3.0 高等',
    wordCountTotal: 2200,
    patternCountTotal: 150,
    lessonCount: 24,
    lessons: createLessonsFromCurriculum('7-9', hsk79Data as ChineseWordItem[], HSK79_CURRICULUM),
  },
};
