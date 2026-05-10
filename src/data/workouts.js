// src/data/workouts.js

export const WORKOUT_PLANS = {
  m: {
    title: 'Upper Body Strength',
    desc : '25 menit · 150 kkal terbakar',
    badge1: 'Intermediate',
    badge2: 'Upper Body',
    gradient: 'linear-gradient(135deg,#4C1D95,#7C3AED,#9333EA)',
    accentColor: '#7C3AED',
    accentLight: '#EDE9FE',
    exercises: [
      { name: 'Push Up',        detail: '4 × 12 reps'  },
      { name: 'Pull Up',        detail: '4 × 8 reps'   },
      { name: 'Dumbbell Press', detail: '4 × 12 reps'  },
      { name: 'Plank',          detail: '3 × 45 detik' },
    ],
  },
  f: {
    title: 'Lower Body & Core',
    desc : '20 menit · 120 kkal terbakar',
    badge1: 'Beginner',
    badge2: 'Lower Body',
    gradient: 'linear-gradient(135deg,#9D174D,#EC4899,#F472B6)',
    accentColor: '#EC4899',
    accentLight: '#FDF2F8',
    exercises: [
      { name: 'Squat',        detail: '3 × 15 reps'  },
      { name: 'Glute Bridge', detail: '3 × 15 reps'  },
      { name: 'Leg Raise',    detail: '3 × 15 reps'  },
      { name: 'Plank',        detail: '3 × 30 detik' },
    ],
  },
};

export const FOOD_LIST = [
  { emoji: '🍚', name: 'Nasi Putih',    portion: '1 porsi (100gr)', kcal: 130 },
  { emoji: '🍗', name: 'Ayam Panggang', portion: '100 gr',          kcal: 165 },
  { emoji: '🥬', name: 'Sayur Tumis',   portion: '1 porsi',         kcal: 80  },
  { emoji: '🍌', name: 'Pisang',        portion: '1 buah',          kcal: 90  },
  { emoji: '🥚', name: 'Telur Rebus',   portion: '1 butir',         kcal: 70  },
];

export const ACHIEVEMENTS = [
  { emoji: '🥇', title: 'First Step',        desc: 'Selesai workout pertama',        done: true  },
  { emoji: '⚡', title: '7 Days Challenge',  desc: 'Capai 7 hari berturut-turut',    done: true  },
  { emoji: '💪', title: '10 Days Challenge', desc: 'Capai 10 hari berturut-turut',   done: true  },
  { emoji: '👑', title: 'Consistency King',  desc: 'Capai 30 hari berturut-turut',   done: false },
];

export const AUTO_REPLIES = [
  'Semangat terus ya sayang! 💜',
  'Ayo kita bisa! 💪',
  'Proud of you banget 🥰',
  'Kamu the best! 🌟',
  'Jangan lupa istirahat ya 😊',
  'Aku selalu dukung kamu 💜',
];

export const MOTIVATIONAL_QUOTES = [
  'Konsistensi kecil setiap hari jauh lebih berharga dari sprint sesaat.',
  'Walaupun LDR, kita tetap tumbuh sehat bersama setiap hari.',
  'Perjalanan seribu mil dimulai dari satu langkah kecil.',
  'Tubuh sehat bukan tujuan, tapi cara kita saling menjaga.',
  'Setiap keringat adalah pesan cinta untuk diri sendiri.',
];
