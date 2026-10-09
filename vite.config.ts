import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/vue-lottery-app/',
  plugins: [vue()],
  server: { port: 5174, open: true },
});
