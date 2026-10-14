'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Play,
  Headphones,
  Clock,
  Eye,
  FileText,
  Filter,
  Users,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useDictationStore } from '@/stores/useDictationStore';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { mockChineseLessons } from '@/data/mockChineseLessons';
import AddVideoModal from '@/components/dictation/AddVideoModal';
import PracticeModeModal from '@/components/dictation/PracticeModeModal';
import { DictationLesson } from '@/lib/types';

export default function DictationListPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { lessons: dictationLessons } = useDictationStore();
  const { videos: adminVideos } = useAdminVideoStore();
  const { targetLanguage } = useLanguageStore();
  const isChinese = targetLanguage === 'zh';

  const [activeTag, setActiveTag] = useState('Tất cả');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả cấp độ');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedLessonForPractice, setSelectedLessonForPractice] = useState<DictationLesson | null>(null);

  const tags = useMemo(() => {
    return isChinese
      ? [
          'Tất cả',
          '# Video tải lên',
          '# Tiếng Trung',
          '# HSK 1',
          '# HSK 2',
          '# HSK 3',
          '# Khẩu ngữ',
          '# Ẩm thực',
          '# Phỏng vấn',
          '# Phim ảnh',
        ]
      : [
          'Tất cả',
          '# Video tải lên',
          '# Youtube video',
          '# TED',
          '# BBC learning english',
          '# Animals and wildlife',
          '# Short Movie',
          '# Fairy Tales',
          '# IELTS Listening',
        ];
  }, [isChinese]);

  const channels = useMemo(() => {
    if (isChinese) {
      return [
        {
          id: 'cctv-chinese',
          name: 'CCTV 4',
          count: '860',
          bgColor: 'bg-[#dc2626]',
          textColor: 'text-white font-black text-sm tracking-tight',
          initial: 'CCTV',
        },
        {
          id: 'hsk-speaking',
          name: 'Khẩu Ngữ HSK',
          count: '640',
          bgColor: 'bg-[#ea580c]',
          textColor: 'text-white font-black text-xs tracking-wider',
          initial: 'HSK',
        },
        {
          id: 'beijing-daily',
          name: 'Đời Sống Bắc Kinh',
          count: '420',
          bgColor: 'bg-[#059669]',
          textColor: 'text-white font-black text-xs',
          initial: '北京',
        },
        {
          id: 'chinese-cartoon',
          name: 'Hoạt Hình Trung',
          count: '315',
          bgColor: 'bg-[#2563eb]',
          textColor: 'text-white font-bold text-xs',
          initial: '动画',
        },
        {
          id: 'food-china',
          name: 'Ẩm Thực Trung Hoa',
          count: '280',
          bgColor: 'bg-[#d97706]',
          textColor: 'text-white font-bold text-xs',
          initial: '美食',
        },
      ];
    }
    return [
      {
        id: 'ted-ed',
        name: 'TED-Ed',
        count: '1.240',
        bgColor: 'bg-[#e62b1e]',
        textColor: 'text-white font-black text-sm tracking-tight',
        initial: 'TED-Ed',
      },
      {
        id: 'mystery-science',
        name: 'Mystery Scien...',
        count: '840',
        bgColor: 'bg-[#6d28d9]',
        textColor: 'text-white font-black text-2xl',
        initial: 'm',
      },
      {
        id: 'science-channel',
        name: 'Science Chan...',
        count: '620',
        bgColor: 'bg-[#0284c7]',
        textColor: 'text-white font-black text-xs tracking-wider',
        initial: 'SCI',
      },
      {
        id: 'bbc-earth',
        name: 'BBC Earth',
        count: '915',
        bgColor: 'bg-[#047857]',
        textColor: 'text-white font-bold text-xs',
        initial: 'BBC EARTH',
      },
      {
        id: 'kurzgesagt',
        name: 'Kurzgesagt – I...',
        count: '430',
        bgColor: 'bg-[#1e3a8a]',
        textColor: 'text-white font-bold text-xs',
        initial: '🌍',
      },
      {
        id: 'deep-look',
        name: 'Deep Look',
        count: '320',
        bgColor: 'bg-[#c2410c]',
        textColor: 'text-white font-bold text-xs',
        initial: 'Deep Look',
      },
      {
        id: 'bbc-learning',
        name: 'BBC Learning ...',
        count: '1.180',
        bgColor: 'bg-[#0f766e]',
        textColor: 'text-white font-bold text-[10px] text-center uppercase tracking-tight',
        initial: 'BBC LEARNING ENGLISH',
      },
    ];
  }, [isChinese]);

  // Hợp nhất bài học từ admin và user theo ngôn ngữ hiện tại
  const allLessons = useMemo(() => {
    const map = new Map<string, DictationLesson>();
    if (isChinese) {
      mockChineseLessons.forEach((l) => map.set(l.id, l));
      adminVideos.forEach((v) => {
        if (v.status !== 'hidden' && v.status !== 'deleted' && (v.tags?.includes('# Tiếng Trung') || /[一-龥]/.test(v.title))) {
          map.set(v.id, v);
        }
      });
      dictationLessons.forEach((l) => {
        if (l.status !== 'hidden' && l.status !== 'deleted' && (l.tags?.includes('# Tiếng Trung') || /[一-龥]/.test(l.title))) {
          map.set(l.id, l);
        }
      });
    } else {
      adminVideos.forEach((v) => {
        if (v.status !== 'hidden' && v.status !== 'deleted' && !v.tags?.includes('# Tiếng Trung') && !/[一-龥]/.test(v.title)) {
          map.set(v.id, v);
        }
      });
      dictationLessons.forEach((l) => {
        if (l.status !== 'hidden' && l.status !== 'deleted' && !l.tags?.includes('# Tiếng Trung') && !/[一-龥]/.test(l.title)) {
          map.set(l.id, l);
        }
      });
    }
    return Array.from(map.values()).sort(
      (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
    );
  }, [dictationLessons, adminVideos, isChinese]);

  // Bộ lọc tổng hợp
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lesson.speaker && lesson.speaker.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        activeTag === 'Tất cả' ||
        (activeTag === '# Video tải lên' && Boolean((lesson.videoUrl && !lesson.youtubeId) || lesson.tags?.some((t) => t.includes('tải lên')))) ||
        (lesson.tags && lesson.tags.includes(activeTag)) ||
        lesson.topic.toLowerCase().includes(activeTag.replace('#', '').trim().toLowerCase());

      const matchesLevel =
        selectedLevel === 'Tất cả cấp độ' ||
        lesson.level?.toUpperCase() === selectedLevel.toUpperCase();

      const matchesChannel =
        !selectedChannel ||
        lesson.channel?.toLowerCase().includes(selectedChannel.toLowerCase()) ||
        lesson.topic.toLowerCase().includes(selectedChannel.toLowerCase());

      return matchesSearch && matchesTag && matchesLevel && matchesChannel;
    });
  }, [allLessons, searchQuery, activeTag, selectedLevel, selectedChannel]);

  // Nhóm bài học theo sections
  const uploadsSection = useMemo(() => {
    return filteredLessons.filter(
      (l) => Boolean(l.videoUrl && !l.youtubeId) || (l.tags && l.tags.some((t) => t.includes('tải lên') || t.includes('Video của tôi')))
    );
  }, [filteredLessons]);
  const youtubeSection = useMemo(() => {
    return filteredLessons.filter(
      (l) =>
        l.topic.toLowerCase().includes('youtube') ||
        (l.tags && l.tags.some((t) => t.includes('Youtube'))) ||
        (!l.topic.toLowerCase().includes('ted') && !l.topic.toLowerCase().includes('bbc'))
    );
  }, [filteredLessons]);

  const tedSection = useMemo(() => {
    return filteredLessons.filter(
      (l) =>
        l.topic.toLowerCase().includes('ted') ||
        (l.tags && l.tags.some((t) => t.includes('TED'))) ||
        l.channel?.toLowerCase().includes('ted')
    );
  }, [filteredLessons]);

  const bbcSection = useMemo(() => {
    return filteredLessons.filter(
      (l) =>
        l.topic.toLowerCase().includes('bbc') ||
        (l.tags && l.tags.some((t) => t.includes('BBC'))) ||
        l.channel?.toLowerCase().includes('bbc')
    );
  }, [filteredLessons]);

  const chineseSpeakingSection = useMemo(() => {
    return filteredLessons.filter(
      (l) => l.tags?.some((t) => t.includes('Khẩu ngữ') || t.includes('HSK 1') || t.includes('HSK 2')) || l.topic.toLowerCase().includes('khẩu ngữ')
    );
  }, [filteredLessons]);

  const chineseCultureSection = useMemo(() => {
    return filteredLessons.filter(
      (l) => l.tags?.some((t) => t.includes('Ẩm thực') || t.includes('Phim') || t.includes('HSK 3')) || l.topic.toLowerCase().includes('ẩm thực')
    );
  }, [filteredLessons]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      {/* Top Search & Filter Bar chuẩn Warm Notebook */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm video bài học, chủ đề..."
            className="w-full bg-white dark:bg-stone-900 border-2 border-stone-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 font-semibold outline-none shadow-[2px_2px_0px_#292524]"
          />
        </div>

        {/* Dropdown Tất cả cấp độ */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-stone-900 border-2 border-stone-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-stone-900 dark:text-white font-cartoon font-bold outline-none cursor-pointer shadow-[2px_2px_0px_#292524]"
            >
              <option value="Tất cả cấp độ">Tất cả cấp độ</option>
              {isChinese ? (
                <>
                  <option value="HSK 1">HSK 1 - Căn bản</option>
                  <option value="HSK 2">HSK 2 - Sơ cấp</option>
                  <option value="HSK 3">HSK 3 - Trung cấp</option>
                  <option value="HSK 4">HSK 4 - Trung cấp cao</option>
                  <option value="HSK 5">HSK 5 - Nâng cao</option>
                  <option value="HSK 6">HSK 6 - Thành thạo</option>
                </>
              ) : (
                <>
                  <option value="A1">A1 - Căn bản</option>
                  <option value="A2">A2 - Sơ cấp</option>
                  <option value="B1">B1 - Trung cấp</option>
                  <option value="B2">B2 - Trung cấp cao</option>
                  <option value="C1">C1 - Nâng cao</option>
                  <option value="C2">C2 - Thành thạo</option>
                </>
              )}
            </select>
            <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-stone-400 text-[10px]">▼</div>
          </div>

          {/* Button Bài học cộng đồng */}
          <button
            type="button"
            onClick={() => setShowCommunityModal(true)}
            className="py-2.5 px-4 bg-[#fffdfa] dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-cartoon font-bold rounded-xl border-2 border-stone-800 flex items-center gap-2 shadow-[2px_2px_0px_#292524] btn-press transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-amber-600" />
            Bài học cộng đồng
          </button>

          {/* Button + Thêm video */}
          <button
            type="button"
            onClick={() => setShowAddVideoModal(true)}
            className={`py-2.5 px-5 font-cartoon text-xs font-bold rounded-xl border-2 border-stone-800 flex items-center gap-1.5 shadow-[3px_3px_0px_#292524] btn-press transition-transform hover:scale-105 cursor-pointer shrink-0 whitespace-nowrap ${
              isChinese
                ? 'bg-[#c53428] hover:bg-[#b02c21] text-white'
                : 'bg-amber-300 hover:bg-amber-400 text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4" /> Thêm video
          </button>
        </div>
      </div>

      {/* Category Pills (Tags) kiểu nhãn dán hoạt hình */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(tag);
                setSelectedChannel(null);
              }}
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

      {/* SECTION 1: Khám phá theo kênh */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            Khám phá theo kênh <span className="font-hand text-sm text-stone-500">(7.093 bài học)</span>
          </h2>
          <button
            onClick={() => setSelectedChannel(null)}
            className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>

        {/* Channels Circular Carousel */}
        <div className="flex items-center gap-5 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {channels.map((ch) => {
            const isSelected = selectedChannel === ch.name;
            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChannel(isSelected ? null : ch.name)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
              >
                <div
                  className={`w-18 h-18 rounded-2xl ${ch.bgColor} flex items-center justify-center transition-transform group-hover:scale-105 border-2 border-stone-800 shadow-[3px_3px_0px_#292524] ${
                    isSelected ? 'ring-3 ring-amber-400 scale-105' : ''
                  }`}
                >
                  <span className={`${ch.textColor} select-none px-1 text-center font-cartoon`}>{ch.initial}</span>
                </div>
                <span
                  className={`font-cartoon text-xs font-bold text-center max-w-[80px] truncate ${
                    isSelected ? 'text-[#c53428] dark:text-amber-400' : 'text-stone-700 dark:text-stone-300 group-hover:text-stone-900'
                  }`}
                >
                  {ch.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: Video tải lên */}
      {uploadsSection.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span>📁 Video của bạn (Lưu trên website)</span>
              </h2>
              <span className="px-2 py-0.5 bg-amber-200 border border-stone-800 text-stone-900 font-cartoon text-xs font-bold rounded-full">
                {uploadsSection.length}
              </span>
            </div>
            <button
              onClick={() => setActiveTag('# Video tải lên')}
              className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline transition-colors cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {uploadsSection.map((lesson) => (
              <VideoCard
                key={lesson.id}
                lesson={lesson}
                onSelect={() => setSelectedLessonForPractice(lesson)}
              />
            ))}
          </div>
        </section>
      )}

      {isChinese ? (
        <>
          {/* SECTION CHINESE 1: Khẩu ngữ giao tiếp HSK */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">Khẩu ngữ giao tiếp HSK 1 - 2</h2>
                <span className="px-2 py-0.5 bg-red-100 border border-stone-800 text-[#c53428] font-cartoon text-xs font-bold rounded-full">
                  {chineseSpeakingSection.length || filteredLessons.length} bài
                </span>
              </div>
              <button
                onClick={() => setActiveTag('# Khẩu ngữ')}
                className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline transition-colors cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(chineseSpeakingSection.length > 0 ? chineseSpeakingSection : filteredLessons).slice(0, 6).map((lesson) => (
                <VideoCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={() => setSelectedLessonForPractice(lesson)}
                />
              ))}
            </div>
          </section>

          {/* SECTION CHINESE 2: Ẩm thực & Đời sống HSK */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">Ẩm thực & Đời sống HSK 2 - 3</h2>
                <span className="px-2 py-0.5 bg-red-100 border border-stone-800 text-[#c53428] font-cartoon text-xs font-bold rounded-full">
                  {chineseCultureSection.length || filteredLessons.length} bài
                </span>
              </div>
              <button
                onClick={() => setActiveTag('# Ẩm thực')}
                className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline transition-colors cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(chineseCultureSection.length > 0 ? chineseCultureSection : filteredLessons.slice().reverse()).slice(0, 6).map((lesson) => (
                <VideoCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={() => setSelectedLessonForPractice(lesson)}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* SECTION 2: Youtube video */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">Youtube video</h2>
                <span className="px-2 py-0.5 bg-amber-200 border border-stone-800 text-stone-900 font-cartoon text-xs font-bold rounded-full">
                  {youtubeSection.length || 278}
                </span>
              </div>
              <button
                onClick={() => setActiveTag('# Youtube video')}
                className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline transition-colors cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {youtubeSection.slice(0, 6).map((lesson) => (
                <VideoCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={() => setSelectedLessonForPractice(lesson)}
                />
              ))}
            </div>
          </section>

          {/* SECTION 3: TED */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">TED</h2>
                <span className="px-2 py-0.5 bg-amber-200 border border-stone-800 text-stone-900 font-cartoon text-xs font-bold rounded-full">
                  {tedSection.length || 247}
                </span>
              </div>
              <button
                onClick={() => setActiveTag('# TED')}
                className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline transition-colors cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tedSection.slice(0, 6).map((lesson) => (
                <VideoCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={() => setSelectedLessonForPractice(lesson)}
                />
              ))}
            </div>
          </section>

          {/* SECTION 4: BBC learning english */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">BBC learning english</h2>
                <span className="px-2 py-0.5 bg-amber-200 border border-stone-800 text-stone-900 font-cartoon text-xs font-bold rounded-full">
                  {bbcSection.length || 173}
                </span>
              </div>
              <button
                onClick={() => setActiveTag('# BBC learning english')}
                className="font-cartoon text-xs font-bold text-[#c53428] dark:text-amber-400 hover:underline transition-colors cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bbcSection.slice(0, 6).map((lesson) => (
                <VideoCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={() => setSelectedLessonForPractice(lesson)}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* MODAL CHỌN CHẾ ĐỘ HỌC */}
      <PracticeModeModal
        lesson={selectedLessonForPractice}
        isOpen={!!selectedLessonForPractice}
        onClose={() => setSelectedLessonForPractice(null)}
      />

      {/* MODAL THÊM VIDEO TỪ YOUTUBE */}
      <AddVideoModal
        isOpen={showAddVideoModal}
        onClose={() => setShowAddVideoModal(false)}
      />

      {/* MODAL BÀI HỌC CỘNG ĐỒNG */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 box-sketch rounded-2xl p-6 text-stone-900 dark:text-white space-y-4">
            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h3 className="font-cartoon text-lg font-bold">Bài Học Do Cộng Đồng Đóng Góp</h3>
              </div>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="text-stone-400 hover:text-stone-900 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <p className="font-hand text-sm text-stone-600 dark:text-stone-400">
              Khám phá các video được cộng đồng học viên chia sẻ kèm phân đoạn phụ đề chuẩn từng câu.
            </p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {allLessons.slice(0, 6).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonForPractice(lesson);
                    setShowCommunityModal(false);
                  }}
                  className="flex items-center justify-between p-3 bg-[#fff9ea] dark:bg-stone-900 border-2 border-stone-800 rounded-xl cursor-pointer hover:bg-amber-100 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={lesson.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-16 h-10 object-cover rounded-lg border border-stone-800"
                    />
                    <div>
                      <h4 className="font-cartoon text-xs font-bold text-stone-900 dark:text-white line-clamp-1">{lesson.title}</h4>
                      <span className="font-hand text-xs text-stone-500">Cấp độ: {lesson.level || 'B1'} • {lesson.sentences?.length || 5} câu</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-amber-400 text-stone-900 border border-stone-800 rounded-lg font-cartoon text-xs font-bold shadow-xs">
                    Học ngay
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Card bài học phong cách Sổ tay hoạt hình 3D
function VideoCard({ lesson, onSelect }: { lesson: DictationLesson; onSelect: () => void }) {
  const isC1 = lesson.level === 'C1' || lesson.level === 'C2' || lesson.level === 'HSK 5' || lesson.level === 'HSK 6';
  const minutes = Math.floor((lesson.duration || 60) / 60);
  const seconds = ((lesson.duration || 60) % 60).toString().padStart(2, '0');

  return (
    <div
      onClick={onSelect}
      className="group relative bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl overflow-hidden box-sketch-sm hover:shadow-[5px_5px_0px_#292524] transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* Thumbnail */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-stone-900 border-b-2 border-stone-800">
        <img
          src={
            lesson.thumbnail ||
            (lesson.youtubeId ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg` : '') ||
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
          }
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Local Video Upload Badge */}
        {Boolean(lesson.videoUrl && !lesson.youtubeId) && (
          <div className="absolute top-2.5 left-2.5 bg-amber-300 border border-stone-800 text-stone-900 font-cartoon font-bold text-[10px] px-2 py-0.5 rounded shadow-sm z-10">
            <span>📁 Tải lên</span>
          </div>
        )}

        {/* Level Badge */}
        <div
          className={`absolute top-2.5 right-2.5 font-cartoon font-bold text-[10px] px-2.5 py-0.5 rounded border border-stone-800 shadow-sm ${
            isC1 ? 'bg-[#c53428] text-white' : 'bg-amber-300 text-stone-900'
          }`}
        >
          {lesson.level || 'B1'}
        </div>

        {/* Duration bottom left */}
        <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded font-cartoon text-[10px] font-bold text-white flex items-center gap-1 border border-stone-700">
          <Clock className="w-2.5 h-2.5 text-amber-400" />
          {minutes}:{seconds}
        </div>

        {/* Views bottom right */}
        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded font-cartoon text-[10px] font-bold text-white flex items-center gap-1 border border-stone-700">
          <Headphones className="w-2.5 h-2.5 text-amber-400" />
          {(lesson.views || 680) > 999
            ? `${((lesson.views || 680) / 1000).toFixed(1)}K`
            : `${lesson.views || 680}`}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {lesson.speaker && (
            <span className="font-hand text-xs text-stone-500 block">
              - {lesson.speaker}
            </span>
          )}
          <h3 className="font-cartoon text-xs sm:text-sm font-bold text-stone-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#c53428] transition-colors">
            {lesson.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-cartoon text-[11px] font-bold text-stone-600 dark:text-stone-400">
          <span>{lesson.sentences?.length || 5} câu nhại</span>
          <span className="text-[#c53428] dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">Vào học ➔</span>
        </div>
      </div>
    </div>
  );
}

