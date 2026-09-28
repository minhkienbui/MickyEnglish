'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Link as LinkIcon,
  Upload,
  FileText,
  HelpCircle,
  Play,
  Plus,
  Trash2,
  AlertCircle,
  Video,
  HardDrive,
  Loader2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useDictationStore } from '@/stores/useDictationStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { DictationLesson, DictationSentence } from '@/lib/types';
import {
  parseSubtitleFile,
  mergeTranslations,
  ParsedSentence,
} from '@/lib/srtParser';
import { extractYoutubeId } from '@/lib/videoAutoSegmenter';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
  const router = useRouter();
  const { addCustomLesson } = useDictationStore();
  const { user } = useAuthStore();

  // Wizard Step: 1 = Nhập link/Upload, 2 = Chỉnh sửa Transcript & Preview
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);

  // Nguồn video: 'local' (Tải file từ máy tính) hoặc 'youtube' (Link YouTube)
  const [videoSource, setVideoSource] = useState<'local' | 'youtube'>('local');

  // Trạng thái Upload Video Trực Tiếp
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(60);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Trạng thái Link YouTube
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

  // Toasts & Messages
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  // STEP 2: Editable Sentences Table
  const [editableSentences, setEditableSentences] = useState<ParsedSentence[]>([]);
  const enFileInputRef = useRef<HTMLInputElement | null>(null);
  const viFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // [UPLOAD VIDEO TRỰC TIẾP LÊN WEBSITE]
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 250 * 1024 * 1024) {
      setErrorMessage('File video quá lớn! Vui lòng chọn file dưới 250MB.');
      return;
    }

    setErrorMessage('');
    setIsUploadingVideo(true);
    setUploadedFileName(file.name);
    setUploadedFileSize(file.size);

    // Tính toán thời lượng video từ file local
    const tempUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = tempUrl;
    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration) || 60;
      setVideoDuration(dur);
      URL.revokeObjectURL(tempUrl);
    };

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload video thất bại.');
      }

      setUploadedVideoUrl(data.videoUrl);
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      showToast('🎉 Video đã được tải lên và lưu trữ thành công trên website!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi tải file video lên server.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // [TỰ ĐỘNG CHIA CÂU CHO VIDEO TẢI LÊN]
  const handleAutoSegment = () => {
    const dur = Math.max(10, videoDuration || 60);
    const sentenceInterval = 5; // 5s mỗi câu
    const totalCount = Math.ceil(dur / sentenceInterval);
    const autoSentences: ParsedSentence[] = [];

    for (let i = 0; i < totalCount; i++) {
      const start = i * sentenceInterval;
      const end = Math.min(dur, (i + 1) * sentenceInterval);
      autoSentences.push({
        id: i + 1,
        startTime: start,
        endTime: end,
        english: `Sentence ${i + 1}`,
        vietnamese: `Câu ${i + 1}`,
        words: ['Sentence', `${i + 1}`],
      });
    }

    setEnSentences(autoSentences);
    showToast(`⚡ Đã tự động chia video thành ${totalCount} mốc câu (mỗi câu 5 giây) để luyện nghe!`);
  };

  // [FETCH TIÊU ĐỀ YOUTUBE]
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

  // [ĐỌC FILE TRANSCRIPT TIẾNG ANH]
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

  // [ĐỌC FILE BẢN DỊCH TIẾNG VIỆT]
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

  // [CHUYỂN SANG BƯỚC 2: CHỈNH SỬA TRANSCRIPT]
  const handleProceedToEdit = () => {
    if (videoSource === 'local') {
      if (!uploadedVideoUrl) {
        setErrorMessage('Vui lòng chọn và tải video lên từ máy tính trước.');
        return;
      }
    } else {
      if (!youtubeId) {
        setErrorMessage('Vui lòng nhập link YouTube hợp lệ.');
        return;
      }
    }

    let parsedEn = enSentences;
    if (parsedEn.length === 0 && enRawText.trim()) {
      const { sentences, warning } = parseSubtitleFile(enRawText, 'transcript.srt');
      parsedEn = sentences;
      if (warning) setWarningMessage(warning);
    }

    // Nếu là video tải lên mà chưa có phụ đề, tự động tạo các câu 5s
    if (parsedEn.length === 0 && videoSource === 'local') {
      handleAutoSegment();
      parsedEn = enSentences;
    }

    if (parsedEn.length === 0) {
      setErrorMessage('Transcript bài học là bắt buộc. Bạn có thể tải file .srt/.vtt hoặc bấm nút "Tự động chia câu".');
      return;
    }

    // Ghép bản dịch tiếng Việt nếu có
    const { merged, warning } = mergeTranslations(parsedEn, viRawText, viFileName || 'vietnamese.srt');
    if (warning) setWarningMessage(warning);

    setEditableSentences(merged);
    setWizardStep(2);
  };

  // [CẬP NHẬT TỪNG Ô TRANSCRIPT]
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

  // [LƯU VÀ TẠO BÀI HỌC]
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

    const isLocalVideo = videoSource === 'local';
    const newLessonId = isLocalVideo
      ? `upload-${Date.now()}`
      : `custom-${youtubeId}-${Date.now()}`;

    const newLesson: DictationLesson = {
      id: newLessonId,
      title: videoTitle || (isLocalVideo ? uploadedFileName : `Bài học ${youtubeId}`),
      topic: isLocalVideo ? 'Video tải lên' : 'Bài học YouTube',
      level: 'B1',
      ...(isLocalVideo
        ? {
            videoUrl: uploadedVideoUrl,
            thumbnail: '/placeholder-video.png',
            thumbnailUrl: '/placeholder-video.png',
          }
        : {
            youtubeId: youtubeId,
            videoId: youtubeId,
            youtubeUrl: videoUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
            thumbnail: videoThumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
            thumbnailUrl: videoThumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
          }),
      duration: cleanLessonSentences[cleanLessonSentences.length - 1]?.endTime || videoDuration || 120,
      sentences: cleanLessonSentences,
      totalSentences: cleanLessonSentences.length,
      status: 'published',
      tags: isLocalVideo ? ['# Video tải lên', '# Video của tôi'] : ['# Video tự tạo', '# Youtube video'],
      createdAt: Date.now(),
      views: 1,
      isCustom: true,
      createdBy: user?.id || 'guest',
    };

    addCustomLesson(newLesson);
    onClose();
    router.push(`/dictation-shadowing/${newLessonId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER MODAL */}
        <div className="p-5 border-b border-[#1e2d42] flex items-center justify-between bg-[#121c2b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
              <Video className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                {wizardStep === 1 ? 'Thêm video vào bài học' : 'Chỉnh sửa & Đồng bộ Transcript'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {wizardStep === 1
                  ? 'Tải video trực tiếp từ máy tính hoặc dùng liên kết YouTube để luyện Dictation & Shadowing'
                  : 'Kiểm tra mốc thời gian, câu tiếng Anh và bản dịch trước khi tạo bài học'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Bạn có thể tải trực tiếp file video (.mp4, .webm) từ máy tính để lưu trên website, hoặc dán link YouTube.')}
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

        {/* STEP 1: CHỌN NGUỒN VIDEO & NHẬP TRANSCRIPT */}
        {wizardStep === 1 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* TABS CHỌN NGUỒN: TẢI TỪ MÁY HOẶC YOUTUBE */}
            <div className="flex rounded-2xl bg-[#0e1726] border border-[#1e2d42] p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => setVideoSource('local')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  videoSource === 'local'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>Tải lên từ máy tính (Lưu trên website)</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoSource('youtube')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  videoSource === 'youtube'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Nhập liên kết YouTube</span>
              </button>
            </div>

            {/* TAB 1: TẢI VIDEO TỪ MÁY TÍNH */}
            {videoSource === 'local' && (
              <div className="space-y-4 p-5 rounded-2xl bg-[#0e1726] border border-[#1e2d42]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white flex items-center gap-1.5">
                    <span className="text-emerald-400 font-extrabold">1</span> File Video
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-md text-[10px] font-black">
                      MP4, WebM, MOV, MKV (Tối đa 250MB)
                    </span>
                  </label>
                </div>

                <input
                  type="file"
                  ref={videoFileInputRef}
                  onChange={handleVideoFileChange}
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska,video/*"
                  className="hidden"
                />

                {!uploadedVideoUrl ? (
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#1e2d42] hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-[#121c2b] flex flex-col items-center justify-center gap-2.5 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#121c2b] border border-[#1e2d42] flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      {isUploadingVideo ? (
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">
                        {isUploadingVideo ? 'Đang tải và lưu video trực tiếp lên website...' : 'Nhấp để chọn file video từ máy tính của bạn'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isUploadingVideo ? 'Vui lòng chờ trong giây lát...' : 'Hỗ trợ các định dạng MP4, WebM, MOV, MKV'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#121c2b] border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate">{uploadedFileName}</p>
                        <p className="text-[11px] text-emerald-400">
                          Đã lưu trên website • {(uploadedFileSize / (1024 * 1024)).toFixed(1)} MB • ~{videoDuration}s
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#0e1726] hover:bg-[#1a293d] border border-[#1e2d42] text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Đổi video khác
                    </button>
                  </div>
                )}

                {/* Tiêu đề video bài học */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Tên bài học / Tiêu đề video:</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Nhập tên bài học..."
                    className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: NHẬP LINK YOUTUBE */}
            {videoSource === 'youtube' && (
              <div className="space-y-3 p-5 rounded-2xl bg-[#0e1726] border border-[#1e2d42]">
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
                    className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white font-medium outline-none transition-colors"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>

                {youtubeId && (
                  <div className="p-3 bg-[#121c2b] border border-[#1e2d42] rounded-2xl flex items-center gap-3 animate-fade-in">
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
            )}

            {/* BƯỚC 2: TRANSCRIPT TIẾNG ANH */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="text-emerald-400 font-extrabold">2</span> Transcript bài học
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-md text-[10px] font-black">
                    Luyện nghe & chép
                  </span>
                </label>

                {/* Nút tự động chia câu nhanh */}
                {videoSource === 'local' && uploadedVideoUrl && (
                  <button
                    type="button"
                    onClick={handleAutoSegment}
                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tự động chia câu (5s/câu)</span>
                  </button>
                )}
              </div>

              {/* Tải file transcript */}
              <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#121c2b] border border-[#1e2d42] flex items-center justify-center text-emerald-400 shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {enFileName ? enFileName : enSentences.length > 0 ? `Đã có ${enSentences.length} mốc câu sẵn sàng` : 'Chọn file transcript (SRT / VTT / TXT)'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {enSentences.length > 0 ? `${enSentences.length} câu đã được nhận diện` : 'Hỗ trợ file phụ đề chuẩn SRT, VTT'}
                    </p>
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
                    {enFileName ? 'Đổi file' : 'Tải file SRT'}
                  </button>
                </div>
              </div>

              {/* Dán văn bản trực tiếp */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowEnPaste(!showEnPaste)}
                  className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{showEnPaste ? '▼' : '▶'} Hoặc dán transcript / lời thoại trực tiếp</span>
                </button>

                {showEnPaste && (
                  <div className="mt-2 space-y-2 animate-fade-in">
                    <textarea
                      rows={5}
                      value={enRawText}
                      onChange={(e) => setEnRawText(e.target.value)}
                      placeholder="Dán nội dung SRT hoặc từng câu tiếng Anh tại đây..."
                      className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl p-3 text-xs text-white outline-none resize-none font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* BƯỚC 3: BẢN DỊCH TIẾNG VIỆT (TÙY CHỌN) */}
            <div className="space-y-3">
              <label className="text-xs font-black text-white flex items-center gap-1.5">
                <span className="text-purple-400 font-extrabold">3</span> Bản dịch tiếng Việt (Không bắt buộc)
              </label>

              <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#121c2b] border border-[#1e2d42] flex items-center justify-center text-purple-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {viFileName ? viFileName : 'Chọn file bản dịch SRT hoặc TXT'}
                    </p>
                    <p className="text-[11px] text-slate-400">Không bắt buộc - có thể thêm sau</p>
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
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW VIDEO + BẢNG ĐỒNG BỘ TRANSCRIPT */}
        {wizardStep === 2 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI: PREVIEW VIDEO (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" /> Preview Video
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {editableSentences.length} câu đã sẵn sàng
                </span>
              </div>

              <div className="aspect-16/9 w-full bg-black rounded-2xl overflow-hidden border border-[#1e2d42] shadow-xl flex items-center justify-center">
                {videoSource === 'local' && uploadedVideoUrl ? (
                  <video
                    src={uploadedVideoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    title="YouTube Preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-1.5 text-xs">
                <p className="font-black text-white">{videoTitle}</p>
                <p className="text-slate-400 text-[11px]">
                  💡 Bạn có thể chỉnh sửa mốc giây và lời thoại ở bảng bên phải để khớp chính xác với video.
                </p>
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG CHỈNH CÂU THOẠI (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">Danh sách câu thoại:</span>
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

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-[#1e2d42] bg-[#121c2b] flex items-center justify-between shrink-0">
          {wizardStep === 1 ? (
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#1e2d42] hover:bg-[#1a293d] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleProceedToEdit}
                disabled={isUploadingVideo}
                className="px-6 py-2.5 rounded-xl bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white text-xs font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Tiếp tục chỉnh transcript</span>
                <span className="text-base">→</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="px-4 py-2 rounded-xl border border-[#1e2d42] hover:bg-[#1a293d] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                ← Quay lại bước 1
              </button>

              <button
                type="button"
                onClick={handleSaveAndCreateLesson}
                className="px-6 py-2.5 rounded-xl bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white text-xs font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Lưu & Bắt đầu học ngay</span>
                <span className="text-base">✓</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
