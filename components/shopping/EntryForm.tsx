"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { EntryType, Scd, TagType } from "@/types/db";
import { Button, Form } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Trash } from "@phosphor-icons/react";

interface EntryProps {
  entry?: Scd<EntryType> & {
    tags: TagType[];
  };
}

type FieldValues = {
  title: string;
  tags: string[];
};

const EntryForm = ({ entry }: EntryProps) => {
  const { user } = db.useAuth();

  const { closeEditor } = useEditor();

  const { data } = db.useQuery({
    entries: {
      meals:{},
      $: {
        where: {
          id: entry?.origin.id || "",
        },
      },
    },
  });

  console.log(data)

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FieldValues>({
    defaultValues: {
      title: entry?.title || "",
      tags: entry?.tags?.map(tag => tag.id) || [],
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
          createdAt: Date.now(),
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
          createdAt: Date.now(),
        })
        .link({
          createdBy: user?.id,
          origin: entry?.origin.id,
        }),
    );

  const handleDelete = () => {
    if (!entry) return;
    db.transact(
      db.tx.entries[id()]
        .update({
          title: entry.title,
          description: entry?.description,
          isDeleted: true,
          createdAt: Date.now(),
        })
        .link({
          createdBy: user?.id,
          origin: entry?.origin.id,
        }),
    );
  };

  const submit = handleSubmit(values => {
    if (isDirty) {
      if (entry) {
        handleUpdate(values);
      } else {
        handleCreate(values);
      }
    }
    closeEditor();
  });

  return (
    <Form onSubmit={submit}>
      <Input size="lg" autoFocus={!entry} control={control} name="title" />
      <div className="flex w-full">
        {entry && (
          <Button isIconOnly color="danger" onPress={handleDelete}>
            <Trash />
          </Button>
        )}
        <Button fullWidth type="submit" color="primary" isDisabled={!isDirty} className="ml-2">
          {entry ? "Aktualisieren" : "Erstellen"}
        </Button>
      </div>
    </Form>
  );
};

export { EntryForm };
