'use client';

import Link from 'next/link';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLanguageStore } from '@/stores/useLanguageStore';

export function Footer() {
  return <MickyFooter />;
}

export default function MickyFooter() {
  const { theme } = useThemeStore();
  const { targetLanguage } = useLanguageStore();
  const isLight = theme === 'light';
  const isChinese = targetLanguage === 'zh';

  return (
    <footer className={`border-t-2 mt-16 py-10 pb-24 md:pb-10 transition-colors ${
      isLight ? 'bg-[#fffdf9] border-stone-800 text-stone-800' : 'bg-[#181513] border-stone-700 text-stone-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-stone-800 flex items-center justify-center text-lg shadow-[1.5px_1.5px_0px_#292524] shrink-0">
                🐼
              </div>
              <span className="font-cartoon text-lg font-bold text-stone-900 dark:text-white">
                Micky <span className={isChinese ? 'text-[#c53428]' : 'text-amber-500'}>{isChinese ? 'Chinese' : 'English'}</span>
              </span>
            </Link>
            <p className="font-hand text-sm text-center md:text-left max-w-sm text-stone-600 dark:text-stone-400">
              {isChinese
                ? 'Sổ tay học tiếng Trung HSK 3.0 & HSKK phản xạ tự nhiên – Vở tập viết chữ Hán, phát âm Pinyin & luyện thi mỗi ngày.'
                : 'Sổ tay tự học tiếng Anh đa kỹ năng dành cho người Việt – Luyện Nghe, Nói, Nhại giọng & Ôn thi TOEIC, IELTS mỗi ngày.'}
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center gap-5 text-xs font-cartoon font-bold">
            <Link href="/roadmap" className="hover:text-[#c53428] transition-colors">Lộ trình học</Link>
            <Link href="/dictation-shadowing" className="hover:text-[#c53428] transition-colors">Luyện nghe nhại</Link>
            <Link href="/vocabulary" className="hover:text-[#c53428] transition-colors">Kho từ vựng</Link>
            <Link href="/practice" className="hover:text-[#c53428] transition-colors">Trung tâm luyện tập</Link>
            <Link href="/tro-choi" className="hover:text-[#c53428] transition-colors">Đấu trường trò chơi</Link>
            <Link href="/kho-de" className="hover:text-[#c53428] transition-colors">Kho đề thi</Link>
            <Link href="/privacy" className="hover:text-[#c53428] transition-colors">Bảo mật</Link>
            <Link href="/terms" className="hover:text-[#c53428] transition-colors">Điều khoản</Link>
          </div>
        </div>

        <div className="border-t border-stone-300 dark:border-stone-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-hand text-stone-500 dark:text-stone-400 gap-3">
          <p>© 2026 Micky Language. Học vui vẻ • Tự nhiên • Không áp lực.</p>
          <p className="font-cartoon font-bold text-[#c53428] dark:text-amber-300">
            Phong cách Sổ Tay Hoạt Hình (Warm Notebook Study System)
          </p>
        </div>
      </div>
    </footer>
  );
}
