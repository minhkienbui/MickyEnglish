'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Check,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Layers,
  Clock,
  GraduationCap,
  HardDrive,
  Trash2,
  Eye,
} from 'lucide-react';
import { useExamStore } from '@/stores/useExamStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { ExamPaper, ExamQuestion } from '@/lib/types';

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamAdded?: (exam: ExamPaper) => void;
}

export default function AddExamModal({ isOpen, onClose, onExamAdded }: AddExamModalProps) {
  const router = useRouter();
  const { addCustomExam, startExam } = useExamStore();
  const { user } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Steps: 1 = Chọn/Tải file hoặc dán text, 2 = Xem trước & Tinh chỉnh câu hỏi
  const [step, setStep] = useState<1 | 2>(1);
  const [inputTab, setInputTab] = useState<'file' | 'text'>('file');

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Exam state
  const [examTitle, setExamTitle] = useState('');
  const [examType, setExamType] = useState<'TOEIC' | 'IELTS' | 'VSTEP' | 'THPTQG' | 'Oxford 3000' | string>('TOEIC');
  const [examLevel, setExamLevel] = useState<string>('B1');
  const [examDuration, setExamDuration] = useState<number>(30);
  const [examDescription, setExamDescription] = useState('');
  const [detectedAnswersCount, setDetectedAnswersCount] = useState<number>(0);

  // Parsed Questions state
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  // [BƯỚC 1] Xử lý tải và quét file PDF / Word (.docx)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File quá lớn! Kích thước tối đa cho phép là 50MB.');
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc') && !name.endsWith('.txt')) {
      setErrorMessage('Định dạng file không được hỗ trợ. Vui lòng chọn file PDF, Word (.docx) hoặc .txt.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', examType);

      const res = await fetch('/api/upload/exam-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể quét nội dung từ file.');
      }

      setUploadedFileUrl(data.fileUrl || '');

      const parsedExam = data.exam;
      if (parsedExam) {
        setExamTitle(parsedExam.title || file.name.replace(/\.[^/.]+$/, ''));
        setExamType(parsedExam.type || examType);
        setExamDuration(parsedExam.duration || 30);
        setExamDescription(parsedExam.description || `Đề thi trích xuất từ file ${file.name}`);
        setDetectedAnswersCount(data.detectedAnswersCount || 0);

        // Flatten questions từ sections
        const flattenedQuestions: ExamQuestion[] = (parsedExam.sections || []).flatMap((sec: any) =>
          (sec.questions || []).map((q: any) => ({
            id: q.id || `q-${q.order}-${Date.now().toString().slice(-4)}`,
            order: q.order,
            questionText: q.questionText,
            options: q.options || ['A', 'B', 'C', 'D'],
            correctAnswer: q.correctAnswer ?? 0,
            explanation: q.explanation || 'Chưa có giải thích chi tiết.',
            part: sec.name || 'Phần 1',
            hasDetectedAnswer: q.hasDetectedAnswer || q.hasColoredAnswer,
          }))
        );

        setQuestions(flattenedQuestions);
        setStep(2);
        setSuccessMessage(
          `🎉 Đã nhận dạng ${flattenedQuestions.length} câu hỏi từ "${file.name}"! Tự động phân loại ${data.detectedAnswersCount || 0} đáp án đúng.`
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi xử lý và quét file tài liệu.');
    } finally {
      setIsUploading(false);
    }
  };

  // [BƯỚC 1B] Xử lý khi dán trực tiếp văn bản đề thi
  const handleParseText = async () => {
    if (!rawText.trim()) {
      setErrorMessage('Vui lòng dán nội dung văn bản đề thi vào ô bên dưới.');
      return;
    }

    setErrorMessage('');
    setIsUploading(true);

    try {
      const res = await fetch('/api/ai/parse-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, type: examType }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể nhận diện nội dung văn bản.');
      }

      const parsedExam = data.exam;
      setExamTitle(parsedExam.title || 'Đề thi tự tạo bằng AI');
      setExamType(parsedExam.type || examType);
      setExamDuration(parsedExam.duration || 30);
      setExamDescription(parsedExam.description || 'Đề thi trích xuất từ văn bản');
      setDetectedAnswersCount(parsedExam.detectedAnswersCount || 0);

      const flattenedQuestions: ExamQuestion[] = (parsedExam.sections || []).flatMap((sec: any) =>
        (sec.questions || []).map((q: any) => ({
          id: q.id || `q-${q.order}-${Date.now().toString().slice(-4)}`,
          order: q.order,
          questionText: q.questionText,
          options: q.options || ['A', 'B', 'C', 'D'],
          correctAnswer: q.correctAnswer ?? 0,
          explanation: q.explanation || 'Chưa có giải thích chi tiết.',
          part: sec.name || 'Phần 1',
          hasDetectedAnswer: q.hasDetectedAnswer || q.hasColoredAnswer,
        }))
      );

      setQuestions(flattenedQuestions);
      setStep(2);
      setSuccessMessage(
        `🎉 Đã nhận dạng ${flattenedQuestions.length} câu hỏi! Tự động phân loại ${parsedExam.detectedAnswersCount || 0} đáp án đúng.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi phân tích văn bản đề thi.');
    } finally {
      setIsUploading(false);
    }
  };

  // Cập nhật đáp án đúng cho từng câu hỏi
  const handleUpdateCorrectAnswer = (qIndex: number, newAnsIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = {
        ...updated[qIndex],
        correctAnswer: newAnsIndex,
        hasDetectedAnswer: true,
      };
      return updated;
    });
  };

  // Cập nhật giải thích chi tiết
  const handleUpdateExplanation = (qIndex: number, newExp: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = {
        ...updated[qIndex],
        explanation: newExp,
      };
      return updated;
    });
  };

  // Xóa câu hỏi khỏi danh sách
  const handleDeleteQuestion = (qIndex: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  // [BƯỚC 2] Lưu đề thi vào Database và Store
  const handleSaveExam = async () => {
    if (questions.length === 0) {
      alert('Đề thi cần có ít nhất 1 câu hỏi.');
      return;
    }

    setIsSaving(true);

    const generatedId = `custom-exam-${Date.now()}`;
    const newExamPaper: ExamPaper = {
      id: generatedId,
      title: examTitle.trim() || 'Đề thi mới',
      type: examType,
      level: examLevel,
      description: examDescription.trim() || `Đề thi gồm ${questions.length} câu hỏi.`,
      durationMinutes: Number(examDuration) || 30,
      duration: Number(examDuration) || 30,
      totalQuestions: questions.length,
      attempts: 1,
      createdAt: new Date().toISOString(),
      questions: questions.map((q, idx) => ({
        ...q,
        order: idx + 1,
      })),
      fileUrl: uploadedFileUrl || undefined,
      fileName: selectedFile?.name || undefined,
    };

    // 1. Thêm vào Zustand store để dùng ngay
    addCustomExam(newExamPaper);

    // 2. Đồng bộ lưu vào database Neon PostgreSQL qua API /api/exams
    try {
      await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newExamPaper.title,
          type: newExamPaper.type,
          description: newExamPaper.description,
          duration: newExamPaper.durationMinutes,
          sections: [
            {
              name: 'Phần 1: Trắc nghiệm',
              order: 1,
              questions: newExamPaper.questions.map((q) => ({
                order: q.order,
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
              })),
            },
          ],
        }),
      });
    } catch (dbErr) {
      console.warn('Sync to database completed or offline:', dbErr);
    }

    setIsSaving(false);
    onClose();

    if (onExamAdded) {
      onExamAdded(newExamPaper);
    }

    // Bắt đầu bài thi và điều hướng đến phòng thi ngay
    startExam(newExamPaper, { mode: 'practice' });
    router.push(`/kho-de/${generatedId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER MODAL */}
        <div className="p-5 border-b border-[#1e2d42] flex items-center justify-between bg-[#121c2b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                {step === 1 ? 'Thêm Đề Thi từ File PDF / Word' : 'Kiểm Tra & Tinh Chỉnh Đề Thi'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {step === 1
                  ? 'AI tự động nhận dạng câu hỏi, 4 đáp án và phân loại đáp án đúng từ tài liệu'
                  : `Đã bóc tách ${questions.length} câu hỏi • Lưu trữ trực tiếp trên website`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1e2d42] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* THÔNG BÁO TOAST & LỖI */}
        {errorMessage && (
          <div className="bg-rose-950/90 border-b border-rose-500 px-4 py-2.5 text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-500 px-4 py-2.5 text-center text-xs font-black text-emerald-300 flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 1: TẢI FILE PDF/WORD HOẶC DÁN NỘI DUNG VĂN BẢN                       */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Tabs chọn hình thức */}
            <div className="flex rounded-2xl bg-[#0e1726] border border-[#1e2d42] p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => setInputTab('file')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  inputTab === 'file'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Tải lên file PDF hoặc Word (.docx)</span>
              </button>

              <button
                type="button"
                onClick={() => setInputTab('text')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  inputTab === 'text'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Dán nội dung văn bản đề thi</span>
              </button>
            </div>

            {/* TAB 1: UPLOAD FILE PDF / WORD */}
            {inputTab === 'file' && (
              <div className="space-y-4 p-6 rounded-3xl bg-[#0e1726] border border-[#1e2d42]">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1e2d42] hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer transition-all hover:bg-[#121c2b] flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#121c2b] border border-[#1e2d42] flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    {isUploading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
                    ) : (
                      <Upload className="w-7 h-7" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">
                      {isUploading
                        ? '⚡ AI đang quét tài liệu, bóc tách câu hỏi & phân loại đáp án...'
                        : 'Nhấp để chọn file PDF hoặc Word (.docx) từ máy tính'}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Hỗ trợ file PDF chuẩn chữ, Word (.docx) có bôi màu/chữ đỏ hoặc có bảng đáp án ở cuối (Tối đa 50MB)
                    </p>
                  </div>
                </div>

                {/* Hướng dẫn nhận dạng AI */}
                <div className="p-4 rounded-2xl bg-[#121c2b] border border-[#1e2d42] space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Cơ chế AI tự nhận dạng đáp án đúng thông minh:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-400">
                    <li><strong>Bảng đáp án cuối file:</strong> Tự động nhận diện mục <em>"BẢNG ĐÁP ÁN: 1.A, 2.B, 3.C..."</em> hoặc <em>"1A 2B 3C"</em> và ghép vào từng câu hỏi.</li>
                    <li><strong>Màu sắc & Highlight:</strong> Nhận diện chữ màu đỏ, bôi vàng hoặc thẻ <em>[CORRECT]</em> trong file Word.</li>
                    <li><strong>Ký hiệu đánh dấu:</strong> Tự nhận diện phương án có dấu sao <em>*A. ...</em>, <em>[x] B. ...</em> hoặc <em>(đáp án đúng)</em>.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: DÁN TEXT TRỰC TIẾP */}
            {inputTab === 'text' && (
              <div className="space-y-4 p-5 rounded-3xl bg-[#0e1726] border border-[#1e2d42]">
                <div className="space-y-1">
                  <label className="text-xs font-black text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    Dán văn bản đề thi (Câu hỏi + 4 đáp án A/B/C/D + Đáp án nếu có):
                  </label>
                  <textarea
                    rows={12}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={`Câu 1: What is the primary purpose of the meeting?\nA. To discuss the budget\nB. To introduce a new member\nC. To launch a product\nD. To sign a contract\nĐáp án: A\nGiải thích: Trong bài nói rõ purpose là discuss budget.\n\nCâu 2: ...`}
                    className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl p-4 text-xs text-white outline-none font-mono resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleParseText}
                  disabled={isUploading || !rawText.trim()}
                  className="w-full py-3 bg-[#00c950] hover:bg-[#00b046] disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang nhận diện câu hỏi...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>AI Quét & Bóc Tách Đề Thi Ngay</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 2: XEM TRƯỚC, TINH CHỈNH ĐÁP ÁN ĐÚNG & LƯU LÊN WEBSITE                */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* THÔNG TIN CHUNG CỦA ĐỀ THI */}
            <div className="p-5 rounded-3xl bg-[#0e1726] border border-[#1e2d42] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Thông Tin Đề Thi Đã Nhận Dạng:
                </span>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                    {questions.length} câu hỏi
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-black">
                    {detectedAnswersCount} đáp án đã nhận diện
                  </span>
                </div>
              </div>

              {/* Tên đề thi */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Tiêu đề đề thi:</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="Nhập tên đề thi..."
                  className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm font-bold text-white outline-none"
                />
              </div>

              {/* Loại đề, trình độ & thời gian thi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Phân loại kỳ thi:</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full bg-[#121c2b] border border-[#1e2d42] text-xs font-bold text-white rounded-xl p-2.5 outline-none cursor-pointer"
                  >
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="VSTEP">VSTEP</option>
                    <option value="THPTQG">THPT Quốc Gia</option>
                    <option value="Oxford 3000">Oxford 3000</option>
                    <option value="Giao Tiếp">Tiếng Anh Giao Tiếp</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Trình độ tương đương:</label>
                  <select
                    value={examLevel}
                    onChange={(e) => setExamLevel(e.target.value)}
                    className="w-full bg-[#121c2b] border border-[#1e2d42] text-xs font-bold text-white rounded-xl p-2.5 outline-none cursor-pointer"
                  >
                    <option value="A1">A1 - Căn bản</option>
                    <option value="A2">A2 - Sơ cấp</option>
                    <option value="B1">B1 - Trung cấp</option>
                    <option value="B2">B2 - Trung cấp cao</option>
                    <option value="C1">C1 - Nâng cao</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Thời lượng thi thử (Phút):</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value) || 30)}
                    className="w-full bg-[#121c2b] border border-[#1e2d42] text-xs font-bold text-white rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* DANH SÁCH CÂU HỎI ĐÃ BÓC TÁCH (CÓ THỂ XEM VÀ TINH CHỈNH ĐÁP ÁN ĐÚNG) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Xem trước và chọn đáp án đúng cho từng câu:
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  💡 Nhấp vào đáp án A / B / C / D để đặt làm đáp án đúng
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-3 relative group hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-emerald-400">Câu {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-black text-white leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* 4 Lựa chọn A/B/C/D với nút chọn đáp án đúng */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleUpdateCorrectAnswer(idx, optIdx)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isCorrect
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-black shadow-sm ring-1 ring-emerald-500/40'
                                : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <span className="truncate mr-2">
                              <strong className="text-emerald-400 mr-1.5">{String.fromCharCode(65 + optIdx)}.</strong>
                              {opt}
                            </span>
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Hộp giải thích */}
                    <input
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => handleUpdateExplanation(idx, e.target.value)}
                      placeholder="Giải thích chi tiết (nếu có)..."
                      className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-2 text-[11px] text-slate-300 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-[#1e2d42] bg-[#121c2b] flex items-center justify-between shrink-0">
          {step === 1 ? (
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#1e2d42] hover:bg-[#1a293d] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-[#1e2d42] hover:bg-[#1a293d] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                ← Tải file khác
              </button>

              <button
                type="button"
                disabled={isSaving || questions.length === 0}
                onClick={handleSaveExam}
                className="px-6 py-2.5 rounded-xl bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white text-xs font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu trữ lên website...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Lưu Trực Tiếp & Vào Thi Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
