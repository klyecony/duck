"use client";

import { db } from "@/db";
import { Button, Form } from "@heroui/react";
import { id } from "@instantdb/react";
import { Input } from "@/components/ui/input";
import { useInstantForm } from "@/lib/interface/form";

const CreateCart = () => {
  const { user } = db.useAuth();
  const { control, handleSubmit } = useInstantForm("carts", {
    defaultValues: {
      title: "",
      timeStamp: Date.now(),
      isDeleted: false,
    },
  });

  const submit = handleSubmit(data => {
    db.transact(
      db.tx.carts[id()]
        .update({
          ...data,
        })
        .link({
          createdBy: user?.id,
        }),
    );
  });

  return (
    <Form onSubmit={submit}>
      <Input control={control} name="title" label="Cart Title" placeholder="Enter cart title" />
      <Button type="submit" className="mt-4">
        Create Cart
      </Button>
    </Form>
  );
};

export { CreateCart };
