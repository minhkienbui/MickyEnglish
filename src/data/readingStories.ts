export interface StoryPage {
  pageNumber: number;
  imageUrl: string;
  imageAlt: string;
  text: string;
  hasIllustrationOnly?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  evidenceQuote: string;
  explanationVi: string;
  explanationEn: string;
  relatedPage: number;
}

export interface StoryData {
  id: string;
  title: string;
  author: string;
  illustrator: string;
  level: string;
  levelNumber: number;
  totalPages: number;
  category: string;
  license: string;
  licenseDetails: string;
  coverImage: string;
  essayPrompt: string;
  essayMinChars: number;
  essayMaxChars: number;
  pages: StoryPage[];
  quiz: QuizQuestion[];
}

export const READING_STORIES: StoryData[] = [
  {
    id: 'a-helping-hand',
    title: 'A Helping Hand',
    author: 'Payal Dhar',
    illustrator: 'Vartika Sharma',
    level: 'Level 4',
    levelNumber: 4,
    totalPages: 22,
    category: 'StoryWeaver Reading',
    license: 'CC BY 4.0',
    licenseDetails:
      'Câu chuyện: "A Helping Hand" được viết bởi Payal Dhar và minh họa bởi Vartika Sharma. Được phát hành theo giấy phép Creative Commons Attribution 4.0 International bởi StoryWeaver (Pratham Books). Bạn được tự do chia sẻ và điều chỉnh nội dung cho mục đích giáo dục.',
    coverImage:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    essayPrompt:
      "The narrator learned that being a friend is more important than being curious about someone's differences. Write about a time you helped someone feel welcome or how you would help a new student in your class.",
    essayMinChars: 40,
    essayMaxChars: 4000,
    pages: [
      {
        pageNumber: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Two children holding hands walking among green trees and hills',
        text: 'A Helping Hand Author: Payal Dhar Illustrator: Vartika Sharma',
        hasIllustrationOnly: true,
      },
      {
        pageNumber: 2,
        imageUrl:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Vintage hand-drawn sketchbook with pencil sketches of a notebook',
        text: 'Dear Diary, a new girl joined our class today. Her name is Manisha, and she transferred from another town. Miss appointed me to be her mentor. I did not ask for this responsibility, but Miss said I am responsible and kind. I wonder why she wears that glove on her left hand all the time.',
      },
      {
        pageNumber: 3,
        imageUrl:
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Classroom desk with school stationery and pencil drawings',
        text: 'At lunchtime, everyone in Class VII was whispering. They watched every step Manisha took. She sat quietly by the window with her lunchbox, looking distant. I tried to ask her what her favorite subject was, but she only nodded shyly.',
      },
      {
        pageNumber: 4,
        imageUrl:
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Pencil sketches on brown paper of eyes, hands and footsteps',
        text: "Hi again, Ma says that it is not good to stare at people, but I can see that everyone stares at you. They stare at me too because I have to hang around with you and be your 'mentor'. Why did you come to our school? Why couldn't you continue going to whatever school you went to earlier? Do you know what happened yesterday? Gaurav, Ali and two of their friends from Class VII cornered me after school to ask about you-know-what. They took my bag and wouldn't give it back. Then they threw it into the thicket by the side of the road and I had to scramble down into the mountainside to get it. I tore my shirt and Ma was angry with me. This is all your fault. Me",
      },
      {
        pageNumber: 5,
        imageUrl:
          'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Artistic charcoal sketches of reaching hands and flowers on kraft parchment',
        text: "Hello, I keep telling them that they can ask you whatever they want to know. What's the point of asking me? How am I supposed to know what happened to your hand? Ma says I must be nice to you and look after you, but nobody told me how to do that. Why don't you talk to anyone? Why do you just sit there and look out of the window? You make me feel stupid because I don't know what to say. If you think having a prosthetic hand makes you special, think again. Lots of people have different kinds of hands...",
      },
      {
        pageNumber: 6,
        imageUrl:
          'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Sketches of trees, path in forest and fallen leaves',
        text: 'I felt terrible after writing that note. I stuffed it into my pocket and did not give it to her. During art class, Sir asked us to paint our favorite memory. While everyone else grabbed watercolor brushes, Manisha carefully unfastened her glove. For the first time, I saw her prosthetic hand clearly—it was made of polished composite material, moving with tiny mechanical clicks.',
      },
      {
        pageNumber: 7,
        imageUrl:
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Watercolor palette with bright vibrant colors',
        text: 'She painted a stunning golden sunset over deep blue mountain peaks. She held the palette steady with her left hand while her right hand brushed bold, vibrant strokes. The entire classroom went silent, not out of mockery, but sheer admiration.',
      },
      {
        pageNumber: 8,
        imageUrl:
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Open storybook with colorful sketches',
        text: '"That looks like the valley behind our old house," she whispered softly. It was the first time she had spoken directly to me. Her voice was calm and gentle. "We had to move here after the accident so my father could work closer to the specialized rehabilitation clinic."',
      },
      {
        pageNumber: 9,
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Two smiling friends sharing lunch outdoors',
        text: 'I felt my face heat up with shame for all the frustrated thoughts I had harbored. I reached into my pocket, crumpled my bitter note, and tossed it deep into the wastebasket. "Your painting is breathtaking," I told her sincerely. "Would you like to sit together under the banyan tree for lunch?"',
      },
      {
        pageNumber: 10,
        imageUrl:
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Group of kids playing and walking together happily',
        text: 'From that afternoon on, everything changed. When Gaurav and Ali came over during recess with curious smirks, I did not let them intimidate us. "Manisha is showing me how she mixes watercolors," I said firmly. Soon, the curiosity stopped being a wall of separation and turned into genuine friendship.',
      },
      {
        pageNumber: 11,
        imageUrl:
          'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Warm golden sunlight beaming through trees',
        text: 'I finally understood what Ma meant. Being a friend does not mean having all the answers or treating someone like an assignment. It simply means offering a helping hand, listening with an open heart, and recognizing that our differences are what make our world beautiful.',
      },
    ],
    quiz: [
      {
        id: 1,
        question:
          "From the story, why did the narrator have to be the 'mentor' for the new student?",
        options: [
          { key: 'A', text: 'Since they were neighbors' },
          { key: 'B', text: 'Since the teacher (Miss) assigned the task' },
          {
            key: 'C',
            text: 'Since the narrator wanted to learn about prosthetic hands',
          },
          { key: 'D', text: 'Since they were the best student in class' },
        ],
        correctAnswer: 'B',
        evidenceQuote:
          'Miss appointed me to be her mentor. I did not ask for this responsibility, but Miss said I am responsible and kind.',
        explanationVi:
          'Trong trang 2 và 4, người kể chuyện giải thích rằng giáo viên (Miss) đã phân công bạn làm người hướng dẫn ("mentor") cho học sinh mới vì cô giáo nhận xét bạn là người có trách nhiệm và tử tế, chứ không phải vì tự nguyện hay là hàng xóm.',
        explanationEn:
          "The narrator explicitly states in Page 2 that 'Miss appointed me to be her mentor' because the teacher recognized the narrator as responsible and kind.",
        relatedPage: 2,
      },
      {
        id: 2,
        question:
          "Based on the reading, what is the correct term for the new girl's 'fake hand'?",
        options: [
          { key: 'A', text: 'Toy hand option' },
          { key: 'B', text: 'Plastic hand option' },
          { key: 'C', text: 'Prosthetic hand' },
          { key: 'D', text: 'Wooden hand option' },
        ],
        correctAnswer: 'C',
        evidenceQuote:
          'If you think having a prosthetic hand makes you special, think again. Lots of people have different kinds of hands...',
        explanationVi:
          'Thuật ngữ y khoa và từ vựng chuẩn được tác giả sử dụng trong trang 5 và 6 là "prosthetic hand" (tay giả cơ học/sinh học), không phải là đồ chơi hay tay gỗ thông thường.',
        explanationEn:
          "The accurate terminology used throughout the text (Page 5 & 6) is 'prosthetic hand', referring to an artificial robotic limb designed to replace a missing hand.",
        relatedPage: 5,
      },
      {
        id: 3,
        question: "What happened to the narrator's bag after school?",
        options: [
          { key: 'A', text: 'It was stolen on the school bus' },
          {
            key: 'B',
            text: 'Classmates threw it into the thicket by the roadside',
          },
          { key: 'C', text: 'The narrator forgot it inside the classroom' },
          { key: 'D', text: 'The teacher confiscated it during detention' },
        ],
        correctAnswer: 'B',
        evidenceQuote:
          'Then they threw it into the thicket by the side of the road and I had to scramble down into the mountainside to get it.',
        explanationVi:
          'Ở trang 4, người kể chuyện kể rằng Gaurav, Ali và bạn học đã chặn đường, giật cặp sách rồi ném vào bụi rậm ven đường khiến bạn phải trèo xuống sườn núi lấy lại và bị rách áo.',
        explanationEn:
          "Page 4 clearly documents that classmates cornered the narrator and 'threw it into the thicket by the side of the road'.",
        relatedPage: 4,
      },
      {
        id: 4,
        question:
          "What is the main lesson the narrator begins to realize about friendship?",
        options: [
          {
            key: 'A',
            text: "Being a friend is more important than being curious about someone's differences",
          },
          {
            key: 'B',
            text: 'It is best to avoid talking to people who look different',
          },
          {
            key: 'C',
            text: 'Always listen to classmates instead of family advice',
          },
          {
            key: 'D',
            text: 'Fitting in is the most important part of going to school',
          },
        ],
        correctAnswer: 'A',
        evidenceQuote:
          'Being a friend does not mean having all the answers or treating someone like an assignment. It simply means offering a helping hand, listening with an open heart...',
        explanationVi:
          'Bài học nhân văn cốt lõi của câu chuyện là tình bạn chân thành và sự đồng cảm quan trọng hơn sự tò mò hay định kiến về sự khác biệt thể chất của người khác.',
        explanationEn:
          "The core moral takeaway is that true friendship transcends mere curiosity or superficial differences, focusing instead on empathy, respect, and mutual support.",
        relatedPage: 11,
      },
    ],
  },
];
