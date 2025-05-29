"use client";

import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner classNames={{ label: "mt-4 text-foreground" }} label="dots" variant="dots" />
    </div>
  );
}
