'use client';

export default function MickyMascot({ size = 48 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative rounded-2xl bg-gradient-to-b from-[#b87333] to-[#8b4513] p-1 shadow-lg flex items-center justify-center shrink-0 border border-[#d2b48c]/30 group hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Bear Ears */}
        <circle cx="22" cy="22" r="16" fill="#8b4513" stroke="#5c2e0b" strokeWidth="4" />
        <circle cx="22" cy="22" r="9" fill="#d2b48c" />
        <circle cx="78" cy="22" r="16" fill="#8b4513" stroke="#5c2e0b" strokeWidth="4" />
        <circle cx="78" cy="22" r="9" fill="#d2b48c" />

        {/* Bear Head */}
        <ellipse cx="50" cy="55" rx="40" ry="36" fill="#a0522d" stroke="#5c2e0b" strokeWidth="4" />
        
        {/* Snout Area */}
        <ellipse cx="50" cy="64" rx="22" ry="17" fill="#ffdead" />
        
        {/* Eyes */}
        <ellipse cx="36" cy="48" rx="6" ry="8" fill="#1f150e" />
        <circle cx="34" cy="45" r="2.5" fill="#ffffff" />
        <ellipse cx="64" cy="48" rx="6" ry="8" fill="#1f150e" />
        <circle cx="62" cy="45" r="2.5" fill="#ffffff" />

        {/* Nose */}
        <ellipse cx="50" cy="58" rx="7" ry="5" fill="#1f150e" />

        {/* Mouth */}
        <path d="M 50 63 Q 44 70 38 66" stroke="#1f150e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 50 63 Q 56 70 62 66" stroke="#1f150e" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="28" cy="58" r="5" fill="#ff7f50" opacity="0.6" />
        <circle cx="72" cy="58" r="5" fill="#ff7f50" opacity="0.6" />
      </svg>
    </div>
  );
}
