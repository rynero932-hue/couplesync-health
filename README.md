# Better Together 💜

> Aplikasi kesehatan khusus untuk pasangan LDR — Ilham & Navisa.  
> Saling dukung, saling lihat progres, tumbuh sehat bersama.

---

## Tech Stack

| Layer      | Library / Service                    |
|------------|--------------------------------------|
| Bundler    | [Vite 5](https://vitejs.dev)         |
| Language   | Vanilla JavaScript (ES Modules)      |
| Styling    | Pure CSS dengan Design Tokens        |
| Charts     | [Chart.js 4](https://chartjs.org)    |
| Backend    | [Firebase 11](https://firebase.google.com) |
| Auth       | Firebase Authentication (Email/PW)   |
| Database   | Cloud Firestore (Realtime)           |
| AI Coach   | Anthropic Claude (claude-sonnet-4)   |
| Hosting    | Vercel / Firebase Hosting / Netlify  |

---

## Struktur Project

```
bettertogether/
├── index.html                  # Entry HTML (semua screen)
├── vite.config.js              # Vite bundler config
├── package.json
├── .env                        # 🔒 Firebase secrets (jangan commit!)
├── .env.example                # Template .env
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.js                 # Entry point — boot & wire globals
    ├── state.js                # Global state (single source of truth)
    ├── data/
    │   └── workouts.js         # Workout plans, food list, achievements
    ├── firebase/
    │   ├── config.js           # Firebase init (reads .env)
    │   ├── refs.js             # Firestore collection references
    │   ├── auth.js             # Login, logout, session restore
    │   └── firestore.js        # All CRUD + realtime listeners
    ├── screens/
    │   ├── login.js            # Login / user selection
    │   ├── workout.js          # Workout plan + tracking + timer
    │   ├── water.js            # Water intake tracker
    │   ├── weight.js           # Weight logging + anti-cheat
    │   ├── chat.js             # Couple chat (Firestore realtime)
    │   └── ai.js               # AI Health Coach (Claude API)
    ├── ui/
    │   ├── nav.js              # Navigation + bottom nav builder
    │   ├── charts.js           # Chart.js weight & progress charts
    │   ├── toast.js            # Toast notifications + Firebase status bar
    │   └── updater.js          # DOM updater (called after Firestore loads)
    └── styles/
        └── main.css            # Full design system
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url> bettertogether
cd bettertogether
npm install
```

### 2. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project `couplesync-health`
3. **Authentication** → Enable **Email/Password**
4. Tambah 2 user:
   - `ilham@couplesync.app` → password: `ilham123`
   - `navisa@couplesync.app` → password: `navisa123`
5. **Firestore** → Create database → Start in **production mode**
6. Set Firestore Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env — sudah terisi dengan config project ini
```

### 4. Run Dev Server

```bash
npm run dev
# → http://localhost:5173
```

### 5. Build Production

```bash
npm run build
# Output di folder dist/
```

---

## Login Credentials

| User   | Email                     | Password    |
|--------|---------------------------|-------------|
| Ilham  | ilham@couplesync.app      | `ilham123`  |
| Navisa | navisa@couplesync.app     | `navisa123` |

Kode pasangan: **281524**

---

## Firestore Schema

```
couples/
  ilham-navisa/             # Shared couple document
    streak: number
    lastStreakDate: string
    userA: "ilham"
    userB: "navisa"
    createdAt: timestamp

daily/
  m_YYYY-MM-DD/             # Ilham's daily log
    water: number (0-8)
    workoutDone: boolean
    updatedAt: timestamp
  f_YYYY-MM-DD/             # Navisa's daily log
    ...

weights_m/                  # Ilham's weight history
  { kg, date, createdAt }

weights_f/                  # Navisa's weight history
  { kg, date, createdAt }

workouts_m/                 # Ilham's workout history
  { title, durationSec, date, completedAt }

workouts_f/                 # Navisa's workout history
  ...

chats/
  ilham-navisa/
    messages/               # Realtime chat messages
      { text, sender, createdAt }
```

---

## Features

- 🔐 **Private Login** — Password per user, kode pasangan
- 🏠 **Dashboard** — Stats harian, berat badan, streak, menu cepat
- 💪 **Workout Tracker** — Plan berbeda cowok/cewek, timer, anti-skip
- 💧 **Water Tracker** — 8 gelas target, realtime sync
- ⚖️ **Weight Tracker** — Grafik 7 hari, anti-cheat (max ±3 kg/hari)
- 📊 **Progress** — Chart perbandingan berat badan berdua
- 💬 **Couple Chat** — Realtime Firestore, cheer buttons
- 🤖 **AI Health Coach** — Claude AI dengan konteks data kesehatan live
- 🔥 **Streak System** — Otomatis naik kalau berdua workout
- 🏆 **Achievement** — Badges milestone

---

## Deploy ke Vercel

```bash
npm install -g vercel
vercel --prod
```

Tambahkan semua variabel dari `.env` di dashboard Vercel → Settings → Environment Variables.

---

## Deploy ke Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## Catatan Keamanan

- File `.env` **TIDAK BOLEH** di-commit ke Git (sudah ada di `.gitignore`)
- Firestore Rules membatasi akses hanya untuk user yang sudah login
- Password disimpan di Firebase Auth (bukan Firestore)
- Data chat dan kesehatan hanya bisa diakses oleh akun yang terautentikasi

---

*Made with 💜 for Ilham & Navisa*
