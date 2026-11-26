import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['app-icon.jpg', 'sample-court.jpg'],
      manifest: {
        name: 'Galaxie Tennis — Suivi & Aventure',
        short_name: 'Galaxie Tennis',
        description:
          'Suivi familial de progression Galaxie Tennis avec espace gestion Parent et aventure ludique Enfant.',
        theme_color: '#C85A32',
        background_color: '#FAF7F2',
        display: 'standalone',
        start_url: './',
        scope: './',
        orientation: 'portrait-primary',
        lang: 'fr',
        icons: [
          {
            src: 'app-icon.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
