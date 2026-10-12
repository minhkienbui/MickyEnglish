import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// P0 seed: CEFR roadmap (clone nhaihsk roadmap) + IPA chart + roots
// Chạy sau khi restart dev server: npx prisma generate && npx tsx prisma/seed-p0.ts
const BOOKS = [
  { slug: 'cefr-a1', title: 'CEFR A1 - Foundation', level: 'A1', order: 1, lessons: ['Chào hỏi & giới thiệu', 'Số đếm & thời gian', 'Gia đình & bạn bè', 'Mua sắm cơ bản'] },
  { slug: 'cefr-a2', title: 'CEFR A2 - Elementary', level: 'A2', order: 2, lessons: ['Công việc hàng ngày', 'Du lịch & hỏi đường', 'Sức khỏe & ăn uống', 'Kể chuyện quá khứ'] },
  { slug: 'cefr-b1', title: 'CEFR B1 - Intermediate', level: 'B1', order: 3, lessons: ['Quan điểm & tranh luận', 'Công việc & email', 'Tin tức & media', 'Kế hoạch tương lai'] },
  { slug: 'cefr-b2', title: 'CEFR B2 - Upper Intermediate', level: 'B2', order: 4, lessons: ['Học thuật & essay', 'Thuyết trình', 'Văn hoá & xã hội', 'Phỏng vấn việc làm'] },
  { slug: 'cefr-c1', title: 'CEFR C1 - Advanced', level: 'C1', order: 5, lessons: ['Ngôn ngữ học thuật', 'Báo cáo & phân tích', 'Hàm ý & sắc thái', 'Tranh biện nâng cao'] },
  { slug: 'cefr-c2', title: 'CEFR C2 - Mastery', level: 'C2', order: 6, lessons: ['Văn học & phong cách', 'Dịch thuật', 'Thuyết trình chuyên gia', 'Nghiên cứu'] },
];

const IPA = [
  { symbol: '/i:/', kind: 'vowel', example: 'sheep', phonetic: '/ʃi:p/' },
  { symbol: '/ɪ/', kind: 'vowel', example: 'ship', phonetic: '/ʃɪp/' },
  { symbol: '/e/', kind: 'vowel', example: 'bed', phonetic: '/bed/' },
  { symbol: '/æ/', kind: 'vowel', example: 'cat', phonetic: '/kæt/' },
  { symbol: '/ɑ:/', kind: 'vowel', example: 'car', phonetic: '/kɑ:/' },
  { symbol: '/ɒ/', kind: 'vowel', example: 'hot', phonetic: '/hɒt/' },
  { symbol: '/ɔ:/', kind: 'vowel', example: 'door', phonetic: '/dɔ:/' },
  { symbol: '/ʌ/', kind: 'vowel', example: 'cup', phonetic: '/kʌp/' },
  { symbol: '/ɜ:/', kind: 'vowel', example: 'bird', phonetic: '/bɜ:d/' },
  { symbol: '/ə/', kind: 'vowel', example: 'about', phonetic: '/əˈbaʊt/' },
  { symbol: '/θ/', kind: 'consonant', example: 'think', phonetic: '/θɪŋk/' },
  { symbol: '/ð/', kind: 'consonant', example: 'this', phonetic: '/ðɪs/' },
  { symbol: '/ʃ/', kind: 'consonant', example: 'ship', phonetic: '/ʃɪp/' },
  { symbol: '/tʃ/', kind: 'consonant', example: 'chair', phonetic: '/tʃeə/' },
  { symbol: '/dʒ/', kind: 'consonant', example: 'judge', phonetic: '/dʒʌdʒ/' },
  { symbol: '/ŋ/', kind: 'consonant', example: 'sing', phonetic: '/sɪŋ/' },
];

const ROOTS = [
  { root: 'un-', meaning: 'không, phủ định', kind: 'prefix', examples: ['unhappy', 'undo', 'unfair'] },
  { root: 're-', meaning: 'làm lại', kind: 'prefix', examples: ['redo', 'rewrite', 'return'] },
  { root: '-dict-', meaning: 'nói', kind: 'root', examples: ['dictation', 'predict', 'dictionary'] },
  { root: '-spect-', meaning: 'nhìn', kind: 'root', examples: ['respect', 'inspect', 'spectator'] },
  { root: '-port-', meaning: 'mang, chở', kind: 'root', examples: ['transport', 'import', 'portable'] },
  { root: '-able', meaning: 'có thể', kind: 'suffix', examples: ['readable', 'comfortable', 'reliable'] },
];

const PATTERNS = [
  { slug: 'pattern-1', title: 'S + suggest + (that) + S + V-inf', formula: 'suggest that + S + (should) + V', level: 'B1', examples: [{ en: 'I suggest that he collect feedback.', vi: 'Tôi đề nghị anh ấy thu thập phản hồi.' }] },
  { slug: 'pattern-2', title: 'used to + V (thói quen quá khứ)', formula: 'S + used to + V', level: 'A2', examples: [{ en: 'I used to play football.', vi: 'Tôi từng chơi bóng đá.' }] },
];

async function main() {
  console.log('🌱 Seed P0: roadmap CEFR + IPA + roots + patterns...');
  for (const b of BOOKS) {
    const book = await prisma.book.upsert({
      where: { slug: b.slug },
      update: {},
      create: { slug: b.slug, title: b.title, level: b.level, order: b.order },
    });
    for (let i = 0; i < b.lessons.length; i++) {
      await prisma.lesson.upsert({
        where: { slug: `${b.slug}-lesson-${i + 1}` },
        update: {},
        create: { slug: `${b.slug}-lesson-${i + 1}`, title: b.lessons[i], order: i + 1, bookId: book.id },
      });
    }
  }
  for (const s of IPA) {
    await prisma.ipaSound.upsert({ where: { symbol: s.symbol }, update: {}, create: s });
  }
  for (const r of ROOTS) {
    await prisma.root.upsert({ where: { root: r.root }, update: {}, create: r });
  }
  for (const p of PATTERNS) {
    await prisma.pattern.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }
  console.log('✅ Seed P0 xong.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
