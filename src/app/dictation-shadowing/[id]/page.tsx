'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDictationStore } from '@/stores/useDictationStore';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { compareText, DiffResult } from '@/lib/diffEngine';
import AddVideoModal from '@/components/dictation/AddVideoModal';
import DictationWordInputs from '@/components/dictation/DictationWordInputs';
import ShadowingPanel from '@/components/dictation/ShadowingPanel';
import WordOrderGame from '@/components/dictation/WordOrderGame';
import { mockDictationLessons } from '@/data/mockDictation';
import { DictationSentence } from '@/lib/types';
import { getAccurateSentenceIndex } from '@/hooks/useVideoSync';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Mic,
  Headphones,
  BookOpen,
  Volume2,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  MessageSquare,
  Plus,
  Send,
  Zap,
  Sun,
  Moon,
  AlertTriangle,
  Lock,
  Unlock,
  Layers,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

type StudyMode = 'dictation' | 'shadowing' | 'xep-tu' | 'transcript' | 'quiz';

function DictationLessonContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = params.id as string;

  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';

  const {
    lessons,
    activeSentenceIndex,
    currentTime,
    playbackSpeed,
    isLoopingSentence,
    isPlaying,
    setActiveSentenceIndex,
    setCurrentTime,
    setPlaybackSpeed,
    setIsLoopingSentence,
    setIsPlaying,
  } = useDictationStore();

  const { videos: adminVideos } = useAdminVideoStore();
  const { incrementProgress } = useAuthStore();

  // Tìm kiếm bài học từ Zustand store (User + Admin) hoặc mock data
  const storeLesson =
    lessons.find((l) => l.id === lessonId || l.youtubeId === lessonId) ||
    adminVideos.find((l) => l.id === lessonId || l.youtubeId === lessonId) ||
    mockDictationLessons.find((l) => l.id === lessonId || l.youtubeId === lessonId) ||
    mockDictationLessons[0] ||
    lessons[0] ||
    adminVideos[0];

  const [lessonSentences, setLessonSentences] = useState<DictationSentence[]>(
    storeLesson?.sentences || []
  );

  useEffect(() => {
    if (storeLesson && storeLesson.sentences) {
      setLessonSentences(storeLesson.sentences);
    }
  }, [storeLesson]);

  const currentSentence =
    lessonSentences[activeSentenceIndex] || lessonSentences[0] || {
      id: 's-empty',
      startTime: 0,
      endTime: 3.37,
      text: "I really love balancing stones.",
      phonetic: "aɪ ˈrɪəli lʌv ˈbælənsɪŋ stoʊnz",
      vietnameseMeaning: 'Tôi thực sự rất thích nghệ thuật xếp đá cân bằng.',
    };

  // 5 Chế độ học tập (Khớp chuẩn 5 Tabs ở Header Ảnh 28.png)
  const modeParam = searchParams.get('mode') as StudyMode | null;
  const [activeMode, setActiveMode] = useState<StudyMode>(modeParam || 'dictation');

  useEffect(() => {
    if (modeParam && ['dictation', 'shadowing', 'xep-tu', 'transcript', 'quiz'].includes(modeParam)) {
      setActiveMode(modeParam);
    }
  }, [modeParam]);

  // Shadowing Sub-mode: 'step-by-step' (Luyện Từng Câu) | 'auto-flow' (Auto Flow liên tục)
  const [shadowingSubMode, setShadowingSubMode] = useState<'step-by-step' | 'auto-flow'>('step-by-step');

  // Video and Add Video Modal
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  // Dictation Strict Gate State
  const [dictationCheckResult, setDictationCheckResult] = useState<DiffResult | null>(null);
  const [isDictationPassed, setIsDictationPassed] = useState<boolean>(false);
  const [isStrictGateBlocked, setIsStrictGateBlocked] = useState<boolean>(false);
  const [isAutoPausedBanner, setIsAutoPausedBanner] = useState(false);
  const [passedIndices, setPassedIndices] = useState<Set<number>>(new Set());

  // Transcript Mode State
  const [showTranscriptTranslation, setShowTranscriptTranslation] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'Tiếng Việt' | 'English'>('Tiếng Việt');
  const transcriptListRef = useRef<HTMLDivElement | null>(null);

  // Comments State (Ban đầu 1 bình luận, hiển thị đúng "Bình luận 1 ∨" như Ảnh 28.png)
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Video "The Art of Balancing Stones" của Jonna Jinton truyền cảm hứng sâu sắc, vừa rèn luyện khả năng tập trung vừa luyện nghe rất hay!',
  ]);

  // Quiz State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);
  }, [currentSentence]);

  /* ====================================================================
     YOUTUBE IFRAME PLAYER API (HIGH-PRECISION REAL-TIME SYNC)
     ==================================================================== */
  const playerRef = useRef<any>(null);
  const ytTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const [ytReady, setYtReady] = useState(false);
  const activeIndexRef = useRef(activeSentenceIndex);
  activeIndexRef.current = activeSentenceIndex;

  useEffect(() => {
    if (!storeLesson.youtubeId) return;
    if (window.YT && window.YT.Player) {
      setYtReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      setYtReady(true);
    };
  }, [storeLesson.youtubeId]);

  useEffect(() => {
    if (!ytReady || !storeLesson.youtubeId || !playerContainerRef.current) return;
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player(playerContainerRef.current, {
      videoId: storeLesson.youtubeId,
      playerVars: {
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: typeof window !== 'undefined' ? window.location.origin : '',
      },
      events: {
        onReady: () => {
          console.log('[YT Player] Ready');
        },
        onStateChange: (event: any) => {
          if (event.data === 1) {
            setIsPlaying(true);
          } else if (event.data === 2 || event.data === 0) {
            setIsPlaying(false);
          }
        },
      },
    });

    return () => {
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [ytReady, storeLesson.youtubeId, setIsPlaying]);

  /* ====================================================================
     1. AUTO-PAUSE KHI NÓI XONG 1 CÂU (Auto-pause at sentence boundary)
     2. STRICT GATE LOOP ENFORCEMENT (Quay lại đầu câu nếu chưa gõ đúng)
     ==================================================================== */
  useEffect(() => {
    if (isPlaying && playerRef.current?.getCurrentTime) {
      ytTimerRef.current = setInterval(() => {
        const t = playerRef.current.getCurrentTime();
        if (typeof t === 'number') {
          setCurrentTime(t);

          // 1. DICTATION & XẾP TỪ: Dừng video CHÍNH XÁC khi người nói dứt câu
          if (activeMode === 'dictation' || activeMode === 'xep-tu') {
            const sentenceEndTime = currentSentence.endTime;
            // Video tự động dừng ngay khi nói xong 1 câu và đợi người nghe nhập / xếp từ
            if (t >= sentenceEndTime - 0.08) {
              if (playerRef.current?.pauseVideo) {
                playerRef.current.pauseVideo();
              }
              setIsPlaying(false);
              setIsAutoPausedBanner(true);
            }

            // Strict Gate Guard trong dictation: Nếu video trôi quá mốc dứt câu khi chưa điền đúng đáp án
            if (activeMode === 'dictation' && !isDictationPassed && t > sentenceEndTime + 0.3) {
              if (playerRef.current?.seekTo) {
                playerRef.current.seekTo(currentSentence.startTime, true);
              }
            }
          } else if (activeMode === 'shadowing' && shadowingSubMode === 'step-by-step') {
            // Shadowing luyện từng câu: dừng sau khi hết câu hoặc 5-7s để nhại lại
            const pauseTime = Math.min(currentSentence.endTime, currentSentence.startTime + 6);
            if (t >= pauseTime - 0.08) {
              if (playerRef.current?.pauseVideo) {
                playerRef.current.pauseVideo();
              }
              setIsPlaying(false);
              setIsAutoPausedBanner(true);
            }
          }

          if (lessonSentences.length > 0) {
            const nextAccurateIdx = getAccurateSentenceIndex(lessonSentences, t, 0.08);
            if (nextAccurateIdx !== activeIndexRef.current) {
              // Trong dictation: nếu chưa pass thì không cho video tự ý nhảy sang câu tiếp theo
              if (activeMode === 'dictation' && !isDictationPassed && nextAccurateIdx > activeIndexRef.current) {
                // Giữ nguyên câu hiện tại
              } else {
                setActiveSentenceIndex(nextAccurateIdx);
              }
            }
          }
        }
      }, 30);
    } else {
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    }

    return () => {
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    };
  }, [
    isPlaying,
    activeMode,
    shadowingSubMode,
    isDictationPassed,
    currentSentence,
    lessonSentences,
    setCurrentTime,
    setActiveSentenceIndex,
    setIsPlaying,
  ]);

  // Auto-scroll Transcript trơn tru vào giữa khung nhìn
  useEffect(() => {
    if (activeMode === 'transcript' && transcriptListRef.current) {
      const activeEl = transcriptListRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeSentenceIndex, activeMode]);

  /* ====================================================================
     PLAYBACK CONTROLS & STRICT GATE LOGIC
     ==================================================================== */
  const playFromSentence = useCallback(
    (sentenceIndex: number) => {
      const s = lessonSentences[sentenceIndex];
      if (!s) return;

      setIsAutoPausedBanner(false);
      setIsStrictGateBlocked(false);

      if (playerRef.current?.seekTo) {
        playerRef.current.seekTo(s.startTime, true);
        playerRef.current.playVideo();
      } else {
        setCurrentTime(s.startTime);
        setIsPlaying(true);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(s.text);
          utterance.lang = 'en-US';
          utterance.rate = playbackSpeed;
          utterance.onend = () => {
            if (activeMode !== 'transcript' && !(activeMode === 'shadowing' && shadowingSubMode === 'auto-flow')) {
              setIsPlaying(false);
            }
          };
          window.speechSynthesis.speak(utterance);
        }
      }
    },
    [lessonSentences, playbackSpeed, activeMode, shadowingSubMode, setCurrentTime, setIsPlaying]
  );

  const startPlayingCurrentSentence = () => {
    playFromSentence(activeSentenceIndex);
  };

  const stopPlaying = () => {
    if (playerRef.current?.pauseVideo) {
      playerRef.current.pauseVideo();
    }
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  /**
   * CƠ CHẾ CỔNG KIỂM TRA NGHIÊM NGẶT KHI BẤM TIẾP TỤC (PLAY ▶):
   * "Nếu cố bấm tiếp tục sẽ quay lại về thời điểm ban đầu để nghe lại cho đến khi điền đúng đáp án."
   */
  const togglePlay = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      if (activeMode === 'dictation' && !isDictationPassed) {
        setIsStrictGateBlocked(true);
        // Tự động quay lại thời điểm ban đầu (startTime) của câu đó để phát lại
        if (playerRef.current?.seekTo) {
          playerRef.current.seekTo(currentSentence.startTime, true);
          playerRef.current.playVideo();
          setIsPlaying(true);
        } else {
          startPlayingCurrentSentence();
        }
        return;
      }
      startPlayingCurrentSentence();
    }
  };

  const playSentenceTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = playbackSpeed;
      window.speechSynthesis.speak(utterance);
    }
  };

  /**
   * CƠ CHẾ CHUYỂN CÂU (NEXT →):
   * Nếu ở Dictation mà chưa điền đúng đáp án, nếu bấm Next → sẽ bị chặn
   * và hệ thống sẽ tự động tua về thời điểm ban đầu (startTime) để nghe lại.
   */
  const goToNextSentence = () => {
    if (activeMode === 'dictation' && !isDictationPassed) {
      setIsStrictGateBlocked(true);
      // Tự động quay lại thời điểm ban đầu (startTime) của câu đó để nghe lại
      if (playerRef.current?.seekTo) {
        playerRef.current.seekTo(currentSentence.startTime, true);
        playerRef.current.playVideo();
        setIsPlaying(true);
      } else {
        startPlayingCurrentSentence();
      }
      return;
    }

    if (activeSentenceIndex < lessonSentences.length - 1) {
      stopPlaying();
      const nextIdx = activeSentenceIndex + 1;
      setActiveSentenceIndex(nextIdx);
      setCurrentTime(lessonSentences[nextIdx].startTime);
      setDictationCheckResult(null);
      setIsDictationPassed(false);
      setIsStrictGateBlocked(false);
      setIsAutoPausedBanner(false);

      // Tự động phát tiếp câu sau trong video
      playFromSentence(nextIdx);
    }
  };

  const goToPrevSentence = () => {
    if (activeSentenceIndex > 0) {
      stopPlaying();
      const prevIdx = activeSentenceIndex - 1;
      setActiveSentenceIndex(prevIdx);
      setCurrentTime(lessonSentences[prevIdx].startTime);
      setDictationCheckResult(null);
      setIsDictationPassed(false);
      setIsStrictGateBlocked(false);
      setIsAutoPausedBanner(false);
      playFromSentence(prevIdx);
    }
  };

  const selectSentenceDirectly = (idx: number) => {
    stopPlaying();
    setActiveSentenceIndex(idx);
    setCurrentTime(lessonSentences[idx].startTime);
    setDictationCheckResult(null);
    setIsDictationPassed(false);
    setIsStrictGateBlocked(false);
    setIsAutoPausedBanner(false);
    playFromSentence(idx);
  };

  /* ====================================================================
     DICTATION CHECK HANDLERS
     ==================================================================== */
  const handleCheckDictation = (fullUserInput: string) => {
    if (!fullUserInput.trim()) return;
    const res = compareText(currentSentence.text, fullUserInput);
    setDictationCheckResult(res);
    incrementProgress({ dictationMinutes: 2 });

    if (res.accuracy === 100) {
      setIsDictationPassed(true);
      setIsStrictGateBlocked(false);
      setPassedIndices((prev) => new Set([...prev, activeSentenceIndex]));

      // Tự động chuyển câu sau và phát tiếp video sau 1.2s
      setTimeout(() => {
        if (activeSentenceIndex < lessonSentences.length - 1) {
          const nextIdx = activeSentenceIndex + 1;
          setActiveSentenceIndex(nextIdx);
          setCurrentTime(lessonSentences[nextIdx].startTime);
          setDictationCheckResult(null);
          setIsDictationPassed(false);
          setIsAutoPausedBanner(false);
          playFromSentence(nextIdx);
        }
      }, 1200);
    } else {
      setIsDictationPassed(false);
      setIsStrictGateBlocked(true);

      // Điền sai: Tự động tua lại về thời điểm ban đầu (startTime) để nghe lại liên tục!
      setTimeout(() => {
        if (playerRef.current?.seekTo) {
          playerRef.current.seekTo(currentSentence.startTime, true);
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      }, 900);
    }
  };

  const handleSkipDictation = () => {
    const res = compareText(currentSentence.text, currentSentence.text);
    setDictationCheckResult(res);
    setIsDictationPassed(true);
    setIsStrictGateBlocked(false);
    setPassedIndices((prev) => new Set([...prev, activeSentenceIndex]));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments([commentInput.trim(), ...comments]);
    setCommentInput('');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0f17] text-white'
      }`}
    >
      {/* 1. TOP HEADER BAR: Back + Title/Đoạn + 5 Tabs Switcher + Theme Toggle + Add Video */}
      <header
        className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md transition-colors ${
          isLight ? 'bg-white/95 border-slate-200 shadow-xs' : 'bg-[#121c2b]/95 border-[#1e2d42]'
        }`}
      >
        {/* Left: Close/Back + Lesson Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/dictation-shadowing')}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white border-[#1e2d42] hover:bg-[#1e2d42]'
            }`}
            title="Quay lại danh sách bài học"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-black truncate max-w-xs sm:max-w-md">
              {storeLesson.title}
            </h1>
            <p className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {passedIndices.size}/{lessonSentences.length} đoạn • {Math.round(currentTime)}s
            </p>
          </div>
        </div>

        {/* Center: 5-Mode Switcher Pills (Khớp chuẩn Ảnh 28.png: Dictation | Shadowing | Xếp từ | Transcript | Quiz) */}
        <div
          className={`hidden md:flex items-center p-1 rounded-2xl border shadow-inner ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0e1726] border-[#1e2d42]'
          }`}
        >
          {/* 1. Dictation */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('dictation');
              router.replace(`/dictation-shadowing/${storeLesson.id}?mode=dictation`);
            }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'dictation'
                ? isLight
                  ? 'bg-white text-[#00c950] border border-[#00c950] shadow-sm font-black'
                  : 'bg-[#121c2b] text-[#00c950] border border-[#00c950] shadow-sm font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-[#00c950]" />
            <span>Dictation</span>
          </button>

          {/* 2. Shadowing */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('shadowing');
              router.replace(`/dictation-shadowing/${storeLesson.id}?mode=shadowing`);
            }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'shadowing'
                ? isLight
                  ? 'bg-white text-[#00c950] border border-[#00c950] shadow-sm font-black'
                  : 'bg-[#121c2b] text-[#00c950] border border-[#00c950] shadow-sm font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Shadowing</span>
          </button>

          {/* 3. Xếp từ */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('xep-tu');
              router.replace(`/dictation-shadowing/${storeLesson.id}?mode=xep-tu`);
            }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'xep-tu'
                ? isLight
                  ? 'bg-white text-[#00c950] border border-[#00c950] shadow-sm font-black'
                  : 'bg-[#121c2b] text-[#00c950] border border-[#00c950] shadow-sm font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Xếp từ</span>
          </button>

          {/* 4. Transcript */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('transcript');
              router.replace(`/dictation-shadowing/${storeLesson.id}?mode=transcript`);
            }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'transcript'
                ? isLight
                  ? 'bg-white text-[#00c950] border border-[#00c950] shadow-sm font-black'
                  : 'bg-[#121c2b] text-[#00c950] border border-[#00c950] shadow-sm font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Transcript</span>
          </button>

          {/* 5. Quiz */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('quiz');
              router.replace(`/dictation-shadowing/${storeLesson.id}?mode=quiz`);
            }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'quiz'
                ? isLight
                  ? 'bg-white text-[#00c950] border border-[#00c950] shadow-sm font-black'
                  : 'bg-[#121c2b] text-[#00c950] border border-[#00c950] shadow-sm font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>
        </div>

        {/* Right: Theme Toggle (Light/Dark) + Add Video Button */}
        <div className="flex items-center gap-2">
          {/* Nút chuyển đổi Theme Mặt Trời / Mặt Trăng */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-amber-600 hover:bg-slate-200'
                : 'bg-[#0e1726] border-[#1e2d42] text-amber-400 hover:bg-[#182638]'
            }`}
            title={isLight ? 'Chuyển sang nền Tối (Dark mode)' : 'Chuyển sang nền Sáng (Light mode)'}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowAddVideoModal(true)}
            className="px-3.5 py-2 bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
            title="Thêm video YouTube mới"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Thêm video</span>
          </button>
        </div>
      </header>

      {/* Mobile Mode Selector */}
      <div
        className={`md:hidden flex items-center justify-around p-2 border-b text-xs font-black ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'
        }`}
      >
        <button
          onClick={() => setActiveMode('dictation')}
          className={`px-2 py-1 rounded-lg ${activeMode === 'dictation' ? 'text-[#00c950] font-black' : 'text-slate-400'}`}
        >
          Dictation
        </button>
        <button
          onClick={() => setActiveMode('shadowing')}
          className={`px-2 py-1 rounded-lg ${activeMode === 'shadowing' ? 'text-[#00c950] font-black' : 'text-slate-400'}`}
        >
          Shadowing
        </button>
        <button
          onClick={() => setActiveMode('xep-tu')}
          className={`px-2 py-1 rounded-lg ${activeMode === 'xep-tu' ? 'text-[#00c950] font-black' : 'text-slate-400'}`}
        >
          Xếp từ
        </button>
        <button
          onClick={() => setActiveMode('transcript')}
          className={`px-2 py-1 rounded-lg ${activeMode === 'transcript' ? 'text-[#00c950] font-black' : 'text-slate-400'}`}
        >
          Transcript
        </button>
        <button
          onClick={() => setActiveMode('quiz')}
          className={`px-2 py-1 rounded-lg ${activeMode === 'quiz' ? 'text-[#00c950] font-black' : 'text-slate-400'}`}
        >
          Quiz
        </button>
      </div>

      {/* 2. MAIN 2-COLUMN WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: YOUTUBE VIDEO PLAYER & SPEED CONTROLS (7 Cols - Khớp Ảnh 28.png) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header Video: 👁 Video + Speed 50% 75% 100% (Khớp Ảnh 28.png) */}
          <div className="flex items-center justify-between gap-2 text-xs font-bold px-1">
            <div className="flex items-center gap-2">
              <span className={`text-[13px] font-black flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Eye className="w-4 h-4 text-[#00c950]" /> Video
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 p-1 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
                }`}
              >
                {[0.5, 0.75, 1.0].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setPlaybackSpeed(s);
                      if (playerRef.current?.setPlaybackRate) {
                        playerRef.current.setPlaybackRate(s);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                      playbackSpeed === s
                        ? 'bg-[#00c950] text-white shadow-xs'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s === 1 ? '100%' : `${s * 100}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* YouTube Video Container (16:9) */}
          <div className="relative aspect-16/9 w-full bg-black rounded-3xl overflow-hidden border border-[#1e2d42] shadow-2xl group">
            {storeLesson.youtubeId ? (
              <div ref={playerContainerRef} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#142338] to-[#0c1320] text-center space-y-3">
                <img
                  src={storeLesson.thumbnail || 'https://img.youtube.com/vi/UqU19dR0bFE/hqdefault.jpg'}
                  alt={storeLesson.title}
                  className="w-full h-full object-cover absolute inset-0 opacity-40"
                />
                <div className="relative z-10 space-y-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-[#00c950] hover:bg-[#00b046] text-white flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                  </button>
                  <h3 className="text-sm font-black text-white">{storeLesson.title}</h3>
                </div>
              </div>
            )}

            {/* Auto-pause notice overlay in Dictation & Xếp từ mode */}
            {isAutoPausedBanner && (activeMode === 'dictation' || activeMode === 'xep-tu') && (
              <div className="absolute top-4 left-4 right-4 bg-emerald-950/95 border border-emerald-500/80 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center shadow-2xl animate-fade-in z-20">
                <p className="text-xs sm:text-sm font-black text-emerald-300 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  {activeMode === 'xep-tu'
                    ? 'Video đã dừng sau khi dứt câu! Hãy bấm các từ theo đúng thứ tự bạn nghe được.'
                    : 'Video đã dừng lại sau khi dứt câu! Hãy gõ những gì bạn vừa nghe vào các ô bên phải.'}
                </p>
              </div>
            )}

            {/* Strict Gate Blocked Loop Alert overlay */}
            {isStrictGateBlocked && activeMode === 'dictation' && (
              <div className="absolute bottom-4 left-4 right-4 bg-rose-950/95 border border-rose-500/80 backdrop-blur-md px-4 py-3 rounded-2xl text-center shadow-2xl animate-fade-in z-20">
                <p className="text-xs sm:text-sm font-black text-rose-300 flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-400 animate-spin" />
                  Bạn chưa điền đúng đáp án! Video tự động quay lại thời điểm ban đầu để nghe lại cho đến khi gõ đúng.
                </p>
              </div>
            )}

            {/* Success Unlocked overlay */}
            {isDictationPassed && activeMode === 'dictation' && (
              <div className="absolute top-4 left-4 right-4 bg-emerald-900/95 border border-emerald-400 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center shadow-2xl animate-fade-in z-20">
                <p className="text-xs sm:text-sm font-black text-emerald-200 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  🎉 Hoàn toàn chính xác (100%)! Đang chuyển sang câu tiếp theo...
                </p>
              </div>
            )}
          </div>

          {/* Accordion: Bình luận 1 ∨ (Khớp chuẩn Ảnh 28.png) */}
          <div
            className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className={`w-full p-4 flex items-center justify-between text-xs font-black cursor-pointer ${
                isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00c950]" />
                Bình luận {comments.length}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showComments ? 'rotate-180' : ''}`} />
            </button>

            {showComments && (
              <div
                className={`p-4 border-t space-y-3 animate-fade-in ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'
                }`}
              >
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Viết bình luận hoặc chia sẻ kinh nghiệm học..."
                    className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                      isLight
                        ? 'bg-white border-slate-300 focus:border-[#00c950] text-slate-900'
                        : 'bg-[#121c2b] border-[#1e2d42] focus:border-[#00c950] text-white'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00c950] hover:bg-[#00b046] text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Gửi
                  </button>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {comments.map((c, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#121c2b] border-[#1e2d42]'
                      }`}
                    >
                      <span className="text-[10px] font-black text-[#00c950]">Học viên Micky</span>
                      <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>{c}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 5 INTERACTIVE PANELS (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* ================================================================
              TAB 1: DICTATION (Khớp chuẩn 100% Ảnh 28.png)
              ================================================================ */}
          {activeMode === 'dictation' && (
            <div
              className={`border rounded-3xl overflow-hidden shadow-2xl animate-fade-in transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
              }`}
            >
              {/* Thanh điều hướng xanh lá #00c950 (Chuẩn Ảnh 28.png) */}
              <div className="bg-[#00c950] p-3 sm:p-3.5 flex items-center justify-between text-white shadow-md">
                {/* Nút Play tròn lớn trắng có icon xanh ▶ */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-full bg-white text-[#00c950] hover:bg-white/95 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg font-black"
                  title={isPlaying ? 'Tạm dừng' : 'Phát video câu này'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Bộ điều hướng chuyển câu < 1 / 29 ∨ > */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={goToPrevSentence}
                    disabled={activeSentenceIndex === 0}
                    className="p-1.5 text-white hover:bg-white/20 rounded-xl disabled:opacity-35 cursor-pointer transition-colors"
                    title="Câu trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="relative group">
                    <select
                      value={activeSentenceIndex}
                      onChange={(e) => selectSentenceDirectly(Number(e.target.value))}
                      className="bg-black/20 hover:bg-black/30 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl appearance-none cursor-pointer outline-none pr-7 border border-white/20 transition-colors"
                    >
                      {lessonSentences.map((_, idx) => (
                        <option key={idx} value={idx} className="bg-[#121c2b] text-white">
                          {idx + 1} / {lessonSentences.length}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white absolute right-2 top-2.5 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={goToNextSentence}
                    disabled={activeSentenceIndex === lessonSentences.length - 1}
                    className="p-1.5 text-white hover:bg-white/20 rounded-xl cursor-pointer transition-colors disabled:opacity-35"
                    title={!isDictationPassed ? 'Cần gõ đúng 100% để mở khóa câu sau' : 'Câu tiếp theo'}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Nút tua lại câu ↺ */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoopingSentence(!isLoopingSentence);
                    playFromSentence(activeSentenceIndex);
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isLoopingSentence ? 'bg-white text-[#00c950]' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title="Nghe lại câu này từ đầu"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Khung nhập liệu từ vựng & Cổng kiểm tra */}
              <div className="p-6 space-y-4">
                <DictationWordInputs
                  key={currentSentence.id + currentSentence.text}
                  targetSentence={currentSentence.text}
                  onCheck={handleCheckDictation}
                  onSkip={handleSkipDictation}
                  onPlaySample={() => playSentenceTTS(currentSentence.text)}
                  isChecked={dictationCheckResult !== null}
                />

                {/* THÔNG BÁO CỔNG KIỂM TRA NGHIÊM NGẶT (STRICT GATE RESULT) */}
                {dictationCheckResult && (
                  <div
                    className={`p-5 rounded-2xl border space-y-3 animate-fade-in transition-colors ${
                      isDictationPassed
                        ? isLight
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-emerald-950/40 border-emerald-500/50'
                        : isLight
                        ? 'bg-rose-50 border-rose-300'
                        : 'bg-rose-950/40 border-rose-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-2.5 border-current/15">
                      <span
                        className={`text-xs sm:text-sm font-black flex items-center gap-1.5 ${
                          isDictationPassed ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {isDictationPassed ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" /> Chính xác 100% (Đã mở khóa)!
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5" /> Chưa đạt (Điểm: {dictationCheckResult.accuracy}%)!
                          </>
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={startPlayingCurrentSentence}
                        className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${
                          isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#00c950]" /> Nghe lại
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs font-medium leading-relaxed">
                      <p className="text-[11px] font-bold opacity-75">Câu gốc chuẩn trong video:</p>
                      <p className="text-emerald-500 font-bold text-sm sm:text-base">{currentSentence.text}</p>
                      {currentSentence.vietnameseMeaning && (
                        <>
                          <p className="text-[11px] font-bold opacity-75 pt-1">Bản dịch tiếng Việt:</p>
                          <p className="italic opacity-90">{currentSentence.vietnameseMeaning}</p>
                        </>
                      )}
                    </div>

                    {!isDictationPassed && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-500 flex items-center gap-2">
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>Chỉ khi điền đúng toàn bộ mới được sang câu tiếp theo. Video đang quay lại đầu câu để nghe lại!</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={goToNextSentence}
                      disabled={activeSentenceIndex === lessonSentences.length - 1 || !isDictationPassed}
                      className={`w-full py-3 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                        isDictationPassed
                          ? 'bg-[#00c950] hover:bg-[#00b046]'
                          : 'bg-slate-500/50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {isDictationPassed ? (
                        <>
                          <Unlock className="w-4 h-4" /> Sang câu tiếp theo <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> Khóa câu tiếp theo (Cần điền đúng 100%)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 2: SHADOWING VOICE (Luyện Nhại Giọng Chuẩn IELTS)
              ================================================================ */}
          {activeMode === 'shadowing' && (
            <ShadowingPanel
              sentences={lessonSentences}
              activeSentenceIndex={activeSentenceIndex}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onSelectSentence={selectSentenceDirectly}
              onNextSentence={goToNextSentence}
              onPrevSentence={goToPrevSentence}
              onReplaySentence={(idx) => playFromSentence(idx)}
              onTogglePlay={togglePlay}
              playbackSpeed={playbackSpeed}
              subMode={shadowingSubMode}
              onSubModeChange={setShadowingSubMode}
            />
          )}

          {/* ================================================================
              TAB 3: XẾP TỪ (Word Order Game - Khớp chuẩn 100% Ảnh 29.png)
              ================================================================ */}
          {activeMode === 'xep-tu' && (
            <WordOrderGame
              sentence={currentSentence}
              sentenceIndex={activeSentenceIndex}
              totalSentences={lessonSentences.length}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onPrevSentence={goToPrevSentence}
              onNextSentence={goToNextSentence}
              onSelectSentence={selectSentenceDirectly}
              onReplaySentence={() => playFromSentence(activeSentenceIndex)}
              onCompleteSentence={() => {
                setPassedIndices((prev) => new Set([...prev, activeSentenceIndex]));
              }}
              sentenceList={lessonSentences}
            />
          )}

          {/* ================================================================
              TAB 4: TRANSCRIPT (Lời thoại song ngữ toàn bộ bài học)
              ================================================================ */}
          {activeMode === 'transcript' && (
            <div
              className={`border rounded-3xl p-5 space-y-4 shadow-2xl animate-fade-in transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 text-xs font-bold gap-2 border-current/15">
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as any)}
                    className={`border rounded-xl px-3 py-1.5 outline-none cursor-pointer appearance-none pr-7 font-black text-xs ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#0e1726] text-white border-[#1e2d42]'
                    }`}
                  >
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="English">English</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none opacity-60" />
                </div>

                <span
                  className={`font-black px-3.5 py-1 rounded-xl border ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#0e1726] text-white border-[#1e2d42]'
                  }`}
                >
                  {activeSentenceIndex + 1} / {lessonSentences.length}
                </span>

                <button
                  type="button"
                  onClick={() => setShowTranscriptTranslation(!showTranscriptTranslation)}
                  className={`px-3.5 py-1.5 border rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors font-black text-xs ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-[#0e1726] text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {showTranscriptTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTranscriptTranslation ? 'Ẩn dịch' : 'Hiện dịch'}</span>
                </button>
              </div>

              {/* Scrollable Subtitle Transcript List */}
              <div
                ref={transcriptListRef}
                className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin"
              >
                {lessonSentences.map((s, idx) => {
                  const isActive = idx === activeSentenceIndex;

                  return (
                    <div
                      key={s.id || `sentence-${idx}`}
                      data-active={isActive ? 'true' : 'false'}
                      onClick={() => selectSentenceDirectly(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 text-center ${
                        isActive
                          ? isLight
                            ? 'bg-emerald-50 border-[#00c950] ring-2 ring-[#00c950]/40 shadow-md scale-[1.01]'
                            : 'bg-[#002f1a] border-[#00c950] ring-2 ring-[#00c950]/50 shadow-xl scale-[1.01]'
                          : isLight
                          ? 'bg-slate-50/70 border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                          : 'bg-[#0e1726]/70 border-[#1e2d42] hover:border-slate-600 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <p
                        className={`text-xs sm:text-sm font-black leading-relaxed ${
                          isActive ? 'text-[#00c950]' : isLight ? 'text-slate-800' : 'text-slate-200'
                        }`}
                      >
                        "{s.text}"
                      </p>

                      {showTranscriptTranslation && s.vietnameseMeaning && (
                        <p
                          className={`text-xs leading-relaxed font-semibold ${
                            isActive
                              ? isLight
                                ? 'text-emerald-800'
                                : 'text-emerald-300'
                              : isLight
                              ? 'text-slate-500'
                              : 'text-slate-400'
                          }`}
                        >
                          * "{s.vietnameseMeaning.replace(/^[\*\s"]+/, '').replace(/"$/, '')}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Playback Navigation Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-current/15">
                <button
                  type="button"
                  onClick={goToPrevSentence}
                  disabled={activeSentenceIndex === 0}
                  className="p-2 opacity-60 hover:opacity-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-13 h-13 rounded-full bg-[#00c950] hover:bg-[#00b046] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={goToNextSentence}
                  disabled={activeSentenceIndex === lessonSentences.length - 1}
                  className="p-2 opacity-60 hover:opacity-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 5: QUIZ (Câu hỏi trắc nghiệm thông minh)
              ================================================================ */}
          {activeMode === 'quiz' && (
            <div
              className={`border rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121c2b] border-[#1e2d42] text-white'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-current/15">
                <span className="text-xs font-black uppercase tracking-wider text-[#00c950] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> TRẮC NGHIỆM ĐỌC HIỂU CÂU
                </span>
                <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Câu {activeSentenceIndex + 1} / {lessonSentences.length}
                </span>
              </div>

              {/* Ngữ cảnh câu */}
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1726] border-[#1e2d42]'}`}>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Câu đang học:</p>
                <p className="text-sm font-black text-emerald-500 pt-1">"{currentSentence.text}"</p>
                <p className="text-xs italic text-slate-400 pt-1">Dịch: {currentSentence.vietnameseMeaning}</p>
              </div>

              {/* Câu hỏi trắc nghiệm */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-black">
                  Nghĩa chính xác nhất của câu trên trong ngữ cảnh video là gì?
                </p>

                <div className="space-y-2">
                  {[
                    currentSentence.vietnameseMeaning || 'Ý nghĩa cân bằng tâm trí và thiền định qua việc xếp đá.',
                    'Tôi không thích việc ra ngoài thiên nhiên để xếp đá.',
                    'Xếp đá là một công việc rất mệt mỏi và tốn nhiều công sức.',
                    'Tôi đang dự định mua những viên đá này từ cửa hàng mỹ nghệ.',
                  ].map((option, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrectAnswer = idx === 0;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => !isQuizSubmitted && setSelectedQuizAnswer(idx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-bold flex items-center gap-3 transition-all cursor-pointer ${
                          isQuizSubmitted
                            ? isCorrectAnswer
                              ? 'bg-emerald-500/20 border-[#00c950] text-[#00c950] font-black'
                              : isSelected
                              ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                              : 'opacity-50'
                            : isSelected
                            ? 'bg-emerald-500/15 border-[#00c950] text-[#00c950] ring-2 ring-[#00c950]/30'
                            : isLight
                            ? 'bg-white border-slate-200 hover:border-slate-400 text-slate-800'
                            : 'bg-[#121c2b] border-[#1e2d42] hover:border-slate-500 text-white'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                            isSelected
                              ? 'bg-[#00c950] text-white'
                              : isLight
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-black/30 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Giải thích sau khi nộp */}
              {isQuizSubmitted && (
                <div
                  className={`p-4 rounded-xl border text-xs font-medium space-y-1.5 animate-fade-in ${
                    selectedQuizAnswer === 0
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                      : 'bg-rose-500/10 border-rose-500 text-rose-500'
                  }`}
                >
                  <p className="font-black flex items-center gap-1.5">
                    {selectedQuizAnswer === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {selectedQuizAnswer === 0 ? 'Chính xác! Đáp án A là lựa chọn chuẩn xác.' : 'Chưa đúng! Đáp án đúng là A.'}
                  </p>
                  <p className="text-slate-400 italic">
                    Tác giả Jonna Jinton diễn tả niềm đam mê xếp đá ("balancing stones") như một liệu pháp giúp cân bằng tâm trí giữa thiên nhiên hùng vĩ.
                  </p>
                </div>
              )}

              {/* Nút nộp câu trả lời */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuizSubmitted(true)}
                  disabled={selectedQuizAnswer === null || isQuizSubmitted}
                  className="px-6 py-2.5 bg-[#00c950] hover:bg-[#00b046] disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  Kiểm tra đáp án
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL THÊM VIDEO YOUTUBE */}
      <AddVideoModal
        isOpen={showAddVideoModal}
        onClose={() => setShowAddVideoModal(false)}
      />
    </div>
  );
}

export default function DictationLessonDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-white font-black text-sm">Đang tải bài học Dictation & Shadowing...</div>}>
      <DictationLessonContent />
    </Suspense>
  );
}
