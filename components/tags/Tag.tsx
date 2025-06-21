import { getContrastColor } from "@/lib/color";
import type { TagType } from "@/types/db";
import { Chip, type ChipProps } from "@heroui/react";
import { forwardRef } from "react";

interface TagProps extends ChipProps {
  tag: TagType;
}

const Tag = forwardRef<HTMLDivElement, TagProps>(({ tag, ...props }, ref) => {
  return (
    <Chip
      ref={ref}
      {...props}
      variant="light"
      radius="sm"
      style={{
        backgroundColor: tag?.color ? tag.color : "#ffffff",
        color: tag?.color ? getContrastColor(tag.color) : "#000000",
      }}
    >
      {tag?.title || "Tag erstellen"}
    </Chip>
  );
});

export default Tag;
