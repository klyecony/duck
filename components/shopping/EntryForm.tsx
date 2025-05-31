"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { EntryType, Scd } from "@/types/db";
import { Form } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

interface EntryProps {
  entry?: Scd<EntryType>;
}

const EntryForm = ({ entry }: EntryProps) => {
  const { user } = db.useAuth();

  const { closeEditor } = useEditor();

  const { control, handleSubmit } = useForm<{
    title: string;
  }>({
    defaultValues: {
      title: entry?.title || "",
    },
    mode: "onChange",
  });

  const handleCreate = (values: { title: string }) => {
    const newId = id();
    db.transact(
      db.tx.entries[newId]
        .update({
          title: values.title,
          description: "",
          timeStamp: Date.now(),
          isDeleted: false,
        })
        .link({ createdBy: user?.id, origin: newId }),
    );
  };

  const handleUpdate = (values: { title: string }) =>
    db.transact(
      db.tx.entries[id()]
        .update({
          title: values.title,
          description: entry?.description,
          isDeleted: false,
          timeStamp: Date.now(),
        })
        .link({
          createdBy: user?.id,
          origin: entry?.origin.id,
        }),
    );

  const handleDelete = (values: { title: string }) => {
    db.transact(
      db.tx.entries[id()]
        .update({
          title: values.title,
          description: entry?.description,
          isDeleted: true,
          timeStamp: Date.now(),
        })
        .link({
          createdBy: user?.id,
          origin: entry?.origin.id,
        }),
    );
  };

  const submit = handleSubmit(values => {
    if (values.title !== entry?.title) {
      if (entry) {
        if (values.title === "") {
          handleDelete(values);
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
      <Input size="lg" autoFocus={!entry} control={control} name="title" />
    </Form>
  );
};

export { EntryForm };
