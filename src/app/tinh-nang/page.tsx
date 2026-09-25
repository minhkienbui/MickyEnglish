import Link from 'next/link';
import { Headphones, BookCheck, Award, BookOpen, Mic, Brain, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Tính năng nổi bật - Micky English',
  description: 'Khám phá toàn bộ tính năng học tiếng Anh trên Micky English: Dictation, Shadowing, Flashcard Spaced Repetition và Kho đề thi.',
};

export default function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Chi tiết tính năng Micky English</h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Tất cả công cụ tự học tiếng Anh được thiết kế tối ưu hóa cho người Việt Nam tự luyện Nghe, Nói, Đọc, Viết.
        </p>
      </div>

      <div className="space-y-8">
        {/* Module 1 */}
        <div className="card-bibung bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-2xl shrink-0">
            <Headphones className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-[#17261c]">1. Module Luyện nghe Dictation & Shadowing</h3>
            <p className="text-xs sm:text-sm text-[#5b6a60] leading-relaxed">
              Trình phát audio thông minh tua lại 5s, tùy chỉnh tốc độ (0.75x, 1x, 1.25x) và lặp lại từng câu. Thuật toán so sánh từng từ hiển thị màu phân biệt (Từ đúng xanh, từ sai chính tả đỏ, từ thiếu vàng, từ thừa xám) cùng tính năng ghi âm Shadowing giọng đọc.
            </p>
          </div>
        </div>

        {/* Module 2 */}
        <div className="card-bibung bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shrink-0">
            <BookCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-[#17261c]">2. Module Từ vựng thông minh Spaced Repetition</h3>
            <p className="text-xs sm:text-sm text-[#5b6a60] leading-relaxed">
              Thẻ học Flashcard 3D sinh động kèm phiên âm IPA, phát âm bản ngữ và câu ví dụ song ngữ. Áp dụng thuật toán Lặp lại ngắt quãng (Leitner) ưu tiên hiển thị "Từ cần ôn hôm nay" để đưa từ vựng vào trí nhớ dài hạn.
            </p>
          </div>
        </div>

        {/* Module 3 */}
        <div className="card-bibung bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-2xl shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-[#17261c]">3. Module Luyện Kỹ năng chuyên sâu</h3>
            <p className="text-xs sm:text-sm text-[#5b6a60] leading-relaxed">
              Rèn luyện bài tập Đọc hiểu đoạn văn, bài tập Luyện viết đoạn ngắn kèm bài mẫu gợi ý & checklist tự đánh giá, chuẩn hóa cặp âm dễ nhầm lẫn và các trò chơi tương tác như nối từ, sắp xếp câu.
            </p>
          </div>
        </div>

        {/* Module 4 */}
        <div className="card-bibung bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-2xl shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-[#17261c]">4. Module Kho Đề thi TOEIC, IELTS, VSTEP</h3>
            <p className="text-xs sm:text-sm text-[#5b6a60] leading-relaxed">
              Luyện thi thử như thi thật với giao diện đồng hồ đếm ngược, tự động chấm điểm tức thì và xem lại đáp án chi tiết tiếng Việt giải thích từng câu làm sai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
