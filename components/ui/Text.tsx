import type { VariantProps } from "@heroui/react";
import React from "react";
import { tv } from "tailwind-variants";

const textStyle = tv({
  variants: {
    variant: {
      h1: "text-3xl leading-tight tracking-tight text-gray-900 dark:text-white",
      h2: "text-2xl leading-tight tracking-tight text-gray-900 dark:text-white",
      h3: "text-xl leading-tight tracking-tight text-gray-900 dark:text-white",
      tiny: "text-tiny leading-relaxed text-gray-900 dark:text-white",
      small: "text-sm leading-relaxed text-gray-900 dark:text-white",
      medium: "text-base leading-relaxed text-gray-900 dark:text-white",
      large: "text-lg leading-relaxed text-gray-900 dark:text-white",
    },
    behave: {
      fill: "w-full text-left",
      center: "w-full text-center",
      hug: "w-fit",
      truncate: "w-full truncate text-start",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    capitalize: {
      true: "capitalize",
    },
  },
  defaultVariants: {
    variant: "medium",
    behave: "fill",
    weight: "normal",
    wrap: true,
    disabled: false,
  },
});

export type TextProps = React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof textStyle>;

const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof textStyle>
>(({ className, variant, behave, weight, capitalize, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`${textStyle({ behave, weight, variant, capitalize })} ${className}`}
      {...props}
    />
  );
});

Text.displayName = "Text";

export { Text };
