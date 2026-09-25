import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'MickyEnglish - Học Tiếng Anh Mỗi Ngày',
  description: 'Học từ vựng thông minh, luyện viết phản xạ (See & Write), luyện nghe nói nhại giọng (Dictation & Shadowing) và thi thử TOEIC, IELTS, VSTEP trên MickyEnglish.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300..1000;1,300..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
