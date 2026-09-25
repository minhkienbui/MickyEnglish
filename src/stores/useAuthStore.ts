import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserRole } from '@/lib/types';

export const ADMIN_EMAILS = [
  'admin@mickyenglish.com',
  'admin@gmail.com',
  'admin@bibung.com',
  'kienbui@gmail.com',
  'kienbui@mickyenglish.com',
];

interface FailedLoginTracker {
  count: number;
  lockedUntil: number | null; // timestamp ms
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  failedLogins: Record<string, FailedLoginTracker>; // keyed by username/email
  
  // Actions
  login: (userOrIdentifier: UserProfile | string, password?: string, name?: string) => { success: boolean; error?: string; remainingSeconds?: number };
  recordFailedLogin: (identifier: string) => { isLocked: boolean; remainingSeconds: number; attemptsLeft: number };
  clearFailedLogin: (identifier: string) => void;
  registerUser: (userData: { username: string; email: string; fullName: string; avatar?: string }) => UserProfile;
  loginWithGoogle: (googleUser: { email: string; name: string; picture?: string; googleId: string }) => UserProfile;
  logout: () => void;
  incrementProgress: (stats: { wordsLearned?: number; dictationMinutes?: number; shadowingMinutes?: number; examsCompleted?: number }) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  deductDiamonds: (amount: number) => boolean;
  deductGems: (amount: number) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'user-default-1',
        username: 'kienbui',
        email: 'kienbui@mickyenglish.com',
        fullName: 'Bùi Kiên',
        name: 'Bùi Kiên',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'admin',
        googleId: null,
        diamonds: 250,
        gems: 250,
        streak: 5,
        wordsLearned: 28,
        dictationMinutes: 45,
        shadowingMinutes: 20,
        examsCompleted: 2,
        isVerified: true,
        isBanned: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLogin: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      },
      isAuthenticated: true,
      token: 'jwt-token-active-demo-micky-2026',
      failedLogins: {},

      recordFailedLogin: (identifier: string) => {
        const key = identifier.toLowerCase().trim();
        const current = get().failedLogins[key] || { count: 0, lockedUntil: null };
        const now = Date.now();

        // Nếu đang bị lock và chưa hết hạn
        if (current.lockedUntil && current.lockedUntil > now) {
          const remainingSeconds = Math.ceil((current.lockedUntil - now) / 1000);
          return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
        }

        const newCount = current.count + 1;
        let lockedUntil = null;
        let isLocked = false;

        // Sai 5 lần liên tiếp -> khóa 15 phút (900.000 ms)
        if (newCount >= 5) {
          lockedUntil = now + 15 * 60 * 1000;
          isLocked = true;
        }

        const tracker: FailedLoginTracker = { count: newCount, lockedUntil };
        set((state) => ({
          failedLogins: { ...state.failedLogins, [key]: tracker },
        }));

        const remainingSeconds = isLocked ? 15 * 60 : 0;
        const attemptsLeft = Math.max(0, 5 - newCount);

        return { isLocked, remainingSeconds, attemptsLeft };
      },

      clearFailedLogin: (identifier: string) => {
        const key = identifier.toLowerCase().trim();
        set((state) => {
          const next = { ...state.failedLogins };
          delete next[key];
          return { failedLogins: next };
        });
      },

      login: (userOrIdentifier: UserProfile | string, _password?: string, name?: string) => {
        if (typeof userOrIdentifier === 'object') {
          set({
            isAuthenticated: true,
            user: userOrIdentifier,
            token: `jwt-token-${userOrIdentifier.id}-${Date.now()}`,
          });
          return { success: true };
        }

        // Identifier string
        const emailOrUser = userOrIdentifier.toLowerCase().trim();
        const key = emailOrUser;
        const tracker = get().failedLogins[key];
        const now = Date.now();

        if (tracker?.lockedUntil && tracker.lockedUntil > now) {
          const remainingSeconds = Math.ceil((tracker.lockedUntil - now) / 1000);
          return {
            success: false,
            error: `Tài khoản tạm thời bị khóa do nhập sai 5 lần. Vui lòng thử lại sau ${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60).toString().padStart(2, '0')}`,
            remainingSeconds,
          };
        }

        // Hỗ trợ đăng nhập tài khoản quản trị Root (tk: admin, mk: 1)
        if (emailOrUser === 'admin' || emailOrUser === 'admin@mickyenglish.com') {
          const rootAdminUser: UserProfile = {
            id: 'admin-root-01',
            username: 'admin',
            email: 'admin@mickyenglish.com',
            fullName: 'Quản Trị Viên',
            name: 'Quản Trị Viên',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            role: 'admin',
            googleId: null,
            diamonds: 9999,
            gems: 9999,
            streak: 30,
            wordsLearned: 500,
            dictationMinutes: 300,
            shadowingMinutes: 150,
            examsCompleted: 15,
            isVerified: true,
            isBanned: false,
            createdAt: '2024-01-01T00:00:00.000Z',
            lastLogin: new Date().toISOString(),
            lastActive: new Date().toISOString(),
          };

          get().clearFailedLogin(key);
          set({
            isAuthenticated: true,
            user: rootAdminUser,
            token: `jwt-token-admin-${Date.now()}`,
          });

          return { success: true };
        }

        const isAdmin = ADMIN_EMAILS.includes(emailOrUser) || emailOrUser.startsWith('admin');
        const username = emailOrUser.includes('@') ? emailOrUser.split('@')[0] : emailOrUser;

        const loggedInUser: UserProfile = {
          id: `user-${Date.now()}`,
          username: username.replace(/[^a-z0-9_.]/g, ''),
          email: emailOrUser.includes('@') ? emailOrUser : `${username}@mickyenglish.com`,
          fullName: name || username,
          name: name || username,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          role: isAdmin ? 'admin' : 'user',
          googleId: null,
          diamonds: 100,
          gems: 100,
          streak: 1,
          wordsLearned: 0,
          dictationMinutes: 0,
          shadowingMinutes: 0,
          examsCompleted: 0,
          isVerified: true,
          isBanned: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };

        get().clearFailedLogin(key);

        set({
          isAuthenticated: true,
          user: loggedInUser,
          token: `jwt-token-${loggedInUser.id}-${Date.now()}`,
        });

        return { success: true };
      },

      registerUser: (userData) => {
        const normalizedEmail = userData.email.toLowerCase().trim();
        const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);

        const newUser: UserProfile = {
          id: `user-${Date.now()}`,
          username: userData.username.toLowerCase().trim(),
          email: normalizedEmail,
          fullName: userData.fullName.trim(),
          name: userData.fullName.trim(),
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: (isAdmin ? 'admin' : 'user') as UserRole,
          googleId: null,
          diamonds: 100,
          gems: 100,
          streak: 1,
          wordsLearned: 0,
          dictationMinutes: 0,
          shadowingMinutes: 0,
          examsCompleted: 0,
          isVerified: true,
          isBanned: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };

        set({
          isAuthenticated: true,
          user: newUser,
          token: `jwt-token-${newUser.id}-${Date.now()}`,
        });

        return newUser;
      },

      loginWithGoogle: (googleUser) => {
        const normalizedEmail = googleUser.email.toLowerCase().trim();
        const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
        const username = normalizedEmail.split('@')[0].replace(/[^a-z0-9_.]/g, '');

        const user: UserProfile = {
          id: `user-google-${googleUser.googleId || Date.now()}`,
          username,
          email: normalizedEmail,
          fullName: googleUser.name,
          name: googleUser.name,
          avatar: googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: (isAdmin ? 'admin' : 'user') as UserRole,
          googleId: googleUser.googleId,
          diamonds: 100,
          gems: 100,
          streak: 1,
          wordsLearned: 0,
          dictationMinutes: 0,
          shadowingMinutes: 0,
          examsCompleted: 0,
          isVerified: true,
          isBanned: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };

        set({
          isAuthenticated: true,
          user,
          token: `jwt-google-token-${user.id}-${Date.now()}`,
        });

        return user;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('micky_auth_token');
        }
      },

      incrementProgress: (stats) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              wordsLearned: state.user.wordsLearned + (stats.wordsLearned || 0),
              dictationMinutes: state.user.dictationMinutes + (stats.dictationMinutes || 0),
              shadowingMinutes: (state.user.shadowingMinutes || 0) + (stats.shadowingMinutes || 0),
              examsCompleted: state.user.examsCompleted + (stats.examsCompleted || 0),
            },
          };
        });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              ...data,
            },
          };
        });
      },

      deductDiamonds: (amount: number) => {
        const currentUser = get().user;
        const currentDiamonds = currentUser?.diamonds ?? 100;
        if (currentDiamonds < amount) return false;
        set({
          user: currentUser
            ? { ...currentUser, diamonds: currentDiamonds - amount, gems: currentDiamonds - amount }
            : null,
        });
        return true;
      },

      deductGems: (amount: number) => {
        return get().deductDiamonds(amount);
      },
    }),
    {
      name: 'micky-auth-storage',
    }
  )
);
