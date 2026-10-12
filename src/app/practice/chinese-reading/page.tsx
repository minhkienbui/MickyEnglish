'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Plus,
  Check,
  Languages,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { useVocabStore } from '@/stores/useVocabStore';
import { mockChineseReadingStories, ReadingWordToken, ChineseReadingStory } from '@/data/mockChineseReading';

export default function ChineseReadingPage() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const { addWord } = useVocabStore();

  const [selectedStory, setSelectedStory] = useState<ChineseReadingStory>(mockChineseReadingStories[0]);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showVietnamese, setShowVietnamese] = useState(false);

  // Popover Word Inspection State
  const [activeToken, setActiveToken] = useState<ReadingWordToken | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [addedWords, setAddedWords] = useState<string[]>([]);

  // Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleTokenClick = (token: ReadingWordToken, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setActiveToken(token);
    speak(token.text);
  };

  const handleAddTokenToVocab = (token: ReadingWordToken) => {
    addWord({
      word: token.text,
      phonetic: token.pinyin,
      meaning: `${token.sinoVi ? `(${token.sinoVi}) ` : ''}${token.meaning}`,
      exampleEn: token.text,
      exampleVi: token.meaning,
      topic: `Bài khoá: ${selectedStory.titleZh}`,
    });

    setAddedWords((prev) => [...prev, token.text]);
  };

  const handleSelectQuizAnswer = (qId: string, optIdx: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

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
              <Languages className="w-3.5 h-3.5" /> Bài Khoá HSK Đọc Hiểu
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Luyện Đọc Tiếng Trung Tra Từ Inline 1-Chạm
            </h1>
            <p className="text-xs text-slate-400">
              Nhấp vào bất kỳ chữ Hán / từ vựng nào để xem ngay Pinyin, âm Hán Việt và nghĩa tiếng Việt mà không cần rời trang.
            </p>
          </div>
        </div>

        {/* Story Selector Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStory.id}
            onChange={(e) => {
              const s = mockChineseReadingStories.find((item) => item.id === e.target.value);
              if (s) {
                setSelectedStory(s);
                setUserAnswers({});
                setIsQuizSubmitted(false);
                setActiveToken(null);
              }
            }}
            className="bg-[#121c2b] border border-[#1e2d42] text-white font-bold text-xs p-2.5 rounded-xl outline-none"
          >
            {mockChineseReadingStories.map((story) => (
              <option key={story.id} value={story.id}>
                [{story.hskLevel}] {story.titleZh} • {story.titleVi}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: BÀI ĐỌC CHÍNH (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            {/* Header Bài đọc: Title & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-700/20">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black border border-rose-500/40">
                  {selectedStory.hskLevel} • ~{selectedStory.wordCount} chữ
                </span>
                <h2 className="text-2xl font-black text-white mt-1.5 font-serif">
                  {selectedStory.titleZh}
                </h2>
                <p className="text-xs text-slate-400 font-medium">{selectedStory.titleVi}</p>
              </div>

              {/* Bật / Tắt Pinyin và Bản dịch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinyin(!showPinyin)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    showPinyin
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'border-[#1e2d42] text-slate-400 hover:text-white'
                  }`}
                >
                  {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>Pinyin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVietnamese(!showVietnamese)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    showVietnamese
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'border-[#1e2d42] text-slate-400 hover:text-white'
                  }`}
                >
                  {showVietnamese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>Bản dịch</span>
                </button>

                <button
                  type="button"
                  onClick={() => speak(selectedStory.paragraphs.map((p) => p.zh).join(' '))}
                  className="p-2 rounded-xl bg-[#00c950] hover:bg-[#00b046] text-white shadow-md cursor-pointer"
                  title="Nghe toàn bộ bài đọc"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* NỘI DUNG ĐOẠN VĂN VỚI TỪ TRA INLINE */}
            <div className="space-y-6 text-slate-200 leading-loose">
              {selectedStory.paragraphs.map((para, pIdx) => (
                <div key={pIdx} className="space-y-2 p-4 rounded-2xl bg-[#0d1420]/80 border border-[#1e2d42]/60">
                  {/* Pinyin */}
                  {showPinyin && (
                    <p className="text-xs text-rose-400/90 font-mono tracking-wide leading-relaxed">
                      {para.pinyin}
                    </p>
                  )}

                  {/* Chữ Hán tương tác */}
                  <div className="text-lg sm:text-xl font-serif font-black tracking-widest flex flex-wrap items-center gap-x-1 gap-y-2">
                    {para.tokens.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        onClick={(e) => handleTokenClick(token, e)}
                        className="px-1.5 py-0.5 rounded-lg bg-rose-950/30 text-white hover:bg-rose-600 hover:text-white border border-rose-500/20 hover:border-rose-400 transition-all cursor-pointer hover:scale-105"
                        title={`Tra từ: ${token.text}`}
                      >
                        {token.text}
                      </span>
                    ))}
                  </div>

                  {/* Bản dịch tiếng Việt */}
                  {showVietnamese && (
                    <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-700/20">
                      🇻🇳 {para.vi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BỘ CÂU HỎI ĐỌC HIỂU (HSK READING QUIZ) */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/20">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Câu Hỏi Đọc Hiểu Bài Khoá ({selectedStory.questions.length} câu)</span>
              </h3>

              {!isQuizSubmitted ? (
                <button
                  type="button"
                  onClick={() => setIsQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-4 py-1.5 bg-[#00c950] hover:bg-[#00b046] disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsQuizSubmitted(false);
                    setUserAnswers({});
                  }}
                  className="px-4 py-1.5 bg-[#121c2b] text-slate-300 border border-[#1e2d42] text-xs font-bold rounded-xl"
                >
                  Làm lại quiz
                </button>
              )}
            </div>

            <div className="space-y-4">
              {selectedStory.questions.map((q, qIdx) => {
                const userSelected = userAnswers[q.id];
                const isCorrect = userSelected === q.correctAnswer;

                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-[#0d1420] border border-[#1e2d42] space-y-3">
                    <p className="text-xs sm:text-sm font-black text-white font-serif">
                      Câu {qIdx + 1}: {q.questionZh}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">({q.questionVi})</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userSelected === optIdx;
                        const isThisCorrect = q.correctAnswer === optIdx;

                        let btnStyle = 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:border-slate-500';

                        if (isQuizSubmitted) {
                          if (isThisCorrect) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500';
                          } else if (isChosen && !isThisCorrect) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 ring-1 ring-rose-500';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-black text-[10px] flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="font-serif font-bold">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isQuizSubmitted && (
                      <div className="text-[11px] text-slate-300 p-2.5 rounded-xl bg-black/40 border border-slate-700/30">
                        <p className="font-bold text-emerald-400">Giải thích: {q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TỪ ĐIỂN INLINE & DANH SÁCH TỪ VỰNG TRỌNG TÂM (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* HỘP TRA TỪ INLINE HIỆN TẠI */}
          {activeToken ? (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-[#111a28] to-[#121c2b] border-2 border-rose-500/60 shadow-2xl space-y-4 animate-fade-in sticky top-20">
              <div className="flex items-center justify-between border-b pb-3 border-rose-500/30">
                <span className="text-[11px] font-black uppercase text-rose-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Tra Cứu 1-Chạm
                </span>
                <button
                  type="button"
                  onClick={() => setActiveToken(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-serif font-black text-rose-400">
                    {activeToken.text}
                  </h3>
                  <button
                    type="button"
                    onClick={() => speak(activeToken.text)}
                    className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition-all cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs font-mono font-bold text-amber-400">{activeToken.pinyin}</p>
                {activeToken.sinoVi && (
                  <p className="text-xs text-slate-300 font-bold">Âm Hán Việt: {activeToken.sinoVi}</p>
                )}
                <p className="text-xs text-emerald-300 font-bold">Nghĩa: {activeToken.meaning}</p>
              </div>

              <button
                type="button"
                onClick={() => handleAddTokenToVocab(activeToken)}
                disabled={addedWords.includes(activeToken.text)}
                className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addedWords.includes(activeToken.text)
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-[#00c950] hover:bg-[#00b046] text-white shadow-md'
                }`}
              >
                {addedWords.includes(activeToken.text) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã lưu vào Sổ Từ Vựng SRS</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Lưu vào Sổ Từ Vựng Ôn Tập</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className={`p-6 rounded-3xl border text-center space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
            }`}>
              <Sparkles className="w-8 h-8 text-rose-400 mx-auto" />
              <h4 className="text-xs font-black text-white">Tra Từ Vựng Tức Thì</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nhấp vào bất kỳ chữ Hán nào trong bài khoá để xem phiên âm Pinyin, âm Hán Việt và nghĩa tiếng Việt chi tiết tại đây!
              </p>
            </div>
          )}

          {/* DANH SÁCH TẤT CẢ TỪ TRỌNG TÂM CỦA BÀI */}
          <div className={`p-5 rounded-3xl border space-y-3 shadow-lg ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#111a28] border-[#1e2d42]'
          }`}>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Từ vựng trọng tâm bài này</span>
            </h4>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedStory.paragraphs.flatMap((p) => p.tokens).map((tk, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveToken(tk);
                    speak(tk.text);
                  }}
                  className="p-2.5 rounded-xl bg-[#0d1420] border border-[#1e2d42] hover:border-rose-500 flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-black text-rose-400">{tk.text}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{tk.pinyin}</span>
                  </div>
                  <span className="text-[11px] text-slate-300 truncate max-w-[110px]">{tk.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
