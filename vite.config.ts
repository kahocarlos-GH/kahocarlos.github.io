
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 确保资源路径正确
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
