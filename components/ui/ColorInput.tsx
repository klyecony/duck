import type React from "react";
import { HexColorPicker } from "react-colorful";
import { Controller } from "react-hook-form";

const ColorInput = ({
  control,
  name,
  ...props
}: React.PropsWithChildren & {
  name: string;
  control?: any;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <HexColorPicker
          {...props}
          color={value}
          onBlur={onBlur}
          onChange={onChange}
          className="w-full"
        />
      )}
    />
  );
};

export { ColorInput };
