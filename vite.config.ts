import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  base: '/fnforge/',
  build: {
    emptyOutDir: true,
    outDir: '../dist',
  },
  plugins: [solid()],
});
