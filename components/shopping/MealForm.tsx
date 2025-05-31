"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { EntryType, MealType, Scd } from "@/types/db";
import { Button, Form } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import useScd from "@/lib/interface/useScd";
import { Trash } from "@phosphor-icons/react";

interface MealFormProps {
  meal?: MealType & {
    entries?: Scd<EntryType>[];
  };
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
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isDeleted: false,
        })
        .link({ createdBy: user?.id, entries: values.entries }),
    );
    closeEditor();
  };

  const handleUpdate = (values: FieldValues) => {
    if (!meal) return;
    db.transact(
      db.tx.meals[meal.id]
        .update({
          title: values.title,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
        .unlink({
          entries: meal?.entries?.map(entry => entry.origin.id) || [],
        })
        .link({
          entries: values.entries,
        }),
    );
  };

  const handleDelete = () => {
    if (!meal) return;
    db.transact(
      db.tx.meals[meal.id].update({
        isDeleted: true,
        updatedAt: Date.now(),
      }),
    );
  };

  const submit = handleSubmit(values => {
    if (isDirty) {
      if (meal) {
        handleUpdate(values);
      } else {
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
      <div className="flex w-full">
        {meal && (
          <Button isIconOnly color="danger" onPress={handleDelete}>
            <Trash />
          </Button>
        )}
        <Button fullWidth type="submit" color="primary" isDisabled={!isDirty} className="ml-2">
          {meal ? "Aktualisieren" : "Erstellen"}
        </Button>
      </div>
    </Form>
  );
};

export default MealForm;
