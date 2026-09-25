import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Đăng ký tài khoản - Micky English',
  description: 'Tạo tài khoản học tiếng Anh miễn phí cùng Micky English.',
};

export default function DangKyPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#0b0f17]">
      <Suspense fallback={<div className="text-white text-xs">Đang tải...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
