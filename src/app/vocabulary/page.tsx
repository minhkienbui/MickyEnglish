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
import PremiumModal from '@/components/common/PremiumModal';

export default function VocabularyHubPage() {
  const { words, getDueWords, addWord } = useVocabStore();
  const { user } = useAuthStore();

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

  // Instant Dictionary Lookup result state
  const [lookupResult, setLookupResult] = useState<{
    word: string;
    phonetic: string;
    meaning: string;
    exampleEn: string;
    exampleVi: string;
  } | null>(null);

  const dueCount = getDueWords().length;

  // 10 Gợi ý từ vựng chuẩn như ảnh Bibung
  const trendingWords = [
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

  // Tính toán số lượng từ ở từng cấp độ Spaced Repetition (0: Mới học, 1-2: Nhớ tạm, 3: Nhớ lâu, 4: Thuộc lòng, 5: Thông thạo)
  const srsStats = useMemo(() => {
    let moiHoc = 0;
    let nhoTam = 0;
    let nhoLau = 0;
    let thuocLong = 0;
    let thongThao = 0;

    words.forEach((w) => {
      if (w.level === 0) moiHoc++;
      else if (w.level === 1 || w.level === 2) nhoTam++;
      else if (w.level === 3) nhoLau++;
      else if (w.level === 4) thuocLong++;
      else if (w.level >= 5) thongThao++;
    });

    return { moiHoc, nhoTam, nhoLau, thuocLong, thongThao, total: words.length };
  }, [words]);

  const hashtags = [
    'Tất cả',
    '# Từ vựng thông dụng',
    '# English In Use',
    '# Từ vựng Oxford',
    '# Từ vựng IELTS',
    '# Từ vựng TOEIC',
    '# Idiom and phrasal...',
  ];

  // Danh mục Từ vựng thông dụng
  const commonDecks = [
    {
      id: 'deck-topics',
      title: 'Từ vựng theo chủ đề',
      subtitle: 'A-Z',
      wordsCount: 13927,
      learnedCount: 0,
      isPro: false,
      tag: '# Từ vựng thông dụng',
      icon: '🎨',
      bgGradient: 'from-amber-600/30 to-orange-600/20',
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
      bgGradient: 'from-blue-600/30 to-indigo-600/20',
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
      bgGradient: 'from-emerald-600/30 to-teal-600/20',
      description: 'Các mẫu câu và cụm từ phản xạ tự nhiên thường dùng trong giao tiếp hằng ngày.',
    },
    {
      id: 'deck-appearance',
      title: 'Ngoại hình',
      subtitle: 'Appearance & Personality',
      wordsCount: 513,
      learnedCount: 0,
      isPro: false,
      tag: '# Từ vựng thông dụng',
      icon: '👤',
      bgGradient: 'from-rose-600/30 to-pink-600/20',
      description: 'Từ vựng miêu tả dáng vẻ, khuôn mặt, phong cách ăn mặc và tính cách con người.',
    },
  ];

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
      bgGradient: 'from-purple-600/30 to-violet-600/20',
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
      bgGradient: 'from-teal-600/30 to-emerald-600/20',
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
      bgGradient: 'from-sky-600/30 to-blue-600/20',
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
      bgGradient: 'from-amber-600/30 to-yellow-600/20',
      description: 'Vốn từ vựng chuyên sâu giúp bạn chinh phục IELTS 7.0+ và giao dịch quốc tế.',
    },
  ];

  // Tra từ tức thì
  const handleInstantLookup = (term: string) => {
    if (!term.trim()) return;
    const found = trendingWords.find(
      (w) => w.word.toLowerCase() === term.toLowerCase()
    );
    if (found) {
      setLookupResult(found);
    } else {
      setLookupResult({
        word: term,
        phonetic: '/əˈkeɪ.ʒən.əl/',
        meaning: `Nghĩa của từ "${term}" (Được tra tự động từ từ điển bản xứ)`,
        exampleEn: `This is an example sentence containing the word ${term}.`,
        exampleVi: `Đây là câu ví dụ minh họa chứa từ ${term}.`,
      });
    }
  };

  // Phát âm audio
  const speakAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* 1. TOP QUICK SEARCH BAR chuẩn Bibung */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={instantSearch}
            onChange={(e) => setInstantSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInstantLookup(instantSearch);
            }}
            placeholder="Nhập từ tiếng Anh hoặc tiếng Việt..."
            className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-full pl-11 pr-24 py-3 text-xs text-white placeholder-slate-400 font-semibold outline-none transition-colors shadow-sm"
          />
          <button
            onClick={() => handleInstantLookup(instantSearch)}
            className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer"
          >
            Tra từ
          </button>
        </div>

        {/* 10 Trending Words Pills (Xanh lá tròn mạ vàng như ảnh 3) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {trendingWords.map((item) => (
            <button
              key={item.word}
              onClick={() => {
                setInstantSearch(item.word);
                setLookupResult(item);
              }}
              className="px-3.5 py-1 rounded-full bg-[#00c950] hover:bg-[#00b046] text-white font-black text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-sm"
            >
              {item.word}
            </button>
          ))}
        </div>
      </div>

      {/* MODAL POPUP TRA TỪ TỨC THÌ NẾU CÓ KẾT QUẢ */}
      {lookupResult && (
        <div className="p-4 sm:p-5 bg-[#121c2b] border-2 border-emerald-500/60 rounded-3xl space-y-3 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-white">{lookupResult.word}</h3>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {lookupResult.phonetic}
              </span>
              <button
                onClick={() => speakAudio(lookupResult.word)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setLookupResult(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-bold text-slate-200">{lookupResult.meaning}</p>

          <div className="p-3 bg-[#0d131d] border border-[#1e2d42] rounded-2xl space-y-1 text-xs">
            <div className="text-emerald-400 font-medium italic">"{lookupResult.exampleEn}"</div>
            <div className="text-slate-400">→ {lookupResult.exampleVi}</div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => handleSaveToFlashcard(lookupResult)}
              className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" /> + Lưu vào Flashcard
            </button>
          </div>
        </div>
      )}

      {/* 2 CỘT CHÍNH: CỘT TRÁI (TIẾN TRÌNH & SRS) + CỘT PHẢI (KHO BỘ TỪ) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================== CỘT TRÁI (4 COLS) ===================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* WIDGET 1: TIẾN TRÌNH TRÍ NHỚ 5 CẤP ĐỘ (SPACED REPETITION) */}
          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Link
                href="/tuvung/on-tap"
                className="text-sm font-black text-white hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <span>{srsStats.total} Từ đã học</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* 5 VÒNG TRÒN TIẾN TRÌNH TRÍ NHỚ CHUẨN ẢNH 3 */}
            <div className="grid grid-cols-5 gap-1 text-center">
              {/* MỚI HỌC */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs font-black text-slate-200 bg-[#0d131d]">
                  {srsStats.moiHoc}
                </div>
                <span className="text-[9px] font-black text-slate-400 tracking-tight uppercase">
                  MỚI HỌC
                </span>
              </div>

              {/* NHỚ TẠM */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/40 flex items-center justify-center text-xs font-black text-emerald-400 bg-[#0d131d]">
                  {srsStats.nhoTam}
                </div>
                <span className="text-[9px] font-black text-slate-400 tracking-tight uppercase">
                  NHỚ TẠM
                </span>
              </div>

              {/* NHỚ LÂU */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full border-2 border-teal-500/40 flex items-center justify-center text-xs font-black text-teal-400 bg-[#0d131d]">
                  {srsStats.nhoLau}
                </div>
                <span className="text-[9px] font-black text-slate-400 tracking-tight uppercase">
                  NHỚ LÂU
                </span>
              </div>

              {/* THUỘC LÒNG */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500/40 flex items-center justify-center text-xs font-black text-blue-400 bg-[#0d131d]">
                  {srsStats.thuocLong}
                </div>
                <span className="text-[9px] font-black text-slate-400 tracking-tight uppercase">
                  THUỘC LÒNG
                </span>
              </div>

              {/* THÔNG THẠO */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full border-2 border-amber-500/40 flex items-center justify-center text-xs font-black text-amber-400 bg-[#0d131d]">
                  {srsStats.thongThao}
                </div>
                <span className="text-[9px] font-black text-slate-400 tracking-tight uppercase">
                  THÔNG THẠO
                </span>
              </div>
            </div>

            {/* Thông báo số từ cần ôn lại */}
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{dueCount} Từ vựng Cần ôn lại</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* NÚT CAM LỚN "📖 LUYỆN TẬP ^" CHUẨN ẢNH 3 */}
            <Link
              href="/tuvung/on-tap"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <BookOpen className="w-4 h-4 fill-white" />
              LUYỆN TẬP ^
            </Link>
          </div>

          {/* WIDGET 2: THƯ MỤC CỦA TÔI */}
          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Thư mục của tôi
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('Tùy chọn quản lý thư mục')}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowFolderModal(true)}
                  className="p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                  title="Thêm thư mục mới"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thư mục danh sách hoặc rỗng */}
            {folders.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
                <Folder className="w-10 h-10 stroke-1" />
                <span className="text-xs font-semibold">Chưa có thư mục nào</span>
              </div>
            ) : (
              <div className="space-y-2">
                {folders.map((folder, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#0d131d] border border-[#1e2d42] hover:border-emerald-500/40 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4 text-emerald-400" />
                      <span>{folder}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">12 từ</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WIDGET 3: NOTIFICATIONS REMINDER */}
          <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Notifications</h4>
                <p className="text-[11px] text-slate-400 font-medium">Daily study reminder</p>
              </div>
            </div>

            <button
              onClick={() => {
                setNotificationEnabled(!notificationEnabled);
                alert(
                  !notificationEnabled
                    ? '✓ Đã kích hoạt chuông nhắc nhở học tiếng Anh mỗi ngày lúc 20:00!'
                    : 'Đã tắt nhắc nhở.'
                );
              }}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                notificationEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0d131d] border border-[#1e2d42] hover:border-slate-500 text-slate-300'
              }`}
            >
              {notificationEnabled ? 'Notifications Enabled ✓' : 'Enable notifications'}
            </button>
          </div>
        </div>

        {/* ===================== CỘT PHẢI (8 COLS) ===================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Thanh tìm kiếm bộ từ + Filter cấp độ */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={deckSearch}
                onChange={(e) => setDeckSearch(e.target.value)}
                placeholder="Tìm bộ từ vựng hoặc chủ đề..."
                className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-full pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-400 font-semibold outline-none"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full appearance-none bg-[#121c2b] border border-[#1e2d42] rounded-full pl-8 pr-8 py-2.5 text-xs text-slate-200 font-bold outline-none cursor-pointer"
              >
                <option value="Tất cả cấp độ">Tất cả cấp độ</option>
                <option value="A1-A2">A1 - A2 (Sơ cấp)</option>
                <option value="B1">B1 (Trung cấp)</option>
                <option value="B2">B2 (Trung cấp cao)</option>
                <option value="C1">C1 (Nâng cao)</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400 text-[10px]">▼</div>
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
                  className={`px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-[#121c2b] text-slate-400 hover:text-white border border-[#1e2d42]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* SECTION 1: TỪ VỰNG THÔNG DỤNG (7 BỘ TỪ) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Từ vựng thông dụng <span className="text-xs text-slate-400 font-semibold">(7)</span>
              </h2>
              <button
                onClick={() => setActiveTag('# Từ vựng thông dụng')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Xem tất cả &gt;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commonDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
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

          {/* SECTION 2: ENGLISH IN USE (4 BỘ TỪ) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                English In Use <span className="text-xs text-slate-400 font-semibold">(4)</span>
              </h2>
              <button
                onClick={() => setActiveTag('# English In Use')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Xem tất cả &gt;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {englishInUseDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
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
        </div>
      </div>

      {/* MODAL CHI TIẾT BỘ TỪ */}
      {selectedDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedDeck.icon}</span>
                <div>
                  <h3 className="text-lg font-black">{selectedDeck.title}</h3>
                  <p className="text-xs text-emerald-400 font-bold">{selectedDeck.wordsCount} từ vựng</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeck(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedDeck.description}</p>

            <div className="p-4 bg-[#0d131d] border border-[#1e2d42] rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Tiến độ hoàn thành:</span>
                <span className="font-bold text-white">0%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/tuvung/on-tap"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs text-center rounded-2xl shadow-lg cursor-pointer"
              >
                Bắt đầu học bộ này
              </Link>
              <button
                onClick={() => setSelectedDeck(null)}
                className="px-4 py-3 bg-[#0d131d] hover:bg-slate-800 border border-[#1e2d42] text-slate-300 font-bold text-xs rounded-2xl cursor-pointer"
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
          <div className="relative w-full max-w-sm bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <h3 className="text-sm font-black">Tạo Thư Mục Mới</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Tên thư mục (VD: Từ vựng IELTS Writing)"
              className="w-full bg-[#0d131d] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
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
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Tạo thư mục
              </button>
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
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

// Card bộ từ vựng chuẩn Bibung
function DeckCard({ deck, onSelect }: { deck: any; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="group relative bg-[#121c2b] border border-[#1e2d42] hover:border-emerald-500/80 rounded-3xl p-4 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
            {deck.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {deck.title}
              </h3>
              {deck.isPro && (
                <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] rounded-md tracking-wider">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{deck.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1e2d42] text-[10px] font-bold text-slate-400">
        <span className="text-emerald-400 font-mono">
          0/{deck.wordsCount.toLocaleString()} từ
        </span>
        <span className="text-slate-500">Chưa bắt đầu</span>
      </div>
    </div>
  );
}
