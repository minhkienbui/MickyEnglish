import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Đặt lại mật khẩu - Micky English',
  description: 'Cập nhật mật khẩu mới cho tài khoản Micky English.',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#0b0f17]">
      <Suspense fallback={<div className="text-white text-xs">Đang tải...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
