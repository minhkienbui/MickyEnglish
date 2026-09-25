'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import MickyMascot from '@/components/common/MickyMascot';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login, recordFailedLogin, loginWithGoogle, failedLogins } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Lockout countdown timer
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current identifier is currently locked
  useEffect(() => {
    if (!identifier.trim()) return;
    const tracker = failedLogins[identifier.toLowerCase().trim()];
    if (tracker?.lockedUntil && tracker.lockedUntil > Date.now()) {
      const remaining = Math.ceil((tracker.lockedUntil - Date.now()) / 1000);
      setLockoutSeconds(remaining);
    } else {
      setLockoutSeconds(0);
    }
  }, [identifier, failedLogins]);

  // Countdown timer tick
  useEffect(() => {
    if (lockoutSeconds > 0) {
      timerRef.current = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const cleanId = identifier.toLowerCase().trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanId,
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Ghi nhận lần nhập sai
        const lockStatus = recordFailedLogin(cleanId);
        if (lockStatus.isLocked) {
          setLockoutSeconds(lockStatus.remainingSeconds);
          throw new Error('Bạn đã nhập sai 5 lần liên tiếp. Tài khoản bị tạm khóa 15 phút.');
        } else {
          throw new Error(
            data.error || `Tên đăng nhập hoặc mật khẩu không đúng. Còn ${lockStatus.attemptsLeft} lần thử.`
          );
        }
      }

      if (data.user?.isBanned) {
        throw new Error('Tài khoản của bạn đã bị khóa bởi quản trị viên. Vui lòng liên hệ hỗ trợ.');
      }

      // Đăng nhập thành công
      login(data.user);
      setSuccessMessage(`🎉 Đăng nhập thành công! Chào mừng ${data.user.fullName}`);

      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const mockGoogleEmail = `user.${Date.now().toString().slice(-4)}@gmail.com`;
      const mockGoogleUser = {
        email: mockGoogleEmail,
        name: 'Học viên Google',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        googleId: `gid-${Date.now()}`,
      };

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleUser),
      });

      const data = await res.json();

      if (data.success && data.user) {
        loginWithGoogle(mockGoogleUser);
        setSuccessMessage(`🎉 Đăng nhập Google thành công! Chào mừng ${data.user.fullName}`);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage('Đăng nhập Google không khả dụng lúc này.');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#121c2b] border border-[#1e2d42] shadow-2xl p-6 sm:p-8 rounded-3xl space-y-6 animate-fade-in font-sans">
      {/* Header Form */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-1">
          <MickyMascot size={48} />
        </div>
        <h2 className="text-2xl font-black text-white">Đăng nhập Micky English</h2>
        <p className="text-xs text-slate-400 font-medium">
          Đăng nhập để lưu tiến độ học tập và quản lý bài học của bạn
        </p>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-center text-xs font-black text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Lockout Banner */}
      {lockoutSeconds > 0 ? (
        <div className="p-4 bg-rose-950/90 border border-rose-500 rounded-2xl space-y-2 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-rose-400 font-black text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Tài khoản tạm thời bị khóa 15 phút</span>
          </div>
          <p className="text-xs text-slate-300">
            Bạn đã nhập sai mật khẩu 5 lần liên tiếp. Vui lòng chờ:
          </p>
          <div className="text-lg font-black font-mono text-rose-300 flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{formatCountdown(lockoutSeconds)}</span>
          </div>
        </div>
      ) : errorMessage ? (
        <div className="p-3 bg-rose-950/90 border border-rose-500 rounded-2xl text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-[#0e1726] hover:bg-[#162338] border border-[#1e2d42] text-slate-200 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>Tiếp tục với Google</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#1e2d42] w-full" />
        <span className="bg-[#121c2b] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Hoặc đăng nhập với tài khoản
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* INPUT: Tên đăng nhập hoặc Email */}
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300">
            Tên đăng nhập hoặc Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username hoặc email..."
              className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* INPUT: Mật khẩu */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-300">
              Mật khẩu <span className="text-rose-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-emerald-400 hover:underline font-bold"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
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

        {/* GHI NHỚ ĐĂNG NHẬP (30 ngày) */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded-sm bg-[#0e1726] border border-[#1e2d42] text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-slate-400 font-medium">Ghi nhớ đăng nhập (30 ngày)</span>
        </label>

        {/* NÚT ĐĂNG NHẬP */}
        <button
          type="submit"
          disabled={loading || lockoutSeconds > 0 || !identifier.trim() || !password}
          className="w-full py-3 bg-[#00c950] hover:bg-[#00b046] disabled:opacity-40 disabled:hover:bg-[#00c950] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang đăng nhập...</span>
            </>
          ) : lockoutSeconds > 0 ? (
            <span>Tạm khóa ({formatCountdown(lockoutSeconds)})</span>
          ) : (
            <>
              <span>Đăng nhập</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Link to Register */}
      <p className="text-center text-xs text-slate-400 font-medium">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-emerald-400 hover:underline font-black">
          Tạo tài khoản mới
        </Link>
      </p>
    </div>
  );
}
