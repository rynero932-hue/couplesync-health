/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        male: {
          accent: '#3b82f6',
          dark: '#1e40af',
        },
        female: {
          accent: '#ec4899',
          soft: '#fbcfe8',
          lavender: '#d8b4fe',
        },
        peach: '#fb923c',
        dark: '#0a0a0c',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
