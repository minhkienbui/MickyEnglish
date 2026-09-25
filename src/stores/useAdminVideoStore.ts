import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DictationLesson, VideoStatus, VideoLevel } from '@/lib/types';
import { mockDictationLessons } from '@/data/mockDictation';
import { useDictationStore } from '@/stores/useDictationStore';

interface AdminVideoState {
  videos: DictationLesson[];
  searchQuery: string;
  selectedTag: string;
  selectedLevel: string;
  selectedStatus: VideoStatus | 'all';
  currentPage: number;
  pageSize: number;

  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedTag: (t: string) => void;
  setSelectedLevel: (l: string) => void;
  setSelectedStatus: (s: VideoStatus | 'all') => void;
  setCurrentPage: (p: number) => void;
  setPageSize: (size: number) => void;

  // CRUD
  addVideo: (video: Partial<DictationLesson> & { title: string; youtubeId?: string; videoId?: string }) => DictationLesson;
  updateVideo: (id: string, data: Partial<DictationLesson>) => void;
  toggleVideoStatus: (id: string) => void;
  softDeleteVideo: (id: string) => void;
  restoreVideo: (id: string) => void;
  hardDeleteVideo: (id: string) => void;
}

export const useAdminVideoStore = create<AdminVideoState>()(
  persist(
    (set, get) => ({
      videos: mockDictationLessons.map((l, idx) => ({
        ...l,
        views: (idx + 1) * 340 + 120,
        status: 'published' as VideoStatus,
        isPinned: idx === 0,
        order: idx + 1,
        createdAt: Date.now() - (idx + 1) * 86400000 * 2,
        tags: [l.topic.includes('Inside Edition') ? '# Inside Edition' : '# Youtube video', '# BBC learning english'],
      })),
      searchQuery: '',
      selectedTag: 'all',
      selectedLevel: 'all',
      selectedStatus: 'all',
      currentPage: 1,
      pageSize: 20,

      setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
      setSelectedTag: (t) => set({ selectedTag: t, currentPage: 1 }),
      setSelectedLevel: (l) => set({ selectedLevel: l, currentPage: 1 }),
      setSelectedStatus: (s) => set({ selectedStatus: s, currentPage: 1 }),
      setCurrentPage: (p) => set({ currentPage: p }),
      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

      addVideo: (videoData) => {
        const newId = videoData.id || `lesson-${Date.now()}`;
        const newVideo: DictationLesson = {
          id: newId,
          title: videoData.title,
          youtubeId: videoData.youtubeId || videoData.videoId || '',
          videoId: videoData.videoId || videoData.youtubeId || '',
          youtubeUrl: videoData.youtubeUrl || (videoData.youtubeId ? `https://www.youtube.com/watch?v=${videoData.youtubeId}` : ''),
          thumbnail: videoData.thumbnail || videoData.thumbnailUrl || `https://img.youtube.com/vi/${videoData.youtubeId}/hqdefault.jpg`,
          thumbnailUrl: videoData.thumbnailUrl || videoData.thumbnail || `https://img.youtube.com/vi/${videoData.youtubeId}/hqdefault.jpg`,
          topic: videoData.topic || 'General Topic',
          level: (videoData.level as VideoLevel) || 'B1',
          duration: Number(videoData.duration) || 60,
          sentences: videoData.sentences && videoData.sentences.length > 0 ? videoData.sentences : [
            { id: 's-1', startTime: 0, endTime: Number(videoData.duration) || 60, text: videoData.title, vietnameseMeaning: '' }
          ],
          totalSentences: videoData.sentences ? videoData.sentences.length : 1,
          createdAt: videoData.createdAt || Date.now(),
          status: videoData.status || 'published',
          isPinned: !!videoData.isPinned,
          order: Number(videoData.order) || 1,
          tags: videoData.tags || ['# Youtube video'],
          views: Number(videoData.views) || 0,
          allowComments: videoData.allowComments !== false,
          requireLogin: !!videoData.requireLogin,
          unlockDiamonds: Number(videoData.unlockDiamonds) || 0,
          publishDate: videoData.publishDate,
          metaTitle: videoData.metaTitle,
          metaDescription: videoData.metaDescription,
        };

        set((state) => {
          const exists = state.videos.findIndex((v) => v.id === newId);
          let nextVideos = state.videos;
          if (exists >= 0) {
            nextVideos = [...state.videos];
            nextVideos[exists] = newVideo;
          } else {
            nextVideos = [newVideo, ...state.videos];
          }
          return { videos: nextVideos };
        });

        // Đồng bộ sang useDictationStore để người dùng có thể học ngay
        try {
          const dictationStore = useDictationStore.getState();
          const existingInDictation = dictationStore.lessons.findIndex((l) => l.id === newId);
          if (existingInDictation >= 0) {
            const nextLessons = [...dictationStore.lessons];
            nextLessons[existingInDictation] = newVideo;
            useDictationStore.setState({ lessons: nextLessons });
          } else {
            useDictationStore.setState({ lessons: [newVideo, ...dictationStore.lessons] });
          }
        } catch {
          // Fallback
        }

        return newVideo;
      },

      updateVideo: (id, data) => {
        set((state) => ({
          videos: state.videos.map((v) => (v.id === id ? { ...v, ...data } : v)),
        }));

        // Đồng bộ cập nhật sang useDictationStore
        try {
          const dictationStore = useDictationStore.getState();
          const updatedLessons = dictationStore.lessons.map((l) => (l.id === id ? { ...l, ...data } : l));
          useDictationStore.setState({ lessons: updatedLessons });
        } catch {}
      },

      toggleVideoStatus: (id) => {
        set((state) => {
          const updatedVideos = state.videos.map((v) => {
            if (v.id !== id) return v;
            const nextStatus: VideoStatus = v.status === 'published' ? 'hidden' : 'published';
            return { ...v, status: nextStatus };
          });
          return { videos: updatedVideos };
        });
      },

      softDeleteVideo: (id) => {
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id ? { ...v, status: 'deleted', deletedAt: Date.now() } : v
          ),
        }));
      },

      restoreVideo: (id) => {
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id ? { ...v, status: 'published', deletedAt: null } : v
          ),
        }));
      },

      hardDeleteVideo: (id) => {
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== id),
        }));
        try {
          const dictationStore = useDictationStore.getState();
          useDictationStore.setState({ lessons: dictationStore.lessons.filter((l) => l.id !== id) });
        } catch {}
      },
    }),
    {
      name: 'micky-admin-videos-storage',
    }
  )
);
