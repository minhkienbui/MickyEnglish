'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  BookOpen,
  Sparkles,
  PenTool,
  Search,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronRight,
  Filter,
  Flame,
  Award,
} from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { pinyinInitials, allChineseRadicals214, strokeRules, RadicalItem } from '@/data/mockPinyinRadicals';

export default function PinyinRadicalsPage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'pinyin' | 'radicals' | 'stroke-rules'>('radicals');
  const [radicalSearch, setRadicalSearch] = useState('');
  const [selectedStrokeFilter, setSelectedStrokeFilter] = useState<number | 'all'>('all');

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // Group radicals by stroke count for quick overview
  const strokeCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    allChineseRadicals214.forEach((r) => {
      counts[r.strokes] = (counts[r.strokes] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredRadicals = useMemo(() => {
    return allChineseRadicals214.filter((r) => {
      const q = radicalSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.radical.toLowerCase().includes(q) ||
        r.sinoVietnamese.toLowerCase().includes(q) ||
        r.pinyin.toLowerCase().includes(q) ||
        r.meaning.toLowerCase().includes(q) ||
        `#${r.id}`.includes(q) ||
        String(r.id) === q;

      const matchStroke = selectedStrokeFilter === 'all' || r.strokes === selectedStrokeFilter;
      return matchSearch && matchStroke;
    });
  }, [radicalSearch, selectedStrokeFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6 font-sans">
      {/* 1. TOP SOVEREIGNTY BANNER & BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/practice"
          className="inline-flex items-center gap-1.5 font-cartoon text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#c53428] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trung tâm luyện tập</span>
        </Link>
        <div className="text-right">
          <p className="font-cartoon text-xs uppercase tracking-wider text-[#c53428] font-black">
            HOÀNG SA, TRƯỜNG SA LÀ CỦA VIỆT NAM
          </p>
          <p className="font-body text-[11px] text-[#c53428]/80 dark:text-[#c53428]/60">
            西沙（黄沙）群岛、南沙（长沙）群岛属于越南
          </p>
        </div>
      </div>

      {/* 2. HEADER NOTEBOOK TITLE */}
      <div className="relative bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl p-6 sm:p-8 box-sketch flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-3xl shadow-[3px_3px_0px_#292524] shrink-0">
            🀄
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-stone-900 text-amber-200 font-cartoon text-xs font-black border border-stone-800">
                NỀN TẢNG TIẾNG TRUNG
              </span>
              <span className="font-hand text-sm text-stone-600 dark:text-stone-400 font-bold">
                214 Bộ Thủ Khang Hy • Pinyin & Thuần Bút
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <h1 className="washi-tape-yellow px-3.5 py-0.5 rounded-lg font-cartoon text-2xl sm:text-3xl font-black text-stone-900 inline-block -rotate-1">
                214 Bộ Thủ Chữ Hán
              </h1>
            </div>

            <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
              Bộ thủ là "chìa khóa vàng" giải mã hơn 80.000 chữ Hán — học nghĩa, cách nhớ tượng hình và phát âm chuẩn.
            </p>
          </div>
        </div>

        {/* Action Button: Luyện viết A4 */}
        <Link
          href="/practice/hanzi-writer"
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-cartoon text-xs font-bold border-2 border-stone-800 rounded-xl shadow-[2px_2px_0px_#292524] btn-press flex items-center gap-2 transition-all self-start md:self-center shrink-0 cursor-pointer"
        >
          <PenTool className="w-4 h-4 text-[#c53428]" />
          <span>Tạo Vở Tập Viết Ô Mễ/Điền</span>
        </Link>
      </div>

      {/* 3. TABS SELECTOR (Warm Cartoon Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('radicals')}
          className={`px-5 py-2.5 rounded-xl font-cartoon text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border-2 border-stone-800 ${
            activeTab === 'radicals'
              ? 'bg-[#c53428] text-white shadow-[2px_2px_0px_#292524]'
              : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>214 Bộ Thủ Khang Hy (214 部首)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pinyin')}
          className={`px-5 py-2.5 rounded-xl font-cartoon text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border-2 border-stone-800 ${
            activeTab === 'pinyin'
              ? 'bg-[#c53428] text-white shadow-[2px_2px_0px_#292524]'
              : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Bảng Thanh Mẫu & 4 Thanh Điệu Pinyin</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stroke-rules')}
          className={`px-5 py-2.5 rounded-xl font-cartoon text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border-2 border-stone-800 ${
            activeTab === 'stroke-rules'
              ? 'bg-[#c53428] text-white shadow-[2px_2px_0px_#292524]'
              : 'bg-[#fffdfa] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>7 Quy Tắc Thuần Bút (Thứ Tự Nét)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 214 BỘ THỦ CHỮ HÁN KHANG HY                                        */}
      {/* ========================================================================= */}
      {activeTab === 'radicals' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search bar & Stroke Filter */}
          <div className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl p-4 box-sketch-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex items-center border-2 border-stone-800 rounded-xl px-3 py-2 w-full sm:w-96 bg-white dark:bg-stone-900 shadow-inner">
                <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={radicalSearch}
                  onChange={(e) => setRadicalSearch(e.target.value)}
                  placeholder="Tra chữ Hán, số #, âm Hán Việt (Nhân, Thủy, Mộc...)"
                  className="bg-transparent border-none outline-none text-xs w-full font-cartoon text-stone-900 dark:text-white"
                />
                {radicalSearch && (
                  <button
                    onClick={() => setRadicalSearch('')}
                    className="text-xs text-stone-400 hover:text-stone-700 font-bold ml-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-cartoon font-bold text-stone-600 dark:text-stone-400 self-end sm:self-auto">
                <span>Hiển thị:</span>
                <span className="washi-tape-yellow px-2 py-0.5 rounded text-stone-900 font-bold">
                  {filteredRadicals.length} / 214 bộ thủ
                </span>
              </div>
            </div>

            {/* Stroke number pills (1 to 17 strokes) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-cartoon font-bold text-stone-700 dark:text-stone-300">
                <Filter className="w-3.5 h-3.5 text-[#c53428]" />
                <span>Lọc theo số nét bút (Khang Hy):</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedStrokeFilter('all')}
                  className={`px-3 py-1 rounded-lg font-cartoon text-xs font-bold border-2 border-stone-800 transition-all cursor-pointer ${
                    selectedStrokeFilter === 'all'
                      ? 'bg-amber-300 text-stone-900 shadow-[2px_2px_0px_#292524]'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
                  }`}
                >
                  Tất cả (214)
                </button>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((s) => {
                  const count = strokeCounts[s] || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedStrokeFilter(s)}
                      className={`px-2.5 py-1 rounded-lg font-cartoon text-xs font-bold border-2 border-stone-800 transition-all cursor-pointer ${
                        selectedStrokeFilter === s
                          ? 'bg-[#c53428] text-white shadow-[2px_2px_0px_#292524]'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 shadow-xs'
                      }`}
                    >
                      {s} nét ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Radicals Grid (Warm Cartoon Notebook Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRadicals.map((rad) => {
              const mainChar = rad.baseRadical || rad.radical.charAt(0);
              return (
                <div
                  key={rad.id}
                  className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl p-4 box-sketch-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between group space-y-3"
                >
                  {/* Top Bar: #Number + Strokes badge + Audio button */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-stone-900 text-amber-200 font-cartoon text-[11px] font-black border border-stone-800">
                        #{rad.id}
                      </span>
                      <span className="font-cartoon text-xs text-stone-500 font-bold bg-amber-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-800">
                        {rad.strokes} nét
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => speak(mainChar)}
                      className="p-1.5 rounded-lg bg-amber-300 hover:bg-amber-400 text-stone-900 border border-stone-800 shadow-[1px_1px_0px_#292524] btn-press transition-colors cursor-pointer"
                      title="Nghe phát âm chuẩn Bắc Kinh"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Character & Pronunciation */}
                  <div className="flex items-baseline gap-3">
                    <span
                      onClick={() => speak(mainChar)}
                      className="font-serif text-4xl font-black text-[#c53428] cursor-pointer hover:scale-110 transition-transform"
                      title="Nhấp để nghe đọc"
                    >
                      {rad.radical}
                    </span>

                    <div>
                      <div className="font-cartoon text-sm font-black text-stone-900 dark:text-white">
                        Bộ {rad.sinoVietnamese}
                      </div>
                      <div className="font-mono text-xs text-amber-600 dark:text-amber-300 font-bold">
                        {rad.pinyin || ''}
                      </div>
                    </div>
                  </div>

                  {/* Meaning & Origin */}
                  <p className="font-body text-xs text-stone-600 dark:text-stone-300 leading-relaxed min-h-[3rem]">
                    {rad.meaning}
                  </p>

                  {/* Example words & Quick Write button */}
                  <div className="pt-2 border-t-2 border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-cartoon">
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-400 font-bold">Chữ mẫu:</span>
                      <div className="flex items-center gap-1">
                        {rad.exampleWords && rad.exampleWords.length > 0 ? (
                          rad.exampleWords.slice(0, 4).map((ex, i) => (
                            <span
                              key={i}
                              onClick={() => speak(ex)}
                              className="font-serif text-sm font-bold text-stone-800 dark:text-stone-200 hover:text-[#c53428] cursor-pointer px-1 rounded hover:bg-amber-100"
                              title={`Nghe chữ ${ex}`}
                            >
                              {ex}
                            </span>
                          ))
                        ) : (
                          <span className="font-serif text-xs text-stone-400">{mainChar}</span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/practice/hanzi-writer?char=${encodeURIComponent(mainChar)}`}
                      className="text-[11px] font-bold text-[#c53428] hover:underline flex items-center gap-0.5"
                    >
                      <span>Tập viết</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRadicals.length === 0 && (
            <div className="text-center py-12 bg-[#fffdfa] dark:bg-[#1a1714] rounded-2xl border-2 border-stone-800 box-sketch space-y-2">
              <span className="text-4xl">🔍</span>
              <h3 className="font-cartoon text-base font-bold text-stone-800 dark:text-white">
                Không tìm thấy bộ thủ phù hợp
              </h3>
              <p className="font-body text-xs text-stone-500">
                Thử tìm bằng chữ Hán, số thứ tự (#1 - #214), hoặc tên âm Hán Việt.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BẢNG NGỮ ÂM PINYIN TƯƠNG TÁC ÂM THANH                             */}
      {/* ========================================================================= */}
      {activeTab === 'pinyin' && (
        <div className="space-y-6 animate-fade-in">
          {/* Hướng dẫn 4 thanh điệu chuẩn */}
          <div className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl p-6 box-sketch space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <h3 className="font-cartoon text-lg font-black text-stone-900 dark:text-white">
                4 Thanh Điệu Trong Tiếng Trung (Four Tones)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div
                onClick={() => speak('mā')}
                className="p-4 rounded-xl bg-[#fff9ea] dark:bg-stone-800 border-2 border-stone-800 box-sketch-sm space-y-1.5 cursor-pointer btn-press hover:bg-amber-100 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-cartoon text-base font-black text-stone-900 dark:text-white">Thanh 1: ā (Âm bằng)</span>
                  <Volume2 className="w-4 h-4 text-[#c53428]" />
                </div>
                <p className="font-body text-stone-600 dark:text-stone-300">Âm cao, phẳng và ngân đều (VD: mā 妈 - Mẹ)</p>
              </div>

              <div
                onClick={() => speak('má')}
                className="p-4 rounded-xl bg-[#fff9ea] dark:bg-stone-800 border-2 border-stone-800 box-sketch-sm space-y-1.5 cursor-pointer btn-press hover:bg-amber-100 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-cartoon text-base font-black text-stone-900 dark:text-white">Thanh 2: á (Âm sắc)</span>
                  <Volume2 className="w-4 h-4 text-[#c53428]" />
                </div>
                <p className="font-body text-stone-600 dark:text-stone-300">Giống dấu sắc, đi từ trung bình lên cao (má 麻 - Cây gai)</p>
              </div>

              <div
                onClick={() => speak('mǎ')}
                className="p-4 rounded-xl bg-[#fff9ea] dark:bg-stone-800 border-2 border-stone-800 box-sketch-sm space-y-1.5 cursor-pointer btn-press hover:bg-amber-100 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-cartoon text-base font-black text-stone-900 dark:text-white">Thanh 3: ǎ (Âm hỏi)</span>
                  <Volume2 className="w-4 h-4 text-[#c53428]" />
                </div>
                <p className="font-body text-stone-600 dark:text-stone-300">Hạ thấp giọng rồi nâng lên (mǎ 马 - Con ngựa)</p>
              </div>

              <div
                onClick={() => speak('mà')}
                className="p-4 rounded-xl bg-[#fff9ea] dark:bg-stone-800 border-2 border-stone-800 box-sketch-sm space-y-1.5 cursor-pointer btn-press hover:bg-amber-100 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-cartoon text-base font-black text-stone-900 dark:text-white">Thanh 4: à (Âm rơi)</span>
                  <Volume2 className="w-4 h-4 text-[#c53428]" />
                </div>
                <p className="font-body text-stone-600 dark:text-stone-300">Dứt khoát, rơi nhanh từ cao nhất xuống thấp (mà 骂 - Mắng)</p>
              </div>
            </div>
          </div>

          {/* Lưới 23 Thanh mẫu Pinyin */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-cartoon text-xs font-black uppercase text-stone-500">
                23 THANH MẪU CĂN BẢN (NHẤP ĐỂ NGHE PHÁT ÂM):
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {pinyinInitials.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => speak(item.exampleWord)}
                  className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-xl p-3.5 box-sketch-sm hover:bg-[#fff9ea] dark:hover:bg-stone-900 cursor-pointer btn-press transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-black text-[#c53428]">
                      {item.symbol}
                    </span>
                    <span className="font-mono text-[10px] text-stone-400 font-bold">
                      {item.ipa}
                    </span>
                  </div>

                  <p className="font-body text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
                    {item.vietnameseGuide}
                  </p>

                  <div className="pt-1.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] font-cartoon">
                    <span className="text-stone-400">VD:</span>
                    <span className="font-bold text-stone-900 dark:text-white">
                      {item.exampleWord} ({item.examplePinyin})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 7 QUY TẮC THUẦN BÚT (QUY TẮC VIẾT NÉT CHỮ HÁN)                     */}
      {/* ========================================================================= */}
      {activeTab === 'stroke-rules' && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="bg-[#fff9ea] dark:bg-stone-900 border-2 border-stone-800 rounded-2xl p-4 box-sketch-sm space-y-1">
            <p className="font-cartoon text-xs font-black text-stone-900 dark:text-amber-300">
              💡 Vì sao cần học thứ tự nét viết (Thuần bút / 笔顺)?
            </p>
            <p className="font-body text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Viết đúng thứ tự nét giúp chữ Hán luôn cân đối, vuông vắn và chuẩn đẹp, giúp bạn viết nhanh mà không bị gãy nét, đồng thời nắm vững cách đếm số nét để tra cứu 214 bộ thủ chính xác.
            </p>
          </div>

          <div className="space-y-3.5">
            {strokeRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-[#fffdfa] dark:bg-[#1a1714] border-2 border-stone-800 rounded-2xl p-5 box-sketch-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-stone-800 text-stone-900 font-cartoon font-black text-sm flex items-center justify-center shadow-[1px_1px_0px_#292524]">
                    {rule.id}
                  </span>
                  <div>
                    <h4 className="font-cartoon text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                      <span>{rule.nameVi}</span>
                      <span className="font-serif text-[#c53428] font-normal">({rule.nameZh})</span>
                    </h4>
                  </div>
                </div>

                <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                  {rule.description}
                </p>

                <div className="p-3 bg-[#fff9ea] dark:bg-stone-900 rounded-xl border border-stone-800 flex items-center gap-3 text-xs flex-wrap">
                  <span className="font-cartoon text-stone-500 font-bold">Chữ ví dụ tiêu biểu:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {rule.exampleWords.map((ex, i) => (
                      <span
                        key={i}
                        onClick={() => speak(ex.charAt(0))}
                        className="font-cartoon font-bold text-stone-900 dark:text-white bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-800 shadow-xs cursor-pointer hover:bg-amber-100"
                        title="Bấm để nghe phát âm"
                      >
                        {ex} 🔊
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
