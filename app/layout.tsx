import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import type * as React from "react";

export const metadata: Metadata = {
  title: "Mosaic",
  description: "A modern, minimalistic, and fast web application for managing your home.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "pwa", "typescript", "home management", "smart home"],
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0014ff" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  authors: [{ name: "Cedrik Meis" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/180.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/icons/32.png" },
    { rel: "icon", type: "image/png", sizes: "196x196", url: "/icons/196.png" },
    { rel: "icon", type: "image/png", sizes: "512x512", url: "/icons/512.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
