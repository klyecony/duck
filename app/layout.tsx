import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import type * as React from "react";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Duck",
  description: "A modern, minimalistic, and fast web application for managing your home.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "pwa", "typescript", "home management", "smart home"],
  authors: [{ name: "Cedrik Meis" }],
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
    <html lang="de" className="h-full overflow-hidden bg-background text-foreground antialiased">
      <body className="relative h-[calc(100dvh-32px)] w-dvw overflow-hidden">
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
