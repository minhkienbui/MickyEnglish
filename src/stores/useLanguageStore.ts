import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TargetLanguage = 'en' | 'zh';

export interface LanguageInfo {
  code: TargetLanguage;
  name: string;
  nativeName: string;
  flag: string;
  slogan: string;
  brandSub: string;
  brandColor: string;
  standards: string[];
  speechLang: string;
}

export const LANGUAGE_CONFIGS: Record<TargetLanguage, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'Tiếng Anh',
    nativeName: 'English',
    flag: '🇬🇧',
    slogan: 'Luyện tập Tiếng Anh Toàn Diện Đa Kỹ Năng',
    brandSub: 'English',
    brandColor: 'text-emerald-500',
    standards: ['TOEIC', 'IELTS', 'Oxford 3000', 'VSTEP', 'CEFR'],
    speechLang: 'en-US',
  },
  zh: {
    code: 'zh',
    name: 'Tiếng Trung',
    nativeName: '中文 (HSK)',
    flag: '🇨🇳',
    slogan: 'Chinh phục Tiếng Trung HSK 3.0 & HSKK Đột Phá',
    brandSub: 'Chinese (HSK)',
    brandColor: 'text-rose-500',
    standards: ['HSK 1-9', 'HSKK', 'Pinyin', '214 Bộ Thủ', 'Tập Viết'],
    speechLang: 'zh-CN',
  },
};

interface LanguageState {
  targetLanguage: TargetLanguage;
  isHydrated: boolean;
  setTargetLanguage: (lang: TargetLanguage) => void;
  toggleLanguage: () => void;
  setHydrated: (val?: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      targetLanguage: 'en',
      isHydrated: false,

      setTargetLanguage: (targetLanguage) => set({ targetLanguage }),

      toggleLanguage: () =>
        set((state) => ({
          targetLanguage: state.targetLanguage === 'en' ? 'zh' : 'en',
        })),

      setHydrated: (val = true) => set({ isHydrated: val }),
    }),
    {
      name: 'micky-language-preference',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
