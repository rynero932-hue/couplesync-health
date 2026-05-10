import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/',

  css: {
    // Inline PostCSS config — prevents Vercel from loading postcss.config.js
    postcss: {
      plugins: [],
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: {
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/analytics',
          ],
          chart: ['chart.js'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
    strictPort: false,
  },

  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics',
      'chart.js',
    ],
  },
});
