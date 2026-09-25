export const metadata = {
  title: 'Hướng dẫn học hiệu quả - Micky English',
  description: 'Bí quyết và lộ trình tự học tiếng Anh nghe nói đọc viết cùng Micky English.',
};

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-[#17261c]">Hướng dẫn tự học tiếng Anh hiệu quả</h1>
        <p className="text-xs sm:text-sm text-[#5b6a60]">
          Áp dụng phương pháp Dictation, Shadowing và Spaced Repetition đúng cách mỗi ngày.
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#17261c] leading-relaxed">
        <article className="card-bibung bg-white p-6 space-y-3">
          <h2 className="text-lg font-bold text-green-700">1. Cách luyện nghe Chép chính tả (Dictation) đúng chuẩn</h2>
          <p className="text-xs text-[#5b6a60]">
            Bước 1: Nghe qua toàn bộ câu một lần để hiểu ý chính.<br />
            Bước 2: Nghe lại câu và gõ chính xác những từ nghe được vào ô nhập liệu.<br />
            Bước 3: Nhấn "Kiểm tra đáp án" để đối chiếu từ đúng (xanh), từ sai (đỏ) hoặc thiếu (vàng).<br />
            Bước 4: Ghi chú lại các từ bạn thường nghe nhầm âm cuối (/s/, /ed/) để cải thiện.
          </p>
        </article>

        <article className="card-bibung bg-white p-6 space-y-3">
          <h2 className="text-lg font-bold text-green-700">2. Phương pháp lật thẻ từ vựng Spaced Repetition</h2>
          <p className="text-xs text-[#5b6a60]">
            Hãy duy trì thói quen học mỗi ngày 10-15 phút tại trang <strong>"Từ cần ôn hôm nay"</strong>. Với các từ bạn nhấn "Cần ôn lại", hệ thống sẽ nhắc lại ngay lập tức. Với những từ "Đã thuộc", khoảng cách ôn sẽ tự động nới rộng ra 7 đến 30 ngày.
          </p>
        </article>
      </div>
    </div>
  );
}
