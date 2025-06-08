import { Switch as BaseSwitch, extendVariants } from "@heroui/react";
import type React from "react";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";

const ExtendedSwitch = extendVariants(BaseSwitch, {
  defaultVariants: {
    color: "secondary",
  },
});

const Switch = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<React.ComponentProps<typeof ExtendedSwitch>> & {
    name: string;
    control?: any;
  }
>(({ control, name, ...props }, ref) => {
  if (!control) return <ExtendedSwitch name={name} {...props} ref={ref as any} />;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { name, value, onChange, onBlur, ref: fieldRef } }) => (
        <ExtendedSwitch
          {...props}
          ref={fieldRef}
          name={name}
          isSelected={value}
          value={value}
          onBlur={onBlur}
          onSelect={onChange}
        />
      )}
    />
  );
});

export { Switch };
