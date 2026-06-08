import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Charity/',
  plugins: [react()],
  ssgOptions: {
    script: 'async',
    dirStyle: 'nested', // /donate → /donate/index.html (cleaner URLs)
    includedRoutes: () => [
      '/',
      '/donate',
      '/about',
      '/impact',
      '/contact',
      '/process',
      '/privacy',
      '/terms',
    ],
    // Keep beasties (inline critical CSS) enabled for perf
    beastiesOptions: {},
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Isolate the heavy Three.js / globe bundle from the main chunk
          if (id.includes('node_modules/three') || id.includes('node_modules/react-globe.gl')) {
            return 'globe';
          }
        },
      },
    },
  },
});
