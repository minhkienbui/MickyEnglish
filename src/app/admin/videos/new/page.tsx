'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Video,
  ArrowLeft,
  Check,
  Upload,
  FileText,
  Sparkles,
  Link as LinkIcon,
  Plus,
  Trash2,
  Eye,
  Star,
  Copy,
  Layers,
  Settings,
  Info,
  Calendar,
  Shield,
  MessageSquare,
  Gem,
} from 'lucide-react';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';
import { parseSubtitleFile, mergeTranslations, generateAIDranslatePrompt } from '@/lib/srtParser';
import { extractYoutubeId } from '@/lib/videoAutoSegmenter';
import { VideoLevel, VideoStatus, DictationSentence } from '@/lib/types';

const DEFAULT_TAGS = [
  '# Youtube video',
  '# TED',
  '# BBC learning english',
  '# Animals and wildlife',
  '# Short Movie',
  '# Fairy Tales',
  '# IELTS Listening',
  '# News',
  '# Daily Conversation',
];

const LEVELS: VideoLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function AdminNewVideoPage() {
  const router = useRouter();
  const { addVideo } = useAdminVideoStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'transcript' | 'advanced'>('basic');

  // Tab 1: Basic Info
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<VideoLevel>('B1');
  const [duration, setDuration] = useState<number>(60);
  const [tags, setTags] = useState<string[]>(['# Youtube video']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [status, setStatus] = useState<VideoStatus>('published');
  const [isPinned, setIsPinned] = useState(false);
  const [order, setOrder] = useState<number>(1);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);

  // Tab 2: Transcript
  const [enFileName, setEnFileName] = useState('');
  const [viFileName, setViFileName] = useState('');
  const [sentences, setSentences] = useState<DictationSentence[]>([]);
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  // Tab 3: Advanced Settings
  const [allowComments, setAllowComments] = useState(true);
  const [requireLogin, setRequireLogin] = useState(false);
  const [unlockDiamonds, setUnlockDiamonds] = useState(0);
  const [publishDate, setPublishDate] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const enFileRef = useRef<HTMLInputElement | null>(null);
  const viFileRef = useRef<HTMLInputElement | null>(null);

  // YouTube URL Blur auto-fetch
  const handleUrlBlur = async () => {
    if (!youtubeUrl.trim()) return;
    const extracted = extractYoutubeId(youtubeUrl);
    if (!extracted) {
      setErrorMessage('URL YouTube không đúng định dạng');
      return;
    }

    setErrorMessage('');
    setYoutubeId(extracted);
    const defaultThumb = `https://img.youtube.com/vi/${extracted}/hqdefault.jpg`;
    if (!thumbnailUrl) setThumbnailUrl(defaultThumb);

    setIsFetchingInfo(true);
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${extracted}&format=json`
      );
      if (res.ok) {
        const data = await res.json();
        if (!title) setTitle(data.title || `Video ${extracted}`);
      }
    } catch {
      if (!title) setTitle(`Video ${extracted}`);
    } finally {
      setIsFetchingInfo(false);
    }
  };

  // Upload EN Transcript
  const handleEnFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const { sentences: parsed } = parseSubtitleFile(content, file.name);
      const formatted: DictationSentence[] = parsed.map((p, idx) => ({
        id: `s-${idx + 1}`,
        startTime: p.startTime,
        endTime: p.endTime,
        text: p.english,
        vietnameseMeaning: '',
      }));
      setSentences(formatted);
      if (formatted.length > 0) {
        setDuration(Math.ceil(formatted[formatted.length - 1].endTime));
      }
    };
    reader.readAsText(file);
  };

  // Upload VI Subtitle
  const handleViFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setViFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const { merged } = mergeTranslations(
        sentences.map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime, english: s.text })),
        content,
        file.name
      );
      const updated: DictationSentence[] = merged.map((m, idx) => ({
        id: `s-${idx + 1}`,
        startTime: m.startTime,
        endTime: m.endTime,
        text: m.english,
        vietnameseMeaning: m.vietnamese || '',
      }));
      setSentences(updated);
    };
    reader.readAsText(file);
  };

  // Copy AI Translation Prompt
  const handleCopyAIPrompt = () => {
    if (sentences.length === 0) {
      alert('Vui lòng upload transcript tiếng Anh trước khi tạo prompt AI');
      return;
    }
    const prompt = generateAIDranslatePrompt(
      sentences.map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime, english: s.text }))
    );
    navigator.clipboard.writeText(prompt);
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 3000);
    window.open('https://claude.ai', '_blank');
  };

  // Inline Sentence Edits
  const handleSentenceChange = (idx: number, field: 'text' | 'vietnameseMeaning' | 'startTime' | 'endTime', val: any) => {
    const next = [...sentences];
    next[idx] = { ...next[idx], [field]: val };
    setSentences(next);
  };

  const handleAddSentence = () => {
    const last = sentences[sentences.length - 1];
    const startTime = last ? last.endTime : 0;
    const endTime = startTime + 5;
    setSentences([
      ...sentences,
      { id: `s-${sentences.length + 1}`, startTime, endTime, text: 'New sentence...', vietnameseMeaning: '' },
    ]);
  };

  const handleDeleteSentence = (idx: number) => {
    setSentences(sentences.filter((_, i) => i !== idx));
  };

  // Save Video
  const handleSave = (chosenStatus?: VideoStatus) => {
    let finalYoutubeId = youtubeId;
    if (!finalYoutubeId && youtubeUrl) {
      finalYoutubeId = extractYoutubeId(youtubeUrl) || '';
      setYoutubeId(finalYoutubeId);
    }

    if (!finalYoutubeId) {
      setErrorMessage('Vui lòng nhập link YouTube hợp lệ ở Tab 1 (Thông tin cơ bản)');
      setActiveTab('basic');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Tiêu đề video là bắt buộc');
      setActiveTab('basic');
      return;
    }

    const calculatedDuration =
      sentences.length > 0
        ? Math.ceil(sentences[sentences.length - 1].endTime)
        : Number(duration) || 60;

    const newLessonId = `lesson-${finalYoutubeId}-${Date.now()}`;
    const payload: any = {
      id: newLessonId,
      youtubeUrl: youtubeUrl || `https://www.youtube.com/watch?v=${finalYoutubeId}`,
      youtubeId: finalYoutubeId,
      videoId: finalYoutubeId,
      title: title.trim(),
      topic: tags[0] ? tags[0].replace('#', '').trim() : 'General Topic',
      level: level || 'B1',
      duration: calculatedDuration,
      thumbnail: thumbnailUrl || `https://img.youtube.com/vi/${finalYoutubeId}/hqdefault.jpg`,
      thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${finalYoutubeId}/hqdefault.jpg`,
      status: chosenStatus || status || 'published',
      isPinned,
      order: Number(order) || 1,
      tags: tags.length > 0 ? tags : ['# Youtube video'],
      sentences: sentences.length > 0 ? sentences : [
        { id: 's-1', startTime: 0, endTime: calculatedDuration, text: title.trim(), vietnameseMeaning: 'Bản dịch' },
      ],
      totalSentences: sentences.length || 1,
      createdAt: Date.now(),
      views: 0,
      allowComments,
      requireLogin,
      unlockDiamonds,
      publishDate,
      metaTitle,
      metaDescription,
    };

    addVideo(payload);
    router.push('/admin/videos');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header Form */}
      <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/videos"
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-400" /> Thêm video bài học mới
            </h1>
            <p className="text-xs text-slate-400">Tạo bài học Dictation & Shadowing chuẩn quốc tế với 3 bước</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            className="px-5 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Xuất bản
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-950/90 border border-rose-500 rounded-2xl text-xs font-bold text-rose-300 flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#334155] pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-black transition-all cursor-pointer ${
            activeTab === 'basic'
              ? 'border-emerald-500 text-emerald-400 bg-[#1e293b]/40 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" /> Tab 1 — Thông tin cơ bản
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transcript')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-black transition-all cursor-pointer ${
            activeTab === 'transcript'
              ? 'border-emerald-500 text-emerald-400 bg-[#1e293b]/40 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Tab 2 — Transcript ({sentences.length} câu)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-black transition-all cursor-pointer ${
            activeTab === 'advanced'
              ? 'border-emerald-500 text-emerald-400 bg-[#1e293b]/40 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" /> Tab 3 — Cài đặt nâng cao & SEO
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: THÔNG TIN CƠ BẢN */}
      {/* ========================================================================= */}
      {activeTab === 'basic' && (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-5 animate-fade-in">
          {/* YouTube Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300">
              Link YouTube <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none"
              />
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            {isFetchingInfo && <p className="text-[11px] text-emerald-400 font-bold">Đang lấy thông tin từ YouTube...</p>}
          </div>

          {/* Title + Thumbnail Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-300">
                  Tiêu đề video <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề video..."
                  className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2.5 px-4 text-xs font-semibold text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-300">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung bài học..."
                  className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl p-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-black text-slate-300">Thumbnail Video</label>
              <div className="aspect-16/9 bg-black rounded-2xl overflow-hidden border border-[#334155] relative flex items-center justify-center">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[11px] text-slate-500">Xem trước ảnh</span>
                )}
              </div>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="URL ảnh thumbnail khác..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-1.5 px-3 text-[11px] text-slate-300 outline-none"
              />
            </div>
          </div>

          {/* Level, Duration, Status, Pin, Order */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#334155]">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Cấp độ (Level)</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2 px-3 text-xs font-bold text-white outline-none cursor-pointer"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Thời lượng (Giây)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-4 text-xs font-mono text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="published">Công khai</option>
                <option value="hidden">Ẩn</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Ghim nổi bật</label>
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`w-full py-2 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isPinned ? 'bg-amber-500/20 border-amber-500/60 text-amber-300' : 'bg-[#0f172a] border-[#334155] text-slate-400'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isPinned ? 'Đã ghim' : 'Không ghim'}</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-black text-slate-300">Tags danh mục</label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_TAGS.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isSelected) setTags(tags.filter((t) => t !== tag));
                      else setTags([...tags, tag]);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#22c55e] text-white shadow-xs'
                        : 'bg-[#0f172a] text-slate-400 border border-[#334155] hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRANSCRIPT SUBTITLES & INLINE EDITOR */}
      {/* ========================================================================= */}
      {activeTab === 'transcript' && (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-6 animate-fade-in">
          {/* File Upload Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* English Upload */}
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> Transcript Tiếng Anh (Bắt buộc)
                </span>
                <span className="text-[10px] text-slate-400">{sentences.length} câu</span>
              </div>

              <input type="file" ref={enFileRef} onChange={handleEnFileUpload} accept=".srt,.vtt,.txt" className="hidden" />
              <button
                type="button"
                onClick={() => enFileRef.current?.click()}
                className="w-full py-2.5 bg-[#1e293b] hover:bg-[#273549] text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-[#334155] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{enFileName ? enFileName : 'Upload file SRT / VTT / TXT (Tiếng Anh)'}</span>
              </button>
            </div>

            {/* Vietnamese Upload & AI Prompt */}
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" /> Bản dịch Tiếng Việt (Tùy chọn)
                </span>
                <button
                  type="button"
                  onClick={handleCopyAIPrompt}
                  className="text-[10px] text-purple-300 bg-purple-950/80 border border-purple-500/50 px-2 py-0.5 rounded-md hover:bg-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-300" />
                  {isPromptCopied ? 'Đã copy prompt!' : '✨ Prompt dịch AI'}
                </button>
              </div>

              <input type="file" ref={viFileRef} onChange={handleViFileUpload} accept=".srt,.vtt,.txt" className="hidden" />
              <button
                type="button"
                onClick={() => viFileRef.current?.click()}
                className="w-full py-2.5 bg-[#1e293b] hover:bg-[#273549] text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-[#334155] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{viFileName ? viFileName : 'Upload file dịch SRT / VTT / TXT (Tiếng Việt)'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Inline Sentences Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white">Bảng chỉnh sửa câu & thời gian (Timeline)</h3>
              <button
                type="button"
                onClick={handleAddSentence}
                className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#334155] text-emerald-400 text-xs font-black rounded-xl border border-[#334155] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm câu mới
              </button>
            </div>

            <div className="border border-[#334155] rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f172a] text-slate-400 text-[10px] uppercase font-black sticky top-0 border-b border-[#334155]">
                  <tr>
                    <th className="py-2.5 px-3 w-10">#</th>
                    <th className="py-2.5 px-3 w-28">Start (s)</th>
                    <th className="py-2.5 px-3 w-28">End (s)</th>
                    <th className="py-2.5 px-3">Câu tiếng Anh</th>
                    <th className="py-2.5 px-3">Bản dịch tiếng Việt</th>
                    <th className="py-2.5 px-3 text-right w-12">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/60 bg-[#1e293b]">
                  {sentences.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-bold">
                        Chưa có câu nào. Vui lòng upload file transcript hoặc bấm "+ Thêm câu mới".
                      </td>
                    </tr>
                  ) : (
                    sentences.map((s, idx) => (
                      <tr key={s.id || idx} className="hover:bg-[#273549]/60 transition-colors">
                        <td className="py-2 px-3 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            step="0.1"
                            value={s.startTime}
                            onChange={(e) => handleSentenceChange(idx, 'startTime', parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2 py-1 text-xs font-mono text-white outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            step="0.1"
                            value={s.endTime}
                            onChange={(e) => handleSentenceChange(idx, 'endTime', parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2 py-1 text-xs font-mono text-white outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={s.text}
                            onChange={(e) => handleSentenceChange(idx, 'text', e.target.value)}
                            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1 text-xs font-semibold text-white outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={s.vietnameseMeaning || ''}
                            onChange={(e) => handleSentenceChange(idx, 'vietnameseMeaning', e.target.value)}
                            placeholder="Dịch nghĩa..."
                            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1 text-xs text-slate-300 outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteSentence(idx)}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CÀI ĐẶT NÂNG CAO & SEO */}
      {/* ========================================================================= */}
      {activeTab === 'advanced' && (
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Quyền truy cập & Tương tác
              </h3>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-white block">Cho phép bình luận</span>
                  <span className="text-[11px] text-slate-400 block">Học viên có thể bình luận dưới video này</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded-sm cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-white block">Yêu cầu đăng nhập để học</span>
                  <span className="text-[11px] text-slate-400 block">Khách chưa đăng nhập không thể mở bài này</span>
                </div>
                <input
                  type="checkbox"
                  checked={requireLogin}
                  onChange={(e) => setRequireLogin(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded-sm cursor-pointer"
                />
              </label>

              <div className="p-3 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-cyan-400" /> Chi phí Đá Quý mở khóa
                  </span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">{unlockDiamonds} 💎</span>
                </div>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={unlockDiamonds}
                  onChange={(e) => setUnlockDiamonds(parseInt(e.target.value) || 0)}
                  placeholder="0 = Miễn phí"
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-3 py-1.5 text-xs text-white outline-none font-mono"
                />
                <p className="text-[10px] text-slate-500">Nhập 0 nếu video này hoàn toàn miễn phí cho tất cả học viên.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-400" /> Cấu hình SEO & Lên lịch đăng
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Lên lịch ngày xuất bản</label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">SEO Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Tiêu đề hiển thị trên Google..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Mô tả tóm tắt cho công cụ tìm kiếm..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl p-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
