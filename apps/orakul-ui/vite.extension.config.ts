import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {},
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      },
    },
  },
  define: {
    
  },
  plugins: [react()],
})
