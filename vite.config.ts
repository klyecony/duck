import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/zenquotes\.io\/api\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "quotes-cache",
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 200 },
            },
          },
        ],
      },
      manifest: {
        name: "Duck",
        short_name: "duck",
        description: "A modern, minimalistic, and fast web application for managing your home.",
        theme_color: "#e7e2e0",
        background_color: "#e7e2e0",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icons/72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
