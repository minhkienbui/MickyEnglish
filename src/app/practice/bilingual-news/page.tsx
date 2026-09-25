'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  BookOpen,
  Sparkles,
  Users,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Sun,
  Moon,
} from 'lucide-react';
import { BILINGUAL_NEWS_ARTICLES, BilingualNewsArticle } from '@/data/bilingualNewsData';
import { useThemeStore } from '@/stores/useThemeStore';

export default function BilingualNewsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [selectedProgress, setSelectedProgress] = useState<'all' | 'unread' | 'completed'>('all');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Danh sách các nhà xuất bản / nguồn báo
  const publishers = [
    { id: 'all', label: '# Tất cả nguồn' },
    { id: 'The Conversation', label: '# The Conversation' },
    { id: 'The Atlantic', label: '# The Atlantic' },
    { id: 'Reuters', label: '# Reuters' },
    { id: 'Substack', label: '# Substack' },
    { id: 'The Guardian', label: '# The Guardian' },
  ];

  // Danh sách các chủ đề
  const categories = [
    { id: 'all', label: '# Tất cả chủ đề' },
    { id: 'Khoa học & Công nghệ', label: '# Khoa học & Công nghệ' },
    { id: 'Kinh tế & Chính trị', label: '# Kinh tế & Chính trị' },
    { id: 'Đời sống & Xã hội', label: '# Đời sống & Xã hội' },
    { id: 'Sức khỏe & Môi trường', label: '# Sức khỏe & Môi trường' },
  ];

  // Lọc bài báo
  const filteredArticles = useMemo(() => {
    return BILINGUAL_NEWS_ARTICLES.filter((article) => {
      // 1. Tìm kiếm theo từ khóa
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitleEn = article.titleEn.toLowerCase().includes(query);
        const matchTitleVi = article.titleVi.toLowerCase().includes(query);
        const matchPublisher = article.publisher.toLowerCase().includes(query);
        if (!matchTitleEn && !matchTitleVi && !matchPublisher) return false;
      }

      // 2. Lọc theo độ dài
      if (selectedDuration === 'short' && article.readingTimeMinutes > 3) return false;
      if (selectedDuration === 'medium' && (article.readingTimeMinutes < 3 || article.readingTimeMinutes > 7)) return false;
      if (selectedDuration === 'long' && article.readingTimeMinutes < 8) return false;

      // 3. Lọc theo nguồn báo
      if (selectedPublisher !== 'all' && article.publisher !== selectedPublisher) return false;

      // 4. Lọc theo chủ đề
      if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;

      return true;
    });
  }, [searchQuery, selectedDuration, selectedPublisher, selectedCategory]);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 font-sans transition-colors ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* 1. Header Đọc báo song ngữ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border ${
            isLight
              ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            📰
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Đọc báo song ngữ
              <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                isLight
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                AI Powered
              </span>
            </h1>
            <p className={`text-sm sm:text-base font-medium ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Luyện đọc tin tức thực tế từ các nguồn báo chí uy tín toàn cầu, tích hợp dịch song ngữ và tra từ 1 chạm.
            </p>
          </div>
        </div>

        {/* Nút chuyển đổi Sáng / Tối */}
        <button
          onClick={toggleTheme}
          className={`self-start sm:self-auto px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 font-bold text-xs sm:text-sm ${
            isLight
              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
              : 'bg-[#121c2b] hover:bg-[#1f2d44] border-[#1e2d42] text-amber-400'
          }`}
          title="Chuyển đổi giao diện Sáng / Tối"
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-700">Nền Tối</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">Nền Sáng</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Thanh tìm kiếm & bộ lọc dropdown (Ảnh 1) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, tác giả..."
            className={`w-full pl-10 pr-4 py-3 border focus:ring-2 focus:ring-emerald-500 rounded-2xl text-sm sm:text-base transition-all outline-none ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs focus:border-emerald-500'
                : 'bg-[#121c2b] border-[#1e2d42] text-white placeholder-slate-500 hover:border-slate-600 focus:border-emerald-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Lọc độ dài */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value as any)}
            className={`border text-xs sm:text-sm font-semibold py-3 px-3.5 rounded-2xl outline-none cursor-pointer transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 shadow-xs hover:border-slate-400'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:border-slate-600'
            }`}
          >
            <option value="all">Tất cả độ dài</option>
            <option value="short">Ngắn (&lt; 3 phút)</option>
            <option value="medium">Trung bình (3-7 phút)</option>
            <option value="long">Dài (&gt; 7 phút)</option>
          </select>

          {/* Lọc tiến độ */}
          <select
            value={selectedProgress}
            onChange={(e) => setSelectedProgress(e.target.value as any)}
            className={`border text-xs sm:text-sm font-semibold py-3 px-3.5 rounded-2xl outline-none cursor-pointer transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 shadow-xs hover:border-slate-400'
                : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:border-slate-600'
            }`}
          >
            <option value="all">Tất cả tiến độ</option>
            <option value="unread">Chưa đọc</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </div>
      </div>

      {/* 3. Dải Hashtag Nguồn báo (Ảnh 1) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {publishers.map((pub) => {
            const isSelected = selectedPublisher === pub.id;
            return (
              <button
                key={pub.id}
                onClick={() => setSelectedPublisher(pub.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                    : isLight
                    ? 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 shadow-2xs'
                    : 'bg-[#121c2b] border border-[#1e2d42] text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {pub.label}
              </button>
            );
          })}
        </div>

        {/* Dải Hashtag Chủ đề (Ảnh 1) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : isLight
                    ? 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 shadow-2xs'
                    : 'bg-[#121c2b] border border-[#1e2d42] text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Grid danh sách bài báo 3 cột (Ảnh 1) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <span>Hiển thị <b className={isLight ? 'text-slate-900' : 'text-white'}>{filteredArticles.length}</b> bài báo song ngữ</span>
          {(selectedPublisher !== 'all' || selectedCategory !== 'all' || selectedDuration !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedPublisher('all');
                setSelectedCategory('all');
                setSelectedDuration('all');
                setSearchQuery('');
              }}
              className="text-emerald-500 hover:underline cursor-pointer font-bold"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} isLight={isLight} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className={`text-center py-16 border rounded-3xl p-8 space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
          }`}>
            <div className="text-4xl">📰</div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Không tìm thấy bài báo phù hợp</h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} max-w-sm mx-auto`}>
              Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc nguồn và chủ đề để xem thêm bài viết.
            </p>
            <button
              onClick={() => {
                setSelectedPublisher('all');
                setSelectedCategory('all');
                setSelectedDuration('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
            >
              Xem tất cả bài báo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Component ArticleCard hiển thị đúng theo Ảnh 1
function ArticleCard({ article, isLight }: { article: BilingualNewsArticle; isLight: boolean }) {
  return (
    <Link
      href={`/practice/bilingual-news/${article.id}`}
      className={`group block border rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer ${
        isLight
          ? 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl'
          : 'bg-[#121c2b] border-[#1e2d42] hover:border-emerald-500/70 shadow-lg hover:shadow-2xl'
      }`}
    >
      {/* 1. Phần ảnh & badge thời lượng đọc */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-gradient-to-t from-white/90 via-transparent to-black/30'
            : 'bg-gradient-to-t from-[#121c2b] via-transparent to-black/30'
        }`} />

        {/* Badge thời lượng đọc (trên cùng bên trái) */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{article.readingTime}</span>
        </div>

        {/* Badge Nhà xuất bản / Nguồn báo (trên cùng bên phải) */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white shadow">
          {article.publisher}
        </div>
      </div>

      {/* 2. Phần nội dung bài viết */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Tiêu đề tiếng Anh in đậm, to rõ */}
          <h3 className={`text-base sm:text-lg font-black group-hover:text-emerald-500 transition-colors leading-snug line-clamp-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {article.titleEn}
          </h3>
          {/* Tiêu đề tiếng Việt */}
          <p className={`text-xs sm:text-sm line-clamp-2 font-normal leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            {article.titleVi}
          </p>
        </div>

        {/* 3. Badges IELTS & TOEIC (Chuẩn ảnh 1) */}
        <div className="flex items-center gap-2 pt-1">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
            isLight
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
          }`}>
            {article.ieltsLevel}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
            isLight
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
          }`}>
            {article.toeicLevel}
          </span>
          <span className={`ml-auto text-xs font-semibold ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {article.category}
          </span>
        </div>

        {/* 4. Footer: Người đọc & Nút điều hướng */}
        <div className={`pt-3 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-slate-200' : 'border-[#1e2d42]'
        }`}>
          <div className={`flex items-center gap-1.5 text-xs ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span><b>{article.readersCount}</b> người đã đọc</span>
          </div>
          <span className="text-emerald-500 font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Đọc ngay &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
