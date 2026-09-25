'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Link as LinkIcon,
  Upload,
  FileText,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Video,
  Sparkles,
  Eye,
  Star,
  Layers,
} from 'lucide-react';
import { DictationLesson, DictationSentence, VideoLevel, VideoStatus } from '@/lib/types';
import { parseSubtitleFile, mergeTranslations } from '@/lib/srtParser';
import { extractYoutubeId } from '@/lib/videoAutoSegmenter';

interface AdminVideoModalProps {
  isOpen: boolean;
  videoToEdit?: DictationLesson | null;
  onClose: () => void;
  onSave: (videoData: any) => void;
}

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

export default function AdminVideoModal({
  isOpen,
  videoToEdit,
  onClose,
  onSave,
}: AdminVideoModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [level, setLevel] = useState<VideoLevel>('B1');
  const [duration, setDuration] = useState<number>(60);
  const [status, setStatus] = useState<VideoStatus>('published');
  const [isPinned, setIsPinned] = useState(false);
  const [order, setOrder] = useState<number>(1);

  // Tags
  const [tags, setTags] = useState<string[]>(['# Youtube video']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Transcript & Sentences
  const [enRawText, setEnRawText] = useState('');
  const [viRawText, setViRawText] = useState('');
  const [enFileName, setEnFileName] = useState('');
  const [viFileName, setViFileName] = useState('');
  const [sentences, setSentences] = useState<DictationSentence[]>([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);

  const enFileRef = useRef<HTMLInputElement | null>(null);
  const viFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (videoToEdit) {
      setYoutubeUrl(videoToEdit.youtubeUrl || (videoToEdit.youtubeId ? `https://www.youtube.com/watch?v=${videoToEdit.youtubeId}` : ''));
      setYoutubeId(videoToEdit.youtubeId || videoToEdit.videoId || '');
      setTitle(videoToEdit.title || '');
      setThumbnailUrl(videoToEdit.thumbnail || videoToEdit.thumbnailUrl || '');
      setLevel(videoToEdit.level || 'B1');
      setDuration(videoToEdit.duration || 60);
      setStatus(videoToEdit.status || 'published');
      setIsPinned(videoToEdit.isPinned || false);
      setOrder(videoToEdit.order || 1);
      setTags(videoToEdit.tags || ['# Youtube video']);
      setSentences(videoToEdit.sentences || []);
    } else {
      setYoutubeUrl('');
      setYoutubeId('');
      setTitle('');
      setThumbnailUrl('');
      setLevel('B1');
      setDuration(60);
      setStatus('published');
      setIsPinned(false);
      setOrder(1);
      setTags(['# Youtube video']);
      setSentences([]);
    }
  }, [videoToEdit, isOpen]);

  if (!isOpen) return null;

  // Fetch Youtube Info
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

  // Upload English Transcript
  const handleEnFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setEnRawText(content);
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

  // Upload Vietnamese Subtitle
  const handleViFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setViFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setViRawText(content);
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

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const cleanTag = customTagInput.startsWith('#') ? customTagInput.trim() : `# ${customTagInput.trim()}`;
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setCustomTagInput('');
  };

  const handleSave = (chosenStatus?: VideoStatus) => {
    if (!youtubeId) {
      setErrorMessage('Vui lòng nhập link YouTube hợp lệ');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Tiêu đề video là bắt buộc');
      return;
    }

    const payload: any = {
      youtubeUrl,
      youtubeId,
      videoId: youtubeId,
      title: title.trim(),
      topic: tags[0] ? tags[0].replace('#', '').trim() : 'General Topic',
      level,
      duration: Number(duration) || 60,
      thumbnail: thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      status: chosenStatus || status,
      isPinned,
      order: Number(order) || 1,
      tags,
      sentences: sentences.length > 0 ? sentences : [
        {
          id: 's-1',
          startTime: 0,
          endTime: duration,
          text: title,
          vietnameseMeaning: 'Bản dịch mặc định',
        },
      ],
      totalSentences: sentences.length || 1,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1e2d42] flex items-center justify-between bg-[#121c2b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {videoToEdit ? 'Chỉnh sửa Video Bài Học' : 'Thêm Video Bài Học Mới'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Quản trị nội dung video, transcript và trạng thái xuất bản
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1e2d42] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-950/90 border-b border-rose-500 px-4 py-2 text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Row 1: YouTube URL + Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-8 space-y-2">
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
                  className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              {isFetchingInfo && (
                <p className="text-[11px] text-emerald-400 font-bold">Đang lấy thông tin từ YouTube oEmbed...</p>
              )}
            </div>

            <div className="sm:col-span-4 space-y-2">
              <label className="text-xs font-black text-slate-300">Thumbnail Preview</label>
              <div className="aspect-16/9 bg-black rounded-2xl overflow-hidden border border-[#1e2d42] relative flex items-center justify-center">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="Thumb" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[11px] text-slate-500">Chưa có ảnh</span>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Tiêu đề + Cấp độ + Thời lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1">
              <label className="text-xs font-black text-slate-300">
                Tiêu đề video <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề video..."
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 px-4 text-xs font-semibold text-white outline-none"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-black text-slate-300">Cấp độ (Level)</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 px-3 text-xs font-bold text-white outline-none cursor-pointer"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-black text-slate-300">Thời lượng (Giây)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 px-4 text-xs font-mono text-white outline-none"
              />
            </div>
          </div>

          {/* Row 3: Tags (Multi-select + Create Tag) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-300">Danh mục & Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_TAGS.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#0e1726] text-slate-400 border border-[#1e2d42] hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="Thêm tag tùy chỉnh..."
                className="bg-[#0e1726] border border-[#1e2d42] rounded-xl px-3 py-1.5 text-xs text-white outline-none w-48"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 bg-[#1e2d42] hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Thêm Tag
              </button>
            </div>
          </div>

          {/* Row 4: Transcript Subtitles (Upload file / Paste) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1e2d42]">
            {/* English SRT */}
            <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> Transcript tiếng Anh
                </span>
                <span className="text-[10px] text-slate-400">{sentences.length} câu</span>
              </div>

              <input
                type="file"
                ref={enFileRef}
                onChange={handleEnFileUpload}
                accept=".srt,.vtt,.txt"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => enFileRef.current?.click()}
                className="w-full py-2 bg-[#121c2b] hover:bg-[#1a293d] border border-[#1e2d42] text-xs font-bold text-slate-300 hover:text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{enFileName ? enFileName : 'Upload file SRT / VTT / TXT'}</span>
              </button>
            </div>

            {/* Vietnamese Subtitle */}
            <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" /> Bản dịch tiếng Việt
                </span>
                <span className="text-[10px] text-slate-400">Tùy chọn</span>
              </div>

              <input
                type="file"
                ref={viFileRef}
                onChange={handleViFileUpload}
                accept=".srt,.vtt,.txt"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => viFileRef.current?.click()}
                className="w-full py-2 bg-[#121c2b] hover:bg-[#1a293d] border border-[#1e2d42] text-xs font-bold text-slate-300 hover:text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{viFileName ? viFileName : 'Upload bản dịch SRT / VTT / TXT'}</span>
              </button>
            </div>
          </div>

          {/* Row 5: Trạng thái + Pin + Thứ tự */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#1e2d42]">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Trạng thái xuất bản</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2 px-3 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="published">Công khai (Published)</option>
                <option value="hidden">Ẩn (Hidden)</option>
                <option value="draft">Nháp (Draft)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Nổi bật (Pin trang chủ)</label>
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`w-full py-2 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isPinned
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-[#0e1726] border-[#1e2d42] text-slate-400'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isPinned ? 'Đã ghim nổi bật' : 'Không ghim'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Thứ tự hiển thị (Order)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2 px-4 text-xs font-mono text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 sm:p-5 border-t border-[#1e2d42] bg-[#121c2b] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-[#1e2d42] hover:bg-[#1e2d42] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-5 py-2.5 bg-[#1e2d42] hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-black transition-all cursor-pointer"
          >
            Lưu nháp
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="px-6 py-2.5 bg-[#00c950] hover:bg-[#00b046] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Xuất bản video
          </button>
        </div>
      </div>
    </div>
  );
}
