'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Radio,
  Play,
  Pause,
  Type,
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import WordHighlight, { compareWordsLevel, normalizeWord } from './WordHighlight';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { DictationSentence } from '@/lib/types';
import { useThemeStore } from '@/stores/useThemeStore';

export interface ShadowingPanelProps {
  sentences: DictationSentence[];
  activeSentenceIndex: number;
  currentTime: number;
  isPlaying: boolean;
  onSelectSentence: (index: number) => void;
  onNextSentence: () => void;
  onPrevSentence: () => void;
  onReplaySentence: (index: number) => void;
  onTogglePlay: () => void;
  playbackSpeed?: number;
  subMode?: 'step-by-step' | 'auto-flow';
  onSubModeChange?: (mode: 'step-by-step' | 'auto-flow') => void;
}

export default function ShadowingPanel({
  sentences,
  activeSentenceIndex,
  currentTime,
  isPlaying,
  onSelectSentence,
  onNextSentence,
  onPrevSentence,
  onReplaySentence,
  onTogglePlay,
  playbackSpeed = 1.0,
  subMode: externalSubMode,
  onSubModeChange,
}: ShadowingPanelProps) {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // 2 Chế độ Shadowing: 'step-by-step' (Luyện Từng Câu) | 'auto-flow' (Auto Flow)
  const [internalSubMode, setInternalSubMode] = useState<'step-by-step' | 'auto-flow'>('step-by-step');
  const subMode = externalSubMode !== undefined ? externalSubMode : internalSubMode;

  const handleSetSubMode = (mode: 'step-by-step' | 'auto-flow') => {
    setInternalSubMode(mode);
    if (onSubModeChange) {
      onSubModeChange(mode);
    }
  };

  // Trạng thái giao diện phụ trợ
  const [showTranslation, setShowTranslation] = useState(true);
  const [showIpa, setShowIpa] = useState(true);
  const [selectedLang, setSelectedLang] = useState<'Tiếng Việt' | 'English'>('Tiếng Việt');

  // Ghi âm Audio người dùng để nghe lại
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentSentence =
    sentences[activeSentenceIndex] ||
    sentences[0] || {
      id: 's-empty',
      startTime: 0,
      endTime: 5,
      text: "hospital, all while shielding me and my",
      phonetic: "ˈhɒspɪtl, ɔːl waɪl ˈʃiːldɪŋ miː ænd maɪ",
      vietnameseMeaning: "bệnh viện, đồng thời che chắn cho tôi và",
    };

  // Hook Web Speech API nhận diện giọng nói Realtime
  const {
    isListening,
    spokenWords,
    interimText,
    fullTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: 'en-US',
    continuous: true,
    interimResults: true,
    silenceTimeoutMs: subMode === 'auto-flow' ? 0 : 5000,
  });

  // Khi chuyển câu -> reset trạng thái giọng nói
  useEffect(() => {
    resetTranscript();
    setRecordedAudioUrl(null);
  }, [activeSentenceIndex, resetTranscript]);

  // AUTO-FLOW: Khi video phát thì tự động lắng nghe liên tục
  useEffect(() => {
    if (subMode === 'auto-flow') {
      if (isPlaying && !isListening) {
        startListening();
      } else if (!isPlaying && isListening) {
        stopListening();
      }
    }
  }, [subMode, isPlaying, isListening, startListening, stopListening]);

  // Bật / Tắt ghi âm thủ công (cho Luyện Từng Câu)
  const handleToggleRecord = async () => {
    if (isListening) {
      stopListening();
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
        } catch {}
      }
    } else {
      resetTranscript();
      setRecordedAudioUrl(null);

      // Thu âm qua MediaRecorder
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mr = new MediaRecorder(stream);
          mediaRecorderRef.current = mr;
          audioChunksRef.current = [];

          mr.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };

          mr.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setRecordedAudioUrl(URL.createObjectURL(blob));
          };

          mr.start();
        }
      } catch (err) {
        console.warn('Microphone stream error:', err);
      }

      startListening();
    }
  };

  // Phát âm mẫu câu chuẩn bằng Web Speech TTS
  const playSampleTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSentence.text);
      utterance.lang = 'en-US';
      utterance.rate = playbackSpeed;
      window.speechSynthesis.speak(utterance);
    }
  };

  /* ====================================================================
     AI TỰ ĐỘNG ĐÁNH GIÁ LEVEL % VÀ QUY ĐỔI IELTS BAND
     ==================================================================== */
  const aiIeltsAssessment = useMemo(() => {
    const { accuracy, correctCount, totalCount, tokens } = compareWordsLevel(
      currentSentence.text,
      spokenWords
    );

    if (spokenWords.length === 0) {
      return null;
    }

    const completionRate = Math.min(1, spokenWords.length / Math.max(1, totalCount));
    const fluency = Math.round(accuracy * 0.6 + completionRate * 40);
    const overallScore = Math.round(accuracy * 0.7 + fluency * 0.3);

    let band = '5.0';
    let levelTitle = 'Modest Speaker';
    let isIeltsPassed = false;
    let verdictText = 'CHƯA ĐẠT CHUẨN IELTS - CẦN LUYỆN LẠI';
    let feedback = 'Hãy nghe phát âm mẫu và nhại lại từng từ để tăng độ chính xác.';
    let badgeColor = 'rose';

    if (overallScore >= 90) {
      band = '8.5 - 9.0';
      levelTitle = 'Expert Speaker (Bản xứ)';
      isIeltsPassed = true;
      verdictText = '🎉 ĐẠT CHUẨN IELTS XUẤT SẮC (Band 8.5+)';
      feedback = 'Phát âm tự nhiên, ngữ điệu chuẩn xác, độ trôi chảy tuyệt vời!';
      badgeColor = 'emerald';
    } else if (overallScore >= 80) {
      band = '7.5 - 8.0';
      levelTitle = 'Very Good Speaker (Rất tốt)';
      isIeltsPassed = true;
      verdictText = '✅ ĐẠT CHUẨN IELTS DU HỌC & ĐỊNH CƯ (Band 7.5+)';
      feedback = 'Phát âm rõ ràng, nhịp điệu trôi chảy, chuẩn âm đuôi và nối âm.';
      badgeColor = 'emerald';
    } else if (overallScore >= 70) {
      band = '6.5 - 7.0';
      levelTitle = 'Good Speaker (Tốt)';
      isIeltsPassed = true;
      verdictText = '✅ ĐẠT YÊU CẦU IELTS ĐẦU RA ĐẠI HỌC (Band 6.5+)';
      feedback = 'Khả năng nhại câu tốt, phát âm chuẩn hầu hết các từ chính.';
      badgeColor = 'blue';
    } else if (overallScore >= 55) {
      band = '5.5 - 6.0';
      levelTitle = 'Competent Speaker (Cận chuẩn)';
      isIeltsPassed = false;
      verdictText = '⚠️ CẬN ĐẠT CHUẨN IELTS - CẦN LUYỆN THÊM (Band 5.5 - 6.0)';
      feedback = 'Nắm được nhịp câu nhưng còn sót hoặc phát âm chưa rõ một số từ khó.';
      badgeColor = 'amber';
    } else {
      band = '4.5 - 5.0';
      levelTitle = 'Modest Speaker (Cần cố gắng)';
      isIeltsPassed = false;
      verdictText = '❌ CHƯA ĐẠT YÊU CẦU IELTS - HÃY NHẠI LẠI';
      feedback = 'Tốc độ nhại còn chậm hoặc sai từ khóa. Bấm Micro để thử lại!';
      badgeColor = 'rose';
    }

    // Lọc các từ phát âm chưa đúng cần cải thiện
    const wordsToImprove = tokens.filter((t) => t.status === 'wrong').map((t) => t.word);

    return {
      accuracy,
      fluency,
      overallScore,
      band,
      levelTitle,
      isIeltsPassed,
      verdictText,
      feedback,
      badgeColor,
      correctCount,
      totalCount,
      wordsToImprove,
    };
  }, [currentSentence.text, spokenWords]);

  return (
    <div
      className={`border rounded-3xl overflow-hidden shadow-2xl animate-fade-in flex flex-col transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
      }`}
    >
      {/* 1. TOP HEADER TOOLBAR: Ngôn ngữ + Phân trang 34/91 + Nút Ẩn/Hiện Dịch (Chuẩn Ảnh 2: 27.png) */}
      <div
        className={`p-4 border-b flex items-center justify-between gap-2 text-xs font-bold ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'
        }`}
      >
        {/* Dropdown Ngôn Ngữ: Tiếng Việt ∨ */}
        <div className="relative">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as any)}
            className={`border rounded-xl px-3.5 py-1.5 outline-none cursor-pointer appearance-none pr-7 font-black text-xs transition-colors ${
              isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
                : 'bg-[#121c2b] text-white border-[#1e2d42] hover:border-slate-500'
            }`}
          >
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="English">English</option>
          </select>
          <span className="text-slate-400 absolute right-2.5 top-2 pointer-events-none text-[10px]">▼</span>
        </div>

        {/* Phân trang số thứ tự câu: 34 / 91 */}
        <div
          className={`border px-4 py-1.5 rounded-xl font-black text-xs shadow-inner ${
            isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-[#121c2b] text-white border-[#1e2d42]'
          }`}
        >
          {activeSentenceIndex + 1} / {sentences.length}
        </div>

        {/* Nút Ẩn / Hiện Dịch */}
        <button
          type="button"
          onClick={() => setShowTranslation(!showTranslation)}
          className={`px-3.5 py-1.5 border rounded-xl flex items-center gap-1.5 cursor-pointer transition-all text-xs font-black ${
            isLight
              ? 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
              : 'bg-[#121c2b] text-emerald-400 border-emerald-500/30 hover:bg-[#182638]'
          }`}
        >
          {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showTranslation ? 'Ẩn dịch' : 'Hiện dịch'}</span>
        </button>
      </div>

      {/* 2. HÀNG CHUYỂN ĐỔI 2 CHẾ ĐỘ: Luyện Từng Câu vs Auto Flow (Chuẩn Ảnh 2) */}
      <div className={`px-5 py-3 flex items-center justify-between gap-2 border-b ${isLight ? 'border-slate-100' : 'border-[#1e2d42]/60'}`}>
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'}`}>
          <button
            type="button"
            onClick={() => handleSetSubMode('step-by-step')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subMode === 'step-by-step'
                ? 'bg-[#00c950] text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Luyện Từng Câu
          </button>
          <button
            type="button"
            onClick={() => handleSetSubMode('auto-flow')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subMode === 'auto-flow'
                ? 'bg-[#00c950] text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Auto Flow
          </button>
        </div>

        <span className={`text-[12px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {subMode === 'auto-flow' ? '⚡ Mic bắt liên tục theo video' : '🎯 Luyện phản xạ & bấm nói'}
        </span>
      </div>

      {/* 3. MAIN SHADOWING WORKSPACE */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* KHUNG CÂU HIỂN THỊ (Token Chips bo góc theo chuẩn Ảnh 2) */}
        <div
          className={`p-6 rounded-3xl border space-y-4 shadow-inner transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'
          }`}
        >
          {/* Action Pills: [Nghe mẫu] [Replay Video] [T IPA] */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={playSampleTTS}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-700 hover:text-emerald-700 hover:border-emerald-400'
                  : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:text-white hover:border-emerald-500/50'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> Nghe mẫu
            </button>

            <button
              type="button"
              onClick={() => onReplaySentence(activeSentenceIndex)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-700 hover:text-emerald-700 hover:border-emerald-400'
                  : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:text-white hover:border-emerald-500/50'
              }`}
              title="Phát lại đoạn video câu này"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-500" /> Replay Video
            </button>

            <button
              type="button"
              onClick={() => setShowIpa(!showIpa)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showIpa
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-300'
                  : isLight
                  ? 'bg-white border-slate-300 text-slate-500'
                  : 'bg-[#121c2b] border-[#1e2d42] text-slate-400'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> T IPA
            </button>
          </div>

          {/* DÒNG TỪ TOKEN CHIPS THEO CHUẨN ẢNH 2: [ hospital, ] [ all ] [ while ] ... */}
          <div className="text-center py-2">
            <WordHighlight
              originalSentence={currentSentence.text}
              spokenWords={spokenWords}
              interimText={interimText}
              isListening={isListening}
            />
          </div>

          {/* Phiên âm IPA */}
          {showIpa && currentSentence.phonetic && (
            <p className={`text-xs sm:text-sm font-mono text-center border-t pt-3 font-semibold tracking-wide ${
              isLight ? 'border-slate-200 text-emerald-700' : 'border-[#1e2d42] text-emerald-400'
            }`}>
              /{currentSentence.phonetic}/
            </p>
          )}

          {/* Bản dịch tiếng Việt: * bệnh viện, đồng thời che chắn cho tôi và */}
          {showTranslation && currentSentence.vietnameseMeaning && (
            <p className={`text-xs sm:text-sm font-medium text-center italic border-t pt-2.5 leading-relaxed ${
              isLight ? 'border-slate-200 text-slate-600' : 'border-[#1e2d42] text-slate-300'
            }`}>
              * {currentSentence.vietnameseMeaning.replace(/^\*+\s*/, '')}
            </p>
          )}
        </div>

        {/* 4. KHU VỰC ĐIỀU KHIỂN MICRO & BẤM NÓI (Chuẩn Ảnh 2: Micro tròn lớn màu xanh ngọc ở giữa) */}
        <div
          className={`p-6 rounded-3xl border flex flex-col items-center justify-center space-y-4 shadow-sm transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'
          }`}
        >
          <div className="flex items-center gap-8 sm:gap-12">
            {/* Nút lùi câu < */}
            <button
              type="button"
              onClick={onPrevSentence}
              disabled={activeSentenceIndex === 0}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer disabled:opacity-30 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'bg-[#121c2b] border-[#1e2d42] text-slate-400 hover:text-white hover:bg-[#1a283c]'
              }`}
              title="Câu trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* NÚT MICRO TRÒN LỚN XANH NGỌC #00c950 PHÁT SÁNG Ở GIỮA */}
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/30 scale-110'
                  : 'bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white ring-8 ring-[#00c950]/20 shadow-emerald-500/40 hover:scale-105'
              }`}
              title={isListening ? 'Bấm để dừng nhận diện' : 'Nhấn vào Micro để bắt đầu nhại giọng'}
            >
              {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </button>

            {/* Nút tiến câu > */}
            <button
              type="button"
              onClick={onNextSentence}
              disabled={activeSentenceIndex === sentences.length - 1}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer disabled:opacity-30 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'bg-[#121c2b] border-[#1e2d42] text-slate-400 hover:text-white hover:bg-[#1a283c]'
              }`}
              title="Câu tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-black text-center">
            {isListening ? (
              <span className="text-rose-500 animate-pulse flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Đang nhận diện giọng nói... Hãy nhại lại câu tiếng Anh ở trên!
              </span>
            ) : (
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                Nhấn vào Micro để bắt đầu nhại giọng (Word-level Realtime)
              </span>
            )}
          </p>

          {/* VĂN BẢN ĐÃ NHẬN DIỆN REALTIME */}
          {(isListening || fullTranscript) && (
            <div
              className={`w-full p-4 rounded-2xl border space-y-1.5 animate-fade-in ${
                isLight
                  ? 'bg-amber-50/70 border-amber-300 text-slate-900'
                  : 'bg-[#0e1726] border-amber-500/40 text-white'
              }`}
            >
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                {isListening ? '🎙️ AI đang lắng nghe:' : '✓ Bạn đã nói:'}
              </span>
              <p className="text-xs sm:text-sm font-black leading-relaxed">
                <span className="text-amber-500 font-extrabold">{fullTranscript || '...'}</span>
                {interimText && <span className="opacity-60 italic"> {interimText}...</span>}
              </p>
            </div>
          )}

          {/* Nghe lại giọng người dùng đã ghi âm */}
          {recordedAudioUrl && (
            <div className="pt-1 flex items-center justify-center gap-3 animate-fade-in flex-wrap">
              <span className={`text-[12px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                🎧 Nghe lại giọng bạn:
              </span>
              <audio controls className="h-8 max-w-[240px]" src={recordedAudioUrl} />
            </div>
          )}

          {/* ================================================================
              BẢNG AI TỰ ĐỘNG ĐÁNH GIÁ LEVEL % VÀ THANG ĐIỂM IELTS BAND
              ================================================================ */}
          {aiIeltsAssessment && (
            <div
              className={`w-full p-5 rounded-3xl border space-y-4 shadow-xl animate-fade-in transition-all ${
                aiIeltsAssessment.isIeltsPassed
                  ? isLight
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-emerald-950/40 border-emerald-500/60'
                  : isLight
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-amber-950/40 border-amber-500/60'
              }`}
            >
              {/* Header: Huy hiệu IELTS Band + Điểm tổng hợp */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-3 border-current/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#00c950] text-white flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wider uppercase opacity-75">
                      ĐÁNH GIÁ NĂNG LỰC IELTS SPEAKING
                    </h4>
                    <p className="text-sm sm:text-base font-black text-[#00c950]">
                      IELTS Band: {aiIeltsAssessment.band} ({aiIeltsAssessment.levelTitle})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-[#00c950]">
                    {aiIeltsAssessment.overallScore}%
                  </span>
                  <p className="text-[10px] font-bold opacity-75">Điểm tổng hợp</p>
                </div>
              </div>

              {/* Status Verdict Pill */}
              <div
                className={`py-2 px-3.5 rounded-xl font-black text-xs text-center border ${
                  aiIeltsAssessment.isIeltsPassed
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                }`}
              >
                {aiIeltsAssessment.verdictText}
              </div>

              {/* 2 Progress Bars: Accuracy & Fluency */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'}`}>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span className="opacity-75">Độ chính xác</span>
                    <span className="text-[#00c950]">{aiIeltsAssessment.accuracy}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00c950] rounded-full transition-all duration-300"
                      style={{ width: `${aiIeltsAssessment.accuracy}%` }}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'}`}>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span className="opacity-75">Độ trôi chảy</span>
                    <span className="text-blue-500">{aiIeltsAssessment.fluency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${aiIeltsAssessment.fluency}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Nhận xét AI chi tiết */}
              <p className="text-xs font-medium italic opacity-90 leading-relaxed">
                💡 {aiIeltsAssessment.feedback}
              </p>

              {/* Danh sách từ cần cải thiện nếu có */}
              {aiIeltsAssessment.wordsToImprove.length > 0 && (
                <div className="text-xs font-bold pt-1">
                  <span className="text-rose-500">Từ cần lưu ý phát âm lại: </span>
                  <span className="underline decoration-rose-400 font-black">
                    {aiIeltsAssessment.wordsToImprove.join(', ')}
                  </span>
                </div>
              )}

              {/* Nút Chuyển sang câu tiếp theo */}
              <button
                type="button"
                onClick={onNextSentence}
                disabled={activeSentenceIndex === sentences.length - 1}
                className="w-full py-3 bg-[#00c950] hover:bg-[#00b046] active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                Sang câu tiếp theo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. BOTTOM PLAYBACK CONTROLS (Chuẩn Ảnh 2: Mũi tên trái <, Nút Play xanh lá tròn lớn ▶, Mũi tên phải >) */}
      <div
        className={`p-4 border-t flex items-center justify-between transition-colors ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'
        }`}
      >
        <button
          type="button"
          onClick={onPrevSentence}
          disabled={activeSentenceIndex === 0}
          className={`p-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 ${
            isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
          title="Câu trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-full bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-transform hover:scale-105 cursor-pointer"
          title={isPlaying ? 'Tạm dừng video' : 'Phát video'}
        >
          {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
        </button>

        <button
          type="button"
          onClick={onNextSentence}
          disabled={activeSentenceIndex === sentences.length - 1}
          className={`p-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-30 ${
            isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
          title="Câu tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
