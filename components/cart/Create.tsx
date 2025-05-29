"use client";

import { db } from "@/db";
import type { Cart } from "@/types/db";
import { Form } from "@heroui/react";
import { id } from "@instantdb/react";
import { Input } from "@/components/ui/input";
import { useInstantForm } from "@/lib/interface/form";

function addCart({ title }: Cart) {
  db.transact(
    db.tx.carts[id()].update({
      title,
      timeStamp: Date.now(),
      isDeleted: false,
    }),
  );
}

const Create = () => {
  const { control, handleSubmit } = useInstantForm("carts", {
    defaultValues: {
      title: "",
    },
  });

  return (
    <Form onSubmit={handleSubmit(addCart)}>
      <Input control={control} name="title" label="Cart Title" placeholder="Enter cart title" />
    </Form>
  );
};

export default Create;
