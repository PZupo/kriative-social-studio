import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: undefined
      }
    }
  }
})
