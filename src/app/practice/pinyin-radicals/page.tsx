'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { pinyinInitials, topChineseRadicals, strokeRules } from '@/data/mockPinyinRadicals';

export default function PinyinRadicalsPage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'pinyin' | 'radicals' | 'stroke-rules'>('pinyin');
  const [radicalSearch, setRadicalSearch] = useState('');
  const [selectedStrokeFilter, setSelectedStrokeFilter] = useState<number | 'all'>('all');

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.85; // tốc độ chuẩn để người học nghe rõ
      window.speechSynthesis.speak(u);
    }
  };

  const filteredRadicals = topChineseRadicals.filter((r) => {
    const matchSearch =
      r.radical.includes(radicalSearch) ||
      r.sinoVietnamese.toLowerCase().includes(radicalSearch.toLowerCase()) ||
      r.pinyin.toLowerCase().includes(radicalSearch.toLowerCase()) ||
      r.meaning.toLowerCase().includes(radicalSearch.toLowerCase());

    const matchStroke = selectedStrokeFilter === 'all' || r.strokes === selectedStrokeFilter;
    return matchSearch && matchStroke;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-[#1e2d42]">
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="p-2.5 rounded-xl border border-[#1e2d42] hover:bg-[#121c2b] text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Nền Tảng HSK 3.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Bảng Ngữ Âm Pinyin & 214 Bộ Thủ Chữ Hán
            </h1>
            <p className="text-xs text-slate-400">
              Nhấp vào từng âm để nghe phát âm chuẩn bản xứ Bắc Kinh • Nắm vững cấu tạo chữ Hán và quy tắc viết nét bút.
            </p>
          </div>
        </div>

        <Link
          href="/practice/hanzi-writer"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all"
        >
          <PenTool className="w-4 h-4" />
          <span>Tạo Vở Tập Viết A4</span>
        </Link>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('pinyin')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pinyin'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 scale-105'
              : isLight
              ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638] border border-[#1e2d42]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Bảng Thanh Mẫu & Ngữ Âm Pinyin</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('radicals')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'radicals'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 scale-105'
              : isLight
              ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638] border border-[#1e2d42]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bảng Bộ Thủ Cốt Lõi (Radicals)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stroke-rules')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'stroke-rules'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 scale-105'
              : isLight
              ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              : 'bg-[#121c2b] text-slate-300 hover:bg-[#182638] border border-[#1e2d42]'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>7 Quy Tắc Thuần Bút (Nét Viết)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BẢNG NGỮ ÂM PINYIN TƯƠNG TÁC ÂM THANH                             */}
      {/* ========================================================================= */}
      {activeTab === 'pinyin' && (
        <div className="space-y-6 animate-fade-in">
          {/* Hướng dẫn 4 thanh điệu */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            <h3 className="text-base font-black text-rose-400 flex items-center gap-2">
              <span>4 Thanh Điệu Trong Tiếng Trung (Tones)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div
                onClick={() => speak('mā')}
                className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-1 cursor-pointer hover:border-rose-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-white">Thanh 1: ā</span>
                  <Volume2 className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-slate-400 font-medium">Âm bằng, cao và phẳng (VD: mā 妈 - mẹ)</p>
              </div>

              <div
                onClick={() => speak('má')}
                className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-1 cursor-pointer hover:border-rose-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-white">Thanh 2: á</span>
                  <Volume2 className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-slate-400 font-medium">Giống dấu sắc, đi từ trung bình lên cao (má 麻)</p>
              </div>

              <div
                onClick={() => speak('mǎ')}
                className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-1 cursor-pointer hover:border-rose-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-white">Thanh 3: ǎ</span>
                  <Volume2 className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-slate-400 font-medium">Giống dấu hỏi, hạ thấp giọng rồi nâng lên (mǎ 马 - ngựa)</p>
              </div>

              <div
                onClick={() => speak('mà')}
                className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-1 cursor-pointer hover:border-rose-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-white">Thanh 4: à</span>
                  <Volume2 className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-slate-400 font-medium">Dứt khoát, đi từ cao nhất rơi xuống thấp nhất (mà 骂)</p>
              </div>
            </div>
          </div>

          {/* Lưới 23 Thanh mẫu Pinyin */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              23 Thanh Mẫu Căn Bản (Bấm để nghe phát âm mẫu):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {pinyinInitials.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => speak(item.exampleWord)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-105 space-y-2 group shadow-md ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-rose-500'
                      : 'bg-[#111a28] border-[#1e2d42] hover:border-rose-500 hover:bg-[#152338]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-rose-400 group-hover:scale-110 transition-transform">
                      {item.symbol}
                    </span>
                    <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">IPA: {item.ipa}</div>

                  <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                    {item.vietnameseGuide}
                  </p>

                  <div className="pt-1 border-t border-slate-700/20 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-white font-serif">{item.exampleWord}</span>
                    <span className="text-rose-400">{item.examplePinyin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BẢNG 214 BỘ THỦ CHỮ HÁN                                            */}
      {/* ========================================================================= */}
      {activeTab === 'radicals' && (
        <div className="space-y-6 animate-fade-in">
          {/* Thanh tìm kiếm bộ thủ */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className={`relative flex items-center border rounded-2xl px-3.5 py-2 w-full sm:w-80 shadow-xs focus-within:border-rose-500 transition-all ${
              isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#121c2b] border-[#1e2d42] text-slate-200'
            }`}>
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={radicalSearch}
                onChange={(e) => setRadicalSearch(e.target.value)}
                placeholder="Tra bộ thủ, âm Hán Việt, ý nghĩa..."
                className="bg-transparent border-none outline-none text-xs w-full font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 font-bold">Lọc theo số nét:</span>
              {(['all', 1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStrokeFilter(s)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedStrokeFilter === s
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#121c2b] text-slate-400 hover:text-white border border-[#1e2d42]'
                  }`}
                >
                  {s === 'all' ? 'Tất cả' : `${s} nét`}
                </button>
              ))}
            </div>
          </div>

          {/* Lưới danh sách bộ thủ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRadicals.map((rad) => (
              <div
                key={rad.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 shadow-md hover:border-rose-500/80 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => speak(rad.radical.charAt(0))}
                      className="font-serif text-3xl font-black text-rose-500 cursor-pointer hover:scale-110 transition-transform"
                      title="Bấm để nghe phát âm"
                    >
                      {rad.radical}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold">
                      {rad.strokes} nét
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => speak(rad.radical.charAt(0))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#121c2b] transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-black text-white">
                    Bộ {rad.sinoVietnamese} ({rad.pinyin})
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-0.5">
                    {rad.meaning}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/20 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Chữ chứa bộ:</span>
                  <span className="font-serif text-xs font-bold text-white tracking-widest">
                    {rad.exampleWords.join(' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 7 QUY TẮC THUẦN BÚT (QUY TẮC VIẾT NÉT CHỮ HÁN)                     */}
      {/* ========================================================================= */}
      {activeTab === 'stroke-rules' && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
            <p className="font-black">💡 Vì sao cần học thứ tự nét viết (Thuần bút)?</p>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Viết đúng thứ tự nét giúp chữ Hán cân đối, vuông vắn, viết nhanh mà không bị mỏi tay, đồng thời giúp bạn dễ dàng đếm số nét để tra từ điển tiếng Trung chính xác.
            </p>
          </div>

          <div className="space-y-4">
            {strokeRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-6 rounded-3xl border shadow-lg space-y-3 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center">
                      {rule.id}
                    </span>
                    <div>
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <span>{rule.nameVi}</span>
                        <span className="font-serif text-rose-400 font-normal">({rule.nameZh})</span>
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {rule.description}
                </p>

                <div className="p-3 bg-[#0d1420] rounded-2xl border border-[#1e2d42] flex items-center gap-4 text-xs">
                  <span className="text-slate-400 font-bold">Chữ ví dụ tiêu biểu:</span>
                  <div className="flex items-center gap-3">
                    {rule.exampleWords.map((ex, i) => (
                      <span key={i} className="font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                        {ex}
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
