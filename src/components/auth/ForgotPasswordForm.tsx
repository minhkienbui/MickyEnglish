'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import MickyMascot from '@/components/common/MickyMascot';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setResetUrl('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể gửi yêu cầu đặt lại mật khẩu');
      }

      setSuccessMsg('Đã tạo liên kết đặt lại mật khẩu thành công (hết hạn sau 1 giờ).');
      if (data.resetToken) {
        setResetUrl(`/reset-password?token=${data.resetToken}`);
      } else {
        setResetUrl(`/reset-password?token=demo-token-${Date.now()}`);
      }
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
        <h2 className="text-2xl font-black text-white">Quên mật khẩu?</h2>
        <p className="text-xs text-slate-400 font-medium">
          Nhập email đăng ký của bạn để nhận liên kết khôi phục và đặt lại mật khẩu mới
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl space-y-3 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-xs font-black text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>

          {resetUrl && (
            <div className="pt-2 border-t border-emerald-800/60 space-y-2">
              <p className="text-[11px] text-slate-300">Nhấn vào liên kết bên dưới để đổi mật khẩu ngay:</p>
              <Link
                href={resetUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-md"
              >
                <KeyRound className="w-3.5 h-3.5" /> Đặt lại mật khẩu ngay
              </Link>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-500 rounded-2xl text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-300">
              Email đăng ký <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hocvien@gmail.com"
                className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 bg-[#00c950] hover:bg-[#00b046] disabled:opacity-40 disabled:hover:bg-[#00c950] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <span>Gửi liên kết khôi phục</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="pt-2 text-center border-t border-[#1e2d42]">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
}
