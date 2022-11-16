import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.csv'],
  base: '/bubble-chart/',
  plugins: [react()],
});
