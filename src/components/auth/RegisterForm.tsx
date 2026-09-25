'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Camera,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import MickyMascot from '@/components/common/MickyMascot';

// Avatar presets for quick selection
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
];

export default function RegisterForm() {
  const router = useRouter();
  const { registerUser, loginWithGoogle } = useAuthStore();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Realtime validation states
  const [usernameStatus, setUsernameStatus] = useState<{
    loading: boolean;
    valid: boolean | null;
    message: string;
  }>({ loading: false, valid: null, message: '' });

  const [emailStatus, setEmailStatus] = useState<{
    loading: boolean;
    valid: boolean | null;
    message: string;
  }>({ loading: false, valid: null, message: '' });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastSuccess, setToastSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const usernameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emailTimerRef = useRef<NodeJS.Timeout | null>(null);

  // [1] Check Username Realtime (Debounce 400ms)
  useEffect(() => {
    if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);

    if (!username.trim()) {
      setUsernameStatus({ loading: false, valid: null, message: '' });
      return;
    }

    const cleanUser = username.toLowerCase().trim();
    const regex = /^[a-z0-9_.]{3,20}$/;

    if (!regex.test(cleanUser)) {
      setUsernameStatus({
        loading: false,
        valid: false,
        message: 'Tên đăng nhập chỉ gồm 3-20 ký tự: a-z, 0-9, dấu _ và .',
      });
      return;
    }

    setUsernameStatus({ loading: true, valid: null, message: 'Đang kiểm tra...' });

    usernameTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUser }),
        });
        const data = await res.json();
        setUsernameStatus({
          loading: false,
          valid: data.available,
          message: data.message,
        });
      } catch {
        setUsernameStatus({
          loading: false,
          valid: true,
          message: 'Tên đăng nhập hợp lệ và còn trống ✅',
        });
      }
    }, 400);

    return () => {
      if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    };
  }, [username]);

  // [2] Check Email Realtime (Debounce 400ms)
  useEffect(() => {
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current);

    if (!email.trim()) {
      setEmailStatus({ loading: false, valid: null, message: '' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setEmailStatus({
        loading: false,
        valid: false,
        message: 'Định dạng email không hợp lệ (ví dụ: ten@gmail.com)',
      });
      return;
    }

    setEmailStatus({ loading: true, valid: null, message: 'Đang kiểm tra...' });

    emailTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const data = await res.json();
        setEmailStatus({
          loading: false,
          valid: data.available,
          message: data.message,
        });
      } catch {
        setEmailStatus({
          loading: false,
          valid: true,
          message: 'Email hợp lệ và có thể đăng ký ✅',
        });
      }
    }, 400);

    return () => {
      if (emailTimerRef.current) clearTimeout(emailTimerRef.current);
    };
  }, [email]);

  // [3] Password Strength Meter (Yếu / Trung bình / Mạnh / Rất mạnh)
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700', textClass: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Yếu', color: 'bg-rose-500', textClass: 'text-rose-400' };
      case 2:
        return { score: 2, label: 'Trung bình', color: 'bg-amber-400', textClass: 'text-amber-400' };
      case 3:
        return { score: 3, label: 'Mạnh', color: 'bg-blue-400', textClass: 'text-blue-400' };
      case 4:
      default:
        return { score: 4, label: 'Rất mạnh', color: 'bg-emerald-400', textClass: 'text-emerald-400' };
    }
  };

  const passwordStrength = calculatePasswordStrength(password);
  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  // [4] Avatar Upload Handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // [5] Submit Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');

    // Form Validations with explicit feedback
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên đầy đủ');
      return;
    }

    if (!username.trim() || username.length < 3) {
      setErrorMessage('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    if (usernameStatus.valid === false) {
      setErrorMessage(usernameStatus.message || 'Tên đăng nhập không hợp lệ hoặc đã tồn tại');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Email không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    if (emailStatus.valid === false) {
      setErrorMessage(emailStatus.message || 'Email này đã được sử dụng');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Mật khẩu phải có tối thiểu 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với Điều khoản sử dụng để tiếp tục');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          email,
          password,
          avatar,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng ký không thành công');
      }

      // Lưu thông tin vào zustand store
      registerUser({
        username,
        email,
        fullName,
        avatar,
      });

      setToastSuccess(`🎉 Chào mừng ${fullName}! Tài khoản đã được tạo thành công.`);

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã có lỗi xảy ra khi tạo tài khoản.');
      setIsSubmitting(false);
    }
  };

  // [6] Google OAuth Login Handler
  const handleGoogleSignup = async () => {
    const mockEmail = `user.${Date.now().toString().slice(-4)}@gmail.com`;
    const mockGoogleUser = {
      email: mockEmail,
      name: 'Học viên Google',
      picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      googleId: `gid-${Date.now()}`,
    };

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleUser),
      });
      const data = await res.json();

      if (data.success && data.user) {
        loginWithGoogle(mockGoogleUser);
        setToastSuccess(`🎉 Chào mừng ${data.user.fullName}! Đã đăng nhập bằng Google.`);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err: any) {
      alert('Đăng nhập Google thất bại');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#121c2b] border border-[#1e2d42] shadow-2xl p-6 sm:p-8 rounded-3xl space-y-6 animate-fade-in font-sans">
      {/* Header Form */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-1">
          <MickyMascot size={48} />
        </div>
        <h2 className="text-2xl font-black text-white">Tạo tài khoản mới</h2>
        <p className="text-xs text-slate-400 font-medium">
          Tham gia Micky English để học từ vựng, dictation và shadowing không giới hạn
        </p>
      </div>

      {/* Toast Success */}
      {toastSuccess && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-center text-xs font-black text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastSuccess}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/90 border border-rose-500 rounded-2xl text-center text-xs font-bold text-rose-300 flex items-center justify-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
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
          Hoặc đăng ký bằng email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* AVATAR UPLOAD (Hình tròn, click chọn ảnh) */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative group">
            <img
              src={avatar}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold cursor-pointer"
              title="Đổi ảnh đại diện"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-bold">Mẫu nhanh:</span>
            {AVATAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(preset)}
                className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                  avatar === preset ? 'border-emerald-400 scale-110' : 'border-transparent opacity-60'
                }`}
              >
                <img src={preset} alt="preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 1. HỌ VÀ TÊN ĐẦY ĐỦ */}
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300">
            Họ và tên đầy đủ <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Bùi Kiên"
              className="w-full bg-[#0e1726] border border-[#1e2d42] focus:border-emerald-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white outline-none"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* 2. TÊN ĐĂNG NHẬP (USERNAME - CHECK REALTIME 400MS) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-300">
              Tên đăng nhập / username <span className="text-rose-500">*</span>
            </label>
            {usernameStatus.loading && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-emerald-400" /> Đang kiểm tra...
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
              placeholder="bminhkien123 (3-20 ký tự)"
              className={`w-full bg-[#0e1726] border rounded-2xl py-2.5 pl-10 pr-10 text-xs font-semibold text-white outline-none ${
                usernameStatus.valid === true
                  ? 'border-emerald-500/80 focus:border-emerald-500'
                  : usernameStatus.valid === false
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-[#1e2d42] focus:border-emerald-500'
              }`}
            />
            <span className="text-slate-400 font-mono text-xs absolute left-3.5 top-2.5">@</span>

            {usernameStatus.valid === true && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3" />
            )}
            {usernameStatus.valid === false && (
              <XCircle className="w-4 h-4 text-rose-400 absolute right-3.5 top-3" />
            )}
          </div>
          {usernameStatus.message && (
            <p
              className={`text-[11px] font-bold ${
                usernameStatus.valid ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {usernameStatus.message}
            </p>
          )}
        </div>

        {/* 3. EMAIL (CHECK REALTIME) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-300">
              Email <span className="text-rose-500">*</span>
            </label>
            {emailStatus.loading && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-emerald-400" /> Đang kiểm tra...
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="minhkienbui456@gmail.com"
              className={`w-full bg-[#0e1726] border rounded-2xl py-2.5 pl-10 pr-10 text-xs font-semibold text-white outline-none ${
                emailStatus.valid === true
                  ? 'border-emerald-500/80 focus:border-emerald-500'
                  : emailStatus.valid === false
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-[#1e2d42] focus:border-emerald-500'
              }`}
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

            {emailStatus.valid === true && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3" />
            )}
            {emailStatus.valid === false && (
              <XCircle className="w-4 h-4 text-rose-400 absolute right-3.5 top-3" />
            )}
          </div>
          {emailStatus.message && (
            <p
              className={`text-[11px] font-bold ${
                emailStatus.valid ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {emailStatus.message}
            </p>
          )}
        </div>

        {/* 4. MẬT KHẨU + THANH ĐỘ MẠNH */}
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300">
            Mật khẩu <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
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

          {/* Thanh đo độ mạnh mật khẩu */}
          {password && (
            <div className="pt-1.5 space-y-1 animate-fade-in">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400">Độ mạnh mật khẩu:</span>
                <span className={passwordStrength.textClass}>{passwordStrength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full transition-all duration-300 ${
                      step <= passwordStrength.score ? passwordStrength.color : 'bg-[#1e2d42]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                Gợi ý: Mật khẩu tối thiểu 6 ký tự. Thêm chữ in hoa (A-Z) hoặc ký tự đặc biệt để bảo mật cao hơn.
              </p>
            </div>
          )}
        </div>

        {/* 5. XÁC NHẬN MẬT KHẨU */}
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300">
            Xác nhận mật khẩu <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu..."
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

        {/* 6. ĐỒNG Ý ĐIỀU KHOẢN */}
        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded-sm bg-[#0e1726] border border-[#1e2d42] text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-slate-400 font-medium leading-relaxed">
            Tôi đồng ý với{' '}
            <Link href="/terms" className="text-emerald-400 hover:underline font-bold">
              Điều khoản sử dụng
            </Link>{' '}
            và Chính sách bảo mật của Micky English.
          </span>
        </label>

        {/* 7. NÚT TẠO TÀI KHOẢN */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#00c950] hover:bg-[#00b046] disabled:opacity-50 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang tạo tài khoản...</span>
            </>
          ) : (
            <>
              <span>Tạo tài khoản</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Link to Login */}
      <p className="text-center text-xs text-slate-400 font-medium">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-emerald-400 hover:underline font-black">
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
}
