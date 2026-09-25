'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, Check, ExternalLink, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface AISpeechConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AISpeechConfigModal({ isOpen, onClose }: AISpeechConfigModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'browser' | 'youtube'>('gemini');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('micky_gemini_api_key') || '';
      const savedModel = (localStorage.getItem('micky_ai_speech_model') as any) || 'gemini';
      setApiKey(savedKey);
      setSelectedModel(savedModel);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('micky_gemini_api_key', apiKey.trim());
      localStorage.setItem('micky_ai_speech_model', selectedModel);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#111a28] border border-[#1e2d42] rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e2d42] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-black text-white">
              Cài Đặt Model AI Nhận Diện Âm Thanh Video
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free AI Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            Chọn Mô Hình AI Phân Tích Giọng Nói:
          </label>

          {/* Model 1: Google Gemini 2.0 Flash */}
          <div
            onClick={() => setSelectedModel('gemini')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              selectedModel === 'gemini'
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-[#0e1726] border-[#1e2d42] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Google Gemini 2.0 Flash AI (Khuyên dùng)
              </span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
                100% MIỄN PHÍ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mô hình mạnh nhất của Google giúp nghe nhận diện lời nói, chia câu theo giây, sinh phiên âm IPA và dịch tiếng Việt chính xác.
            </p>
          </div>

          {/* Model 2: YouTube AI Caption Extractor */}
          <div
            onClick={() => setSelectedModel('youtube')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
              selectedModel === 'youtube'
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-[#0e1726] border-[#1e2d42] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-400" />
                YouTube AI Neural Subtitles
              </span>
              <span className="text-[10px] font-black text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-500/40">
                Không cần Key
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Trích xuất trực tiếp luồng phụ đề tự động bằng AI từ máy chủ YouTube.
            </p>
          </div>
        </div>

        {/* API Key Input for Gemini */}
        {selectedModel === 'gemini' && (
          <div className="p-4 rounded-2xl bg-[#0e1726] border border-[#1e2d42] space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                Google AI Studio API Key:
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                Lấy Key miễn phí 100% <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Dán mã API Key của bạn (AIzaSy...)"
              className="w-full bg-[#121c2b] border border-[#1e2d42] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
            />

            <div className="flex items-start gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                API Key được lưu trữ trực tiếp trên trình duyệt của bạn (Local Storage) và hoàn toàn miễn phí 1,500 lượt yêu cầu/ngày từ Google AI Studio.
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1e2d42]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-micky-primary py-2.5 px-6 text-xs font-black flex items-center gap-1.5 shadow-xl cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" /> Đã Lưu!
              </>
            ) : (
              'Lưu Cài Đặt'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
