import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { weeklyMilestones, MilestoneQuest } from '@/data/mockLeaderboard';
import { useAuthStore } from './useAuthStore';

interface LeaderboardState {
  period: 'weekly' | 'monthly' | 'allTime';
  metric: 'xp' | 'time';
  claimedMilestones: string[]; // List of claimed quest IDs

  setPeriod: (p: 'weekly' | 'monthly' | 'allTime') => void;
  setMetric: (m: 'xp' | 'time') => void;
  claimMilestone: (questId: string) => { success: boolean; diamonds: number; message: string };
  isMilestoneClaimed: (questId: string) => boolean;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      period: 'weekly',
      metric: 'xp',
      claimedMilestones: [],

      setPeriod: (period) => set({ period }),
      setMetric: (metric) => set({ metric }),

      claimMilestone: (questId: string) => {
        const { claimedMilestones } = get();
        if (claimedMilestones.includes(questId)) {
          return { success: false, diamonds: 0, message: 'Bạn đã nhận phần thưởng này rồi!' };
        }

        const quest = weeklyMilestones.find((q) => q.id === questId);
        if (!quest) {
          return { success: false, diamonds: 0, message: 'Nhiệm vụ không tồn tại.' };
        }

        // Thêm kim cương và XP vào Auth Store của người dùng
        const authStore = useAuthStore.getState();
        authStore.addDiamonds(quest.rewardDiamonds);
        if (quest.rewardXp) {
          authStore.addXp(quest.rewardXp);
        }

        set({
          claimedMilestones: [...claimedMilestones, questId],
        });

        // Kích hoạt âm thanh chúc mừng chiến thắng
        if (typeof window !== 'undefined') {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
              gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.12);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(ctx.currentTime + idx * 0.12);
              osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
            });
          } catch {}
        }

        return {
          success: true,
          diamonds: quest.rewardDiamonds,
          message: `🎉 Chúc mừng! Bạn đã nhận thành công +${quest.rewardDiamonds} 💎 Kim cương!`,
        };
      },

      isMilestoneClaimed: (questId: string) => {
        return get().claimedMilestones.includes(questId);
      },
    }),
    {
      name: 'micky-leaderboard-storage',
    }
  )
);
