'use client';

import React, { useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { useAuthStore } from '@/stores/useAuthStore';

function SessionSync() {
  const { data: session, status } = useSession();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && !isAuthenticated) {
      // Đồng bộ thông tin từ tài khoản Google thật vào Neon DB và useAuthStore
      fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
          picture: session.user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          googleId: (session.user as any).id || session.user.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            login(data.user);
          }
        })
        .catch((err) => console.error('Lỗi đồng bộ tài khoản Google:', err));
    }
  }, [status, session, isAuthenticated, login]);

  return null;
}

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
