import type { TagType } from "@/types/db";
import { Chip, type ChipProps } from "@heroui/react";
import { forwardRef } from "react";

interface TagProps extends ChipProps {
  tag?: TagType;
}

const Tag = forwardRef<HTMLDivElement, TagProps>(({ tag, ...props }, ref) => {
  return (
    <Chip ref={ref} {...props}>
      {tag?.title || "Tag erstellen"}
    </Chip>
  );
});

export default Tag;
