"use client";
import { Text } from "@/components/ui/Text";

interface TabHeaderProps {
  title: string;
  description: string;
}

export const TabHeader = ({ title, description }: TabHeaderProps) => {
  return (
    
    <div className="mb-1.5 flex h-fit flex-col justify-center pl-[54px]">
      <Text variant="h3" weight="bold" behave="truncate">
        {title}
      </Text>
      <Text variant="small" className="pb-1.5 text-default-foreground/70 leading-3" behave="truncate">
        {description}
      </Text>
    </div>
  );
};
