# Bibung English - Spec Thiết kế Hệ thống Web Học Tiếng Anh Trực Tuyến

## 1. Tổng quan Dự án
- **Tên ứng dụng**: Bibung English
- **Ngôn ngữ giao diện**: Tiếng Việt 100%
- **Đối tượng người dùng**: Người Việt tự học nghe, nói, đọc, viết; luyện thi TOEIC, IELTS, VSTEP và tiếng Anh giao tiếp.
- **Phong cách giao diện**: 99% tương đồng với Bibung.com – Tối giản, gọn gàng, màu xanh lá chủ đạo (`#16a34a`), font chữ Nunito, thiết kế mobile-first mượt mà.
- **Tech Stack**: Next.js 16 (App Router), React 19, TailwindCSS v4, Zustand, Lucide React Icons, Prisma (SQLite/PostgreSQL), NextAuth / Custom Auth API.

---

## 2. Cấu trúc Trang & Tuyến đường (Routing Architecture)
1. `/` - Trang chủ: Hero giới thiệu tổng quan, 3 khối tính năng nổi bật, nút CTA "Bắt đầu học miễn phí".
2. `/features` - Trang Tính năng chi tiết.
3. `/guides` - Trang Hướng dẫn học hiệu quả.
4. `/dictation-shadowing` - Trang Luyện nghe, Chép chính tả (Dictation) & Nói theo (Shadowing).
5. `/dictation-shadowing/[id]` - Trình phát audio thông minh, bài tập chép chính tả, so sánh từ đúng/sai/thiếu/thừa và ghi âm Shadowing.
6. `/tuvung` - Quản lý bộ từ vựng cá nhân & chủ đề (TOEIC, IELTS, Giao tiếp).
7. `/tuvung/on-tap` - Chế độ học Flashcard & Thuật toán Spaced Repetition (Từ cần ôn hôm nay).
8. `/ky-nang` - Trang Luyện kỹ năng: Đọc hiểu, Viết, Phát âm cơ bản, Bài tập tương tác (điền từ, sắp xếp câu, nối từ).
9. `/kho-de` - Ngân hàng đề thi TOEIC, IELTS, VSTEP.
10. `/kho-de/[id]` - Giao diện làm bài thi đếm thời gian thực & Xem lại đáp án chi tiết sau nộp bài.
11. `/tai-khoan` - Trang cá nhân: Tiến độ học tập, số từ đã thuộc, chuỗi Streak, biểu đồ tiến bộ, lịch sử bài làm.
12. `/dang-nhap` / `/dang-ky` - Đăng nhập / Đăng ký tài khoản.
13. `/about`, `/contact`, `/privacy`, `/terms` - Các trang thông tin pháp lý và liên hệ.

---

## 3. Thiết kế Chi tiết các Module

### 3.1. Module Người dùng & Tiến độ Học tập
- **Xác thực**: Hỗ trợ Đăng nhập bằng Email/Mật khẩu & Google Auth (hoặc Demo Session).
- **Trang cá nhân (`/tai-khoan`)**:
  - Chuỗi ngày học liên tục (Streak Counter).
  - Thống kê: Số từ vựng đã nhớ, số phút luyện nghe, số đề thi đã làm.
  - Biểu đồ tiến độ học tập.
  - Lưu lịch sử làm bài thi & bài chép chính tả để xem lại bất cứ lúc nào.

### 3.2. Module Từ vựng thông minh (Spaced Repetition & Flashcard)
- **Cấu trúc dữ liệu từ vựng**: Từ tiếng Anh, phiên âm IPA, nghĩa tiếng Việt, câu ví dụ, audio phát âm, ghi chú cá nhân, cấp độ nhớ (0-5), ngày ôn tiếp theo (`nextReviewDate`).
- **Giao diện Flashcard**:
  - Lật mặt trước (từ + IPA + audio) / mặt sau (nghĩa + câu ví dụ).
  - 3 nút đánh giá sau khi lật: "Cần ôn lại" (Gần), "Tạm nhớ" (Vừa), "Đã thuộc" (Xa).
- **Thuật toán Spaced Repetition (Leitner/SM-2)**:
  - Tự động lọc danh sách "Từ cần ôn hôm nay" dựa trên `nextReviewDate <= today`.

### 3.3. Module Luyện nghe Dictation & Shadowing
- **Bộ bài nghe**: Phân loại theo chủ đề (Daily, Business, Academic) và cấp độ (A1-C1).
- **Audio Player**: Tua lại 5s, chỉnh tốc độ (0.75x, 1x, 1.25x), phát lặp từng câu.
- **Dictation Engine**:
  - Ô gõ văn bản để người dùng nhập từ nghe được.
  - Thuật toán so sánh từng từ (Diff algorithm): 
    - 🟢 Đúng (Green)
    - 🔴 Sai chính tả (Red)
    - 🟡 Thiếu từ (Yellow)
    - ⚪ Thừa từ (Gray)
  - Phân loại lỗi hay gặp: Nghe nhầm âm cuối (s/es/ed), sai từ nối, sai chính tả.
- **Shadowing Mode**:
  - Hiển thị transcript đồng bộ audio.
  - Tích hợp công cụ ghi âm trực tiếp trên browser (MediaRecorder API) để người dùng tự nghe lại giọng đọc của mình.

### 3.4. Module Luyện Kỹ năng (Skills Practice)
- **Đọc hiểu**: Đoạn văn tiếng Anh + Trắc nghiệm + Giải thích đáp án.
- **Luyện viết**: Đề bài viết + Bài mẫu tham khảo + Checklist tự đánh giá.
- **Phát âm cơ bản**: Phân biệt cặp âm dễ nhầm qua audio & trắc nghiệm.
- **Widget câu hỏi tương tác**:
  - Điền từ vào ô trống (Fill in the blanks)
  - Sắp xếp từ thành câu hoàn chỉnh (Sentence ordering)
  - Nối từ tiếng Anh với nghĩa tiếng Việt (Word matching)

### 3.5. Module Kho Đề thi (Exam Bank)
- **Cấu trúc đề**: TOEIC Full/Part, IELTS Academic/General, VSTEP Reading/Listening.
- **Giao diện Thi**: Đồng hồ đếm ngược, danh sách câu hỏi thanh bên (Nav grid), tự động lưu câu đã chọn.
- **Kết quả & Giải thích**: Chấm điểm tức thì, xem lại toàn bộ câu hỏi kèm đáp án đúng & giải thích chi tiết, khuyến nghị phần kiến thức cần củng cố.

---

## 4. Thiết kế Giao diện UI/UX (Bibung Theme)
- Color Tokens:
  - Primary: `#16a34a` (Green-600)
  - Primary Hover: `#15803d` (Green-700)
  - Primary Light: `#f0fdf4` (Green-50)
  - Surface Card: `#ffffff`
  - Border: `#dfe7e1` / `#e2eef0`
  - Text Primary: `#17261c`
  - Text Muted: `#5b6a60`
- Mobile Responsive:
  - Header thu gọn thành Hamburger menu / Bottom Navigation bar tiện thao tác bằng 1 tay trên smartphone.
