'use client';

import Link from 'next/link';
import { BarChart2, Clock, ArrowRight, Sparkles, Award, Headphones, Volume2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { oxford3000Exams } from '@/data/exams';

export default function ExamBankPage() {
  const { isAuthenticated } = useAuthStore();

  const mainExam = oxford3000Exams[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Award className="w-8 h-8 text-emerald-400" />
            Kho Đề Thi & Luyện Đề Chuẩn Hóa
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Bộ đề thi trọn vẹn 3544 từ vựng Oxford (quét từ trang 1 đến 296 có audio & hình ảnh) kèm đáp án và giải thích tiếng Việt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/them-de-thi"
            className="btn-micky-primary text-xs font-bold py-3 px-5 rounded-2xl flex items-center gap-1.5 shrink-0 shadow-lg"
          >
            <BarChart2 className="w-4 h-4" /> + Tạo & Quét Đề Mới (Admin)
          </Link>
        </div>
      </div>

      {/* SECTION ĐẶC BIỆT: BỘ ĐỀ THI 3544 TỪ OXFORD DUY NHẤT */}
      {mainExam && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <Headphones className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-white">Đề Thi Trắc Nghiệm 3000 Từ Vựng Oxford Toàn Diện</h2>
              <span className="badge-micky-green text-[10px]">1 Đề duy nhất</span>
            </div>

            <span className="text-xs text-slate-400 font-semibold hidden sm:inline-block">
              Trọn vẹn 3544 câu hỏi chuẩn khung Oxford
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Link
              href={`/kho-de/${mainExam.id}`}
              className="group bg-gradient-to-r from-[#132338] via-[#121c2b] to-[#14263c] border-2 border-emerald-500/70 hover:border-emerald-400 rounded-3xl p-8 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl hover:scale-[1.01] ring-4 ring-emerald-500/10"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-micky-green text-xs font-black py-1 px-3">
                    🔥 ĐẦY ĐỦ 3544 TỪ (TRANG 1 - 296)
                  </span>
                  <span className="text-xs text-amber-400 font-bold bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 180 phút (Tự do tùy chỉnh)
                  </span>
                  <span className="text-xs text-blue-400 font-bold bg-blue-950/40 border border-blue-800/40 px-3 py-1 rounded-full flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> Tích hợp Audio MP3 & Ảnh minh họa
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {mainExam.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Bao gồm đầy đủ 3.544 câu hỏi trắc nghiệm 4 lựa chọn (A/B/C/D), hỗ trợ 2 chế độ: <strong>Ôn luyện (hiện đúng/sai tức thì)</strong> và <strong>Thi thử chuẩn hóa (nộp bài mới chấm)</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> 3544 câu hỏi
                  </span>
                  <span className="flex items-center gap-1">
                    🎧 Audio giọng đọc bản xứ
                  </span>
                  <span className="flex items-center gap-1">
                    💡 Giải thích tiếng Việt chi tiết
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                <span className="btn-micky-primary py-3.5 px-8 text-sm font-black flex items-center gap-2 shadow-xl group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" /> Bắt Đầu Làm Bài Ngay <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
