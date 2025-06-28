import { Checkbox as BaseCheckbox, extendVariants } from "@heroui/react";
import type React from "react";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";

const ExtendedCheckbox = extendVariants(BaseCheckbox, {
  defaultVariants: {
    radius: "sm",
  },
});

const Checkbox = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<React.ComponentProps<typeof ExtendedCheckbox>> & {
    name: string;
    control?: any;
  }
>(({ control, name, ...props }, ref) => {
  if (!control) return <ExtendedCheckbox name={name} {...props} ref={ref as any} />;
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { name, value, onChange, onBlur, ref: fieldRef },
        fieldState: { invalid },
      }) => (
        <>
          <ExtendedCheckbox
            {...props}
            ref={fieldRef}
            validationBehavior="aria"
            isInvalid={invalid}
            name={name}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        </>
      )}
    />
  );
});

export { Checkbox };
