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
  cart: EntryType;
}

const Entry = ({ entry, cart }: EntryProps) => {
  const { user } = db.useAuth();

  const { openEditor, closeEditor } = useEditor();

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
        .link({ cart: cart.id, createdBy: user?.id, origin: newId }),
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
          cart: cart.id,
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
          cart: cart.id,
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

  const editEntry = () =>
    openEditor({
      title: entry ? "Eintrag bearbeiten" : "Eintrag hinzufügen",
      children: (
        <Form onSubmit={submit}>
          <Input size="lg" autoFocus={!entry} control={control} name="title" />
        </Form>
      ),
    });

  return (
    <>
      <p onClick={editEntry} className="cursor-pointer text-center font-semibold text-lg">
        {entry?.title || "Hinzufügen"}
      </p>
    </>
  );
};

export default Entry;
