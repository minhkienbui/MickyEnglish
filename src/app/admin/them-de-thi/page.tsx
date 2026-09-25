'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Save,
  FileText,
  Clock,
  Award,
  HelpCircle,
  CheckCircle2,
  Upload,
  ArrowLeft,
  Sparkles,
  Layers,
  FileCode,
  Loader2,
  AlertCircle,
  Bot,
  ScanText,
  Zap,
  Palette,
  FileType,
  FileCheck,
} from 'lucide-react';

interface QuestionItem {
  id: string;
  order: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hasColoredAnswer?: boolean;
}

interface SectionItem {
  id: string;
  name: string;
  order: number;
  passage: string;
  audioUrl: string;
  questions: QuestionItem[];
}

export default function CreateExamPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'TOEIC' | 'IELTS' | 'VSTEP'>('TOEIC');
  const [duration, setDuration] = useState<number>(30);
  const [description, setDescription] = useState('');

  const [sections, setSections] = useState<SectionItem[]>([
    {
      id: 'sec-1',
      name: 'Part 5: Incomplete Sentences',
      order: 1,
      passage: '',
      audioUrl: '',
      questions: [
        {
          id: 'q-1',
          order: 1,
          questionText: 'The project manager suggested that we _______ customer feedback before the launch.',
          options: ['analyze', 'analyzes', 'analyzed', 'analyzing'],
          correctAnswer: 0,
          explanation: 'Cấu trúc giả định thức: suggest that + S + (should) + V-nguyên thể -> chọn "analyze".',
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string; title: string } | null>(null);

  // Modals state
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // AI Generator Modal
  const [showAiGenModal, setShowAiGenModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('Kinh doanh & Đàm phán');
  const [aiCount, setAiCount] = useState(5);
  const [aiLevel, setAiLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // AI Scanner / File & Text OCR Parser Modal
  const [showAiScanModal, setShowAiScanModal] = useState(false);
  const [scanMode, setScanMode] = useState<'file' | 'text'>('file');
  const [rawScanText, setRawScanText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResultPreview, setScanResultPreview] = useState<any>(null);
  const [colorDetectionInfo, setColorDetectionInfo] = useState<{ hasColored: boolean; count: number } | null>(null);

  // Add section
  const handleAddSection = () => {
    const newSec: SectionItem = {
      id: 'sec-' + Date.now(),
      name: `Phần ${sections.length + 1}`,
      order: sections.length + 1,
      passage: '',
      audioUrl: '',
      questions: [
        {
          id: 'q-' + Date.now(),
          order: 1,
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
        },
      ],
    };
    setSections([...sections, newSec]);
  };

  // Remove section
  const handleRemoveSection = (secIndex: number) => {
    if (sections.length <= 1) {
      alert('Đề thi cần có ít nhất 1 phần thi.');
      return;
    }
    setSections(sections.filter((_, idx) => idx !== secIndex));
  };

  // Add question
  const handleAddQuestion = (secIndex: number) => {
    const updated = [...sections];
    const sec = updated[secIndex];
    sec.questions.push({
      id: 'q-' + Date.now(),
      order: sec.questions.length + 1,
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    });
    setSections(updated);
  };

  // Remove question
  const handleRemoveQuestion = (secIndex: number, qIndex: number) => {
    const updated = [...sections];
    if (updated[secIndex].questions.length <= 1) {
      alert('Mỗi phần cần ít nhất 1 câu hỏi.');
      return;
    }
    updated[secIndex].questions = updated[secIndex].questions.filter((_, idx) => idx !== qIndex);
    setSections(updated);
  };

  // Update question field
  const handleUpdateQuestion = (
    secIndex: number,
    qIndex: number,
    field: keyof QuestionItem,
    value: any
  ) => {
    const updated = [...sections];
    updated[secIndex].questions[qIndex] = {
      ...updated[secIndex].questions[qIndex],
      [field]: value,
    };
    setSections(updated);
  };

  // Update option
  const handleUpdateOption = (
    secIndex: number,
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const updated = [...sections];
    const opts = [...updated[secIndex].questions[qIndex].options];
    opts[optIndex] = value;
    updated[secIndex].questions[qIndex].options = opts;
    setSections(updated);
  };

  // Trigger AI Generation
  const handleGenerateExamByAi = async () => {
    try {
      setAiLoading(true);
      const res = await fetch('/api/ai/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          topic: aiTopic,
          count: aiCount,
          level: aiLevel,
          customInstructions: aiCustomPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Sinh đề bằng AI không thành công.');
      }

      const generated = data.exam;
      if (generated.title) setTitle(generated.title);
      if (generated.type) setType(generated.type);
      if (generated.duration) setDuration(generated.duration);
      if (generated.description) setDescription(generated.description);
      if (Array.isArray(generated.sections) && generated.sections.length > 0) {
        setSections(
          generated.sections.map((s: any, sIdx: number) => ({
            id: 'sec-' + (sIdx + 1),
            name: s.name || `Phần ${sIdx + 1}`,
            order: s.order || sIdx + 1,
            passage: s.passage || '',
            audioUrl: s.audioUrl || '',
            questions: (s.questions || []).map((q: any, qIdx: number) => ({
              id: 'q-' + (qIdx + 1),
              order: q.order || qIdx + 1,
              questionText: q.questionText || '',
              options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
              correctAnswer: Number(q.correctAnswer) || 0,
              explanation: q.explanation || '',
            })),
          }))
        );
      }

      setShowAiGenModal(false);
      alert(`✨ AI đã tạo thành công đề thi với ${generated.sections.reduce((sum: number, s: any) => sum + s.questions.length, 0)} câu hỏi!`);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo đề thi AI.');
    } finally {
      setAiLoading(false);
    }
  };

  // Trigger File Upload & Color Scan
  const handleScanUploadedFile = async (file: File) => {
    try {
      setScanLoading(true);
      setSelectedFile(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/ai/scan-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Quét file không thành công.');
      }

      setScanResultPreview(data.exam);
      setColorDetectionInfo({
        hasColored: data.hasColoredAnswers,
        count: data.coloredAnswersCount || 0,
      });
    } catch (err: any) {
      alert(err.message || 'Lỗi khi quét file tài liệu.');
    } finally {
      setScanLoading(false);
    }
  };

  // Trigger AI Text Scanning
  const handleScanExamText = async () => {
    if (!rawScanText.trim()) {
      alert('Vui lòng dán văn bản đề thi thô vào ô nhập liệu.');
      return;
    }

    try {
      setScanLoading(true);
      const res = await fetch('/api/ai/parse-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: rawScanText,
          type,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Quét đề thi không thành công.');
      }

      setScanResultPreview(data.exam);
      setColorDetectionInfo({
        hasColored: (data.exam.coloredAnswersCount || 0) > 0,
        count: data.exam.coloredAnswersCount || 0,
      });
    } catch (err: any) {
      alert(err.message || 'Lỗi khi quét đề thi.');
    } finally {
      setScanLoading(false);
    }
  };

  // Apply parsed scan result to main form
  const handleApplyScanResult = () => {
    if (!scanResultPreview) return;
    const p = scanResultPreview;
    if (p.title) setTitle(p.title);
    if (p.type) setType(p.type);
    if (p.duration) setDuration(p.duration);
    if (p.description) setDescription(p.description);
    if (Array.isArray(p.sections) && p.sections.length > 0) {
      setSections(
        p.sections.map((s: any, sIdx: number) => ({
          id: 'sec-' + (sIdx + 1),
          name: s.name || `Phần ${sIdx + 1}`,
          order: s.order || sIdx + 1,
          passage: s.passage || '',
          audioUrl: s.audioUrl || '',
          questions: (s.questions || []).map((q: any, qIdx: number) => ({
            id: 'q-' + (qIdx + 1),
            order: q.order || qIdx + 1,
            questionText: q.questionText || '',
            options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
            correctAnswer: Number(q.correctAnswer) || 0,
            explanation: q.explanation || '',
            hasColoredAnswer: q.hasColoredAnswer,
          })),
        }))
      );
    }

    setShowAiScanModal(false);
    setScanResultPreview(null);
    setSelectedFile(null);
    setRawScanText('');
    alert('Đã áp dụng toàn bộ đề thi được bóc tách vào biểu mẫu thành công!');
  };

  // Submit Exam to Database
  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Vui lòng nhập tên đề thi.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        type,
        duration: Number(duration) || 30,
        description: description.trim(),
        sections: sections.map((sec, sIdx) => ({
          name: sec.name.trim(),
          order: sIdx + 1,
          passage: sec.passage.trim() || null,
          audioUrl: sec.audioUrl.trim() || null,
          questions: sec.questions.map((q, qIdx) => ({
            order: qIdx + 1,
            questionText: q.questionText.trim(),
            options: q.options.map((opt) => opt.trim()),
            correctAnswer: Number(q.correctAnswer),
            explanation: q.explanation.trim(),
          })),
        })),
      };

      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Tạo đề thi thất bại.');
      }

      setSuccess({
        id: data.exam.id,
        title: data.exam.title,
      });
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra khi lưu đề thi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#121c2b] border border-[#1e2d42] p-6 rounded-3xl shadow-xl">
        <div>
          <Link href="/kho-de" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 mb-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại Kho đề thi
          </Link>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            Tạo, Quét File PDF & Word Bằng AI (Admin)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quét file Word / PDF với nhận diện chữ màu tự động, tạo đề thi AI hoặc chỉnh sửa trực quan.
          </p>
        </div>

        {/* AI Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Scanner / PDF / Word Button */}
          <button
            type="button"
            onClick={() => setShowAiScanModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer animate-pulse"
          >
            <ScanText className="w-4 h-4" />
            Quét File Word / PDF
          </button>

          {/* AI Generator Button */}
          <button
            type="button"
            onClick={() => setShowAiGenModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            AI Tạo Đề Tự Động
          </button>

          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="px-3 py-2 bg-[#0e1726] border border-[#1e2d42] hover:border-slate-500 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-slate-400" />
            Nhập JSON
          </button>
        </div>
      </div>

      {/* Alert Error / Success */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-6 bg-emerald-950/80 border border-emerald-500 rounded-3xl text-emerald-200 space-y-3 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 text-base font-black text-white">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span>Đã tạo và xuất bản đề thi thành công!</span>
          </div>
          <p className="text-xs text-emerald-300">
            Đề thi <strong>"{success.title}"</strong> đã được lưu trữ an toàn trong PostgreSQL và sẵn sàng cho học viên làm bài thi.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/kho-de/${success.id}`}
              className="btn-micky-primary text-xs px-5 py-2.5"
            >
              Làm thử đề thi ngay
            </Link>
            <button
              onClick={() => {
                setSuccess(null);
                setTitle('');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Tạo đề khác
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmitExam} className="space-y-8">
        {/* 1. Thông Tin Chung Đề Thi */}
        <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-[#1e2d42] pb-3">
            <FileText className="w-5 h-5 text-emerald-400" />
            1. Thông tin chung về đề thi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Tên đề thi *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: TOEIC Practice Test 2026 - Mini Test 01"
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 font-semibold outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Loại chứng chỉ</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none cursor-pointer"
              >
                <option value="TOEIC">TOEIC</option>
                <option value="IELTS">IELTS</option>
                <option value="VSTEP">VSTEP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Thời gian làm bài (Phút)
              </label>
              <input
                type="number"
                min={5}
                max={180}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white font-semibold outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Mô tả tóm tắt</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Đề thi kiểm tra khả năng đọc hiểu và ngữ pháp căn bản."
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 font-semibold outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Danh Sách Phần Thi (Sections) & Câu Hỏi */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              2. Nội dung các phần thi ({sections.length} phần, {sections.reduce((sum, s) => sum + s.questions.length, 0)} câu hỏi)
            </h2>

            <button
              type="button"
              onClick={handleAddSection}
              className="btn-micky-secondary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm phần thi mới
            </button>
          </div>

          {sections.map((section, secIdx) => (
            <div
              key={section.id}
              className="bg-[#121c2b] border-2 border-[#1e2d42] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1e2d42] pb-4">
                <div className="flex items-center gap-2 flex-1 w-full">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                    {secIdx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={section.name}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[secIdx].name = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="Tên phần (VD: Part 5: Incomplete Sentences hoặc Reading Passage 1)"
                    className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSection(secIdx)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-950/40 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Xóa phần này"
                >
                  <Trash2 className="w-4 h-4" /> Xóa phần
                </button>
              </div>

              {/* Optional Passage & Audio */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Đoạn văn đọc hiểu (Passage - Tùy chọn nếu là bài đọc)
                  </label>
                  <textarea
                    rows={3}
                    value={section.passage}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[secIdx].passage = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="Dán nội dung bài đọc, email, thông báo văn bản vào đây..."
                    className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-3 text-xs text-slate-200 outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Đường dẫn Audio (Tùy chọn nếu là bài nghe)
                  </label>
                  <input
                    type="text"
                    value={section.audioUrl}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[secIdx].audioUrl = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="https://.../audio.mp3"
                    className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Các câu hỏi trong phần {secIdx + 1} ({section.questions.length} câu)
                  </h4>

                  <button
                    type="button"
                    onClick={() => handleAddQuestion(secIdx)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-[#0e1726] px-3 py-1.5 rounded-xl border border-[#1e2d42]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm câu hỏi
                  </button>
                </div>

                {section.questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="bg-[#0e1726] border border-[#1e2d42] rounded-2xl p-5 space-y-4 shadow-sm"
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white bg-emerald-950/80 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-600/40">
                          Câu {qIdx + 1}
                        </span>
                        {q.hasColoredAnswer && (
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Palette className="w-3 h-3" /> Đáp án chữ màu
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(secIdx, qIdx)}
                        className="text-red-400 hover:text-red-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa câu
                      </button>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-300">Nội dung câu hỏi *</label>
                      <input
                        type="text"
                        required
                        value={q.questionText}
                        onChange={(e) =>
                          handleUpdateQuestion(secIdx, qIdx, 'questionText', e.target.value)
                        }
                        placeholder="VD: What is the main purpose of the announcement?"
                        className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white font-semibold outline-none"
                      />
                    </div>

                    {/* 4 Options Grid */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300">
                        4 Lựa chọn (Chọn ô tròn màu xanh tương ứng đáp án ĐÚNG) *
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = q.correctAnswer === optIdx;
                          const letter = String.fromCharCode(65 + optIdx);
                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                isCorrect
                                  ? 'bg-emerald-950/60 border-emerald-500 text-white'
                                  : 'bg-[#121c2b] border-[#1e2d42] text-slate-300'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(secIdx, qIdx, 'correctAnswer', optIdx)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 cursor-pointer ${
                                  isCorrect
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#0e1726] text-slate-400 border border-[#1e2d42] hover:text-white'
                                }`}
                              >
                                {letter}
                              </button>

                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={(e) =>
                                  handleUpdateOption(secIdx, qIdx, optIdx, e.target.value)
                                }
                                placeholder={`Đáp án ${letter}...`}
                                className="w-full bg-transparent border-none outline-none text-xs font-semibold text-white placeholder-slate-500"
                              />

                              {isCorrect && (
                                <span className="text-[10px] font-extrabold text-emerald-400 uppercase mr-2">
                                  ĐÚNG
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                        Giải thích chi tiết đáp án (Tiếng Việt)
                      </label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) =>
                          handleUpdateQuestion(secIdx, qIdx, 'explanation', e.target.value)
                        }
                        placeholder="VD: Căn cứ vào câu đầu đoạn 2, đáp án A chính xác vì..."
                        className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Bottom Bar */}
        <div className="sticky bottom-4 z-20 bg-[#121c2b]/95 backdrop-blur-md border border-[#1e2d42] p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            Tổng cộng: <strong className="text-white">{sections.length}</strong> phần,{' '}
            <strong className="text-emerald-400">
              {sections.reduce((sum, s) => sum + s.questions.length, 0)}
            </strong>{' '}
            câu hỏi
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-micky-primary px-8 py-3 text-xs flex items-center gap-2 shadow-xl cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu & Xuất Bản Đề Thi
          </button>
        </div>
      </form>

      {/* MODAL 1: AI EXAM GENERATOR */}
      {showAiGenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121c2b] border border-emerald-500/40 w-full max-w-xl rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                AI Tự Động Sinh Đề Thi Trắc Nghiệm
              </h3>
              <button
                type="button"
                onClick={() => setShowAiGenModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Trợ lý AI sẽ tự động biên soạn một bộ đề thi hoàn chỉnh chuẩn định dạng kèm 4 lựa chọn, đáp án chính xác và lời giải thích tiếng Việt.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Loại đề thi</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#0e1726] border border-[#1e2d42] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="VSTEP">VSTEP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Cấp độ độ khó</label>
                  <select
                    value={aiLevel}
                    onChange={(e) => setAiLevel(e.target.value as any)}
                    className="w-full bg-[#0e1726] border border-[#1e2d42] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="Beginner">Sơ cấp (Cơ bản)</option>
                    <option value="Intermediate">Trung cấp (Chuẩn)</option>
                    <option value="Advanced">Cao cấp (Nâng cao)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Chủ đề bài thi</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="VD: Kinh doanh, Công nghệ, Môi trường, Giao tiếp công sở..."
                  className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Số lượng câu hỏi cần tạo</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Yêu cầu đặc biệt cho AI (Tùy chọn)</label>
                <input
                  type="text"
                  value={aiCustomPrompt}
                  onChange={(e) => setAiCustomPrompt(e.target.value)}
                  placeholder="VD: Tập trung vào ngữ pháp mệnh đề quan hệ và thì hoàn thành..."
                  className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAiGenModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={aiLoading}
                onClick={handleGenerateExamByAi}
                className="btn-micky-primary px-6 py-2.5 text-xs font-black flex items-center gap-2"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? 'AI Đang Biên Soạn...' : 'Sinh Đề Thi Ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AI SCANNER - FILE UPLOAD (WORD / PDF) & TEXT PARSER */}
      {showAiScanModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121c2b] border border-blue-500/50 w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ScanText className="w-6 h-6 text-blue-400" />
                  AI Quét File Word, PDF & Nhận Diện Chữ Màu
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Tải lên file <strong>Word (.docx)</strong> hoặc <strong>PDF (.pdf)</strong>. AI sẽ tự động đọc câu hỏi và <strong className="text-amber-400">quét các chữ có màu (đỏ, xanh, vàng, highlight) để làm đáp án đúng!</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAiScanModal(false);
                  setScanResultPreview(null);
                  setSelectedFile(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Mode Switcher: Tải File vs Dán Text */}
            <div className="flex border-b border-[#1e2d42] gap-4">
              <button
                type="button"
                onClick={() => setScanMode('file')}
                className={`pb-2.5 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  scanMode === 'file'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileType className="w-4 h-4" />
                Tải lên File Word (.docx) / PDF
              </button>

              <button
                type="button"
                onClick={() => setScanMode('text')}
                className={`pb-2.5 text-xs font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  scanMode === 'text'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Dán Văn Bản Trực Tiếp
              </button>
            </div>

            {/* Mode 1: File Dropzone */}
            {scanMode === 'file' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.doc,.pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleScanUploadedFile(f);
                  }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-500/40 hover:border-blue-400 bg-[#0e1726] rounded-3xl p-8 text-center cursor-pointer transition-all hover:bg-[#121f33] space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">
                      Nhấn để chọn file Word (.docx) hoặc PDF (.pdf) từ máy tính
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Hỗ trợ định dạng .docx, .doc, .pdf, .txt (Dung lượng tối đa 15MB)
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    Tính năng đặc biệt: Tự động phát hiện chữ tô màu đỏ/xanh/vàng làm đáp án đúng!
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-4 bg-[#0e1726] border border-[#1e2d42] rounded-2xl text-xs">
                    <div className="flex items-center gap-2 text-slate-200">
                      <FileCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <strong>{selectedFile.name}</strong>
                        <span className="text-slate-400 ml-2">
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={scanLoading}
                      onClick={() => handleScanUploadedFile(selectedFile)}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      Quét lại
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Direct Text Paste */}
            {scanMode === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[11px] font-bold text-slate-400">Dán mẫu thử nghiệm:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setRawScanText(`Title: Đề thi tiếng Anh Word với chữ màu

Part 5: Vocabulary
1. What is the antonym of abundant?
A. Plentiful
B. Scarce (chữ đỏ)
C. Generous
D. Large
Giải thích: Scarce mang nghĩa khan hiếm, trái nghĩa với abundant.

2. Choose the correct spelling:
A. Accommodate (màu xanh)
B. Acommodate
C. Accomodate
D. Acomodate`)
                    }
                    className="px-2.5 py-1 rounded-lg bg-[#0e1726] border border-[#1e2d42] hover:border-emerald-500 text-slate-300 text-[11px] font-semibold cursor-pointer"
                  >
                    Mẫu có đánh dấu chữ màu (đỏ/xanh)
                  </button>
                </div>

                <textarea
                  rows={7}
                  value={rawScanText}
                  onChange={(e) => setRawScanText(e.target.value)}
                  placeholder="Dán toàn bộ văn bản đề thi thô vào đây..."
                  className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-blue-500 rounded-2xl p-4 text-xs font-mono text-slate-200 outline-none leading-relaxed"
                />

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    disabled={scanLoading}
                    onClick={handleScanExamText}
                    className="btn-micky-primary px-6 py-2.5 text-xs font-black flex items-center gap-2"
                  >
                    {scanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {scanLoading ? 'Đang Bóc Tách...' : 'Bắt Đầu Quét & Phân Tích'}
                  </button>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {scanLoading && (
              <div className="p-8 text-center space-y-3 bg-[#0e1726] rounded-2xl border border-blue-500/30">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
                <p className="text-xs font-bold text-slate-200">
                  AI đang đọc tệp tài liệu, phân tích các phần thi và nhận diện màu sắc đáp án...
                </p>
              </div>
            )}

            {/* Preview of Parsed Result */}
            {scanResultPreview && !scanLoading && (
              <div className="p-5 bg-[#0e1726] border border-emerald-500/50 rounded-2xl space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1e2d42] pb-3">
                  <div>
                    <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Kết quả bóc tách file thành công!
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300">
                      <span>
                        Nhận diện <strong>{scanResultPreview.sections?.length || 0}</strong> phần thi,{' '}
                        <strong>
                          {scanResultPreview.sections?.reduce(
                            (sum: number, s: any) => sum + s.questions.length,
                            0
                          )}{' '}
                          câu hỏi
                        </strong>.
                      </span>

                      {colorDetectionInfo?.hasColored && (
                        <span className="badge-micky-green text-[10px] py-0.5">
                          ✓ Đã tự động chọn {colorDetectionInfo.count} câu có chữ màu làm đáp án đúng!
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyScanResult}
                    className="btn-micky-primary px-6 py-2.5 text-xs font-black shadow-lg cursor-pointer shrink-0"
                  >
                    ✓ Áp Dụng Vào Đề Thi
                  </button>
                </div>

                {/* Question List Preview */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {scanResultPreview.sections?.map((sec: any, sIdx: number) => (
                    <div key={sIdx} className="p-3 bg-[#121c2b] rounded-xl border border-[#1e2d42] space-y-2">
                      <p className="text-xs font-bold text-white">
                        {sec.name} ({sec.questions.length} câu)
                      </p>
                      {sec.passage && (
                        <p className="text-[11px] text-slate-400 italic line-clamp-2">
                          Passage: {sec.passage}
                        </p>
                      )}
                      <div className="space-y-1.5">
                        {sec.questions.map((q: any, qIdx: number) => (
                          <div key={qIdx} className="text-[11px] text-slate-300 bg-[#0e1726] p-2 rounded-lg border border-[#1e2d42]">
                            <div className="flex items-center justify-between">
                              <span>
                                <strong>Câu {q.order || qIdx + 1}:</strong> {q.questionText}
                              </span>
                              <span className="text-emerald-400 font-black ml-2 shrink-0">
                                Đáp án: {String.fromCharCode(65 + (q.correctAnswer || 0))}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 grid grid-cols-2 gap-1 mt-1 pl-2">
                              {q.options.map((opt: string, optIdx: number) => (
                                <span
                                  key={optIdx}
                                  className={q.correctAnswer === optIdx ? 'text-emerald-400 font-bold' : ''}
                                >
                                  {String.fromCharCode(65 + optIdx)}. {opt}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: JSON BULK IMPORT */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121c2b] border border-[#1e2d42] w-full max-w-2xl rounded-3xl p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-400" />
                Nhập đề thi nhanh từ JSON
              </h3>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Dán đoạn mã JSON chứa danh sách câu hỏi theo đúng định dạng vào ô bên dưới để tự động điền toàn bộ biểu mẫu trong 1 giây:
            </p>

            <textarea
              rows={12}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{
  "title": "IELTS Academic Reading Test 1",
  "type": "IELTS",
  "duration": 60,
  "description": "Đề thi đọc học thuật chuyên sâu",
  "sections": [
    {
      "name": "Passage 1: The Life of Bees",
      "passage": "Bees are flying insects known for their role in pollination...",
      "questions": [
        {
          "questionText": "What is the primary role of bees?",
          "options": ["Pollination", "Honey only", "Defense", "Navigation"],
          "correctAnswer": 0,
          "explanation": "Câu đầu nêu rõ role in pollination."
        }
      ]
    }
  ]
}`}
              className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-blue-500 rounded-2xl p-4 text-xs font-mono text-emerald-300 outline-none leading-relaxed"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonInput);
                    if (parsed.title) setTitle(parsed.title);
                    if (parsed.type) setType(parsed.type);
                    if (parsed.duration) setDuration(Number(parsed.duration));
                    if (parsed.description) setDescription(parsed.description);
                    if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
                      setSections(
                        parsed.sections.map((s: any, sIdx: number) => ({
                          id: 'sec-' + (sIdx + 1),
                          name: s.name || `Phần ${sIdx + 1}`,
                          order: s.order || sIdx + 1,
                          passage: s.passage || '',
                          audioUrl: s.audioUrl || '',
                          questions: (s.questions || []).map((q: any, qIdx: number) => ({
                            id: 'q-' + (qIdx + 1),
                            order: q.order || qIdx + 1,
                            questionText: q.questionText || '',
                            options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
                            correctAnswer: Number(q.correctAnswer) || 0,
                            explanation: q.explanation || '',
                          })),
                        }))
                      );
                    }
                    setShowJsonModal(false);
                    setJsonInput('');
                    alert('Đã nạp dữ liệu đề thi thành công!');
                  } catch (err: any) {
                    alert('JSON không hợp lệ: ' + err.message);
                  }
                }}
                className="btn-micky-primary px-6 py-2.5 text-xs font-bold"
              >
                Áp dụng JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
