# Better Together v2 💜

> Aplikasi kesehatan private untuk pasangan LDR — Ilham & Navisa

---

## Fitur Baru v2

| Fitur | Keterangan |
|---|---|
| 🔄 **Switch User** | Bisa ganti akun di halaman Profil — tidak perlu logout |
| 📊 **Partner Activity Feed** | Dashboard langsung tampilkan aktivitas pasangan secara realtime |
| 💪 **Workout partner notif** | Notifikasi otomatis saat pasangan selesai workout |
| ✅ **Habits berdua** | Setiap habit tampilkan status kamu DAN pasangan |
| 🔔 **Notifikasi harian** | Reminder jam 7, 12, 17.30, 21, 22 |
| 🚪 **Tombol logout** | Ada di halaman Profil → Keluar |
| 📱 **Nav selalu tampil** | Bottom nav hardcoded di tiap screen, tidak bergantung JS |

---

## Struktur Project

```
bettertogether/
├── index.html              ← Semua screen HTML
├── vite.config.js
├── package.json
├── postcss.config.js
├── vercel.json
├── .env                    ← 🔒 Firebase config
├── .env.example
├── .gitignore
├── README.md
├── public/
│   ├── favicon.svg
│   └── firebase-messaging-sw.js
└── src/
    ├── main.js             ← Entry point, semua window.*
    ├── config.js           ← ⭐ GANTI INFO DI SINI
    ├── state.js            ← Global state
    ├── firebase/
    │   └── db.js           ← Auth + Firestore semua dalam 1 file
    ├── screens/
    │   ├── auth.js         ← Login, logout, switch user
    │   ├── home.js         ← Dashboard + partner feed
    │   ├── habits.js       ← Habit tracker (berdua)
    │   ├── workout.js      ← Workout + timer
    │   ├── water.js        ← Water tracker
    │   ├── weight.js       ← Weight logging
    │   ├── chat.js         ← Realtime chat
    │   ├── ai.js           ← AI Health Coach
    │   └── notifications.js← Push notif + reminders
    └── ui/
        ├── router.js       ← Navigasi antar screen
        ├── charts.js       ← Chart.js weight & progress
        └── toast.js        ← Toast + Firebase status bar
```

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Run dev
npm run dev

# 3. Build untuk Vercel
npm run build
```

---

## Setup AI Coach (gratis, OpenRouter)

AI Coach menggunakan [OpenRouter](https://openrouter.ai) dengan model gratis.
API key sudah terisi di `.env` — tinggal tambahkan di Vercel.

### Langkah:
1. Buka Vercel Dashboard → Project → **Settings → Environment Variables**
2. Tambahkan:
   - `OPENROUTER_API_KEY` = `sk-or-v1-your-key-here`
3. Klik **Save** → **Redeploy**

### Model yang digunakan:
- **Primary:** `google/gemini-2.0-flash-exp:free` — cepat & pintar
- **Fallback:** `meta-llama/llama-3.1-8b-instruct:free` — kalau rate limit

> ✅ Semua model pakai akhiran `:free` — 100% gratis, tidak perlu kartu kredit.

---

## Setup Firebase (wajib untuk sync data)

### 1. Authentication
Firebase Console → Authentication → Sign-in method → **Email/Password** → Enable

Tambah 2 user:
| Nama   | Email                     | Password    |
|--------|---------------------------|-------------|
| Ilham  | ilham@couplesync.app      | `ilham123`  |
| Navisa | navisa@couplesync.app     | `navisa123` |

### 2. Firestore Database
Firebase Console → Firestore Database → Create database → Start in **production mode**

Set Rules:
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

### 3. Vercel Environment Variables
Settings → Environment Variables → tambahkan semua dari `.env`

---

## Cara Ganti Nama / Password

Edit file `src/config.js`:

```js
export const USERS = {
  m: {
    name: 'Ilham',           // ← ganti nama
    email: 'ilham@...',      // ← ganti email (sama dengan Firebase Auth)
    password: 'ilham123',    // ← ganti password
    height: 175,
    weightTarget: 65,
  },
  f: {
    name: 'Navisa',
    email: 'navisa@...',
    password: 'navisa123',
    height: 160,
    weightTarget: 52,
  },
};
```

---

## Cara Kerja Partner Tracking

1. Ilham selesai workout → data tersimpan ke Firestore `daily/m_YYYY-MM-DD`
2. Navisa membuka app → **onSnapshot listener** otomatis detect perubahan
3. Dashboard Navisa langsung update: "💪 Ilham selesai workout 25 menit!"
4. Notifikasi browser muncul di device Navisa (kalau izin diberikan)

Sama berlaku sebaliknya.

---

## Login Credentials

| User   | Password    | Kode Pasangan |
|--------|-------------|---------------|
| Ilham  | `ilham123`  | `281524`      |
| Navisa | `navisa123` | `281524`      |

---

*Made with 💜 for Ilham & Navisa*
