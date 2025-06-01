"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import { Form } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import type { TagType } from "@/types/db";
import { ColorInput } from "../ui/ColorInput";

type FormValues = {
  title: string;
  color: string;
};

interface TagProps {
  tag?: TagType;
}

const TagForm = ({ tag }: TagProps) => {
  const { closeEditor } = useEditor();

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: tag?.title || "",
      color: tag?.color || "#ffffff",
    },
    mode: "onChange",
  });

  const handleCreate = (values: FormValues) => {
    db.transact(
      db.tx.tags[id()].update({
        title: values.title,
        color: values.color,
        isDeleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    );
  };

  const handleUpdate = (values: FormValues) =>
    tag &&
    db.transact(
      db.tx.tags[tag.id].update({
        title: values.title,
        color: values.color,
        isDeleted: false,
        updatedAt: Date.now(),
      }),
    );

  const handleDelete = () => tag && db.transact(db.tx.tags[tag.id].update({ isDeleted: true }));

  const submit = handleSubmit(values => {
    if (values.title !== tag?.title) {
      if (tag) {
        if (values.title === "") {
          handleDelete();
          return closeEditor();
        }
        handleUpdate(values);
      } else {
        if (values.title === "") return closeEditor();
        handleCreate(values);
      }
    }
    closeEditor();
  });

  return (
    <Form onSubmit={submit}>
      <Input size="lg" autoFocus={!tag} control={control} name="title" onClear={handleDelete} />
      <ColorInput control={control} name="color" />
    </Form>
  );
};

export { TagForm };
