'use client';

import Link from 'next/link';
import MickyMascot from '@/components/common/MickyMascot';
import { useThemeStore } from '@/stores/useThemeStore';

export function Footer() {
  return <MickyFooter />;
}

export default function MickyFooter() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <footer className={`border-t mt-16 py-10 pb-24 md:pb-10 transition-colors ${
      isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#0b0f17] border-[#1e2d42] text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <MickyMascot size={32} />
              <span className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Micky<span className="text-emerald-500">English</span>
              </span>
            </Link>
            <p className={`text-xs text-center md:text-left max-w-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Nền tảng tự học tiếng Anh đa kỹ năng dành cho người Việt – Luyện Nghe, Nói, Đọc, Viết & Ôn thi TOEIC, IELTS, VSTEP mỗi ngày.
            </p>
          </div>

          {/* Navigation links */}
          <div className={`flex flex-wrap justify-center gap-6 text-xs font-bold ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <Link href="/dictation-shadowing" className="hover:text-emerald-500 transition-colors">Luyện nghe</Link>
            <Link href="/tuvung" className="hover:text-emerald-500 transition-colors">Từ vựng</Link>
            <Link href="/ky-nang" className="hover:text-emerald-500 transition-colors">Kỹ năng</Link>
            <Link href="/kho-de" className="hover:text-emerald-500 transition-colors">Kho đề thi</Link>
            <Link href="/tinh-nang" className="hover:text-emerald-500 transition-colors">Tính năng</Link>
            <Link href="/huong-dan" className="hover:text-emerald-500 transition-colors">Hướng dẫn</Link>
            <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Bảo mật</Link>
            <Link href="/terms" className="hover:text-emerald-500 transition-colors">Điều khoản</Link>
          </div>
        </div>

        <div className={`border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-[#1e2d42] text-slate-500'
        }`}>
          <p>© 2026 MickyEnglish. Tất cả quyền được bảo lưu.</p>
          <p className="text-emerald-500 font-semibold">Tối ưu trải nghiệm Sáng & Tối (Light & Dark Mode)</p>
        </div>
      </div>
    </footer>
  );
}
