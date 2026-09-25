'use client';

import { useState, useMemo } from 'react';
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
import AddVideoModal from '@/components/dictation/AddVideoModal';
import PracticeModeModal from '@/components/dictation/PracticeModeModal';
import { DictationLesson } from '@/lib/types';

export default function DictationListPage() {
  const { lessons: dictationLessons } = useDictationStore();
  const { videos: adminVideos } = useAdminVideoStore();

  const [activeTag, setActiveTag] = useState('Tất cả');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả cấp độ');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedLessonForPractice, setSelectedLessonForPractice] = useState<DictationLesson | null>(null);

  const tags = [
    'Tất cả',
    '# Youtube video',
    '# TED',
    '# BBC learning english',
    '# Animals and wildlife',
    '# Short Movie',
    '# Fairy Tales',
    '# IELTS Listening',
  ];

  const channels = [
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

  // Hợp nhất bài học từ admin và user
  const allLessons = useMemo(() => {
    const map = new Map<string, DictationLesson>();
    adminVideos.forEach((v) => {
      if (v.status !== 'hidden' && v.status !== 'deleted') {
        map.set(v.id, v);
      }
    });
    dictationLessons.forEach((l) => {
      if (l.status !== 'hidden' && l.status !== 'deleted') {
        map.set(l.id, l);
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)
    );
  }, [dictationLessons, adminVideos]);

  // Bộ lọc tổng hợp
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lesson.speaker && lesson.speaker.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        activeTag === 'Tất cả' ||
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans">
      {/* Top Search & Filter Bar chuẩn ảnh Bibung */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm video..."
            className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-full pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-400 font-semibold outline-none transition-colors"
          />
        </div>

        {/* Dropdown Tất cả cấp độ */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full appearance-none bg-[#121c2b] border border-[#1e2d42] hover:border-slate-600 rounded-full pl-9 pr-8 py-2.5 text-xs text-slate-200 font-bold outline-none cursor-pointer"
            >
              <option value="Tất cả cấp độ">Tất cả cấp độ</option>
              <option value="A1">A1 - Căn bản</option>
              <option value="A2">A2 - Sơ cấp</option>
              <option value="B1">B1 - Trung cấp</option>
              <option value="B2">B2 - Trung cấp cao</option>
              <option value="C1">C1 - Nâng cao</option>
              <option value="C2">C2 - Thành thạo</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
          </div>

          {/* Button Bài học cộng đồng */}
          <button
            type="button"
            onClick={() => setShowCommunityModal(true)}
            className="py-2.5 px-4 bg-[#121c2b] hover:bg-[#1a273a] text-slate-200 text-xs font-bold rounded-full border border-[#1e2d42] flex items-center gap-2 shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Bài học cộng đồng
          </button>

          {/* Button + Thêm video */}
          <button
            type="button"
            onClick={() => setShowAddVideoModal(true)}
            className="py-2.5 px-5 bg-[#00c950] hover:bg-[#00b046] text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Thêm video
          </button>
        </div>
      </div>

      {/* Category Pills (Tags) với underline xanh khi active */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-[#1e2d42]/50">
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(tag);
                setSelectedChannel(null);
              }}
              className={`pb-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer relative ${
                isActive ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tag}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Khám phá theo kênh (7.093 bài học) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            Khám phá theo kênh <span className="text-xs text-slate-400 font-semibold">(7.093 bài học)</span>
          </h2>
          <button
            onClick={() => setSelectedChannel(null)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>

        {/* Channels Circular Carousel */}
        <div className="flex items-center gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none">
          {channels.map((ch) => {
            const isSelected = selectedChannel === ch.name;
            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChannel(isSelected ? null : ch.name)}
                className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              >
                <div
                  className={`w-20 h-20 rounded-full ${ch.bgColor} flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 border-2 ${
                    isSelected ? 'border-emerald-400 ring-4 ring-emerald-500/20' : 'border-white/10'
                  }`}
                >
                  <span className={`${ch.textColor} select-none px-1 text-center`}>{ch.initial}</span>
                </div>
                <span
                  className={`text-xs font-bold text-center max-w-[80px] truncate ${
                    isSelected ? 'text-emerald-400' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {ch.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Youtube video */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white">Youtube video</h2>
            <span className="px-2 py-0.5 bg-[#131d2b] border border-[#1e2d42] text-slate-400 text-xs font-bold rounded-full">
              {youtubeSection.length || 278}
            </span>
          </div>
          <button
            onClick={() => setActiveTag('# Youtube video')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {youtubeSection.slice(0, 4).map((lesson) => (
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
            <h2 className="text-base sm:text-lg font-black text-white">TED</h2>
            <span className="px-2 py-0.5 bg-[#131d2b] border border-[#1e2d42] text-slate-400 text-xs font-bold rounded-full">
              {tedSection.length || 247}
            </span>
          </div>
          <button
            onClick={() => setActiveTag('# TED')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tedSection.slice(0, 4).map((lesson) => (
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
            <h2 className="text-base sm:text-lg font-black text-white">BBC learning english</h2>
            <span className="px-2 py-0.5 bg-[#131d2b] border border-[#1e2d42] text-slate-400 text-xs font-bold rounded-full">
              {bbcSection.length || 173}
            </span>
          </div>
          <button
            onClick={() => setActiveTag('# BBC learning english')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bbcSection.slice(0, 4).map((lesson) => (
            <VideoCard
              key={lesson.id}
              lesson={lesson}
              onSelect={() => setSelectedLessonForPractice(lesson)}
            />
          ))}
        </div>
      </section>

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
          <div className="relative w-full max-w-2xl bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2d42] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black">Bài Học Do Cộng Đồng Đóng Góp</h3>
              </div>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Khám phá các video tiếng Anh được người học chia sẻ kèm phân đoạn phụ đề chất lượng cao.
            </p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {allLessons.slice(0, 6).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonForPractice(lesson);
                    setShowCommunityModal(false);
                  }}
                  className="flex items-center justify-between p-3 bg-[#0d131d] border border-[#1e2d42] hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={lesson.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-16 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{lesson.title}</h4>
                      <span className="text-[10px] text-slate-400">Cấp độ: {lesson.level || 'B1'} • {lesson.sentences?.length || 5} câu</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
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

// Card bài học chuẩn phong cách Bibung
function VideoCard({ lesson, onSelect }: { lesson: DictationLesson; onSelect: () => void }) {
  const isC1 = lesson.level === 'C1' || lesson.level === 'C2';
  const minutes = Math.floor((lesson.duration || 60) / 60);
  const seconds = ((lesson.duration || 60) % 60).toString().padStart(2, '0');

  return (
    <div
      onClick={onSelect}
      className="group relative bg-[#121c2b] border border-[#1e2d42] hover:border-emerald-500/80 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
        <img
          src={
            lesson.thumbnail ||
            (lesson.youtubeId ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg` : '') ||
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
          }
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Level Badge (Xanh dương cho B1, Đỏ cho C1 như ảnh Bibung) */}
        <div
          className={`absolute top-2.5 right-2.5 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md ${
            isC1 ? 'bg-[#ef4444] text-white' : 'bg-[#2563eb] text-white'
          }`}
        >
          {lesson.level || 'B1'}
        </div>

        {/* Duration bottom left */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-slate-300" />
          {minutes}:{seconds}
        </div>

        {/* Views bottom right with Headphones icon */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
          <Headphones className="w-2.5 h-2.5 text-slate-300" />
          {(lesson.views || 680) > 999
            ? `${((lesson.views || 680) / 1000).toFixed(1)}K views`
            : `${lesson.views || 680} views`}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {lesson.speaker && (
            <span className="text-[10px] font-medium text-slate-400 block">
              - {lesson.speaker}
            </span>
          )}
          <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
            {lesson.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
