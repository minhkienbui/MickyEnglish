'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  Clock,
  Award,
  Layers,
  ArrowRight,
  BookOpen,
  Plus,
  Trash2,
} from 'lucide-react';
import { useExamStore } from '@/stores/useExamStore';
import { ExamPaper, ExamQuestion } from '@/lib/types';
import { ParsedExamResult, ParsedQuestion } from '@/lib/aiExamParser';

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated?: (newExam: ExamPaper) => void;
}

export default function AddExamModal({ isOpen, onClose, onExamCreated }: AddExamModalProps) {
  const { addCustomExam } = useExamStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Wizard Step: 1 = Chọn & Tải File, 2 = Xem Trước & Chỉnh Sửa Câu Hỏi
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form State
  const [examTitle, setExamTitle] = useState('');
  const [examType, setExamType] = useState<string>('TOEIC');
  const [examLevel, setExamLevel] = useState<string>('B1');
  const [examDuration, setExamDuration] = useState<number>(30);
  const [examDescription, setExamDescription] = useState('');

  // Parsed Questions
  const [editableQuestions, setEditableQuestions] = useState<
    {
      id: string;
      order: number;
      questionText: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      hasDetectedAnswer?: boolean;
    }[]
  >([]);

  const [colorDetectionCount, setColorDetectionCount] = useState<number>(0);

  if (!isOpen) return null;

  // [BƯỚC 1: XỬ LÝ CHỌN FILE VÀ QUÉT TỰ ĐỘNG BẰNG AI]
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext || '')) {
      setErrorMessage('Định dạng file không được hỗ trợ. Vui lòng chọn file .pdf, .docx, .doc hoặc .txt');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('Kích thước file quá lớn. Vui lòng tải file dưới 50MB.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // 1. Lưu trữ trực tiếp file gốc lên website (/api/upload/exam)
      setProcessStatus('Đang lưu trữ file trực tiếp trên website...');
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await fetch('/api/upload/exam', {
        method: 'POST',
        body: uploadFormData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.fileUrl) {
        setUploadedFileUrl(uploadData.fileUrl);
      }

      // 2. AI Quét và nhận dạng đề thi (/api/ai/scan-file)
      setProcessStatus('AI đang quét và bóc tách câu hỏi, nhận diện đáp án sẵn...');
      const scanFormData = new FormData();
      scanFormData.append('file', file);
      scanFormData.append('type', examType);

      const scanRes = await fetch('/api/ai/scan-file', {
        method: 'POST',
        body: scanFormData,
      });
      const scanData = await scanRes.json();

      if (!scanRes.ok || !scanData.success) {
        throw new Error(scanData.error || 'Quét tài liệu không thành công.');
      }

      const parsed: ParsedExamResult = scanData.exam;

      // Thiết lập thông tin đề thi
      setExamTitle(parsed.title || file.name.replace(/\.[^/.]+$/, ''));
      if (parsed.type) setExamType(parsed.type);
      if (parsed.duration) setExamDuration(parsed.duration || 30);
      setExamDescription(parsed.description || `Đề thi được quét tự động từ tài liệu ${file.name}`);
      setColorDetectionCount(scanData.coloredAnswersCount || 0);

      // Thu thập toàn bộ câu hỏi từ các section
      const allQs: any[] = [];
      let counter = 1;
      (parsed.sections || []).forEach((sec) => {
        (sec.questions || []).forEach((q) => {
          allQs.push({
            id: `q-${counter}`,
            order: counter++,
            questionText: q.questionText,
            options: q.options && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
            correctAnswer: q.correctAnswer ?? 0,
            explanation: q.explanation || 'Đáp án tự động phân loại từ tài liệu.',
            hasDetectedAnswer: q.hasDetectedAnswer || q.hasColoredAnswer || false,
          });
        });
      });

      if (allQs.length === 0) {
        throw new Error('Không tìm thấy câu hỏi trắc nghiệm nào trong tài liệu. Vui lòng kiểm tra lại định dạng file.');
      }

      setEditableQuestions(allQs);
      setWizardStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi xử lý file tài liệu đề thi.');
    } finally {
      setIsProcessing(false);
      setProcessStatus('');
    }
  };

  // Cập nhật câu hỏi trong Bước 2
  const handleUpdateQuestion = (idx: number, field: string, val: any) => {
    const updated = [...editableQuestions];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditableQuestions(updated);
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    const updated = [...editableQuestions];
    const newOpts = [...updated[qIdx].options];
    newOpts[optIdx] = val;
    updated[qIdx].options = newOpts;
    setEditableQuestions(updated);
  };

  const handleDeleteQuestion = (idx: number) => {
    setEditableQuestions(editableQuestions.filter((_, i) => i !== idx));
  };

  // [BƯỚC 3: LƯU VÀO KHO ĐỀ THI]
  const handleSaveExam = async () => {
    if (editableQuestions.length === 0) {
      alert('Đề thi cần có ít nhất 1 câu hỏi.');
      return;
    }

    const finalQuestions: ExamQuestion[] = editableQuestions.map((q, idx) => ({
      id: `custom-q-${idx + 1}-${Date.now()}`,
      questionNumber: idx + 1,
      order: idx + 1,
      part: 'Trắc nghiệm tổng hợp',
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    const newExamId = `custom-exam-${Date.now()}`;
    const newExam: ExamPaper = {
      id: newExamId,
      title: examTitle || (selectedFile?.name ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'Đề thi mới'),
      type: examType,
      level: examLevel,
      description: examDescription || `Đề thi ${examType} gồm ${finalQuestions.length} câu hỏi.`,
      durationMinutes: Number(examDuration) || 30,
      duration: Number(examDuration) || 30,
      totalQuestions: finalQuestions.length,
      questions: finalQuestions,
      attempts: 1,
      fileUrl: uploadedFileUrl || undefined,
      fileName: selectedFile?.name || undefined,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    // 1. Thêm vào Zustand Store (tự động lưu vào localStorage qua persist)
    addCustomExam(newExam);

    // 2. Gửi lưu vào Database (/api/exams)
    try {
      fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newExam.title,
          type: newExam.type,
          description: newExam.description,
          duration: newExam.durationMinutes,
          sections: [
            {
              name: 'Phần 1: Trắc nghiệm',
              order: 1,
              questions: finalQuestions.map((q) => ({
                order: q.questionNumber,
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
              })),
            },
          ],
        }),
      }).catch(() => {});
    } catch {}

    if (onExamCreated) {
      onExamCreated(newExam);
    }

    onClose();
    alert(`🎉 Đã tạo đề thi "${newExam.title}" thành công với ${finalQuestions.length} câu hỏi! Bạn có thể vào thi ngay.`);
  };

  const detectedCount = editableQuestions.filter((q) => q.hasDetectedAnswer).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER MODAL */}
        <div className="p-5 border-b border-[#1e2d42] flex items-center justify-between bg-[#121c2b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                {wizardStep === 1 ? 'Thêm Đề Thi Từ PDF / Word' : 'Xem Trước & Kiểm Duyệt Đề Thi'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {wizardStep === 1
                  ? 'AI tự động phân tách câu hỏi, nhận diện đáp án sẵn từ chữ màu, gạch chân hoặc bảng đáp án'
                  : `Đã bóc tách ${editableQuestions.length} câu hỏi (${detectedCount} câu tự nhận diện đáp án)`}
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

        {/* THÔNG BÁO LỖI */}
        {errorMessage && (
          <div className="bg-rose-950/90 border-b border-rose-500 px-4 py-2 text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 1: TẢI FILE PDF / WORD VÀ CHỌN THÔNG TIN ĐỀ                          */}
        {/* ========================================================================= */}
        {wizardStep === 1 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* THÔNG TIN CƠ BẢN VỀ ĐỀ THI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#0e1726] border border-[#1e2d42]">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Kỳ thi / Chứng chỉ:</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white font-bold outline-none"
                >
                  <option value="TOEIC">TOEIC</option>
                  <option value="IELTS">IELTS</option>
                  <option value="VSTEP">VSTEP</option>
                  <option value="THPTQG">THPT Quốc Gia</option>
                  <option value="Oxford 3000">Oxford 3000</option>
                  <option value="Khác">Tổng hợp / Khác</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Cấp độ khuyến nghị:</label>
                <select
                  value={examLevel}
                  onChange={(e) => setExamLevel(e.target.value)}
                  className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white font-bold outline-none"
                >
                  <option value="A1">A1 - Căn bản (Starter)</option>
                  <option value="A2">A2 - Sơ cấp (Elementary)</option>
                  <option value="B1">B1 - Trung cấp (Intermediate)</option>
                  <option value="B2">B2 - Nâng cao (Upper-Inter)</option>
                  <option value="C1">C1 - Thành thạo (Advanced)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Thời gian làm bài (Phút):</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={examDuration}
                  onChange={(e) => setExamDuration(Number(e.target.value) || 30)}
                  className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white font-bold outline-none"
                />
              </div>
            </div>

            {/* VÙNG KÉO THẢ TẢI LÊN FILE */}
            <div className="space-y-3">
              <label className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                <span className="text-emerald-400 font-extrabold">2</span> Chọn File Đề Thi (PDF hoặc Word .docx):
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />

              <div
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isProcessing
                    ? 'border-emerald-500 bg-emerald-950/20 pointer-events-none'
                    : 'border-[#1e2d42] hover:border-emerald-500 bg-[#0e1726] hover:bg-[#121c2b] group'
                }`}
              >
                <div className="w-16 h-16 rounded-3xl bg-[#121c2b] border border-[#1e2d42] flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-lg">
                  {isProcessing ? (
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-black text-white">
                    {isProcessing ? processStatus : 'Bấm để chọn file PDF hoặc Word (.docx) từ máy tính'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isProcessing
                      ? 'Hệ thống đang xử lý tự động...'
                      : 'Hỗ trợ: PDF (.pdf), Microsoft Word (.docx, .doc) và Văn bản (.txt) tối đa 50MB'}
                  </p>
                </div>

                {isProcessing && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold animate-pulse mt-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI đang phân loại câu hỏi & tìm đáp án sẵn...</span>
                  </div>
                )}
              </div>
            </div>

            {/* HỘP HƯỚNG DẪN ĐỊNH DẠNG ĐÁP ÁN ĐƯỢC AI HỖ TRỢ */}
            <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-black text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>AI hỗ trợ tự nhận diện đáp án sẵn qua các cách sau:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                <li><strong>Gạch chân hoặc bôi màu</strong> phương án đúng trong file Word (chữ đỏ, chữ xanh, highlight).</li>
                <li>Có dấu <strong>*</strong> hoặc <strong>[x]</strong> hoặc <strong>(đáp án đúng)</strong> ở lựa chọn đúng.</li>
                <li>Có <strong>Bảng đáp án ở cuối đề thi</strong> (ví dụ: <em>"BẢNG ĐÁP ÁN: 1.A 2.B 3.C 4.D..."</em>).</li>
                <li>Có dòng ghi chú <strong>"Đáp án: B - Giải thích: ..."</strong> ngay dưới câu hỏi.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 2: XEM TRƯỚC, CHỈNH SỬA CÂU HỎI & CHỌN ĐÁP ÁN ĐÚNG TRỰC TIẾP         */}
        {/* ========================================================================= */}
        {wizardStep === 2 && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Thanh tiêu đề đề thi & tổng quan số câu */}
            <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <label className="text-[11px] font-bold text-slate-400">Tiêu đề đề thi:</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-black text-white outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/40">
                    {editableQuestions.length} câu hỏi
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-black border border-blue-500/40">
                    {detectedCount}/{editableQuestions.length} câu có đáp án
                  </span>
                </div>
              </div>

              {uploadedFileUrl && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã lưu trữ file tài liệu trực tiếp: <code className="bg-black/40 px-1 py-0.5 rounded">{uploadedFileUrl}</code>
                </p>
              )}
            </div>

            {/* DANH SÁCH CÂU HỎI BÓC TÁCH */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Chi tiết từng câu hỏi (Nhấp vào ô tròn A/B/C/D để chọn đáp án đúng):
                </h4>
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {editableQuestions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-3 relative group hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[11px]">
                          Câu {qIdx + 1}
                        </span>
                        {q.hasDetectedAnswer && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                            ✓ Tự nhận diện đáp án
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(qIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Nội dung câu hỏi */}
                    <textarea
                      rows={2}
                      value={q.questionText}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'questionText', e.target.value)}
                      placeholder="Nội dung câu hỏi..."
                      className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white font-bold outline-none resize-none"
                    />

                    {/* 4 Lựa chọn A / B / C / D */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleUpdateQuestion(qIdx, 'correctAnswer', optIdx)}
                            className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                              isCorrect
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                                : 'bg-[#121c2b] border-[#1e2d42] text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${
                                isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                              className="w-full bg-transparent border-none outline-none text-xs font-semibold"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Giải thích chi tiết */}
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                      placeholder="Giải thích chi tiết (tùy chọn)..."
                      className="w-full bg-[#121c2b]/60 border border-[#1e2d42] rounded-xl px-3 py-1.5 text-[11px] text-slate-400 outline-none"
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
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="px-4 py-2 rounded-xl border border-[#1e2d42] hover:bg-[#1a293d] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                ← Chọn file khác
              </button>

              <button
                type="button"
                onClick={handleSaveExam}
                className="px-6 py-2.5 rounded-xl bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white text-xs font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Lưu Vào Kho Đề Thi Ngay</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
