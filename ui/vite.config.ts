import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { ConfigEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ["**/*"],
        manifest: {
          name: 'Addicts Golfing Society',
          short_name: 'Addicts Golfing Society',
          description: 'A simple PWA created with Vite, React, and Zustand',
          start_url: '/',
          scope: "/",
          display: "standalone",
          background_color: '#ffffff',
          theme_color: '#ffffff',
          icons: [
            {
              src: "icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: 'any'
            },
            {
              src: "icons/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icons/apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
            },
            {
              src: "icons/favicon-16x16.png",
              sizes: "16x16",
              type: "image/png",
            },
            {
              src: "icons/favicon-32x32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "icons/favicon.ico",
              sizes: "48x48",
              type: "image/png",
            }
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: ['ag-grid-community', 'ag-grid-react'],
      exclude: ['lucide-react'],
    },
    define: {
      "__APP_VERSION__": JSON.stringify(require("./package.json").version),
    },
  }
});