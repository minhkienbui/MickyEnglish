import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, VideoLevel, VideoStatus } from '@/lib/types';

// ==========================================
// 1. Interfaces & Types
// ==========================================

export interface AdminUserItem {
  id: string;
  name: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  diamonds: number;
  streak: number;
  provider: 'email' | 'google';
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  lastLogin: string;
  lastIp: string;
  studiedVideosCount?: number;
  totalDictationMinutes?: number;
}

export interface DiamondTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number; // positive = add, negative = deduct
  reason: string;
  actionType: string;
  performedBy: string;
  createdAt: string;
}

export interface DiamondRewardConfig {
  id: string;
  action: string;
  rewardAmount: number;
  isEnabled: boolean;
}

export interface AdminTagItem {
  id: string;
  name: string;
  slug: string;
  videoCount: number;
  bgColor: string;
  textColor: string;
  icon?: string;
  order: number;
  isVisible: boolean;
}

export interface AdminCommentItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  videoId: string;
  videoTitle: string;
  content: string;
  status: 'pending' | 'approved' | 'hidden' | 'spam';
  reportCount: number;
  createdAt: string;
}

export interface AdminNotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'promo' | 'maintenance' | 'feature';
  link?: string;
  targetType: 'all' | 'group' | 'specific';
  targetGroup?: string;
  targetUserIds?: string[];
  sentCount: number;
  readCount: number;
  createdAt: string;
  scheduledAt?: string;
  status: 'sent' | 'scheduled' | 'draft';
}

export interface AdminLogItem {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'video' | 'user' | 'comment' | 'diamond' | 'setting' | 'tag' | 'auth';
  targetId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  timestamp: string;
}

export interface SystemSettings {
  appName: string;
  appLogo: string;
  favicon: string;
  seoDescription: string;
  seoKeywords: string;
  contactEmail: string;
  socialLinks: { facebook?: string; youtube?: string; tiktok?: string };
  defaultRegisterDiamonds: number;
  defaultPlaybackRate: number;
  defaultTranslateLang: string;
  enableDictation: boolean;
  enableShadowing: boolean;
  enableAIVoice: boolean;
  maxSentencesPerVideo: number;
  adminEmails: string[];
  sessionTimeoutHours: number;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  bannedIps: string[];
  bannedKeywords: string[];
  commentAutoApproval: boolean;
  commentReportThreshold: number;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  googleClientId: string;
  googleClientSecret: string;
  youtubeApiKey: string;
  openAiApiKey: string;
}

// ==========================================
// 2. Initial Mock Data
// ==========================================

const INITIAL_USERS: AdminUserItem[] = [
  {
    id: 'user-1',
    name: 'Bùi Minh Kiên',
    fullName: 'Bùi Minh Kiên',
    username: 'kienbui',
    email: 'kienbui@mickyenglish.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    diamonds: 9999,
    streak: 15,
    provider: 'email',
    isVerified: true,
    isBanned: false,
    createdAt: '2024-01-10T08:00:00.000Z',
    lastLogin: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastIp: '192.168.1.247',
    studiedVideosCount: 24,
    totalDictationMinutes: 180,
  },
  {
    id: 'user-2',
    name: 'Nguyễn Văn Học',
    fullName: 'Nguyễn Văn Học',
    username: 'nguyenvanhoc',
    email: 'vanhoc.english@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    diamonds: 350,
    streak: 7,
    provider: 'google',
    isVerified: true,
    isBanned: false,
    createdAt: '2024-02-01T10:30:00.000Z',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    lastIp: '113.190.23.45',
    studiedVideosCount: 12,
    totalDictationMinutes: 95,
  },
  {
    id: 'user-3',
    name: 'Trần Thị Mai',
    fullName: 'Trần Thị Mai',
    username: 'maitran99',
    email: 'maitran.ielts@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    diamonds: 520,
    streak: 21,
    provider: 'email',
    isVerified: true,
    isBanned: false,
    createdAt: '2024-02-15T14:20:00.000Z',
    lastLogin: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    lastIp: '27.72.105.12',
    studiedVideosCount: 38,
    totalDictationMinutes: 240,
  },
  {
    id: 'user-4',
    name: 'Lê Hoàng Nam',
    fullName: 'Lê Hoàng Nam',
    username: 'namle_toeic',
    email: 'namle.toeic@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    diamonds: 80,
    streak: 2,
    provider: 'google',
    isVerified: false,
    isBanned: false,
    createdAt: '2024-03-01T09:15:00.000Z',
    lastLogin: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    lastIp: '14.232.88.90',
    studiedVideosCount: 5,
    totalDictationMinutes: 30,
  },
  {
    id: 'user-5',
    name: 'Phạm Thu Trang',
    fullName: 'Phạm Thu Trang',
    username: 'trangpham',
    email: 'trangpham.spam@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    diamonds: 0,
    streak: 0,
    provider: 'email',
    isVerified: true,
    isBanned: true,
    createdAt: '2024-03-05T16:45:00.000Z',
    lastLogin: '2024-03-10T11:00:00.000Z',
    lastIp: '42.118.12.99',
    studiedVideosCount: 0,
    totalDictationMinutes: 0,
  },
];

const INITIAL_REWARDS: DiamondRewardConfig[] = [
  { id: '1', action: 'Đăng ký tài khoản mới', rewardAmount: 100, isEnabled: true },
  { id: '2', action: 'Đăng nhập hàng ngày', rewardAmount: 10, isEnabled: true },
  { id: '3', action: 'Hoàn thành 1 video Dictation/Shadowing', rewardAmount: 50, isEnabled: true },
  { id: '4', action: 'Duy trì chuỗi Streak 7 ngày', rewardAmount: 200, isEnabled: true },
  { id: '5', action: 'Thêm video mới (User tự upload)', rewardAmount: -100, isEnabled: false },
  { id: '6', action: 'Mở khóa video Premium VIP', rewardAmount: -150, isEnabled: true },
];

const INITIAL_TAGS: AdminTagItem[] = [
  { id: 't-1', name: '# Youtube video', slug: 'youtube-video', videoCount: 45, bgColor: '#1e3a8a', textColor: '#93c5fd', order: 1, isVisible: true },
  { id: 't-2', name: '# BBC learning english', slug: 'bbc-learning-english', videoCount: 28, bgColor: '#831843', textColor: '#fbcfe8', order: 2, isVisible: true },
  { id: 't-3', name: '# TED Talks', slug: 'ted-talks', videoCount: 16, bgColor: '#7f1d1d', textColor: '#fca5a5', order: 3, isVisible: true },
  { id: 't-4', name: '# IELTS Listening', slug: 'ielts-listening', videoCount: 22, bgColor: '#14532d', textColor: '#86efac', order: 4, isVisible: true },
  { id: 't-5', name: '# Short Movie', slug: 'short-movie', videoCount: 14, bgColor: '#581c87', textColor: '#d8b4fe', order: 5, isVisible: true },
  { id: 't-6', name: '# Daily Conversation', slug: 'daily-conversation', videoCount: 19, bgColor: '#78350f', textColor: '#fde68a', order: 6, isVisible: true },
];

const INITIAL_COMMENTS: AdminCommentItem[] = [
  {
    id: 'c-1',
    userId: 'user-2',
    userName: 'Nguyễn Văn Học',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    videoId: 'lesson-1',
    videoTitle: 'Inside Edition - Japanese Leaf Carving',
    content: 'Bài nghe này phát âm rất chuẩn, tốc độ 75% nghe rất rõ từng từ!',
    status: 'approved',
    reportCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'c-2',
    userId: 'user-3',
    userName: 'Trần Thị Mai',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    videoId: 'lesson-2',
    videoTitle: 'BBC 6 Minute English - The power of silence',
    content: 'Có ai giải thích giúp mình câu số 4 không ạ? Cảm ơn nhiều.',
    status: 'pending',
    reportCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'c-3',
    userId: 'user-5',
    userName: 'Phạm Thu Trang',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    videoId: 'lesson-1',
    videoTitle: 'Inside Edition - Japanese Leaf Carving',
    content: 'Bấm vào link này nhận 1000 kim cương miễn phí ngay: bit.ly/spam-link',
    status: 'spam',
    reportCount: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Chào mừng bản cập nhật Micky English 2.0 ✨',
    content: 'Hệ thống đã nâng cấp toàn diện tính năng Shadowing & Dictation chuẩn quốc tế.',
    type: 'feature',
    link: '/dictation-shadowing',
    targetType: 'all',
    sentCount: 1234,
    readCount: 890,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'sent',
  },
  {
    id: 'notif-2',
    title: '🎁 Tặng 100 Đá Quý nhân dịp cuối tuần!',
    content: 'Đăng nhập và hoàn thành ít nhất 1 bài Shadowing để nhận thưởng ngay.',
    type: 'promo',
    link: '/tuvung',
    targetType: 'all',
    sentCount: 1234,
    readCount: 654,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'sent',
  },
];

const INITIAL_LOGS: AdminLogItem[] = [
  {
    id: 'log-1',
    adminId: 'admin-root-01',
    adminName: 'Quản Trị Viên (Admin)',
    action: 'video.publish',
    targetType: 'video',
    targetId: 'lesson-1',
    newValue: { status: 'published', title: 'Japanese Leaf Carving' },
    ipAddress: '192.168.1.247',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'log-2',
    adminId: 'admin-root-01',
    adminName: 'Quản Trị Viên (Admin)',
    action: 'user.ban',
    targetType: 'user',
    targetId: 'user-5',
    oldValue: { isBanned: false },
    newValue: { isBanned: true, reason: 'Spam liên kết độc hại' },
    ipAddress: '192.168.1.247',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'log-3',
    adminId: 'admin-root-01',
    adminName: 'Quản Trị Viên (Admin)',
    action: 'diamond.grant',
    targetType: 'diamond',
    targetId: 'user-3',
    newValue: { amount: 200, reason: 'Thưởng học viên chăm chỉ' },
    ipAddress: '192.168.1.247',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

const INITIAL_SETTINGS: SystemSettings = {
  appName: 'Micky English',
  appLogo: '/logo.png',
  favicon: '/favicon.ico',
  seoDescription: 'Nền tảng học tiếng Anh trực tuyến, luyện nghe chép chính tả (Dictation) và Shadowing số 1 Việt Nam.',
  seoKeywords: 'học tiếng anh, dictation, shadowing, từ vựng oxford, luyện thi toeic, ielts',
  contactEmail: 'support@mickyenglish.com',
  socialLinks: { facebook: 'https://facebook.com/mickyenglish', youtube: 'https://youtube.com/@mickyenglish' },
  defaultRegisterDiamonds: 100,
  defaultPlaybackRate: 100,
  defaultTranslateLang: 'vi',
  enableDictation: true,
  enableShadowing: true,
  enableAIVoice: true,
  maxSentencesPerVideo: 100,
  adminEmails: ['admin@mickyenglish.com', 'kienbui@gmail.com', 'admin@gmail.com'],
  sessionTimeoutHours: 720, // 30 days
  allowRegistration: true,
  requireEmailVerification: false,
  bannedIps: ['192.0.2.1'],
  bannedKeywords: ['spam', 'hack', 'lua dao', 'bit.ly', 'kiem tien online'],
  commentAutoApproval: true,
  commentReportThreshold: 3,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: 'noreply@mickyenglish.com',
  googleClientId: 'google-oauth-client-id-sample',
  googleClientSecret: 'google-oauth-client-secret-sample',
  youtubeApiKey: 'youtube-api-key-sample',
  openAiApiKey: 'openai-api-key-sample',
};

// ==========================================
// 3. Zustand Admin Store
// ==========================================

interface AdminState {
  users: AdminUserItem[];
  rewards: DiamondRewardConfig[];
  diamondTransactions: DiamondTransaction[];
  tags: AdminTagItem[];
  comments: AdminCommentItem[];
  notifications: AdminNotificationItem[];
  logs: AdminLogItem[];
  settings: SystemSettings;

  // Actions - Users
  updateUser: (id: string, data: Partial<AdminUserItem>) => void;
  toggleUserRole: (id: string) => void;
  toggleUserBan: (id: string, reason?: string) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string, newPass: string) => void;
  adjustUserDiamonds: (userId: string, amount: number, reason: string) => void;
  resetUserStreak: (userId: string) => void;

  // Actions - Diamonds
  updateRewardConfig: (id: string, data: Partial<DiamondRewardConfig>) => void;
  bulkAdjustDiamonds: (filterGroup: string, amount: number, reason: string) => void;

  // Actions - Tags
  addTag: (tag: Omit<AdminTagItem, 'id' | 'videoCount'>) => void;
  updateTag: (id: string, data: Partial<AdminTagItem>) => void;
  deleteTag: (id: string) => void;

  // Actions - Comments
  updateCommentStatus: (id: string, status: AdminCommentItem['status']) => void;
  deleteComment: (id: string) => void;

  // Actions - Notifications
  createNotification: (notif: Omit<AdminNotificationItem, 'id' | 'createdAt' | 'sentCount' | 'readCount'>) => void;
  deleteNotification: (id: string) => void;

  // Actions - Logs
  addLog: (log: Omit<AdminLogItem, 'id' | 'timestamp'>) => void;

  // Actions - Settings
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      rewards: INITIAL_REWARDS,
      diamondTransactions: [
        {
          id: 'dt-1',
          userId: 'user-3',
          userName: 'Trần Thị Mai',
          amount: 200,
          reason: 'Thưởng học viên đạt chuỗi 21 ngày streak',
          actionType: 'admin_grant',
          performedBy: 'admin',
          createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        },
      ],
      tags: INITIAL_TAGS,
      comments: INITIAL_COMMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      logs: INITIAL_LOGS,
      settings: INITIAL_SETTINGS,

      // Users Actions
      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        }));
        get().addLog({
          adminId: 'admin-root',
          adminName: 'Quản Trị Viên',
          action: 'user.update',
          targetType: 'user',
          targetId: id,
          newValue: data,
          ipAddress: '192.168.1.247',
        });
      },

      toggleUserRole: (id) => {
        const u = get().users.find((x) => x.id === id);
        if (!u) return;
        const newRole: UserRole = u.role === 'admin' ? 'user' : 'admin';
        set((state) => ({
          users: state.users.map((x) => (x.id === id ? { ...x, role: newRole } : x)),
        }));
        get().addLog({
          adminId: 'admin-root',
          adminName: 'Quản Trị Viên',
          action: 'user.role_change',
          targetType: 'user',
          targetId: id,
          oldValue: { role: u.role },
          newValue: { role: newRole },
          ipAddress: '192.168.1.247',
        });
      },

      toggleUserBan: (id, reason) => {
        const u = get().users.find((x) => x.id === id);
        if (!u) return;
        const newBan = !u.isBanned;
        set((state) => ({
          users: state.users.map((x) => (x.id === id ? { ...x, isBanned: newBan } : x)),
        }));
        get().addLog({
          adminId: 'admin-root',
          adminName: 'Quản Trị Viên',
          action: newBan ? 'user.ban' : 'user.unban',
          targetType: 'user',
          targetId: id,
          newValue: { isBanned: newBan, reason },
          ipAddress: '192.168.1.247',
        });
      },

      deleteUser: (id) => {
        const u = get().users.find((x) => x.id === id);
        set((state) => ({
          users: state.users.filter((x) => x.id !== id),
        }));
        if (u) {
          get().addLog({
            adminId: 'admin-root',
            adminName: 'Quản Trị Viên',
            action: 'user.delete',
            targetType: 'user',
            targetId: id,
            oldValue: u,
            ipAddress: '192.168.1.247',
          });
        }
      },

      resetUserPassword: (id, _newPass) => {
        get().addLog({
          adminId: 'admin-root',
          adminName: 'Quản Trị Viên',
          action: 'user.password_reset',
          targetType: 'user',
          targetId: id,
          ipAddress: '192.168.1.247',
        });
      },

      adjustUserDiamonds: (userId, amount, reason) => {
        const u = get().users.find((x) => x.id === userId);
        if (!u) return;
        const newBalance = Math.max(0, u.diamonds + amount);
        set((state) => ({
          users: state.users.map((x) => (x.id === userId ? { ...x, diamonds: newBalance } : x)),
          diamondTransactions: [
            {
              id: `dt-${Date.now()}`,
              userId,
              userName: u.fullName,
              amount,
              reason,
              actionType: amount > 0 ? 'admin_grant' : 'admin_deduct',
              performedBy: 'admin',
              createdAt: new Date().toISOString(),
            },
            ...state.diamondTransactions,
          ],
        }));
        get().addLog({
          adminId: 'admin-root',
          adminName: 'Quản Trị Viên',
          action: 'diamond.adjust',
          targetType: 'diamond',
          targetId: userId,
          newValue: { amount, reason, newBalance },
          ipAddress: '192.168.1.247',
        });
      },

      resetUserStreak: (userId) => {
        set((state) => ({
          users: state.users.map((x) => (x.id === userId ? { ...x, streak: 0 } : x)),
        }));
      },

      // Diamond Configs
      updateRewardConfig: (id, data) => {
        set((state) => ({
          rewards: state.rewards.map((r) => (r.id === id ? { ...r, ...data } : r)),
        }));
      },

      bulkAdjustDiamonds: (filterGroup, amount, reason) => {
        set((state) => {
          let targets = state.users;
          if (filterGroup === 'active') {
            targets = targets.filter((u) => !u.isBanned && u.streak > 0);
          } else if (filterGroup === 'admin') {
            targets = targets.filter((u) => u.role === 'admin');
          }
          const targetIds = targets.map((t) => t.id);

          const updatedUsers = state.users.map((u) =>
            targetIds.includes(u.id) ? { ...u, diamonds: Math.max(0, u.diamonds + amount) } : u
          );

          const newTxs: DiamondTransaction[] = targets.map((t) => ({
            id: `dt-bulk-${Date.now()}-${t.id}`,
            userId: t.id,
            userName: t.fullName,
            amount,
            reason: `[Hàng loạt] ${reason}`,
            actionType: 'bulk_adjustment',
            performedBy: 'admin',
            createdAt: new Date().toISOString(),
          }));

          return {
            users: updatedUsers,
            diamondTransactions: [...newTxs, ...state.diamondTransactions],
          };
        });

        get().addLog({
          adminId: 'admin-root',
          adminName: 'Quản Trị Viên',
          action: 'diamond.bulk_adjust',
          targetType: 'diamond',
          targetId: filterGroup,
          newValue: { amount, reason, filterGroup },
          ipAddress: '192.168.1.247',
        });
      },

      // Tags Actions
      addTag: (tagData) => {
        const newTag: AdminTagItem = {
          ...tagData,
          id: `t-${Date.now()}`,
          videoCount: 0,
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
      },

      updateTag: (id, data) => {
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
      },

      deleteTag: (id) => {
        set((state) => ({ tags: state.tags.filter((t) => t.id !== id) }));
      },

      // Comments Actions
      updateCommentStatus: (id, status) => {
        set((state) => ({
          comments: state.comments.map((c) => (c.id === id ? { ...c, status } : c)),
        }));
      },

      deleteComment: (id) => {
        set((state) => ({ comments: state.comments.filter((c) => c.id !== id) }));
      },

      // Notifications Actions
      createNotification: (notifData) => {
        const newNotif: AdminNotificationItem = {
          ...notifData,
          id: `notif-${Date.now()}`,
          sentCount: notifData.status === 'sent' ? get().users.length : 0,
          readCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },

      deleteNotification: (id) => {
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
      },

      // Logs Actions
      addLog: (logData) => {
        const newLog: AdminLogItem = {
          ...logData,
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ logs: [newLog, ...state.logs.slice(0, 499)] }));
      },

      // Settings Actions
      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        get().addLog({
          adminId: 'admin-root',
          adminName: 'Quản Trị Viên',
          action: 'settings.update',
          targetType: 'setting',
          targetId: 'global_config',
          newValue: newSettings,
          ipAddress: '192.168.1.247',
        });
      },
    }),
    {
      name: 'micky-admin-master-storage',
    }
  )
);
