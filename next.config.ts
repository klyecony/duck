// next.config.ts
import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  runtimeCaching: [
    {
      urlPattern: /^http?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  // Your existing Next.js config options
  reactStrictMode: true,
  swcMinify: true,
  // Add other config as needed
};

export default withPWA(nextConfig);
