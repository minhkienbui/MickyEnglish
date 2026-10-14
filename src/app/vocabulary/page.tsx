'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Folder,
  Bell,
  Volume2,
  BookOpen,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Info,
  MoreHorizontal,
  Bookmark,
  X,
  Bot,
  Flame,
} from 'lucide-react';
import { useVocabStore } from '@/stores/useVocabStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import {
  mockChineseVocabulary,
  allHskWords,
  hskDecks,
  getChineseVocabByLevel,
  ChineseWordItem,
} from '@/data/mockChineseVocab';
import PremiumModal from '@/components/common/PremiumModal';

export default function VocabularyHubPage() {
  const { words, getDueWords, addWord } = useVocabStore();
  const { user } = useAuthStore();
  const { targetLanguage } = useLanguageStore();
  const isChinese = targetLanguage === 'zh';

  const [instantSearch, setInstantSearch] = useState('');
  const [deckSearch, setDeckSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả cấp độ');
  const [activeTag, setActiveTag] = useState('Tất cả');
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<string[]>([
    'Từ vựng TOEIC 800+',
    'Giao tiếp công sở hàng ngày',
  ]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);

  // Pagination cho danh sách từ vựng tiếng Trung HSK
  const [chinesePage, setChinesePage] = useState(1);
  const pageSize = 32;

  // Instant Dictionary Lookup result state
  const [lookupResult, setLookupResult] = useState<{
    word: string;
    phonetic: string;
    meaning: string;
    exampleEn?: string;
    exampleVi?: string;
  } | null>(null);

  const dueCount = getDueWords().length;

  // Gợi ý từ vựng theo ngôn ngữ (Anh vs Trung)
  const englishTrendingWords = [
    { word: 'actually', phonetic: '/ˈæk.tʃu.ə.li/', meaning: 'Thực ra, thực sự', exampleEn: 'Actually, I think that is a great idea.', exampleVi: 'Thực ra tôi nghĩ đó là một ý tưởng tuyệt vời.' },
    { word: 'however', phonetic: '/haʊˈev.ər/', meaning: 'Tuy nhiên, dù thế nào', exampleEn: 'He was tired; however, he continued working.', exampleVi: 'Anh ấy mệt; tuy nhiên, anh ấy vẫn tiếp tục làm việc.' },
    { word: 'different', phonetic: '/ˈdɪf.ər.ənt/', meaning: 'Khác biệt, đa dạng', exampleEn: 'They hold very different opinions on this topic.', exampleVi: 'Họ có những quan điểm rất khác nhau về chủ đề này.' },
    { word: 'something', phonetic: '/ˈsʌm.θɪŋ/', meaning: 'Một điều gì đó, một thứ gì đó', exampleEn: 'There is something special about this method.', exampleVi: 'Có điều gì đó rất đặc biệt ở phương pháp này.' },
    { word: 'through', phonetic: '/θruː/', meaning: 'Xuyên qua, thông qua', exampleEn: 'We walked through the ancient forest.', exampleVi: 'Chúng tôi đi bộ xuyên qua khu rừng cổ thụ.' },
    { word: 'without', phonetic: '/wɪˈðaʊt/', meaning: 'Mà không có, thiếu', exampleEn: 'You cannot master speaking without regular practice.', exampleVi: 'Bạn không thể thành thạo nói nếu không luyện tập thường xuyên.' },
    { word: 'although', phonetic: '/ɔːlˈðoʊ/', meaning: 'Mặc dù, dẫu cho', exampleEn: 'Although it rained heavily, they arrived on time.', exampleVi: 'Mặc dù trời mưa lớn, họ vẫn đến đúng giờ.' },
    { word: 'because', phonetic: '/bɪˈkɒz/', meaning: 'Bởi vì, do', exampleEn: 'She succeeded because of her determination.', exampleVi: 'Cô ấy thành công nhờ vào sự kiên định của mình.' },
    { word: 'enough', phonetic: '/ɪˈnʌf/', meaning: 'Đủ, vừa vặn', exampleEn: 'Is there enough time to finish this lesson?', exampleVi: 'Có đủ thời gian để hoàn thành bài học này không?' },
    { word: 'language', phonetic: '/ˈlæŋ.ɡwɪdʒ/', meaning: 'Ngôn ngữ, tiếng nói', exampleEn: 'English is the global language of communication.', exampleVi: 'Tiếng Anh là ngôn ngữ giao tiếp toàn cầu.' },
  ];

  const chineseTrendingWords = allHskWords.slice(0, 10).map((w) => ({
    word: w.hanzi,
    phonetic: w.pinyin,
    meaning: `${w.sinoVietnamese ? `[${w.sinoVietnamese}] ` : ''}${w.meaning}`,
    exampleEn: w.exampleZh,
    exampleVi: w.exampleVi,
  }));

  const trendingWords = isChinese ? chineseTrendingWords : englishTrendingWords;

  // Tính toán số lượng từ ở từng cấp độ Spaced Repetition (0: Mới học, 1-2: Nhớ tạm, 3: Nhớ lâu, 4: Thuộc lòng, 5: Thông thạo)
  const srsStats = useMemo(() => {
    let moiHoc = 0;
    let nhoTam = 0;
    let nhoLau = 0;
    let thuocLong = 0;
    let thongThao = 0;

    words.forEach((w) => {
      const lv = w.level || 0;
      if (lv === 0) moiHoc++;
      else if (lv === 1 || lv === 2) nhoTam++;
      else if (lv === 3) nhoLau++;
      else if (lv === 4) thuocLong++;
      else if (lv >= 5) thongThao++;
    });

    return {
      total: words.length || 6,
      moiHoc: moiHoc || 3,
      nhoTam: nhoTam || 3,
      nhoLau: nhoLau || 0,
      thuocLong: thuocLong || 0,
      thongThao: thongThao || 0,
    };
  }, [words]);

  const englishHashtags = [
    'Tất cả',
    '# Từ vựng thông dụng',
    '# English In Use',
    '# Từ vựng Oxford',
    '# Từ vựng IELTS',
    '# Từ vựng TOEIC',
    '# Idiom and phrasal...',
  ];

  const chineseHashtags = [
    'Tất cả',
    '# HSK 1',
    '# HSK 2',
    '# HSK 3',
    '# HSK 4',
    '# HSK 5',
    '# HSK 6',
  ];

  const hashtags = isChinese ? chineseHashtags : englishHashtags;

  // Danh mục Từ vựng thông dụng
  const englishCommonDecks = [
    {
      id: 'deck-topics',
      title: 'Từ vựng theo chủ đề',
      subtitle: 'A-Z',
      wordsCount: 13927,
      learnedCount: 0,
      isPro: false,
      tag: '# Từ vựng thông dụng',
      icon: '🎨',
      bgGradient: 'from-amber-400 to-orange-400',
      description: 'Tổng hợp từ vựng phân theo 80+ chủ đề đời sống, du lịch, nghề nghiệp và công nghệ.',
    },
    {
      id: 'deck-levels',
      title: 'Từ vựng theo cấp độ',
      subtitle: 'A1 - A2 - B1 - B2 - C1',
      wordsCount: 9378,
      learnedCount: 0,
      isPro: false,
      tag: '# Từ vựng thông dụng',
      icon: '📊',
      bgGradient: 'from-blue-400 to-indigo-400',
      description: 'Học từ vựng bám sát khung tham chiếu châu Âu CEFR từ cơ bản đến nâng cao.',
    },
    {
      id: 'deck-communication',
      title: 'Từ vựng tiếng Anh giao tiếp',
      subtitle: 'Daily Communication',
      wordsCount: 325,
      learnedCount: 0,
      isPro: true,
      tag: '# Từ vựng thông dụng',
      icon: '🗣️',
      bgGradient: 'from-teal-400 to-emerald-400',
      description: 'Các mẫu câu và cụm từ phản xạ tự nhiên thường dùng trong giao tiếp hằng ngày.',
    },
    {
      id: 'deck-appearance',
      title: 'Ngoại hình & Tính cách',
      subtitle: 'Appearance & Personality',
      wordsCount: 513,
      learnedCount: 0,
      isPro: false,
      tag: '# Từ vựng thông dụng',
      icon: '👤',
      bgGradient: 'from-rose-400 to-pink-400',
      description: 'Từ vựng miêu tả dáng vẻ, khuôn mặt, phong cách ăn mặc và tính cách con người.',
    },
  ];

  const chineseCommonDecks = hskDecks.map((d) => ({
    id: d.id,
    title: d.name,
    subtitle: d.level,
    hskLevelNum: d.hskLevelNum,
    wordsCount: d.count,
    learnedCount: 0,
    isPro: false,
    tag: `# ${d.level}`,
    icon: '🇨🇳',
    bgGradient: d.color,
    description: d.description,
  }));

  const commonDecks = isChinese ? chineseCommonDecks : englishCommonDecks;

  // Danh mục English In Use
  const englishInUseDecks = [
    {
      id: 'deck-collocations-inter',
      title: 'English Collocations in Use - Intermediate',
      subtitle: 'Collocations & Phrases',
      wordsCount: 2466,
      learnedCount: 0,
      isPro: true,
      tag: '# English In Use',
      icon: '📚',
      bgGradient: 'from-purple-400 to-violet-400',
      description: 'Cực kỳ quan trọng để nói và viết tiếng Anh tự nhiên như người bản xứ.',
    },
    {
      id: 'deck-vocab-elementary',
      title: 'English Vocabulary in Use - Elementary (A1-A2)',
      subtitle: 'Elementary Foundation',
      wordsCount: 1435,
      learnedCount: 0,
      isPro: false,
      tag: '# English In Use',
      icon: '🌱',
      bgGradient: 'from-teal-400 to-emerald-400',
      description: 'Giáo trình nền tảng của Đại học Cambridge dành cho người mới bắt đầu.',
    },
    {
      id: 'deck-vocab-pre-inter',
      title: 'English Vocabulary in Use - Pre-intermediate & Intermediate (B1)',
      subtitle: 'B1 Intermediate',
      wordsCount: 2803,
      learnedCount: 0,
      isPro: false,
      tag: '# English In Use',
      icon: '🚀',
      bgGradient: 'from-sky-400 to-blue-400',
      description: 'Giáo trình trung cấp mở rộng vốn từ vựng học thuật và giao tiếp tự tin.',
    },
    {
      id: 'deck-vocab-upper',
      title: 'English Vocabulary in Use - Upper-intermediate',
      subtitle: 'B2 Upper-intermediate',
      wordsCount: 3215,
      learnedCount: 0,
      isPro: false,
      tag: '# English In Use',
      icon: '⭐',
      bgGradient: 'from-amber-400 to-yellow-400',
      description: 'Vốn từ vựng chuyên sâu giúp bạn chinh phục IELTS 7.0+ và giao dịch quốc tế.',
    },
  ];

  // Lọc từ vựng tiếng Trung HSK 1 - 6
  const filteredChineseWords = useMemo(() => {
    if (!isChinese) return [];
    let list = allHskWords;

    if (activeTag !== 'Tất cả' && activeTag.startsWith('# HSK')) {
      const lv = parseInt(activeTag.replace('# HSK', '').trim(), 10);
      if (!isNaN(lv)) {
        list = getChineseVocabByLevel(lv);
      }
    } else if (selectedLevel !== 'Tất cả cấp độ') {
      const lv = parseInt(selectedLevel.replace('HSK', '').trim(), 10);
      if (!isNaN(lv)) {
        list = getChineseVocabByLevel(lv);
      }
    }

    if (deckSearch.trim()) {
      const q = deckSearch.trim().toLowerCase();
      list = list.filter(
        (w) =>
          w.hanzi.includes(q) ||
          w.pinyin.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          w.sinoVietnamese.toLowerCase().includes(q)
      );
    }

    return list;
  }, [isChinese, activeTag, selectedLevel, deckSearch]);

  const displayedChineseWords = useMemo(() => {
    return filteredChineseWords.slice(0, chinesePage * pageSize);
  }, [filteredChineseWords, chinesePage]);

  // Tra từ tức thì
  const handleInstantLookup = (term: string) => {
    if (!term.trim()) return;
    const q = term.trim().toLowerCase();
    if (isChinese) {
      const found = allHskWords.find(
        (w) =>
          w.hanzi === term.trim() ||
          w.pinyin.toLowerCase() === q ||
          w.meaning.toLowerCase().includes(q) ||
          w.sinoVietnamese.toLowerCase() === q
      );
      if (found) {
        setLookupResult({
          word: found.hanzi,
          phonetic: found.pinyin,
          meaning: `${found.sinoVietnamese ? `[${found.sinoVietnamese}] ` : ''}${found.meaning} (HSK ${found.hskLevel})`,
          exampleEn: found.exampleZh || `包含 "${found.hanzi}" 的词语。`,
          exampleVi: found.exampleVi || `Thuộc bộ từ vựng HSK ${found.hskLevel}.`,
        });
        return;
      }
    }
    const found = trendingWords.find(
      (w) => w.word.toLowerCase() === q
    );
    if (found) {
      setLookupResult(found);
    } else {
      setLookupResult({
        word: term,
        phonetic: isChinese ? 'pīnyīn' : '/əˈkeɪ.ʒən.əl/',
        meaning: `Nghĩa của từ "${term}" (Được tra tự động từ từ điển)`,
        exampleEn: isChinese ? `这是包含 "${term}" 的例句。` : `This is an example sentence containing the word ${term}.`,
        exampleVi: `Đây là câu ví dụ minh họa chứa từ ${term}.`,
      });
    }
  };

  // Phát âm audio
  const speakAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = isChinese ? 'zh-CN' : 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  // Lưu từ vào Flashcard
  const handleSaveToFlashcard = (item: any) => {
    addWord({
      word: item.word,
      phonetic: item.phonetic,
      meaning: item.meaning,
      exampleEn: item.exampleEn,
      exampleVi: item.exampleVi,
      topic: 'Từ tra nhanh',
    });
    alert(`✓ Đã lưu từ "${item.word}" vào sổ tay ôn tập Flashcard!`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6 font-sans">
      {/* 1. TOP QUICK SEARCH BAR chuẩn Warm Notebook */}
      <div className="space-y-3">
        <div className="relative w-full">
          <div className="relative flex items-center border-2 border-stone-800 rounded-2xl bg-white dark:bg-stone-900 shadow-[3px_3px_0px_#292524] p-1.5">
            <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
            <input
              type="text"
              value={instantSearch}
              onChange={(e) => setInstantSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInstantLookup(instantSearch);
              }}
              placeholder={
                isChinese
                  ? "Nhập chữ Hán, Pinyin hoặc nghĩa tiếng Việt..."
                  : "Nhập từ tiếng Anh hoặc tiếng Việt..."
              }
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold px-3 text-stone-900 dark:text-white placeholder-stone-400"
            />
            <button
              onClick={() => handleInstantLookup(instantSearch)}
              className={`px-5 py-2.5 text-white font-cartoon text-xs font-bold rounded-xl border border-stone-800 shadow-md transition-all shrink-0 cursor-pointer ${
                isChinese ? 'bg-[#c53428] hover:bg-[#b02c21]' : 'bg-[#292524] hover:bg-amber-600'
              }`}
            >
              Tra từ
            </button>
          </div>
        </div>

        {/* 10 Trending Words Pills (Warm amber sticker pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {trendingWords.map((item) => (
            <button
              key={item.word}
              onClick={() => {
                setInstantSearch(item.word);
                handleInstantLookup(item.word);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-stone-900 font-cartoon font-bold text-xs border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press transition-all cursor-pointer shrink-0"
            >
              {item.word}
            </button>
          ))}
        </div>
      </div>

      {/* MODAL POPUP TRA TỪ TỨC THÌ NẾU CÓ KẾT QUẢ */}
      {lookupResult && (
        <div className="p-5 bg-[#fff9ea] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl space-y-3 box-sketch animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-cartoon font-black text-stone-900 dark:text-white">
                {lookupResult.word}
              </h3>
              <span className="text-xs font-mono font-bold text-[#c53428] dark:text-amber-300">
                {lookupResult.phonetic}
              </span>
              <button
                onClick={() => speakAudio(lookupResult.word)}
                className="p-1.5 rounded-lg bg-amber-300 border border-stone-800 hover:bg-amber-400 text-stone-900 transition-colors cursor-pointer"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setLookupResult(null)}
              className="text-stone-400 hover:text-stone-800 p-1"
            >
              ✕
            </button>
          </div>

          <p className="font-body text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
            {lookupResult.meaning}
          </p>

          {lookupResult.exampleEn && (
            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-800 text-xs space-y-1">
              <p className="font-bold text-stone-900 dark:text-white">"{lookupResult.exampleEn}"</p>
              {lookupResult.exampleVi && (
                <p className="text-stone-600 dark:text-stone-400 italic">{lookupResult.exampleVi}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => handleSaveToFlashcard(lookupResult)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 font-cartoon text-xs font-bold rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" /> Lưu vào Sổ tay Ôn tập (Flashcard)
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN LAYOUT (4 COLS LEFT, 8 COLS RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================== CỘT TRÁI (4 COLS) ===================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* WIDGET 1: HỆ THỐNG SPACED REPETITION (SRS) */}
          <div className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-5 box-sketch space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-cartoon text-sm font-bold text-stone-900 dark:text-white">
                  {srsStats.total} Từ đã học
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>
              <span className="washi-tape-yellow px-2 py-0.5 rounded font-cartoon text-[10px] font-black uppercase text-stone-900">
                SRS SM-2
              </span>
            </div>

            {/* 5 Cột / Vòng tròn cấp độ nhớ */}
            <div className="grid grid-cols-5 gap-1.5 pt-1 text-center">
              {/* MỚI HỌC */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-stone-800 flex items-center justify-center font-cartoon text-xs font-bold text-stone-900 dark:text-white bg-amber-100 dark:bg-stone-800 shadow-[1px_1px_0px_#292524]">
                  {srsStats.moiHoc}
                </div>
                <span className="font-cartoon text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                  Mới học
                </span>
              </div>

              {/* NHỚ TẠM */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-stone-800 flex items-center justify-center font-cartoon text-xs font-bold text-stone-900 dark:text-white bg-teal-100 dark:bg-stone-800 shadow-[1px_1px_0px_#292524]">
                  {srsStats.nhoTam}
                </div>
                <span className="font-cartoon text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                  Nhớ tạm
                </span>
              </div>

              {/* NHỚ LÂU */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-stone-800 flex items-center justify-center font-cartoon text-xs font-bold text-stone-900 dark:text-white bg-blue-100 dark:bg-stone-800 shadow-[1px_1px_0px_#292524]">
                  {srsStats.nhoLau}
                </div>
                <span className="font-cartoon text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                  Nhớ lâu
                </span>
              </div>

              {/* THUỘC LÒNG */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-stone-800 flex items-center justify-center font-cartoon text-xs font-bold text-stone-900 dark:text-white bg-purple-100 dark:bg-stone-800 shadow-[1px_1px_0px_#292524]">
                  {srsStats.thuocLong}
                </div>
                <span className="font-cartoon text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                  Thuộc lòng
                </span>
              </div>

              {/* THÔNG THẠO */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-stone-800 flex items-center justify-center font-cartoon text-xs font-bold text-stone-900 dark:text-white bg-rose-100 dark:bg-stone-800 shadow-[1px_1px_0px_#292524]">
                  {srsStats.thongThao}
                </div>
                <span className="font-cartoon text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                  Thành thạo
                </span>
              </div>
            </div>

            {/* Thông báo số từ cần ôn lại */}
            <div className="flex items-center gap-2 text-xs font-hand text-stone-600 dark:text-stone-400 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-stone-800" />
              <span>{dueCount} Từ vựng cần ôn lại theo chu kỳ SM-2</span>
            </div>

            {/* NÚT VÀNG NOTEBOOK "📖 LUYỆN TẬP ^" */}
            <Link
              href="/tuvung/on-tap"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-cartoon font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border-2 border-stone-800 shadow-[3px_3px_0px_#292524] btn-press transition-transform"
            >
              <BookOpen className="w-4 h-4 fill-stone-900" />
              Luyện Tập Flashcard ^
            </Link>
          </div>

          {/* WIDGET 2: THƯ MỤC CỦA TÔI */}
          <div className="bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-5 box-sketch space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-cartoon text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                Thư mục của tôi
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowFolderModal(true)}
                  className="p-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-stone-900 border border-stone-800 shadow-sm transition-colors cursor-pointer"
                  title="Thêm thư mục mới"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thư mục danh sách */}
            <div className="space-y-2">
              {folders.map((folder, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#fff9ea] dark:bg-stone-900 border-2 border-stone-800 text-xs font-cartoon font-bold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer hover:bg-amber-100"
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-4 h-4 text-amber-600" />
                    <span>{folder}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">12 từ</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== CỘT PHẢI (8 COLS) ===================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Thanh tìm kiếm bộ từ + Filter cấp độ */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={deckSearch}
                onChange={(e) => setDeckSearch(e.target.value)}
                placeholder={
                  isChinese
                    ? "Tìm từ vựng HSK, chữ Hán, Pinyin..."
                    : "Tìm bộ từ vựng hoặc chủ đề..."
                }
                className="w-full bg-white dark:bg-stone-900 border-2 border-stone-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 font-semibold outline-none shadow-[2px_2px_0px_#292524]"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-stone-900 border-2 border-stone-800 rounded-xl pl-8 pr-8 py-2.5 text-xs text-stone-900 dark:text-white font-cartoon font-bold outline-none cursor-pointer shadow-[2px_2px_0px_#292524]"
              >
                <option value="Tất cả cấp độ">{isChinese ? 'Tất cả cấp độ HSK' : 'Tất cả cấp độ'}</option>
                {isChinese ? (
                  <>
                    <option value="HSK 1">HSK 1 (300 từ)</option>
                    <option value="HSK 2">HSK 2 (200 từ)</option>
                    <option value="HSK 3">HSK 3 (500 từ)</option>
                    <option value="HSK 4">HSK 4 (1.000 từ)</option>
                    <option value="HSK 5">HSK 5 (1.600 từ)</option>
                    <option value="HSK 6">HSK 6 (1.800 từ)</option>
                  </>
                ) : (
                  <>
                    <option value="A1-A2">A1 - A2 (Sơ cấp)</option>
                    <option value="B1">B1 (Trung cấp)</option>
                    <option value="B2">B2 (Trung cấp cao)</option>
                    <option value="C1">C1 (Nâng cao)</option>
                  </>
                )}
              </select>
              <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5 pointer-events-none" />
              <div className="absolute right-3 top-3.5 pointer-events-none text-stone-400 text-[10px]">▼</div>
            </div>
          </div>

          {/* Hashtags filter row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {hashtags.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-cartoon font-bold whitespace-nowrap transition-all cursor-pointer border-2 border-stone-800 ${
                    isActive
                      ? isChinese
                        ? 'bg-[#c53428] text-white shadow-[2px_2px_0px_#292524] scale-105'
                        : 'bg-amber-300 text-stone-900 shadow-[2px_2px_0px_#292524] scale-105'
                      : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* SECTION 1: CÁC BỘ TỪ VỰNG */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-cartoon text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                {isChinese ? (
                  <>
                    6 Bộ từ vựng HSK 1 - 6 Chuẩn HSK 3.0 <span className="text-xs text-[#c53428] font-bold">(5.400+ từ)</span>
                  </>
                ) : (
                  <>
                    Từ vựng thông dụng <span className="text-xs text-amber-600 font-bold">(7 bộ)</span>
                  </>
                )}
              </h2>
              <button
                onClick={() => setActiveTag('Tất cả')}
                className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline cursor-pointer"
              >
                Xem tất cả &gt;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commonDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  isChinese={isChinese}
                  onSelect={() => {
                    if (deck.isPro) {
                      setShowPremiumModal(true);
                    } else {
                      setSelectedDeck(deck);
                    }
                  }}
                />
              ))}
            </div>
          </section>

          {/* SECTION 2: DANH SÁCH TỪ VỰNG CHI TIẾT */}
          {isChinese ? (
            <section className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-cartoon text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span>📖 Danh Sách Từ Vựng HSK Chi Tiết</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-[#c53428] border border-stone-800 font-bold">
                      {filteredChineseWords.length} từ
                    </span>
                  </h2>
                  <p className="font-hand text-sm text-stone-600 dark:text-stone-400">
                    Bấm loa để nghe phát âm giọng Bắc Kinh chuẩn, xem âm Hán-Việt và câu ví dụ minh họa.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {displayedChineseWords.map((word) => (
                  <div
                    key={word.id}
                    className="p-3.5 bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl space-y-2 box-sketch-sm transition-all group hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-stone-900 dark:text-white group-hover:text-[#c53428] transition-colors font-serif">
                          {word.hanzi}
                        </span>
                        <span className="text-xs font-bold text-[#c53428] dark:text-amber-300 font-mono">
                          {word.pinyin}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-cartoon font-bold bg-amber-200 text-stone-900 border border-stone-800">
                        HSK {word.hskLevel}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      {word.sinoVietnamese && (
                        <p className="text-[11px] text-stone-500 font-medium font-cartoon">
                          Âm Hán Việt: <span className="text-stone-900 dark:text-white font-bold">{word.sinoVietnamese}</span>
                        </p>
                      )}
                      <p className="font-body text-xs text-stone-700 dark:text-stone-300 font-semibold line-clamp-2">
                        {word.meaning}
                      </p>
                    </div>

                    {word.exampleZh && (
                      <div className="p-2 bg-[#fff9ea] dark:bg-stone-900 border border-stone-800 rounded-xl text-[11px] space-y-0.5">
                        <p className="text-[#c53428] dark:text-amber-300 font-medium line-clamp-1">"{word.exampleZh}"</p>
                        {word.exampleVi && <p className="text-stone-600 dark:text-stone-400 italic line-clamp-1">{word.exampleVi}</p>}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-800">
                      <button
                        onClick={() => speakAudio(word.hanzi)}
                        className="p-1.5 rounded-lg bg-amber-300 hover:bg-amber-400 text-stone-900 border border-stone-800 transition-colors cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          handleSaveToFlashcard({
                            word: word.hanzi,
                            phonetic: word.pinyin,
                            meaning: `${word.sinoVietnamese ? `[${word.sinoVietnamese}] ` : ''}${word.meaning}`,
                            exampleEn: word.exampleZh,
                            exampleVi: word.exampleVi,
                          })
                        }
                        className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-amber-100 text-stone-800 dark:text-stone-200 border border-stone-800 rounded-lg font-cartoon text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <Bookmark className="w-3 h-3" /> Lưu
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {displayedChineseWords.length < filteredChineseWords.length && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setChinesePage((p) => p + 1)}
                    className="px-6 py-2.5 bg-[#c53428] hover:bg-[#b02c21] text-white font-cartoon text-xs font-bold rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer transition-all"
                  >
                    Xem thêm ({filteredChineseWords.length - displayedChineseWords.length} từ còn lại)
                  </button>
                </div>
              )}
            </section>
          ) : (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-cartoon text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  English In Use <span className="text-xs text-amber-600 font-bold">(4 bộ)</span>
                </h2>
                <button
                  onClick={() => setActiveTag('# English In Use')}
                  className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Xem tất cả &gt;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {englishInUseDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    isChinese={false}
                    onSelect={() => {
                      if (deck.isPro) {
                        setShowPremiumModal(true);
                      } else {
                        setSelectedDeck(deck);
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* MODAL CHI TIẾT BỘ TỪ */}
      {selectedDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 box-sketch rounded-2xl p-6 text-stone-900 dark:text-white space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedDeck.icon}</span>
                <div>
                  <h3 className="font-cartoon text-lg font-bold">{selectedDeck.title}</h3>
                  <p className="font-cartoon text-xs text-[#c53428] dark:text-amber-400 font-bold">
                    {selectedDeck.wordsCount} từ vựng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeck(null)}
                className="text-stone-400 hover:text-stone-900 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="font-body text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {selectedDeck.description}
            </p>

            <div className="p-4 bg-[#fff9ea] dark:bg-stone-900 border-2 border-stone-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-cartoon text-stone-600 dark:text-stone-400 font-bold">
                <span>Tiến độ hoàn thành:</span>
                <span className="text-stone-900 dark:text-white">0%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full border border-stone-800 overflow-hidden">
                <div className="w-0 h-full bg-amber-400 rounded-full" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/tuvung/on-tap"
                className="flex-1 py-3 text-stone-900 font-cartoon font-bold text-xs text-center rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
              >
                Luyện Tập Flashcard (SM-2)
              </Link>
              {isChinese && (
                <Link
                  href="/practice/hanzi-writer"
                  className="py-3 px-4 bg-[#c53428] hover:bg-[#b02c21] text-white font-cartoon font-bold text-xs text-center rounded-xl border-2 border-stone-800 shadow-[2px_2px_0px_#292524] btn-press cursor-pointer"
                >
                  Tạo Vở Viết A4
                </Link>
              )}
              <button
                onClick={() => setSelectedDeck(null)}
                className="px-4 py-3 bg-[#ede4d3] dark:bg-stone-800 hover:bg-stone-200 border-2 border-stone-800 text-stone-800 dark:text-stone-200 font-cartoon font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TẠO THƯ MỤC */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 box-sketch rounded-2xl p-5 text-stone-900 dark:text-white space-y-4">
            <h3 className="font-cartoon text-sm font-bold">Tạo Thư Mục Mới</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Tên thư mục (VD: Từ vựng IELTS Writing)"
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-900 dark:text-white outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    setFolders([...folders, newFolderName.trim()]);
                    setNewFolderName('');
                    setShowFolderModal(false);
                  }
                }}
                className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 font-cartoon text-xs font-bold rounded-xl border border-stone-800 shadow-sm cursor-pointer"
              >
                Tạo thư mục
              </button>
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 bg-[#ede4d3] text-stone-800 text-xs font-cartoon font-bold rounded-xl border border-stone-800 cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nâng Cấp VIP */}
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}

// Card bộ từ vựng phong cách Vở Sổ Tay Hoạt Hình
function DeckCard({ deck, isChinese, onSelect }: { deck: any; isChinese: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="group relative bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl p-4 box-sketch-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-300 border-2 border-stone-800 flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0px_#292524] group-hover:scale-105 transition-transform">
            {deck.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cartoon text-xs font-bold text-stone-900 dark:text-white line-clamp-1 group-hover:text-[#c53428] transition-colors">
                {deck.title}
              </h3>
              {deck.isPro && (
                <span className="px-1.5 py-0.2 bg-amber-400 border border-stone-800 text-stone-900 font-cartoon font-black text-[9px] rounded">
                  PRO
                </span>
              )}
            </div>
            <p className="font-hand text-xs text-stone-600 dark:text-stone-400 line-clamp-1 mt-0.5">{deck.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-stone-200 dark:border-stone-800 font-cartoon text-[11px] font-bold text-stone-600 dark:text-stone-400">
        <span className="text-[#c53428] dark:text-amber-400">
          0/{deck.wordsCount.toLocaleString()} từ
        </span>
        <span className="text-stone-500">Bấm để học ➔</span>
      </div>
    </div>
  );
}
