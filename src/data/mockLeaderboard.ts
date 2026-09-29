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

export const mockLeaderboardUsers: LeaderboardUser[] = [];

