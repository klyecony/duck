"use client";
import { db } from "@/db";
import { useRouter } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, isLoading } = db.useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return <>{children}</>;
}
