import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validations/auth.schema';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/dang-nhap',
    error: '/dang-nhap',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error('Email hoặc mật khẩu không hợp lệ');
        }

        const { email, password } = parsed.data;

        try {
          const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!user || !user.hashedPassword) {
            throw new Error('Tài khoản hoặc mật khẩu không chính xác');
          }

          const isValid = await bcrypt.compare(password, user.hashedPassword);
          if (!isValid) {
            throw new Error('Tài khoản hoặc mật khẩu không chính xác');
          }

          // Update lastActive & streak
          await db.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            streak: user.streak,
          };
        } catch (error: any) {
          throw new Error(error.message || 'Đăng nhập thất bại');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.streak = (user as any).streak || 1;
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.image = session.user.image;
        if (session.user.streak !== undefined) {
          token.streak = session.user.streak;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).streak = (token.streak as number) || 1;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'micky-english-secret-jwt-key-2026',
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function authenticateAccount(accounts: any[], email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  return (
    accounts.find(
      (account) => normalizeEmail(account.email) === normalizedEmail && account.password === password
    ) ?? null
  );
}

export function getAccountByRole(accounts: any[], role: string) {
  return accounts.find((account) => account.role === role) ?? null;
}

export function accountEmailExists(accounts: any[], email: string) {
  const normalizedEmail = normalizeEmail(email);
  return accounts.some((account) => normalizeEmail(account.email) === normalizedEmail);
}

export function createAccountId(email: string) {
  return `acct-${normalizeEmail(email).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function createCustomerId(email: string) {
  return `cust-${normalizeEmail(email).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}
