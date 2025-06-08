import { Input as BaseInput, Textarea as BaseTextarea, extendVariants } from "@heroui/react";
import type React from "react";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";

const ExtendedInput = extendVariants(BaseInput, {
  defaultVariants: {
    variant: "faded",
    color: "secondary",
    size: "md",
    labelPlacement: "outside",
    placeholder: "Auswählen",
    radius: "sm",
  },
});

const ExtendedTextarea = extendVariants(BaseTextarea, {
  defaultVariants: {
    variant: "faded",
    color: "secondary",
    size: "md",
    labelPlacement: "outside",
    placeholder: "Auswählen",
    radius: "sm",
  },
});

const Input = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<React.ComponentProps<typeof ExtendedInput>> & {
    name: string;
    control?: any;
  }
>(({ control, name, ...props }, ref) => {
  if (!control) return <ExtendedInput name={name} {...props} ref={ref as any} />;
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { name, value, onChange, onBlur, ref: fieldRef },
        fieldState: { invalid, error },
      }) => (
        <ExtendedInput
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

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.PropsWithChildren<React.ComponentProps<typeof ExtendedTextarea>> & {
    name: string;
    control?: any;
  }
>(({ control, name, ...props }, ref) => {
  if (!control) return <ExtendedTextarea name={name} {...props} ref={ref as any} />;
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { name, value, onChange, onBlur, ref: fieldRef },
        fieldState: { invalid, error },
      }) => (
        <ExtendedTextarea
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

Input.displayName = "Input";
Textarea.displayName = "Textarea";

export { Input, Textarea };
