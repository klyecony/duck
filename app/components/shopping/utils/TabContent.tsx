import { ScrollShadow } from "@heroui/react";
import type { ReactNode } from "react";

interface TabContentProps {
  children: ReactNode;
}

export const TabContent = ({ children }: TabContentProps) => (
  <ScrollShadow className="h-[calc(100dvh-168px)]">{children}</ScrollShadow>
);
