import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        streak: true,
        wordsLearned: true,
        dictationMinutes: true,
        examsCompleted: true,
        role: true,
        createdAt: true,
      },
      orderBy: [
        { wordsLearned: 'desc' },
        { dictationMinutes: 'desc' },
      ],
      take: 50,
    });

    const realUsers = users.map((u, idx) => {
      const xpTotal = (u.wordsLearned || 0) * 10 + (u.dictationMinutes || 0) * 5 + (u.examsCompleted || 0) * 50;
      const studyMinutes = u.dictationMinutes || 0;
      const displayName = u.name || (u.email ? u.email.split('@')[0] : `Học viên #${idx + 1}`);

      return {
        id: u.id,
        rank: idx + 1,
        name: displayName,
        avatar: u.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        badge: idx === 0 ? '👑 Quán Quân' : idx === 1 ? '🥈 Á Quân' : idx === 2 ? '🥉 Quý Quân' : 'Học viên Chăm chỉ',
        roleTitle: u.role?.toUpperCase() === 'ADMIN' ? 'Quản Trị Viên' : 'Học Viên',
        level: xpTotal > 2000 ? 'C1' : xpTotal > 1000 ? 'B2' : xpTotal > 300 ? 'B1' : 'A2',
        streak: u.streak || 1,
        schoolOrOrg: 'MickyEnglish Member',
        xp: {
          weekly: Math.round(xpTotal * 0.4),
          monthly: Math.round(xpTotal * 0.8),
          allTime: xpTotal,
        },
        studyTimeMinutes: {
          weekly: Math.round(studyMinutes * 0.4),
          monthly: Math.round(studyMinutes * 0.8),
          allTime: studyMinutes,
        },
        wordsLearned: u.wordsLearned || 0,
      };
    });

    return NextResponse.json({ success: true, users: realUsers });
  } catch (error: any) {
    console.error('Error fetching real leaderboard users:', error);
    return NextResponse.json({ success: true, users: [] });
  }
}
