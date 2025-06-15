import { InputOtp as BaseOtpInput, extendVariants } from "@heroui/react";
import type React from "react";
import { forwardRef } from "react";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";

const ExtendedOtpInput = extendVariants(BaseOtpInput, {
  defaultVariants: {
    variant: "bordered",
    color: "secondary",
    size: "lg",
    labelPlacement: "outside",
    placeholder: "",
    radius: "lg",
    length: 6,
    autoComplete: "one-time-code",
  },
});

export const OtpInput = forwardRef<
  HTMLElement,
  React.PropsWithChildren<
    Omit<React.ComponentProps<typeof ExtendedOtpInput>, "name"> & {
      name: FieldPath<FieldValues>;
      control?: Control<any>;
    }
  >
>(({ control, name, ...props }, ref) => {
  if (!control) return <ExtendedOtpInput name={name} {...props} ref={ref as any} />;
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { name, value, onChange, onBlur, ref: fieldRef },
        fieldState: { invalid, error },
      }) => (
        <ExtendedOtpInput
          {...props}
          ref={fieldRef}
          errorMessage={error?.message}
          validationBehavior="aria"
          isInvalid={invalid}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
        />
      )}
    />
  );
});
