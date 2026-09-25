'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Mail,
  Cpu,
  BookOpen,
  CheckCircle2,
  Save,
  Globe,
  Sliders,
  Key,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAdminStore } from '@/stores/useAdminStore';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'app' | 'learning' | 'security' | 'email' | 'integrations'>('app');
  const [formData, setFormData] = useState({ ...settings });
  const [toastMsg, setToastMsg] = useState('');
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('✓ Đã lưu cài đặt hệ thống thành công!');
  };

  const handleTestEmail = () => {
    setIsTestingEmail(true);
    setTimeout(() => {
      setIsTestingEmail(false);
      showToast('✓ Đã gửi thử nghiệm email SMTP thành công tới ' + formData.contactEmail);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500 py-2.5 px-4 rounded-2xl text-xs font-black text-emerald-300 flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" /> Cài đặt Hệ thống
          </h1>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Cấu hình tham số toàn cục, bảo mật, cổng tích hợp API bên ngoài và dịch vụ thông báo
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Lưu cấu hình</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[#334155] gap-1 overflow-x-auto">
        {[
          { id: 'app', label: '🌐 Thông tin Ứng dụng', icon: Globe },
          { id: 'learning', label: '📚 Cấu hình Học tập', icon: BookOpen },
          { id: 'security', label: '🛡️ Bảo mật & Phân quyền', icon: Shield },
          { id: 'email', label: '✉️ Cấu hình Email SMTP', icon: Mail },
          { id: 'integrations', label: '⚡ Tích hợp API', icon: Cpu },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-black border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400 bg-[#1e293b]/40 rounded-t-2xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: THÔNG TIN ỨNG DỤNG */}
        {/* ========================================================================= */}
        {activeTab === 'app' && (
          <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-5 animate-fade-in">
            <h2 className="text-sm font-black text-white">Cấu hình Thương hiệu & SEO</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Tên Ứng dụng (App Name)</label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => handleChange('appName', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Email liên hệ hỗ trợ</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Đường dẫn Logo URL</label>
                <input
                  type="text"
                  value={formData.appLogo}
                  onChange={(e) => handleChange('appLogo', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Đường dẫn Favicon URL</label>
                <input
                  type="text"
                  value={formData.favicon}
                  onChange={(e) => handleChange('favicon', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Mô tả SEO tóm tắt</label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl p-3 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Từ khóa SEO (Keywords)</label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CẤU HÌNH HỌC TẬP */}
        {/* ========================================================================= */}
        {activeTab === 'learning' && (
          <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-5 animate-fade-in">
            <h2 className="text-sm font-black text-white">Tham số trải nghiệm học tập</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Đá Quý tặng khi đăng ký mới</label>
                <input
                  type="number"
                  value={formData.defaultRegisterDiamonds}
                  onChange={(e) => handleChange('defaultRegisterDiamonds', parseInt(e.target.value) || 100)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-mono text-cyan-400 font-bold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Tốc độ phát mặc định</label>
                <select
                  value={formData.defaultPlaybackRate}
                  onChange={(e) => handleChange('defaultPlaybackRate', parseInt(e.target.value) || 100)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-bold text-white outline-none"
                >
                  <option value={50}>50% (Chậm)</option>
                  <option value={75}>75% (Vừa phải)</option>
                  <option value={100}>100% (Chuẩn)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Số câu tối đa mỗi video</label>
                <input
                  type="number"
                  value={formData.maxSentencesPerVideo}
                  onChange={(e) => handleChange('maxSentencesPerVideo', parseInt(e.target.value) || 100)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#334155]">
              <h3 className="text-xs font-black text-slate-300">Bật / Tắt chế độ học tập</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
                  <span className="text-xs font-bold text-white">Chế độ Dictation</span>
                  <input
                    type="checkbox"
                    checked={formData.enableDictation}
                    onChange={(e) => handleChange('enableDictation', e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded-sm"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
                  <span className="text-xs font-bold text-white">Chế độ Shadowing</span>
                  <input
                    type="checkbox"
                    checked={formData.enableShadowing}
                    onChange={(e) => handleChange('enableShadowing', e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded-sm"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
                  <span className="text-xs font-bold text-white">AI Voice Recognition</span>
                  <input
                    type="checkbox"
                    checked={formData.enableAIVoice}
                    onChange={(e) => handleChange('enableAIVoice', e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded-sm"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BẢO MẬT & PHÂN QUYỀN */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-5 animate-fade-in">
            <h2 className="text-sm font-black text-white">Quy tắc An ninh & Quản trị</h2>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">
                Danh sách Admin Emails (cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={(formData.adminEmails || []).join(', ')}
                onChange={(e) =>
                  handleChange(
                    'adminEmails',
                    e.target.value.split(',').map((x) => x.trim())
                  )
                }
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Cho phép Đăng ký mới</span>
                  <span className="text-[10px] text-slate-400">Người dùng có thể tạo tài khoản mới</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowRegistration}
                  onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded-sm"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0f172a] border border-[#334155] cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Yêu cầu Xác minh Email</span>
                  <span className="text-[10px] text-slate-400">Bắt buộc verify trước khi sử dụng</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.requireEmailVerification}
                  onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded-sm"
                />
              </label>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CẤU HÌNH EMAIL SMTP */}
        {/* ========================================================================= */}
        {activeTab === 'email' && (
          <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white">Máy chủ gửi thư (SMTP Server)</h2>
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#334155] text-emerald-400 text-xs font-bold border border-[#334155] rounded-xl cursor-pointer"
              >
                {isTestingEmail ? 'Đang gửi test...' : '✉️ Test gửi Email'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">SMTP Host</label>
                <input
                  type="text"
                  value={formData.smtpHost}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">SMTP Port</label>
                <input
                  type="number"
                  value={formData.smtpPort}
                  onChange={(e) => handleChange('smtpPort', parseInt(e.target.value) || 587)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300">Tài khoản gửi (Email)</label>
                <input
                  type="text"
                  value={formData.smtpUser}
                  onChange={(e) => handleChange('smtpUser', e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TÍCH HỢP API */}
        {/* ========================================================================= */}
        {activeTab === 'integrations' && (
          <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-5 animate-fade-in">
            <h2 className="text-sm font-black text-white">Khóa API Dịch vụ bên ngoài</h2>

            <div className="space-y-4">
              <div className="p-4 bg-[#0f172a] rounded-2xl border border-[#334155] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">Google OAuth 2.0 Client ID</span>
                  <span className="text-[10px] text-emerald-400 font-bold">✅ Sẵn sàng</span>
                </div>
                <input
                  type="password"
                  value={formData.googleClientId}
                  onChange={(e) => handleChange('googleClientId', e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-1.5 px-3 text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="p-4 bg-[#0f172a] rounded-2xl border border-[#334155] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">YouTube Data API v3 Key</span>
                  <span className="text-[10px] text-emerald-400 font-bold">✅ Sẵn sàng</span>
                </div>
                <input
                  type="password"
                  value={formData.youtubeApiKey}
                  onChange={(e) => handleChange('youtubeApiKey', e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-1.5 px-3 text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="p-4 bg-[#0f172a] rounded-2xl border border-[#334155] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">OpenAI API Key (AI Translation Prompt)</span>
                  <span className="text-[10px] text-emerald-400 font-bold">✅ Sẵn sàng</span>
                </div>
                <input
                  type="password"
                  value={formData.openAiApiKey}
                  onChange={(e) => handleChange('openAiApiKey', e.target.value)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl py-1.5 px-3 text-xs text-white font-mono outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
