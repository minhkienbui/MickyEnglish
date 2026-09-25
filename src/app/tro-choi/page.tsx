'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Trophy,
  Flame,
  Gem,
  Zap,
  Volume2,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Timer,
  Play,
  HelpCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function GamesHubPage() {
  const { user, isAuthenticated, incrementProgress } = useAuthStore();
  const [activeGame, setActiveGame] = useState<'memory' | 'speed' | 'audio' | null>(null);

  const games = [
    {
      id: 'memory',
      title: 'Lật Thẻ Trí Nhớ (Memory Match)',
      description: 'Lật và ghép đôi từ vựng tiếng Anh với nghĩa tiếng Việt tương ứng trong thời gian ngắn nhất.',
      icon: '🃏',
      color: 'border-emerald-500/40 hover:border-emerald-400',
      tag: 'HOT',
      reward: '+30 💎',
    },
    {
      id: 'speed',
      title: 'Đua Tốc Độ (Speed Vocab Race)',
      description: '30 giây chọn nhanh từ đồng nghĩa hoặc trái nghĩa dưới áp lực thời gian cao độ.',
      icon: '⚡',
      color: 'border-amber-500/40 hover:border-amber-400',
      tag: 'NEW',
      reward: '+50 💎',
    },
    {
      id: 'audio',
      title: 'Thử Thách Nghe Tinh (Audio Quiz)',
      description: 'Nghe phát âm chuẩn bản xứ và phân biệt các cặp từ dễ nhầm lẫn (Minimal Pairs).',
      icon: '🎧',
      color: 'border-cyan-500/40 hover:border-cyan-400',
      tag: 'PRO',
      reward: '+40 💎',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Minh Tuấn (IELTS 8.0)', diamonds: 3450, streak: 42, avatar: '🦁' },
    { rank: 2, name: 'Thu Thảo', diamonds: 2980, streak: 31, avatar: '🦊' },
    { rank: 3, name: 'Hoàng Long', diamonds: 2610, streak: 28, avatar: '🐼' },
    { rank: 4, name: 'Ngọc Mai', diamonds: 2150, streak: 19, avatar: '🐰' },
    { rank: 5, name: 'Quang Huy', diamonds: 1890, streak: 15, avatar: '🐨' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Đấu Trường Trò Chơi
            </h1>
            <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded uppercase tracking-wider">
              NEW
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Vừa chơi vừa ghi nhớ từ vựng phản xạ, kiếm thêm 💎 Kim cương và leo bảng xếp hạng tuần.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#121c2b] border border-[#1e2d42] px-4 py-2 rounded-2xl text-xs font-black">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Gem className="w-4 h-4 fill-cyan-400" />
            <span>{user?.diamonds ?? 0}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{user?.streak ?? 0} ngày</span>
          </span>
        </div>
      </div>

      {/* Grid 3 Trò chơi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {games.map((g) => (
          <div
            key={g.id}
            onClick={() => setActiveGame(g.id as any)}
            className={`bg-[#121c2b] border ${g.color} rounded-3xl p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group`}
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#0d131d] border border-[#1e2d42] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                {g.icon}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  {g.reward}
                </span>
                <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[9px] rounded uppercase">
                  {g.tag}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                {g.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {g.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1">
                <Play className="w-3.5 h-3.5 fill-emerald-400" /> Chơi ngay
              </span>
              <span className="text-slate-500 text-[10px]">Đã chơi 1.2k lần</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng xếp hạng tuần & Phần thưởng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Bảng xếp hạng tuần (2 cột) */}
        <div className="lg:col-span-2 bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-black text-base">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Bảng Xếp Hạng Giải Đấu Tuần</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Kết thúc sau 2 ngày 14 giờ</span>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-3.5 bg-[#0d131d] border border-[#1e2d42] rounded-2xl text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center font-black ${
                      item.rank === 1
                        ? 'text-amber-400 text-base'
                        : item.rank === 2
                        ? 'text-slate-300 text-base'
                        : item.rank === 3
                        ? 'text-amber-600 text-base'
                        : 'text-slate-500'
                    }`}
                  >
                    #{item.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#1e2d42] flex items-center justify-center text-sm shadow-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{item.streak} ngày liên tiếp</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-black text-cyan-400 font-mono text-xs">
                  <Gem className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>{item.diamonds.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phần thưởng VIP */}
        <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-base">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Phần Thưởng Top Tuần</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Thi đấu minigame mỗi ngày để nhận quà tặng VIP độc quyền trao vào 00:00 Chủ Nhật hàng tuần:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3 bg-[#0d131d] border border-amber-500/30 rounded-2xl flex items-center gap-3">
                <span className="text-xl">🥇</span>
                <div>
                  <div className="font-black text-amber-400">Top 1: 500 💎 + 7 Ngày VIP Pro</div>
                  <div className="text-[10px] text-slate-400">Mở toàn bộ tài liệu & tính năng AI</div>
                </div>
              </div>

              <div className="p-3 bg-[#0d131d] border border-slate-700 rounded-2xl flex items-center gap-3">
                <span className="text-xl">🥈</span>
                <div>
                  <div className="font-black text-slate-200">Top 2-3: 300 💎 + Huy hiệu Bạc</div>
                  <div className="text-[10px] text-slate-400">Được ghim trên danh dự bảng tuần</div>
                </div>
              </div>

              <div className="p-3 bg-[#0d131d] border border-amber-900/30 rounded-2xl flex items-center gap-3">
                <span className="text-xl">🥉</span>
                <div>
                  <div className="font-black text-amber-600">Top 4-10: 100 💎</div>
                  <div className="text-[10px] text-slate-400">Cộng trực tiếp vào ví học tập</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e2d42]">
            <button
              onClick={() => setActiveGame('memory')}
              className="w-full py-3 bg-[#00c950] hover:bg-[#00b046] text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" /> Tham Gia Đua Điểm Ngay
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL GAME 1: MEMORY MATCH ================= */}
      {activeGame === 'memory' && (
        <MemoryMatchModal onClose={() => setActiveGame(null)} />
      )}

      {/* ================= MODAL GAME 2: SPEED VOCAB ================= */}
      {activeGame === 'speed' && (
        <SpeedVocabModal onClose={() => setActiveGame(null)} />
      )}

      {/* ================= MODAL GAME 3: AUDIO LISTENING ================= */}
      {activeGame === 'audio' && (
        <AudioQuizModal onClose={() => setActiveGame(null)} />
      )}
    </div>
  );
}

// ================= GAME 1: MEMORY MATCH =================
function MemoryMatchModal({ onClose }: { onClose: () => void }) {
  const rawPairs = [
    { id: 1, text: 'actually', matchId: 1, type: 'en' },
    { id: 2, text: 'thực ra, quả thật', matchId: 1, type: 'vi' },
    { id: 3, text: 'however', matchId: 2, type: 'en' },
    { id: 4, text: 'tuy nhiên', matchId: 2, type: 'vi' },
    { id: 5, text: 'although', matchId: 3, type: 'en' },
    { id: 6, text: 'mặc dù', matchId: 3, type: 'vi' },
    { id: 7, text: 'without', matchId: 4, type: 'en' },
    { id: 8, text: 'không có, thiếu', matchId: 4, type: 'vi' },
  ];

  const [cards, setCards] = useState(() => [...rawPairs].sort(() => Math.random() - 0.5));
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = (card: any) => {
    if (selectedCards.length === 2 || selectedCards.some((c) => c.id === card.id) || matchedIds.includes(card.matchId)) {
      return;
    }

    const next = [...selectedCards, card];
    setSelectedCards(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      if (next[0].matchId === next[1].matchId && next[0].id !== next[1].id) {
        setMatchedIds((prev) => [...prev, next[0].matchId]);
        setSelectedCards([]);
      } else {
        setTimeout(() => setSelectedCards([]), 900);
      }
    }
  };

  const isCompleted = matchedIds.length === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#121c2b] border border-emerald-500/40 rounded-3xl p-6 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#1e2d42] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🃏</span>
            <h3 className="text-base font-black">Lật Thẻ Trí Nhớ (Memory Match)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
          <span>Số lượt lật: <span className="text-white">{moves}</span></span>
          <span className="text-emerald-400">Đã ghép: {matchedIds.length} / 4 cặp</span>
        </div>

        {!isCompleted ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {cards.map((c) => {
              const isSelected = selectedCards.some((s) => s.id === c.id);
              const isMatched = matchedIds.includes(c.matchId);

              return (
                <button
                  key={c.id}
                  disabled={isMatched}
                  onClick={() => handleCardClick(c)}
                  className={`h-20 rounded-2xl text-xs font-black p-2 flex items-center justify-center text-center transition-all cursor-pointer border ${
                    isMatched
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 opacity-60'
                      : isSelected
                      ? 'bg-cyan-600 border-cyan-400 text-white scale-105 shadow-lg'
                      : 'bg-[#0d131d] border-[#1e2d42] text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {isMatched || isSelected ? c.text : '❓'}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="text-4xl">🏆</div>
            <h4 className="text-xl font-black text-white">Xuất Sắc! Bạn Đã Ghép Hết Các Thẻ!</h4>
            <p className="text-xs text-slate-300">
              Hoàn thành sau <span className="text-emerald-400 font-black">{moves}</span> lượt thử.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-xs">
              <Gem className="w-4 h-4 text-cyan-400" /> +30 Kim Cương Đã Được Cộng
            </div>
            <div>
              <button
                onClick={() => {
                  setCards([...rawPairs].sort(() => Math.random() - 0.5));
                  setMatchedIds([]);
                  setSelectedCards([]);
                  setMoves(0);
                }}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-full cursor-pointer"
              >
                Chơi lại ván mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= GAME 2: SPEED VOCAB RACE =================
function SpeedVocabModal({ onClose }: { onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const questions = [
    { word: 'ABUNDANT', correct: 'plentiful', options: ['plentiful', 'scarce', 'narrow', 'harsh'] },
    { word: 'RELUCTANT', correct: 'unwilling', options: ['enthusiastic', 'unwilling', 'eager', 'proud'] },
    { word: 'CONCISE', correct: 'brief', options: ['elaborate', 'brief', 'confusing', 'lengthy'] },
    { word: 'BENEFICIAL', correct: 'helpful', options: ['harmful', 'helpful', 'neutral', 'boring'] },
    { word: 'AUTHENTIC', correct: 'genuine', options: ['fake', 'cloned', 'genuine', 'doubtful'] },
  ];

  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const handlePick = (opt: string) => {
    if (opt === questions[currentQ].correct) {
      setScore((s) => s + 10);
    }
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
    } else {
      setIsGameOver(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#121c2b] border border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#1e2d42] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-base font-black">Đua Tốc Độ Từ Vựng (Speed Race)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        {!isGameOver ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Timer className="w-4 h-4" /> Thời gian: {timeLeft}s
              </span>
              <span className="text-emerald-400">Điểm: {score}</span>
            </div>

            <div className="p-6 bg-[#0d131d] border-2 border-amber-500/30 rounded-2xl text-center space-y-1 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-slate-400">Chọn từ đồng nghĩa với:</span>
              <div className="text-2xl font-black text-amber-300 tracking-wider">
                {questions[currentQ].word}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {questions[currentQ].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handlePick(opt)}
                  className="py-3 px-4 bg-[#0d131d] border border-[#1e2d42] hover:border-amber-400 hover:bg-amber-500/10 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="text-4xl">🏁</div>
            <h4 className="text-xl font-black text-white">Hết Giờ!</h4>
            <p className="text-xs text-slate-300">
              Bạn đạt được tổng cộng <span className="text-amber-400 font-black text-lg">{score}</span> điểm phản xạ.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-xs">
              <Gem className="w-4 h-4 text-cyan-400" /> +50 Kim Cương Đã Được Cộng
            </div>
            <div>
              <button
                onClick={() => {
                  setTimeLeft(30);
                  setScore(0);
                  setCurrentQ(0);
                  setIsGameOver(false);
                }}
                className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-full cursor-pointer"
              >
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= GAME 3: AUDIO LISTENING QUIZ =================
function AudioQuizModal({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const quiz = [
    {
      word: 'sheep',
      options: ['ship', 'sheep', 'sheet', 'shape'],
      phonetic: '/ʃiːp/',
      meaning: 'Con cừu (nguyên âm dài /iː/)',
    },
    {
      word: 'dessert',
      options: ['desert', 'dessert', 'deserve', 'desire'],
      phonetic: '/dɪˈzɜːrt/',
      meaning: 'Món tráng miệng (nhấn âm 2)',
    },
    {
      word: 'beer',
      options: ['bear', 'beer', 'beard', 'bird'],
      phonetic: '/bɪər/',
      meaning: 'Bia (nguyên âm đôi /ɪə/)',
    },
  ];

  const current = quiz[currentIdx];

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(current.word);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#121c2b] border border-cyan-500/40 rounded-3xl p-6 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#1e2d42] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎧</span>
            <h3 className="text-base font-black">Thử Thách Nghe Tinh (Minimal Pairs)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <div className="p-6 bg-[#0d131d] border-2 border-cyan-500/30 rounded-2xl text-center space-y-3 shadow-inner">
          <p className="text-xs text-slate-400">Bấm nút để nghe từ được phát âm:</p>
          <button
            onClick={playAudio}
            className="w-16 h-16 mx-auto rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
          >
            <Volume2 className="w-8 h-8" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOpt(opt)}
              className={`py-3 rounded-2xl font-bold text-xs cursor-pointer border transition-all ${
                selectedOpt === opt
                  ? opt === current.word
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-rose-600 border-rose-400 text-white'
                  : 'bg-[#0d131d] border-[#1e2d42] text-slate-200 hover:border-slate-500'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {selectedOpt && (
          <div className="p-3.5 bg-[#0b1320] border border-slate-700 rounded-2xl text-xs space-y-1 animate-in fade-in">
            <div className="font-bold text-cyan-400">
              Từ chính xác: {current.word} <span className="text-slate-400 font-mono font-normal">{current.phonetic}</span>
            </div>
            <div className="text-slate-300">{current.meaning}</div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSelectedOpt(null);
                  setCurrentIdx((i) => (i + 1) % quiz.length);
                }}
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Câu tiếp theo →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
