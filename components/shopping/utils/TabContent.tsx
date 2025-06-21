"use client";
import type { ReactNode } from "react";

interface TabContentProps {
  children: ReactNode;
}

export const TabContent = ({ children }: TabContentProps) => (
  <div className="z-40 flex max-h-[calc(100dvh-158px)] w-full flex-1 flex-col items-start justify-start gap-2 overflow-y-auto overflow-x-hidden">
    {children}
  </div>
);
