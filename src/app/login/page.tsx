import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Đăng nhập - Micky English',
  description: 'Đăng nhập tài khoản Micky English để tiếp tục học tập.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#0b0f17]">
      <Suspense fallback={<div className="text-white text-xs">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
