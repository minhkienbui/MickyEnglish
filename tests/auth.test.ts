import { expect, test, beforeEach } from 'vitest';
import { useAuthStore } from '../src/stores/useAuthStore';

beforeEach(() => {
  useAuthStore.setState({
    user: {
      id: 'demo-1',
      name: 'Người học Micky',
      email: 'hocvien@mickyenglish.com',
      streak: 5,
      wordsLearned: 42,
      dictationMinutes: 30,
      examsCompleted: 3,
      lastActive: new Date().toISOString(),
    },
    isAuthenticated: true,
  });
});

test('login updates user credentials', () => {
  const { login } = useAuthStore.getState();
  login('nguyena@gmail.com', '123456', 'Nguyen Van A');
  const state = useAuthStore.getState();
  expect(state.isAuthenticated).toBe(true);
  expect(state.user?.email).toBe('nguyena@gmail.com');
  expect(state.user?.name).toBe('Nguyen Van A');
});

test('incrementStreak updates streak count', () => {
  const { incrementProgress } = useAuthStore.getState();
  incrementProgress({ wordsLearned: 5, dictationMinutes: 10 });
  const state = useAuthStore.getState();
  expect(state.user?.wordsLearned).toBe(47);
  expect(state.user?.dictationMinutes).toBe(40);
});
