import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Quên mật khẩu - Micky English',
  description: 'Khôi phục mật khẩu tài khoản Micky English.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#0b0f17]">
      <Suspense fallback={<div className="text-white text-xs">Đang tải...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
