import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Đăng nhập / Đăng ký - Micky English',
  description: 'Tham gia học tiếng Anh trực tuyến miễn phí cùng Micky English.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#0b0f17]">
      <Suspense fallback={<div className="text-white text-xs">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
