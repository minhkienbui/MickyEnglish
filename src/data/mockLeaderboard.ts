export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  badge?: string;
  roleTitle?: string;
  level: string; // "C2", "C1", "B2", "B1", "A2"
  streak: number;
  schoolOrOrg?: string;
  xp: {
    weekly: number;
    monthly: number;
    allTime: number;
  };
  studyTimeMinutes: {
    weekly: number;
    monthly: number;
    allTime: number;
  };
  wordsLearned: number;
  isCurrentUser?: boolean;
}

export interface MilestoneQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetType: 'xp' | 'time' | 'streak' | 'exams';
  targetValue: number;
  unit: string;
  rewardDiamonds: number;
  rewardXp?: number;
}

export const weeklyMilestones: MilestoneQuest[] = [
  {
    id: 'm-xp-300',
    title: 'Khởi Động Năng Lượng',
    description: 'Tích lũy 300 XP qua các bài luyện nghe, từ vựng hoặc trò chơi trong tuần.',
    icon: '⚡',
    targetType: 'xp',
    targetValue: 300,
    unit: 'XP',
    rewardDiamonds: 25,
    rewardXp: 30,
  },
  {
    id: 'm-time-60',
    title: 'Luyện Nghe Bền Bỉ',
    description: 'Học tối thiểu 60 phút Dictation hoặc Shadowing trong tuần.',
    icon: '🎧',
    targetType: 'time',
    targetValue: 60,
    unit: 'phút',
    rewardDiamonds: 40,
    rewardXp: 50,
  },
  {
    id: 'm-streak-5',
    title: 'Giữ Lửa Đam Mê',
    description: 'Duy trì chuỗi học tập (Streak) từ 5 ngày liên tiếp trở lên.',
    icon: '🔥',
    targetType: 'streak',
    targetValue: 5,
    unit: 'ngày',
    rewardDiamonds: 50,
    rewardXp: 75,
  },
  {
    id: 'm-xp-1000',
    title: 'Bứt Phá Giới Hạn',
    description: 'Chinh phục cột mốc 1.000 XP tuần để vươn lên nhóm dẫn đầu.',
    icon: '🚀',
    targetType: 'xp',
    targetValue: 1000,
    unit: 'XP',
    rewardDiamonds: 80,
    rewardXp: 120,
  },
];

export const mockLeaderboardUsers: LeaderboardUser[] = [
  {
    id: 'user-top-1',
    rank: 1,
    name: 'Đặng Mai Phương',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    badge: '👑 Quán Quân Tuần',
    roleTitle: 'Học viên Xuất sắc',
    level: 'C1',
    streak: 42,
    schoolOrOrg: 'ĐH Ngoại Thương Hà Nội',
    xp: {
      weekly: 2850,
      monthly: 9420,
      allTime: 34500,
    },
    studyTimeMinutes: {
      weekly: 410,
      monthly: 1450,
      allTime: 5200,
    },
    wordsLearned: 1420,
  },
  {
    id: 'user-top-2',
    rank: 2,
    name: 'Nguyễn Thành Nam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    badge: '🥈 Á Quân Bứt Phá',
    roleTitle: 'Chiến Thần Chăm Chỉ',
    level: 'C1',
    streak: 35,
    schoolOrOrg: 'ĐH Bách Khoa TP.HCM',
    xp: {
      weekly: 2420,
      monthly: 8890,
      allTime: 31200,
    },
    studyTimeMinutes: {
      weekly: 365,
      monthly: 1320,
      allTime: 4890,
    },
    wordsLearned: 1280,
  },
  {
    id: 'user-top-3',
    rank: 3,
    name: 'Lê Hoàng Yến',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    badge: '🥉 Quý Quân Siêu Đẳng',
    roleTitle: 'Cao Thủ Nghe Nói',
    level: 'B2',
    streak: 28,
    schoolOrOrg: 'ĐH Sư Phạm Hà Nội',
    xp: {
      weekly: 2190,
      monthly: 8120,
      allTime: 27800,
    },
    studyTimeMinutes: {
      weekly: 320,
      monthly: 1190,
      allTime: 4250,
    },
    wordsLearned: 1150,
  },
  {
    id: 'user-top-4',
    rank: 4,
    name: 'Trần Quốc Bảo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    badge: 'Top 10 Tinh Anh',
    roleTitle: 'IELTS Chinh Phục',
    level: 'B2',
    streak: 24,
    schoolOrOrg: 'ĐH Kinh Tế Quốc Dân',
    xp: {
      weekly: 1850,
      monthly: 6940,
      allTime: 23400,
    },
    studyTimeMinutes: {
      weekly: 280,
      monthly: 1040,
      allTime: 3820,
    },
    wordsLearned: 980,
  },
  {
    id: 'user-top-5',
    rank: 5,
    name: 'Vũ Thị Minh Anh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    badge: 'Top 10 Tinh Anh',
    roleTitle: 'Chuyên Gia Từ Vựng',
    level: 'B2',
    streak: 19,
    schoolOrOrg: 'ĐH FPT',
    xp: {
      weekly: 1680,
      monthly: 6420,
      allTime: 21500,
    },
    studyTimeMinutes: {
      weekly: 255,
      monthly: 980,
      allTime: 3410,
    },
    wordsLearned: 920,
  },
  {
    id: 'user-top-6',
    rank: 6,
    name: 'Phạm Đức Huy',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    badge: 'Học Viên Tích Cực',
    roleTitle: 'Chiến Binh Shadowing',
    level: 'B1',
    streak: 15,
    schoolOrOrg: 'Kỹ sư Viettel',
    xp: {
      weekly: 1490,
      monthly: 5780,
      allTime: 18900,
    },
    studyTimeMinutes: {
      weekly: 225,
      monthly: 860,
      allTime: 3100,
    },
    wordsLearned: 810,
  },
  {
    id: 'user-top-7',
    rank: 7,
    name: 'Bùi Thảo My',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    badge: 'Học Viên Tích Cực',
    roleTitle: 'Học Viên Chăm Chỉ',
    level: 'B1',
    streak: 14,
    schoolOrOrg: 'ĐH Hà Nội (HANU)',
    xp: {
      weekly: 1350,
      monthly: 5240,
      allTime: 17200,
    },
    studyTimeMinutes: {
      weekly: 210,
      monthly: 810,
      allTime: 2850,
    },
    wordsLearned: 750,
  },
  {
    id: 'user-top-8',
    rank: 8,
    name: 'Đỗ Tiến Đạt',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    badge: 'Học Viên Tích Cực',
    roleTitle: 'Học Viên Năng Nổ',
    level: 'B1',
    streak: 12,
    schoolOrOrg: 'ĐH Giao Thông Vận Tải',
    xp: {
      weekly: 1210,
      monthly: 4890,
      allTime: 15900,
    },
    studyTimeMinutes: {
      weekly: 190,
      monthly: 740,
      allTime: 2620,
    },
    wordsLearned: 690,
  },
  {
    id: 'user-top-9',
    rank: 9,
    name: 'Ngô Khánh Linh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    badge: 'Học Viên Tích Cực',
    roleTitle: 'Chiến Thần Dictation',
    level: 'A2',
    streak: 10,
    schoolOrOrg: 'ĐH Khoa Học Tự Nhiên',
    xp: {
      weekly: 1080,
      monthly: 4320,
      allTime: 14300,
    },
    studyTimeMinutes: {
      weekly: 175,
      monthly: 690,
      allTime: 2410,
    },
    wordsLearned: 620,
  },
  {
    id: 'user-top-10',
    rank: 10,
    name: 'Hoàng Văn Tuấn',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    badge: 'Học Viên Tích Cực',
    roleTitle: 'Học Viên Mới Bứt Phá',
    level: 'A2',
    streak: 9,
    schoolOrOrg: 'Học Viện Tài Chính',
    xp: {
      weekly: 950,
      monthly: 3950,
      allTime: 12800,
    },
    studyTimeMinutes: {
      weekly: 155,
      monthly: 630,
      allTime: 2180,
    },
    wordsLearned: 560,
  },
];
