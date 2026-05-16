import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: '../dist',
  },
  plugins: [solid()],
});
