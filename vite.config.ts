import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // --- SEÇÃO DE OTIMIZAÇÃO DE BUILD ADICIONADA ---
  build: {
    // Configurações do Rollup para dividir o código manualmente
    rollupOptions: {
      output: {
        // Função que decide em qual 'chunk' (arquivo) o código deve ir
        manualChunks(id) {
          // 1. Agrupa todas as dependências do nó (node_modules) que não são React em um chunk 'vendor'
          if (id.includes('node_modules') && !id.includes('@vite/client') && !id.includes('react')) {
            // Separa libs maiores do bundle principal
            if (id.includes('firebase') || id.includes('stripe') || id.includes('jszip')) {
              return 'vendor-critical'; 
            }
            return 'vendor';
          }
        },
      },
    },
    // Opcional: Aumentar o limite do aviso para 1000 kB (1MB) para não ficar spamando o terminal
    chunkSizeWarningLimit: 1000, 
  },
  // ------------------------------------------------
})