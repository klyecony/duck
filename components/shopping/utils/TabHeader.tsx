"use client";
import { Text } from "@/components/ui/Text";

interface TabHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export const TabHeader = ({ title, description, className = "" }: TabHeaderProps) => {
  return (
    <div className={`mb-1.5 flex h-11 flex-col justify-center pb-1.5 pl-[54px] ${className}`}>
      <Text variant="h3" weight="bold" behave="truncate">
        {title}
      </Text>
      <Text variant="small" className="text-default-foreground/70 leading-4" behave="truncate">
        {description}
      </Text>
    </div>
  );
};
