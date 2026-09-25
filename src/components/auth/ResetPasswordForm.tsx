'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import MickyMascot from '@/components/common/MickyMascot';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isPasswordMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isPasswordValid = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !isPasswordMatch || loading) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể đặt lại mật khẩu');
      }

      setSuccessMsg('🎉 Mật khẩu đã được cập nhật thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#121c2b] border border-[#1e2d42] shadow-2xl p-6 sm:p-8 rounded-3xl space-y-6 animate-fade-in font-sans">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-1">
          <MickyMascot size={48} />
        </div>
        <h2 className="text-2xl font-black text-white">Đặt lại mật khẩu mới</h2>
        <p className="text-xs text-slate-400 font-medium">
          Nhập mật khẩu mới an toàn có tối thiểu 8 ký tự, 1 chữ hoa và 1 số
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-center text-xs font-black text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-500 rounded-2xl text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300">
            Mật khẩu mới <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự, 1 chữ hoa, 1 số"
              className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 pl-10 pr-10 text-xs font-semibold text-white outline-none"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-white absolute right-3.5 top-3 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300">
            Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 pl-10 pr-10 text-xs font-semibold text-white outline-none"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-white absolute right-3.5 top-3 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && (
            <p className={`text-[11px] font-bold ${isPasswordMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPasswordMatch ? '✓ Mật khẩu xác nhận trùng khớp' : '❌ Mật khẩu xác nhận không khớp'}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isPasswordValid || !isPasswordMatch}
          className="w-full py-3 bg-[#00c950] hover:bg-[#00b046] disabled:opacity-40 disabled:hover:bg-[#00c950] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu mật khẩu...</span>
            </>
          ) : (
            <>
              <span>Lưu mật khẩu mới</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
