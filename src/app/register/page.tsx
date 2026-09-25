import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Tạo tài khoản mới - Micky English',
  description: 'Đăng ký tài khoản học tiếng Anh, từ vựng, dictation và shadowing miễn phí cùng Micky English.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#0b0f17]">
      <Suspense fallback={<div className="text-white text-xs">Đang tải biểu mẫu...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
