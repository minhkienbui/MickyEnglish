'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  FileDown,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Check,
  Grid,
  Settings2,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

interface HanziCharData {
  char: string;
  pinyin: string;
  sinoVi: string;
  meaning: string;
  strokes: number;
}

const PRESET_CHAR_SETS: { label: string; chars: HanziCharData[] }[] = [
  {
    label: 'HSK 1 Căn bản',
    chars: [
      { char: '你', pinyin: 'nǐ', sinoVi: 'Nhĩ', meaning: 'Bạn, anh, chị', strokes: 7 },
      { char: '好', pinyin: 'hǎo', sinoVi: 'Hảo', meaning: 'Tốt, đẹp, khỏe', strokes: 6 },
      { char: '我', pinyin: 'wǒ', sinoVi: 'Ngã', meaning: 'Tôi, mình, tao', strokes: 7 },
      { char: '爱', pinyin: 'ài', sinoVi: 'Ái', meaning: 'Yêu, quý trọng', strokes: 10 },
      { char: '学', pinyin: 'xué', sinoVi: 'Học', meaning: 'Học tập, bắt chước', strokes: 8 },
      { char: '习', pinyin: 'xí', sinoVi: 'Tập', meaning: 'Thực hành, ôn tập', strokes: 3 },
      { char: '中', pinyin: 'zhōng', sinoVi: 'Trung', meaning: 'Ở giữa, nước Trung', strokes: 4 },
      { char: '国', pinyin: 'guó', sinoVi: 'Quốc', meaning: 'Đất nước, quốc gia', strokes: 8 },
    ],
  },
  {
    label: 'Số đếm 1-10',
    chars: [
      { char: '一', pinyin: 'yī', sinoVi: 'Nhất', meaning: 'Số một (1)', strokes: 1 },
      { char: '二', pinyin: 'èr', sinoVi: 'Nhị', meaning: 'Số hai (2)', strokes: 2 },
      { char: '三', pinyin: 'sān', sinoVi: 'Tam', meaning: 'Số ba (3)', strokes: 3 },
      { char: '四', pinyin: 'sì', sinoVi: 'Tứ', meaning: 'Số bốn (4)', strokes: 5 },
      { char: '五', pinyin: 'wǔ', sinoVi: 'Ngũ', meaning: 'Số năm (5)', strokes: 4 },
      { char: '六', pinyin: 'liù', sinoVi: 'Lục', meaning: 'Số sáu (6)', strokes: 4 },
      { char: '七', pinyin: 'qī', sinoVi: 'Thất', meaning: 'Số bảy (7)', strokes: 2 },
      { char: '八', pinyin: 'bā', sinoVi: 'Bát', meaning: 'Số tám (8)', strokes: 2 },
      { char: '九', pinyin: 'jiǔ', sinoVi: 'Cửu', meaning: 'Số chín (9)', strokes: 2 },
      { char: '十', pinyin: 'shí', sinoVi: 'Thập', meaning: 'Số mười (10)', strokes: 2 },
    ],
  },
  {
    label: 'Gia đình & Xưng hô',
    chars: [
      { char: '爸', pinyin: 'bà', sinoVi: 'Ba', meaning: 'Bố, cha', strokes: 8 },
      { char: '妈', pinyin: 'mā', sinoVi: 'Ma', meaning: 'Mẹ, má', strokes: 6 },
      { char: '哥', pinyin: 'gē', sinoVi: 'Ca', meaning: 'Anh trai', strokes: 10 },
      { char: '弟', pinyin: 'dì', sinoVi: 'Đệ', meaning: 'Em trai', strokes: 7 },
      { char: '姐', pinyin: 'jiě', sinoVi: 'Tỷ', meaning: 'Chị gái', strokes: 8 },
      { char: '妹', pinyin: 'mèi', sinoVi: 'Muội', meaning: 'Em gái', strokes: 8 },
    ],
  },
];

export default function HanziWriterPage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [inputCharsText, setInputCharsText] = useState('你好中国学习');
  const [gridStyle, setGridStyle] = useState<'mi' | 'tian'>('mi'); // mi = 米字格 (Mễ), tian = 田字格 (Điền)
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [repeatCount, setRepeatCount] = useState<number>(8); // số ô tập viết mỗi hàng
  const [customHeaderTitle, setCustomHeaderTitle] = useState('VỞ LUYỆN VIẾT CHỮ HÁN • MICKY CHINESE');

  // Tách từng chữ Hán hợp lệ
  const parsedCharacters = inputCharsText
    .split('')
    .filter((c) => /[一-龥]/.test(c));

  const handlePrint = () => {
    window.print();
  };

  const speakHanzi = (char: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(char);
      u.lang = 'zh-CN';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* HEADER CONTROL BAR (Ẩn khi in ấn @media print) */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-[#1e2d42]">
          <div className="flex items-center gap-3">
            <Link
              href="/practice"
              className="p-2 rounded-xl border border-[#1e2d42] hover:bg-[#121c2b] text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Tạo Vở Luyện Viết Chữ Hán</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  Chuẩn Khổ A4
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Tự động tạo ô chữ Mễ (米字格) và ô chữ Điền (田字格) có chữ mờ tập tô, sẵn sàng xuất file PDF hoặc in trực tiếp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In / Lưu PDF A4</span>
            </button>
          </div>
        </div>

        {/* CẤU HÌNH TẠO FILE TẬP VIẾT */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
        }`}>
          <div className="space-y-2">
            <label className="text-xs font-black text-white flex items-center justify-between">
              <span>Nhập danh sách chữ Hán cần luyện viết:</span>
              <span className="text-slate-400 font-normal">Đã nhận {parsedCharacters.length} chữ</span>
            </label>
            <input
              type="text"
              value={inputCharsText}
              onChange={(e) => setInputCharsText(e.target.value)}
              placeholder="Nhập hoặc dán các chữ Hán (VD: 你好世界学习汉语...)"
              className="w-full bg-[#0d1420] border border-[#1e2d42] focus:border-rose-500 rounded-xl p-3 text-sm font-black text-white outline-none tracking-widest font-serif"
            />
          </div>

          {/* Preset nhanh */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-bold">Chọn bộ mẫu:</span>
            {PRESET_CHAR_SETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setInputCharsText(preset.chars.map((c) => c.char).join(''))}
                className="px-3 py-1 rounded-lg bg-[#0e1726] hover:bg-rose-950/40 border border-[#1e2d42] text-slate-300 hover:text-rose-400 font-bold transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Tùy chọn lưới và hiển thị */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-700/30 text-xs">
            {/* Lưới */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Kiểu ô kẻ:</label>
              <div className="flex rounded-xl bg-[#0d1420] p-1 border border-[#1e2d42]">
                <button
                  type="button"
                  onClick={() => setGridStyle('mi')}
                  className={`flex-1 py-1 rounded-lg font-black transition-all ${
                    gridStyle === 'mi' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ô chữ Mễ (米)
                </button>
                <button
                  type="button"
                  onClick={() => setGridStyle('tian')}
                  className={`flex-1 py-1 rounded-lg font-black transition-all ${
                    gridStyle === 'tian' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ô chữ Điền (田)
                </button>
              </div>
            </div>

            {/* Pinyin */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d1420] border border-[#1e2d42] cursor-pointer">
              <span className="font-bold text-slate-300">Hiện Pinyin</span>
              <input
                type="checkbox"
                checked={showPinyin}
                onChange={(e) => setShowPinyin(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500"
              />
            </label>

            {/* Nghĩa Hán Việt */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d1420] border border-[#1e2d42] cursor-pointer">
              <span className="font-bold text-slate-300">Hiện nghĩa & âm</span>
              <input
                type="checkbox"
                checked={showMeaning}
                onChange={(e) => setShowMeaning(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500"
              />
            </label>

            {/* Số ô tập viết */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold block">Số ô tập tô/hàng:</label>
              <select
                value={repeatCount}
                onChange={(e) => setRepeatCount(Number(e.target.value))}
                className="w-full bg-[#0d1420] border border-[#1e2d42] rounded-xl p-2 text-white font-bold outline-none"
              >
                <option value={6}>6 ô</option>
                <option value={8}>8 ô (Khuyến nghị)</option>
                <option value={10}>10 ô</option>
                <option value={12}>12 ô</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VÙNG TRANG IN A4 CHUẨN (PRINT-READY A4 WORKSHEET)                         */}
      {/* ========================================================================= */}
      <div className="print:p-0 bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-300 max-w-[210mm] mx-auto min-h-[297mm] space-y-6">
        {/* Header trang in */}
        <div className="border-b-2 border-red-700 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-red-700 tracking-wider">
              {customHeaderTitle}
            </h2>
            <p className="text-[10px] text-slate-500">
              Nền tảng học Tiếng Trung HSK 3.0 • Luyện viết chữ Hán nét bút chuẩn
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-600 font-mono space-y-0.5">
            <div>Họ tên: ........................................</div>
            <div>Ngày luyện: ...... / ...... / 202...</div>
          </div>
        </div>

        {/* Các hàng chữ luyện viết */}
        <div className="space-y-4">
          {parsedCharacters.map((char, rowIdx) => (
            <div key={rowIdx} className="space-y-1 page-break-inside-avoid">
              {/* Thông tin chữ: Pinyin + Chữ mẫu + Nút nghe */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-black text-red-800">{char}</span>
                  <button
                    type="button"
                    onClick={() => speakHanzi(char)}
                    className="print:hidden p-1 text-slate-400 hover:text-red-700 transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {showMeaning && (
                  <span className="text-[10px] text-slate-500 italic">
                    Hàng #{rowIdx + 1}
                  </span>
                )}
              </div>

              {/* Dãy ô kẻ lưới chữ Hán */}
              <div className="flex items-center flex-wrap gap-1">
                {/* Ô 1: Chữ mẫu đen đậm */}
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 border border-red-600 flex items-center justify-center font-serif text-2xl sm:text-3xl font-black text-black select-none ${
                    gridStyle === 'mi' ? 'grid-mi' : 'grid-tian'
                  }`}
                >
                  <span className="relative z-10">{char}</span>
                </div>

                {/* Các ô tiếp theo: Chữ mờ tập tô (Watermark) */}
                {[...Array(Math.min(3, repeatCount - 1))].map((_, i) => (
                  <div
                    key={i}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 border border-red-600 flex items-center justify-center font-serif text-2xl sm:text-3xl text-slate-300 select-none ${
                      gridStyle === 'mi' ? 'grid-mi' : 'grid-tian'
                    }`}
                  >
                    <span className="relative z-10 opacity-60">{char}</span>
                  </div>
                ))}

                {/* Các ô trống còn lại: Người học tự viết */}
                {[...Array(Math.max(0, repeatCount - 4))].map((_, i) => (
                  <div
                    key={i}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 border border-red-600 flex items-center justify-center font-serif text-2xl sm:text-3xl text-transparent select-none ${
                      gridStyle === 'mi' ? 'grid-mi' : 'grid-tian'
                    }`}
                  >
                    <span className="relative z-10"> </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer trang in */}
        <div className="pt-6 border-t border-slate-300 text-center text-[10px] text-slate-400 flex items-center justify-between">
          <span>Tài liệu tự học tại: https://mickyenglish.com/practice/hanzi-writer</span>
          <span>Trang 1/1</span>
        </div>
      </div>

      <style jsx global>{`
        /* Ô chữ Mễ (米字格) - có đường chéo và đường thẳng nét đứt */
        .grid-mi {
          background-image:
            linear-gradient(to right, transparent 49%, rgba(220, 38, 38, 0.3) 50%, transparent 51%),
            linear-gradient(to bottom, transparent 49%, rgba(220, 38, 38, 0.3) 50%, transparent 51%),
            linear-gradient(45deg, transparent 49.2%, rgba(220, 38, 38, 0.2) 50%, transparent 50.8%),
            linear-gradient(-45deg, transparent 49.2%, rgba(220, 38, 38, 0.2) 50%, transparent 50.8%);
          background-size: 100% 100%;
        }

        /* Ô chữ Điền (田字格) - có đường chữ thập ở giữa */
        .grid-tian {
          background-image:
            linear-gradient(to right, transparent 49%, rgba(220, 38, 38, 0.3) 50%, transparent 51%),
            linear-gradient(to bottom, transparent 49%, rgba(220, 38, 38, 0.3) 50%, transparent 51%);
          background-size: 100% 100%;
        }

        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, aside, nav, footer, .print\\:hidden {
            display: none !important;
          }
          .page-break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
