import type { FormProps } from "@heroui/react";
import { tv } from "tailwind-variants";

const formStyle = tv({
  base: "w-full block",
});

const Form = ({ className, ...props }: FormProps) => {
  return <Form className={`${formStyle()}${className}`} {...props} />;
};

export { Form };
