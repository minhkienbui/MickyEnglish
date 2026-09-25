import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DictationLesson, DictationSentence } from '@/lib/types';
import { mockDictationLessons } from '@/data/mockDictation';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';

interface DictationState {
  lessons: DictationLesson[];
  activeLesson: DictationLesson | null;
  activeSentenceIndex: number;
  currentTime: number;
  playbackSpeed: number; // 0.5, 0.75, 1.0
  isLoopingSentence: boolean;
  autoPauseEachSentence: boolean;
  isPlaying: boolean;
  userRecordings: Record<string, string>; // sentenceId -> audioBlobUrl

  addCustomLesson: (lesson: DictationLesson) => void;
  updateLessonSentences: (lessonId: string, sentences: DictationSentence[]) => void;
  setActiveLesson: (id: string) => void;
  setActiveSentenceIndex: (index: number) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsLoopingSentence: (isLooping: boolean) => void;
  setAutoPauseEachSentence: (autoPause: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  saveRecording: (sentenceId: string, blobUrl: string) => void;
}

export const useDictationStore = create<DictationState>()(
  persist(
    (set, get) => ({
      lessons: mockDictationLessons,
      activeLesson: mockDictationLessons[0],
      activeSentenceIndex: 0,
      currentTime: 0,
      playbackSpeed: 1.0,
      isLoopingSentence: false,
      autoPauseEachSentence: true,
      isPlaying: false,
      userRecordings: {},

      addCustomLesson: (lesson) => {
        set((state) => {
          const existing = state.lessons.findIndex((l) => l.id === lesson.id);
          let newLessons = state.lessons;
          if (existing >= 0) {
            newLessons = [...state.lessons];
            newLessons[existing] = lesson;
          } else {
            newLessons = [lesson, ...state.lessons];
          }
          return {
            lessons: newLessons,
            activeLesson: lesson,
            activeSentenceIndex: 0,
            currentTime: 0,
          };
        });

        // Đồng bộ sang Admin Video Store nếu chưa có
        try {
          const adminStore = useAdminVideoStore.getState();
          const existsInAdmin = adminStore.videos.some((v) => v.id === lesson.id || (v.youtubeId && v.youtubeId === lesson.youtubeId));
          if (!existsInAdmin) {
            adminStore.addVideo(lesson);
          }
        } catch {
          // Store sync fallback
        }
      },

      updateLessonSentences: (lessonId, sentences) => {
        set((state) => {
          const updatedLessons = state.lessons.map((l) => {
            if (l.id === lessonId) {
              return {
                ...l,
                sentences,
                duration: sentences[sentences.length - 1]?.endTime || l.duration,
              };
            }
            return l;
          });

          const currentActive = state.activeLesson;
          const updatedActive =
            currentActive && currentActive.id === lessonId
              ? {
                  ...currentActive,
                  sentences,
                  duration: sentences[sentences.length - 1]?.endTime || currentActive.duration,
                }
              : currentActive;

          return {
            lessons: updatedLessons,
            activeLesson: updatedActive,
            activeSentenceIndex: 0,
          };
        });
      },

      setActiveLesson: (id) => {
        const { lessons } = get();
        // Tìm trong lessons của dictation store, nếu chưa có thì tìm trong admin store
        let lesson = lessons.find((l) => l.id === id);
        if (!lesson) {
          try {
            const adminVideos = useAdminVideoStore.getState().videos;
            lesson = adminVideos.find((v) => v.id === id || v.youtubeId === id);
            if (lesson) {
              set((state) => ({ lessons: [lesson!, ...state.lessons] }));
            }
          } catch {}
        }
        
        if (!lesson) {
          lesson = lessons[0] || mockDictationLessons[0];
        }

        set({
          activeLesson: lesson,
          activeSentenceIndex: 0,
          currentTime: 0,
          isPlaying: false,
        });
      },

      setActiveSentenceIndex: (index) => set({ activeSentenceIndex: index }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setIsLoopingSentence: (isLooping) => set({ isLoopingSentence: isLooping }),
      setAutoPauseEachSentence: (autoPause) => set({ autoPauseEachSentence: autoPause }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),

      saveRecording: (sentenceId, blobUrl) => {
        set((state) => ({
          userRecordings: {
            ...state.userRecordings,
            [sentenceId]: blobUrl,
          },
        }));
      },
    }),
    {
      name: 'micky-dictation-storage',
    }
  )
);
