import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WordItem } from '@/lib/types';
import { mockPresetWords } from '@/data/mockVocab';
import { calculateNextReview, Rating, isDueToday } from '@/lib/spacedRepetition';

interface VocabState {
  words: WordItem[];
  activeTopic: string;
  searchQuery: string;
  setActiveTopic: (topic: string) => void;
  setSearchQuery: (query: string) => void;
  addWord: (word: Omit<WordItem, 'id' | 'level' | 'nextReviewDate'>) => void;
  deleteWord: (id: string) => void;
  rateWord: (id: string, rating: Rating) => void;
  getDueWords: () => WordItem[];
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      words: mockPresetWords,
      activeTopic: 'All',
      searchQuery: '',

      setActiveTopic: (topic) => set({ activeTopic: topic }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      addWord: (newWordData) => {
        const newWord: WordItem = {
          ...newWordData,
          id: 'custom-' + Date.now(),
          level: 0,
          nextReviewDate: new Date().toISOString(),
        };
        set((state) => ({ words: [newWord, ...state.words] }));
      },

      deleteWord: (id) => {
        set((state) => ({ words: state.words.filter((w) => w.id !== id) }));
      },

      rateWord: (id, rating) => {
        set((state) => ({
          words: state.words.map((w) => {
            if (w.id !== id) return w;
            const res = calculateNextReview(w.level, rating);
            return {
              ...w,
              level: res.newLevel,
              nextReviewDate: res.nextReviewDate,
            };
          }),
        }));
      },

      getDueWords: () => {
        return get().words.filter((w) => isDueToday(w.nextReviewDate));
      },
    }),
    {
      name: 'micky-vocab-storage',
    }
  )
);
