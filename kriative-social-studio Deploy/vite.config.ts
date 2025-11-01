import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['/assets/index-C75-rJQP.js'], // Ignora o asset quebrado
    },
  },
  assetsInclude: ['**/*.js'], // Inclui assets JS externos
})
