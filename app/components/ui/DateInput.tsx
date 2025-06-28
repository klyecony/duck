import { DateInput as BaseDateInput, extendVariants } from "@heroui/react";
import type React from "react";
import { forwardRef } from "react";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";

const ExtendedDateInput = extendVariants(BaseDateInput, {
  defaultVariants: {
    variant: "faded",
    color: "secondary",
    size: "lg",
    labelPlacement: "outside",
    placeholder: "",
    radius: "sm",
  },
});

export const DateInput = forwardRef<
  HTMLElement,
  React.PropsWithChildren<
    Omit<React.ComponentProps<typeof ExtendedDateInput>, "name"> & {
      name: FieldPath<FieldValues>;
      control?: Control<any>;
    }
  >
>(({ control, name, ...props }, ref) => {
  if (!control) return <ExtendedDateInput name={name} {...props} ref={ref as any} />;
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { name, value, onChange, onBlur, ref: fieldRef },
        fieldState: { invalid, error },
      }) => (
        <ExtendedDateInput
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
