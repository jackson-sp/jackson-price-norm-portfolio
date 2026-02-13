import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Explicitly set public directory
  build: {
    chunkSizeWarningLimit: 1000,
    copyPublicDir: true, // Ensure public directory is copied
  },
})