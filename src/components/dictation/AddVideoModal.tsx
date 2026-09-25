'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Link as LinkIcon,
  Upload,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Play,
  Pause,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Gem,
  ArrowLeft,
  Video,
  Copy,
} from 'lucide-react';
import { useDictationStore } from '@/stores/useDictationStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { DictationLesson, DictationSentence } from '@/lib/types';
import {
  parseSubtitleFile,
  mergeTranslations,
  generateAIDranslatePrompt,
  ParsedSentence,
  secondsToTimeString,
} from '@/lib/srtParser';
import { extractYoutubeId } from '@/lib/videoAutoSegmenter';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
  const router = useRouter();
  const { addCustomLesson } = useDictationStore();
  const { user, deductGems } = useAuthStore();

  // Wizard Step: 1 = Nhập link & Upload, 2 = Chỉnh sửa Transcript Table & Preview Video
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);

  // STEP 1 Form State
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);

  // English Transcript
  const [enFileName, setEnFileName] = useState('');
  const [enRawText, setEnRawText] = useState('');
  const [showEnPaste, setShowEnPaste] = useState(false);
  const [enSentences, setEnSentences] = useState<ParsedSentence[]>([]);

  // Vietnamese Translation
  const [viFileName, setViFileName] = useState('');
  const [viRawText, setViRawText] = useState('');
  const [showViPaste, setShowViPaste] = useState(false);

  // Collapsible Guide & Toasts
  const [showDownSubGuide, setShowDownSubGuide] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  // STEP 2 State: Editable Sentences Table & Video Preview
  const [editableSentences, setEditableSentences] = useState<ParsedSentence[]>([]);
  const [previewActiveIndex, setPreviewActiveIndex] = useState(0);
  const enFileInputRef = useRef<HTMLInputElement | null>(null);
  const viFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // [BƯỚC 1] Fetch Title & Thumbnail khi URL thay đổi
  const handleUrlBlur = async () => {
    if (!videoUrl.trim()) return;
    const extractedId = extractYoutubeId(videoUrl);
    if (!extractedId) {
      setErrorMessage('Link YouTube không hợp lệ. Vui lòng kiểm tra lại URL.');
      return;
    }

    setErrorMessage('');
    setYoutubeId(extractedId);
    setVideoThumbnail(`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`);

    setIsFetchingTitle(true);
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${extractedId}&format=json`
      );
      if (res.ok) {
        const data = await res.json();
        setVideoTitle(data.title || `Video (${extractedId})`);
      } else {
        setVideoTitle(`Video (${extractedId})`);
      }
    } catch {
      setVideoTitle(`Video (${extractedId})`);
    } finally {
      setIsFetchingTitle(false);
    }
  };

  // [BƯỚC 2] Xử lý đọc file Transcript tiếng Anh qua FileReader (Client-side)
  const handleEnFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('File quá lớn! Kích thước tối đa cho phép là 2MB.');
      return;
    }

    setErrorMessage('');
    setEnFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setEnRawText(content);
      const { sentences, warning } = parseSubtitleFile(content, file.name);
      setEnSentences(sentences);
      if (warning) setWarningMessage(warning);
      showToast(`✓ Đã tải và phân tích ${sentences.length} câu tiếng Anh từ file!`);
    };
    reader.readAsText(file);
  };

  // [BƯỚC 3] Xử lý đọc file bản dịch tiếng Việt
  const handleViFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('File quá lớn! Kích thước tối đa cho phép là 2MB.');
      return;
    }

    setErrorMessage('');
    setViFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setViRawText(content);
      showToast('✓ Đã tải file bản dịch tiếng Việt thành công!');
    };
    reader.readAsText(file);
  };

  // [PHẦN 3] Nút "Prompt Dịch AI"
  const handleCopyAIPrompt = () => {
    let sentencesToPrompt = enSentences;
    if (sentencesToPrompt.length === 0 && enRawText.trim()) {
      const { sentences } = parseSubtitleFile(enRawText, 'transcript.srt');
      sentencesToPrompt = sentences;
    }

    if (sentencesToPrompt.length === 0) {
      setErrorMessage('Vui lòng upload hoặc dán transcript tiếng Anh ở Bước 2 trước khi lấy prompt dịch!');
      return;
    }

    const promptText = generateAIDranslatePrompt(sentencesToPrompt);
    navigator.clipboard.writeText(promptText);
    showToast('✅ Đã copy prompt! Dán vào ChatGPT hoặc Claude để dịch');

    // Mở Claude / ChatGPT tab mới
    setTimeout(() => {
      window.open('https://claude.ai', '_blank');
    }, 600);
  };

  // [CHUYỂN SANG BƯỚC CHỈNH TRANSCRIPT]
  const handleProceedToEdit = () => {
    if (!youtubeId) {
      setErrorMessage('Vui lòng nhập link YouTube hợp lệ ở Bước 1.');
      return;
    }

    let parsedEn = enSentences;
    if (parsedEn.length === 0 && enRawText.trim()) {
      const { sentences, warning } = parseSubtitleFile(enRawText, 'transcript.srt');
      parsedEn = sentences;
      if (warning) setWarningMessage(warning);
    }

    if (parsedEn.length === 0) {
      setErrorMessage('Transcript tiếng Anh là bắt buộc. Vui lòng tải file SRT/VTT/TXT hoặc dán nội dung vào ô.');
      return;
    }

    // Ghép bản dịch tiếng Việt nếu có
    const { merged, warning } = mergeTranslations(parsedEn, viRawText, viFileName || 'vietnamese.srt');
    if (warning) setWarningMessage(warning);

    setEditableSentences(merged);
    setWizardStep(2);
  };

  // [THAO TÁC TRÊN BẢNG CHỈNH TRANSCRIPT]
  const handleUpdateCell = (idx: number, field: keyof ParsedSentence, value: any) => {
    const updated = [...editableSentences];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableSentences(updated);
  };

  const handleAddNewSentence = () => {
    const last = editableSentences[editableSentences.length - 1];
    const startTime = last ? last.endTime : 0;
    const endTime = startTime + 5;
    const newS: ParsedSentence = {
      id: editableSentences.length + 1,
      startTime,
      endTime,
      english: 'New sentence text here',
      vietnamese: 'Bản dịch tiếng Việt',
      words: ['New', 'sentence'],
    };
    setEditableSentences([...editableSentences, newS]);
  };

  const handleDeleteSentence = (idx: number) => {
    setEditableSentences(editableSentences.filter((_, i) => i !== idx));
  };

  // [LƯU VÀ TẠO BÀI HỌC - HOÀN TOÀN MIỄN PHÍ KHÔNG TỐN ĐÁ QUÝ]
  const handleSaveAndCreateLesson = () => {
    if (editableSentences.length === 0) {
      alert('Bài học cần ít nhất 1 câu transcript.');
      return;
    }

    const cleanLessonSentences: DictationSentence[] = editableSentences.map((s, idx) => ({
      id: `s-${idx + 1}`,
      startTime: Number(s.startTime) || 0,
      endTime: Number(s.endTime) || 5,
      text: s.english || '',
      vietnameseMeaning: s.vietnamese || '',
      phonetic: '',
    }));

    const newLessonId = `custom-${youtubeId}-${Date.now()}`;
    const newLesson: DictationLesson = {
      id: newLessonId,
      title: videoTitle || `Bài học ${youtubeId}`,
      topic: 'Bài học tự tạo',
      level: 'B1',
      youtubeId: youtubeId,
      videoId: youtubeId,
      youtubeUrl: videoUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
      thumbnail: videoThumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      thumbnailUrl: videoThumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      duration: cleanLessonSentences[cleanLessonSentences.length - 1]?.endTime || 120,
      sentences: cleanLessonSentences,
      totalSentences: cleanLessonSentences.length,
      status: 'published',
      tags: ['# Video tự tạo', '# Youtube video'],
      createdAt: Date.now(),
      views: 1,
    };

    addCustomLesson(newLesson);
    onClose();
    router.push(`/dictation-shadowing/${newLessonId}?mode=shadowing`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER MODAL (Khớp ảnh thiết kế) */}
        <div className="p-5 border-b border-[#1e2d42] flex items-center justify-between bg-[#121c2b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-sm">
              <Video className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                {wizardStep === 1 ? 'Thêm video YouTube' : 'Chỉnh sửa & Đồng bộ Transcript'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {wizardStep === 1
                  ? 'Tạo bài Dictation hoặc Shadowing từ video và transcript của bạn'
                  : 'Kiểm tra mốc thời gian, câu tiếng Anh và bản dịch trước khi lưu'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Nhập link YouTube, tải file phụ đề .SRT (hoặc lấy từ DownSub.com) và dán bản dịch tiếng Việt để tạo bài học.')}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1e2d42] cursor-pointer"
              title="Hướng dẫn"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1e2d42] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST & CẢNH BÁO */}
        {toastMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-500 px-4 py-2 text-center text-xs font-black text-emerald-300 animate-fade-in shrink-0">
            {toastMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-rose-950/90 border-b border-rose-500 px-4 py-2 text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: FORM NHẬP LINK + UPLOAD TRANSCRIPT & BẢN DỊCH (Khớp 100% Ảnh 1) */}
        {/* ========================================================================= */}
        {wizardStep === 1 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* BƯỚC 1: LINK YOUTUBE */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white flex items-center gap-1.5">
                <span className="text-emerald-400 font-extrabold">1</span> Link YouTube
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white font-medium outline-none transition-colors"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* Preview Thumbnail Video */}
              {youtubeId && (
                <div className="p-3 bg-[#0e1726] border border-[#1e2d42] rounded-2xl flex items-center gap-3 animate-fade-in">
                  <img
                    src={videoThumbnail}
                    alt="Preview"
                    className="w-20 h-12 object-cover rounded-xl border border-[#1e2d42]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-white truncate">
                      {isFetchingTitle ? 'Đang lấy tiêu đề...' : videoTitle}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-bold">ID: {youtubeId}</p>
                  </div>
                </div>
              )}
            </div>

            {/* BƯỚC 2: TRANSCRIPT TIẾNG ANH (BẮT BUỘC) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="text-emerald-400 font-extrabold">2</span> Transcript tiếng Anh
                  <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-md text-[10px] font-black">
                    Bắt buộc
                  </span>
                </label>
              </div>

              {/* Option A: Chọn file transcript */}
              <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#121c2b] border border-[#1e2d42] flex items-center justify-center text-emerald-400 shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {enFileName ? enFileName : 'Chọn file transcript'}
                    </p>
                    <p className="text-[11px] text-slate-400">SRT, VTT hoặc TXT - tối đa 2 MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="file"
                    ref={enFileInputRef}
                    onChange={handleEnFileUpload}
                    accept=".srt,.vtt,.txt"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => enFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#121c2b] hover:bg-[#1a293d] border border-[#1e2d42] text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {enFileName ? 'Đổi file' : 'Tải lên'}
                  </button>
                  {enFileName && (
                    <button
                      type="button"
                      onClick={() => {
                        setEnFileName('');
                        setEnRawText('');
                        setEnSentences([]);
                      }}
                      className="text-slate-400 hover:text-rose-400 p-1.5 cursor-pointer"
                      title="Xóa file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Hướng Dẫn DownSub (Khớp 100% Ảnh thiết kế) */}
              <div className="rounded-2xl bg-[#072428] border border-[#0d4a52] overflow-hidden">
                <div className="p-3.5 flex items-center justify-between border-b border-[#0d4a52]/60">
                  <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <DownloadIcon className="w-4 h-4 text-emerald-400" /> Cách lấy file SRT từ DownSub
                  </span>
                  <a
                    href="https://downsub.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Mở DownSub <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#04191c] border border-[#0d4a52] text-slate-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-black flex items-center justify-center text-[10px] shrink-0">
                      1
                    </span>
                    <span className="text-[11px] leading-tight">Nhập link YouTube ở bước 1</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-200 flex items-center gap-2 shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-blue-900 border border-blue-400 text-blue-300 font-black flex items-center justify-center text-[10px] shrink-0">
                      2
                    </span>
                    <span className="text-[11px] leading-tight font-black">
                      Mở DownSub, tải file phụ đề tiếng Anh .SRT
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#04191c] border border-[#0d4a52] text-slate-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-black flex items-center justify-center text-[10px] shrink-0">
                      3
                    </span>
                    <span className="text-[11px] leading-tight">Tải file vừa tải lên ở ô trên</span>
                  </div>
                </div>
              </div>

              {/* Option B: Dán nội dung transcript trực tiếp */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowEnPaste(!showEnPaste)}
                  className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{showEnPaste ? '▼' : '▶'} Hoặc dán nội dung transcript trực tiếp</span>
                </button>

                {showEnPaste && (
                  <div className="mt-2 space-y-2 animate-fade-in">
                    <textarea
                      rows={5}
                      value={enRawText}
                      onChange={(e) => setEnRawText(e.target.value)}
                      placeholder="Dán nội dung SRT/VTT hoặc từng dòng câu tiếng Anh vào đây..."
                      className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl p-3 text-xs text-white outline-none resize-none font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* BƯỚC 3: BẢN DỊCH TIẾNG VIỆT (TÙY CHỌN) */}
            <div className="space-y-3 pt-2 border-t border-[#1e2d42]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="text-purple-400 font-extrabold">文A</span> Bản dịch tiếng Việt
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md text-[10px] font-bold">
                    tùy chọn
                  </span>
                </label>

                {/* Nút Prompt Dịch AI (Màu tím) */}
                <button
                  type="button"
                  onClick={handleCopyAIPrompt}
                  className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  title="Copy Prompt dịch SRT chuẩn để dán vào ChatGPT / Claude"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Prompt dịch AI</span>
                </button>
              </div>

              {/* Option A: Upload file bản dịch */}
              <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#121c2b] border border-[#1e2d42] flex items-center justify-center text-purple-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {viFileName ? viFileName : 'Chọn file bản dịch SRT, VTT hoặc TXT'}
                    </p>
                    <p className="text-[11px] text-slate-400">Không bắt buộc - có thể dịch sau</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="file"
                    ref={viFileInputRef}
                    onChange={handleViFileUpload}
                    accept=".srt,.vtt,.txt"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => viFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#121c2b] hover:bg-[#1a293d] border border-[#1e2d42] text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {viFileName ? 'Đổi file' : 'Tải lên'}
                  </button>
                </div>
              </div>

              {/* Option B: Dán bản dịch tiếng Việt trực tiếp */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowViPaste(!showViPaste)}
                  className="text-xs font-bold text-slate-400 hover:text-purple-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{showViPaste ? '▼' : '▶'} Hoặc dán nội dung bản dịch tiếng Việt trực tiếp</span>
                </button>

                {showViPaste && (
                  <div className="mt-2 space-y-2 animate-fade-in">
                    <textarea
                      rows={5}
                      value={viRawText}
                      onChange={(e) => setViRawText(e.target.value)}
                      placeholder="Dán nội dung SRT bản dịch hoặc từng dòng câu tiếng Việt..."
                      className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-purple-500 rounded-2xl p-3 text-xs text-white outline-none resize-none font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: MÀN HÌNH CHỈNH TRANSCRIPT TABLE + PREVIEW VIDEO (Khớp Phần 4) */}
        {/* ========================================================================= */}
        {wizardStep === 2 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI: PREVIEW VIDEO YOUTUBE (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" /> Preview Video
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {editableSentences.length} câu đã parse
                </span>
              </div>

              <div className="aspect-16/9 w-full bg-black rounded-2xl overflow-hidden border border-[#1e2d42] shadow-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                  title="YouTube Preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-1.5 text-xs">
                <p className="font-black text-white">{videoTitle}</p>
                <p className="text-slate-400 text-[11px]">
                  💡 Bạn có thể bấm vào từng ô thời gian để tinh chỉnh mốc giây sao cho khớp chính xác với video.
                </p>
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG CHỈNH TRANSCRIPT TABLE (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">Bảng câu thoại & bản dịch:</span>
                <button
                  type="button"
                  onClick={handleAddNewSentence}
                  className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm câu mới
                </button>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {editableSentences.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-2 relative group hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span className="text-emerald-400 font-black">#{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <span>
                          <input
                            type="number"
                            step="0.1"
                            value={s.startTime}
                            onChange={(e) =>
                              handleUpdateCell(idx, 'startTime', parseFloat(e.target.value) || 0)
                            }
                            className="w-14 bg-[#121c2b] border border-[#1e2d42] rounded-md px-1.5 py-0.5 text-center text-white font-mono text-xs"
                          />
                          s →{' '}
                          <input
                            type="number"
                            step="0.1"
                            value={s.endTime}
                            onChange={(e) =>
                              handleUpdateCell(idx, 'endTime', parseFloat(e.target.value) || 0)
                            }
                            className="w-14 bg-[#121c2b] border border-[#1e2d42] rounded-md px-1.5 py-0.5 text-center text-white font-mono text-xs"
                          />
                          s
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSentence(idx)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                          title="Xóa câu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={s.english}
                      onChange={(e) => handleUpdateCell(idx, 'english', e.target.value)}
                      placeholder="Câu tiếng Anh..."
                      className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white font-bold outline-none"
                    />

                    <input
                      type="text"
                      value={s.vietnamese || ''}
                      onChange={(e) => handleUpdateCell(idx, 'vietnamese', e.target.value)}
                      placeholder="Bản dịch tiếng Việt..."
                      className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-purple-500 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 font-medium outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FOOTER MODAL (Khớp 100% Ảnh thiết kế) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-t border-[#1e2d42] bg-[#121c2b] flex items-center justify-between shrink-0">
          {/* Bên trái: Thông báo miễn phí */}
          <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs" />
            <span>Tạo bài học miễn phí</span>
          </div>

          {/* Bên phải: Nút Hủy & Nút Tiếp tục */}
          <div className="flex items-center gap-3">
            {wizardStep === 2 && (
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="px-4 py-2.5 border border-[#1e2d42] hover:bg-[#1e2d42] text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#1e2d42] hover:bg-[#1e2d42] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>

            {wizardStep === 1 ? (
              <button
                type="button"
                onClick={handleProceedToEdit}
                className="px-6 py-2.5 bg-[#00c950] hover:bg-[#00b046] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                Tiếp tục chỉnh transcript
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndCreateLesson}
                className="px-6 py-2.5 bg-[#00c950] hover:bg-[#00b046] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Lưu và tạo bài học
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
