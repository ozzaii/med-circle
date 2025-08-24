import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🚀 BULLETPROOF GITHUB PAGES DEPLOYMENT CONFIG
export default defineConfig({
  plugins: [react()],
  base: '/medcircle-poc/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion'],
          ai: ['@google/genai']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true
  },
  define: {
    __DEV__: process.env.NODE_ENV !== 'production'
  }
})
