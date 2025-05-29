import {
  Select as BaseSelect,
  type SelectItemProps,
  extendVariants,
  ListboxItem as SelectItem,
} from "@heroui/react";
import type React from "react";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";

const ExtendedSelect = extendVariants(BaseSelect, {
  defaultVariants: {
    variant: "faded",
    color: "default",
    size: "md",
    labelPlacement: "outside",
    placeholder: "Auswählen",
    radius: "sm",
  },
});

const Select = forwardRef<
  HTMLSelectElement,
  React.ComponentProps<typeof ExtendedSelect> & {
    control?: any;
    items?: Iterable<SelectItemProps>;
  }
>(({ control, ...props }, ref) => {
  if (!control || !props.name) return <ExtendedSelect {...props} ref={ref as any} />;
  return (
    <Controller
      control={control}
      name={props.name}
      render={({
        field: { name, value, onChange, onBlur, ref: fieldRef },
        fieldState: { invalid, error },
      }) => (
        <ExtendedSelect
          {...props}
          ref={fieldRef}
          errorMessage={error?.message}
          validationBehavior="aria"
          defaultSelectedKeys={value ? [value] : []}
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

Select.displayName = "Select";

/**
 * Converts an iterable of strings or numbers into an array of objects suitable for selection components.
 *
 * @param items - An iterable collection of strings or numbers to be converted.
 * @returns An array of objects where each object has a `key` and `children` property.
 *
 * @example
 * const items = ["Option1", 2, "Option3"];
 * const selection = toSelection(items);
 * // selection will be:
 * // [
 * //   { key: "option1", children: "Option1" },
 * //   { key: "2", children: "2" },
 * //   { key: "option3", children: "Option3" }
 * // ]
 */
const selectionFrom = (items: (string | number)[]) => {
  return Array.from(items).map(value => ({
    key: value.toString(),
    children: value.toString(),
  }));
};

export { Select, SelectItem, selectionFrom };
