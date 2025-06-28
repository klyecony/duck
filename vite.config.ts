import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import {} from "node:url";
import path from "node:path";

export default defineConfig({
  server: {
    port: 3000
  },
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
        name: "Duck - Home Management",
        short_name: "Duck",
        description: "A modern, minimalistic, and fast web application for managing your home.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/32.png", sizes: "32x32", type: "image/png" },
          { src: "/icons/180.png", sizes: "180x180", type: "image/png" },
          { src: "/icons/196.png", sizes: "196x196", type: "image/png" },
          { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
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
