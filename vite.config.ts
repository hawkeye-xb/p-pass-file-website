import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: '/index.html'
    }
  },
  publicDir: 'public',
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})