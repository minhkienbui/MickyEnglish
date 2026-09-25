'use client';

import { useState } from 'react';
import { WordItem } from '@/lib/types';
import {
  Volume2,
  RotateCw,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Bot,
  Lightbulb,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  Bookmark,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Rating } from '@/lib/spacedRepetition';

interface FlashcardProps {
  word: WordItem;
  onRate: (rating: Rating) => void;
}

export default function Flashcard({ word, onRate }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState<'explain' | 'practice'>('explain');

  // AI Explain State
  const [aiData, setAiData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // AI Sentence Checker State
  const [userSentence, setUserSentence] = useState('');
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [sentenceResult, setSentenceResult] = useState<any>(null);

  const speakAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpenAiAssistant = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAiModal(true);
    if (!aiData || aiData.word !== word.word) {
      fetchAiExplanation();
    }
  };

  const fetchAiExplanation = async () => {
    try {
      setAiLoading(true);
      const res = await fetch('/api/ai/vocab-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.word }),
      });
      const data = await res.json();
      if (data.success) {
        setAiData(data.data);
      }
    } catch (err) {
      console.error('Error fetching AI vocab:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSentence.trim()) return;

    try {
      setSentenceLoading(true);
      const res = await fetch('/api/ai/vocab-check-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.word, sentence: userSentence }),
      });
      const data = await res.json();
      if (data.success) {
        setSentenceResult(data.analysis);
      }
    } catch (err) {
      console.error('Error checking sentence:', err);
    } finally {
      setSentenceLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[360px] cursor-pointer perspective-1000 group"
      >
        <div
          className={`relative w-full h-full min-h-[360px] duration-500 rounded-3xl shadow-2xl transition-all border-2 border-[#1e2d42] bg-[#121c2b] p-8 flex flex-col justify-between ${
            isFlipped ? 'ring-2 ring-emerald-500/50 border-emerald-500/40' : 'hover:border-slate-600'
          }`}
        >
          {/* Card Header Tag */}
          <div className="flex items-center justify-between">
            <span className="badge-micky-green text-xs">{word.topic || 'Từ vựng'}</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAiAssistant}
                className="px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                title="AI Micky phân tích chuyên sâu & mẹo nhớ"
              >
                <Bot className="w-3.5 h-3.5" /> AI Trợ Giảng
              </button>

              <button
                type="button"
                onClick={speakAudio}
                className="w-9 h-9 rounded-full bg-[#0e1726] border border-[#1e2d42] text-slate-300 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                title="Phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Content Body */}
          <div className="text-center space-y-4 py-4">
            {!isFlipped ? (
              <>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide">{word.word}</h2>
                <p className="text-sm font-bold text-emerald-400 font-mono">{word.phonetic}</p>
                <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Nhấn vào thẻ để lật xem nghĩa & ví dụ</span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-emerald-400">{word.meaning}</h3>
                <div className="bg-[#0e1726] p-4 rounded-2xl border border-[#1e2d42] text-left text-xs space-y-1.5">
                  <p className="font-semibold text-slate-200">🇬🇧 {word.exampleEn}</p>
                  <p className="text-slate-400">🇻🇳 {word.exampleVi}</p>
                </div>
              </>
            )}
          </div>

          {/* Card Bottom Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold pt-3 border-t border-[#1e2d42]">
            <span>Spaced Repetition (SM-2)</span>
            <button
              type="button"
              onClick={handleOpenAiAssistant}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Mẹo nhớ AI
            </button>
          </div>
        </div>
      </div>

      {/* Rating Buttons (Show when flipped) */}
      {isFlipped && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          <button
            onClick={() => onRate('again')}
            className="py-3 px-3 rounded-2xl bg-red-950/40 text-red-400 font-bold border border-red-800/60 hover:bg-red-900/50 flex flex-col items-center gap-1 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>Chưa thuộc</span>
            <span className="text-[10px] text-red-500 font-normal">Ôn lại ngay hôm nay</span>
          </button>

          <button
            onClick={() => onRate('good')}
            className="py-3 px-3 rounded-2xl bg-amber-950/40 text-amber-300 font-bold border border-amber-800/60 hover:bg-amber-900/50 flex flex-col items-center gap-1 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Tạm nhớ</span>
            <span className="text-[10px] text-amber-400/80 font-normal">Ôn lại sau 3 ngày</span>
          </button>

          <button
            onClick={() => onRate('easy')}
            className="py-3 px-3 rounded-2xl bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-600/60 hover:bg-emerald-900/50 flex flex-col items-center gap-1 text-xs transition-colors cursor-pointer shadow-sm"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Đã thuộc</span>
            <span className="text-[10px] text-emerald-400/80 font-normal">Ôn lại sau 7 ngày</span>
          </button>
        </div>
      )}

      {/* MODAL: AI VOCABULARY ASSISTANT */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121c2b] border border-emerald-500/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in my-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e2d42] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    AI Micky Phân Tích Từ: <span className="text-emerald-400 font-black">{word.word}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{word.phonetic} • {word.meaning}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Tab switch: Giải nghĩa vs Luyện đặt câu */}
            <div className="flex border-b border-[#1e2d42] gap-4">
              <button
                type="button"
                onClick={() => setActiveAiTab('explain')}
                className={`pb-2.5 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeAiTab === 'explain'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Mẹo Nhớ Siêu Tốc & Cụm Từ
              </button>

              <button
                type="button"
                onClick={() => setActiveAiTab('practice')}
                className={`pb-2.5 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeAiTab === 'practice'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Luyện Đặt Câu (AI Chấm Điểm)
              </button>
            </div>

            {/* Tab 1: Mẹo nhớ & Phân tích chuyên sâu */}
            {activeAiTab === 'explain' && (
              <div className="space-y-5">
                {aiLoading ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                    <p className="text-xs text-slate-300">Micky đang tìm mẹo nhớ và các cụm từ hay cho bạn...</p>
                  </div>
                ) : aiData ? (
                  <div className="space-y-4 text-xs">
                    {/* Mnemonic Box */}
                    {aiData.mnemonic && (
                      <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-1.5">
                        <h4 className="font-black text-amber-300 flex items-center gap-1.5 text-sm">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          Mẹo Nhớ Siêu Tốc (Âm Thanh Tương Tự)
                        </h4>
                        <p className="text-slate-200 leading-relaxed font-medium">{aiData.mnemonic}</p>
                      </div>
                    )}

                    {/* Collocations */}
                    {aiData.collocations && aiData.collocations.length > 0 && (
                      <div className="p-4 bg-[#0e1726] border border-[#1e2d42] rounded-2xl space-y-2">
                        <h4 className="font-black text-emerald-400">Các Cụm Từ Hay Đi Kèm (Collocations):</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiData.collocations.map((c: string, idx: number) => (
                            <span key={idx} className="bg-[#121c2b] border border-emerald-500/30 text-slate-200 px-3 py-1 rounded-xl text-[11px] font-semibold">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Word Family & Synonyms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiData.wordFamily && (
                        <div className="p-3.5 bg-[#0e1726] border border-[#1e2d42] rounded-2xl space-y-1.5">
                          <h4 className="font-black text-blue-400">Họ từ (Word Family):</h4>
                          <p className="text-slate-300 font-mono text-[11px]">
                            N: {aiData.wordFamily.noun || '-'} | V: {aiData.wordFamily.verb || '-'}
                          </p>
                          <p className="text-slate-300 font-mono text-[11px]">
                            Adj: {aiData.wordFamily.adjective || '-'} | Adv: {aiData.wordFamily.adverb || '-'}
                          </p>
                        </div>
                      )}

                      {aiData.synonyms && (
                        <div className="p-3.5 bg-[#0e1726] border border-[#1e2d42] rounded-2xl space-y-1.5">
                          <h4 className="font-black text-emerald-400">Từ đồng nghĩa (Synonyms):</h4>
                          <p className="text-slate-300 font-semibold">{aiData.synonyms.join(', ')}</p>
                        </div>
                      )}
                    </div>

                    {/* Exam Tip */}
                    {aiData.examTip && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-slate-300 font-medium">
                        💡 <strong>Mẹo thi TOEIC/IELTS:</strong> {aiData.examTip}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <button onClick={fetchAiExplanation} className="btn-micky-primary text-xs px-4 py-2">
                      Tải phân tích AI
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Luyện đặt câu */}
            {activeAiTab === 'practice' && (
              <div className="space-y-4">
                <form onSubmit={handleCheckSentence} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300">
                    Hãy viết một câu tiếng Anh có sử dụng từ <strong className="text-emerald-400 font-black">"{word.word}"</strong>:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={userSentence}
                    onChange={(e) => setUserSentence(e.target.value)}
                    placeholder={`VD: We need to ${word.word.toLowerCase()} this issue...`}
                    className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-blue-500 rounded-2xl p-4 text-xs text-white outline-none leading-relaxed"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sentenceLoading}
                      className="btn-micky-primary text-xs px-6 py-2.5 flex items-center gap-2"
                    >
                      {sentenceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Kiểm Tra Câu Của Tôi
                    </button>
                  </div>
                </form>

                {/* Sentence Result */}
                {sentenceResult && (
                  <div className="p-4 bg-[#0e1726] border border-blue-500/40 rounded-2xl space-y-3 animate-fade-in text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Điểm Đánh Giá Ngữ Cảnh:
                      </span>
                      <span className="text-base font-black text-emerald-400">{sentenceResult.score} / 100</span>
                    </div>

                    <div className="p-3 bg-[#121c2b] rounded-xl border border-[#1e2d42] space-y-1">
                      <p className="font-bold text-slate-300">Nhận xét của AI Micky:</p>
                      <p className="text-slate-300 leading-relaxed">{sentenceResult.feedback}</p>
                    </div>

                    {sentenceResult.nativeRewrite && (
                      <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-1">
                        <p className="font-bold text-blue-300">Gợi ý cách viết tự nhiên của người bản xứ:</p>
                        <p className="text-white font-medium italic">"{sentenceResult.nativeRewrite}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
