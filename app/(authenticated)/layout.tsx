"use client";

import { Creator } from "@/components/Creator";
import { absoluteCenter } from "@/components/ui/config/utils";
import { db } from "@/db";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, isLoading } = db.useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/");
  }, [isLoading, user, router]);

  return (
    <>
      <Creator />
      <div
        className={`${absoluteCenter} transition-opacity ease-in ${isLoading || !user ? "opacity-100 duration-300" : "opacity-0 duration-75"}`}
      >
        <Spinner color="primary" variant="wave" />
      </div>
      {children}
    </>
  );
}
