import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu mẫu (Seeding Micky English)...');

  // 1. Tạo tài khoản người dùng mẫu
  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'hocvien@mickyenglish.com' },
    update: {},
    create: {
      email: 'hocvien@mickyenglish.com',
      name: 'Nguyễn Văn Học',
      hashedPassword: passwordHash,
      streak: 5,
      wordsLearned: 42,
      dictationMinutes: 45,
      examsCompleted: 2,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mickyenglish.com' },
    update: {},
    create: {
      email: 'admin@mickyenglish.com',
      name: 'Micky Admin',
      hashedPassword: passwordHash,
      streak: 12,
      wordsLearned: 150,
      dictationMinutes: 120,
      examsCompleted: 10,
    },
  });

  console.log('✅ Đã tạo tài khoản:', demoUser.email, adminUser.email);

  // 2. Tạo các bộ từ vựng mẫu
  const toeicSet = await prisma.vocabularySet.create({
    data: {
      name: '600 Từ Vựng TOEIC Căn Bản',
      description: 'Bộ từ vựng trọng tâm thường xuyên xuất hiện trong bài thi TOEIC Listening & Reading.',
      isPublic: true,
      userId: adminUser.id,
      words: {
        create: [
          {
            word: 'Accommodate',
            phonetic: '/əˈkɑːmədeɪt/',
            meaning: 'Cung cấp chỗ ở; đáp ứng nhu cầu',
            example: 'The hotel can accommodate up to 500 guests comfortably.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/accommodate-us.mp3',
          },
          {
            word: 'Negotiate',
            phonetic: '/nɪˈɡoʊʃieɪt/',
            meaning: 'Đàm phán, thương lượng hợp đồng',
            example: 'They managed to negotiate a 15% discount for the contract.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/negotiate-us.mp3',
          },
          {
            word: 'Resilient',
            phonetic: '/rɪˈzɪliənt/',
            meaning: 'Kiên cường, có khả năng phục hồi nhanh',
            example: 'The local economy proved to be remarkably resilient after the crisis.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/resilient-us.mp3',
          },
          {
            word: 'Collaborate',
            phonetic: '/kəˈlæbəreɪt/',
            meaning: 'Hợp tác, làm việc cùng nhau',
            example: 'Two international research teams will collaborate on the new project.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/collaborate-us.mp3',
          },
          {
            word: 'Implement',
            phonetic: '/ˈɪmplɪment/',
            meaning: 'Thực thi, triển khai kế hoạch',
            example: 'We need to implement these new security measures immediately.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/implement-us.mp3',
          },
        ],
      },
    },
    include: { words: true },
  });

  const ieltsSet = await prisma.vocabularySet.create({
    data: {
      name: 'IELTS Academic Essential',
      description: 'Từ vựng học thuật Band 7.0+ cho bài viết Writing & Nói Speaking.',
      isPublic: true,
      userId: adminUser.id,
      words: {
        create: [
          {
            word: 'Abundant',
            phonetic: '/əˈbʌndənt/',
            meaning: 'Dồi dào, phong phú',
            example: 'There is abundant evidence that regular exercise improves mental health.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/abundant-us.mp3',
          },
          {
            word: 'Mitigate',
            phonetic: '/ˈmɪtɪɡeɪt/',
            meaning: 'Làm giảm bớt, xoa dịu tác động',
            example: 'Governments should take action to mitigate the effects of climate change.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/mitigate-us.mp3',
          },
          {
            word: 'Inevitable',
            phonetic: '/ɪnˈevɪtəbl/',
            meaning: 'Không thể tránh khỏi, tất yếu',
            example: 'Change is inevitable in any fast-growing organization.',
            audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/inevitable-us.mp3',
          },
        ],
      },
    },
    include: { words: true },
  });

  console.log('✅ Đã tạo các bộ từ vựng:', toeicSet.name, ieltsSet.name);

  // 3. Khởi tạo tiến độ UserWordProgress mẫu (SM-2)
  for (const word of toeicSet.words.slice(0, 3)) {
    await prisma.userWordProgress.upsert({
      where: {
        userId_wordId: { userId: demoUser.id, wordId: word.id },
      },
      update: {},
      create: {
        userId: demoUser.id,
        wordId: word.id,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: new Date(),
      },
    });
  }

  // 4. Tạo các bài học Dictation & Shadowing
  const lesson1 = await prisma.listeningLesson.create({
    data: {
      title: 'Morning Routine for High Productivity',
      topic: 'Daily Life',
      level: 'Beginner',
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      duration: 35,
      transcript:
        'Starting your morning with a clear plan helps you stay focused and calm throughout the busy day.',
    },
  });

  const lesson2 = await prisma.listeningLesson.create({
    data: {
      title: 'The Secrets to Mastering Spoken English',
      topic: 'Education',
      level: 'Intermediate',
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      duration: 45,
      transcript:
        'Listening to authentic English audio every day and shadowing native speakers will dramatically improve your pronunciation and speaking reflex.',
    },
  });

  console.log('✅ Đã tạo bài nghe luyện chép chính tả:', lesson1.title, lesson2.title);

  // 5. Tạo đề thi mẫu hoàn chỉnh (TOEIC & IELTS)
  const toeicExam = await prisma.exam.create({
    data: {
      title: 'TOEIC Mini Test 1 - Luyện Nghe & Đọc Hiểu',
      type: 'TOEIC',
      description: 'Đề thi rút gọn kiểm tra kỹ năng Ngữ pháp, Từ vựng và Đọc hiểu trong môi trường công sở.',
      duration: 15,
      sections: {
        create: [
          {
            name: 'Part 5: Incomplete Sentences',
            order: 1,
            questions: {
              create: [
                {
                  order: 1,
                  questionText: 'Ms. Henderson will present the quarterly budget report _______ Friday morning.',
                  options: ['on', 'in', 'at', 'by'],
                  correctAnswer: 0,
                  explanation: 'Giải thích: Dùng giới từ "on" trước các ngày trong tuần (on Friday morning).',
                },
                {
                  order: 2,
                  questionText: 'The new marketing director suggested that we _______ customer feedback more frequently.',
                  options: ['collect', 'collects', 'collected', 'collection'],
                  correctAnswer: 0,
                  explanation: 'Giải thích: Cấu trúc giả định thức "suggest that + S + (should) + V-infinitive", nên dùng động từ nguyên thể "collect".',
                },
                {
                  order: 3,
                  questionText: 'All employees are required to submit their vacation requests at _______ two weeks in advance.',
                  options: ['least', 'last', 'most', 'less'],
                  correctAnswer: 0,
                  explanation: 'Giải thích: Cụm từ cố định "at least" mang nghĩa "ít nhất là hai tuần trước".',
                },
              ],
            },
          },
          {
            name: 'Part 7: Reading Comprehension',
            order: 2,
            passage: 'To: All Staff\nFrom: Facilities Management\nSubject: Office Renovation Notice\n\nPlease be advised that the 3rd-floor conference room will be closed for maintenance from August 20 to August 22. All scheduled meetings during this period will be relocated to Room 405 on the 4th floor. Thank you for your cooperation.',
            questions: {
              create: [
                {
                  order: 4,
                  questionText: 'Why is the 3rd-floor conference room closed?',
                  options: [
                    'For staff meeting',
                    'For maintenance work',
                    'For painting only',
                    'Because of bad weather',
                  ],
                  correctAnswer: 1,
                  explanation: 'Giải thích: Trong thông báo nêu rõ: "conference room will be closed for maintenance".',
                },
                {
                  order: 5,
                  questionText: 'Where will meetings be held between August 20 and 22?',
                  options: ['In Room 301', 'In Room 405', 'At a local cafe', 'Virtually online'],
                  correctAnswer: 1,
                  explanation: 'Giải thích: Trong thông báo nêu: "All scheduled meetings will be relocated to Room 405".',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Đã tạo đề thi mẫu:', toeicExam.title);
  console.log('🎉 Hoàn tất seed dữ liệu cho Micky English!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
