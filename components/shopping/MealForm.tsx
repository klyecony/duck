"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { EntryType, MealType, Scd } from "@/types/db";
import { Form } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import useScd from "@/lib/interface/useScd";

interface MealFormProps {
  meal?: Scd<
    MealType & {
      entries?: Scd<EntryType>[];
    }
  >;
}

type FieldValues = {
  title: string;
  entries: string[];
};

const MealForm = ({ meal }: MealFormProps) => {
  const { user } = db.useAuth();
  const { closeEditor } = useEditor();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FieldValues>({
    defaultValues: {
      title: meal?.title || "",
      entries: meal?.entries?.map(entry => entry.origin.id) || [],
    },
    mode: "onChange",
  });

  const { isLoading, data } = db.useQuery({
    entries: {
      origin: {},
    },
  });

  const latest = useScd((data?.entries as Scd<EntryType>[]) || []);

  const handleCreate = (values: FieldValues) => {
    const newId = id();
    db.transact(
      db.tx.meals[newId]
        .update({
          title: values.title,
          description: "",
          timeStamp: Date.now(),
          isDeleted: false,
        })
        .link({ createdBy: user?.id, origin: newId, entries: values.entries }),
    );
    closeEditor();
  };

  const handleUpdate = (values: FieldValues) =>
    db.transact(
      db.tx.meals[id()]
        .update({
          title: values.title,
          description: meal?.description,
          isDeleted: false,
          timeStamp: Date.now(),
        })
        .link({
          createdBy: user?.id,
          origin: meal?.origin.id,
          entries: values.entries,
        }),
    );

  const handleDelete = (values: FieldValues) => {
    db.transact(
      db.tx.meals[id()]
        .update({
          title: values.title || meal?.title,
          description: meal?.description,
          isDeleted: true,
          timeStamp: Date.now(),
        })
        .link({
          createdBy: user?.id,
          origin: meal?.origin.id,
          entries: values.entries,
        }),
    );
  };

  const submit = handleSubmit(values => {
    if (isDirty) {
      if (meal) {
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
      <Input
        size="lg"
        autoFocus={!meal}
        name="title"
        aria-label="Gericht Titel"
        control={control}
      />
      <Select
        size="lg"
        name="entries"
        control={control}
        aria-label="Gericht Zutaten"
        selectionMode="multiple"
        placeholder="Hinzufügen"
        isDisabled={isLoading}
        isLoading={isLoading}
        items={latest.map(entry => ({
          key: entry.origin.id,
          children: entry.title,
        }))}
      />
    </Form>
  );
};

export default MealForm;
