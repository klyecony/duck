"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { MealType, TagType } from "@/types/db";
import { Button, Form } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Trash } from "@phosphor-icons/react";
import { useScd0 } from "@/lib/interface/instant";
import { Select } from "../ui/select";

interface MealFormProps {
  meal?: MealType & {
    tags: TagType[];
  };
}

type FieldValues = {
  title: string;
  tags?: string[];
};

const MealForm = ({ meal }: MealFormProps) => {
  const { user } = db.useAuth();
  const { closeEditor } = useEditor();

  const { data } = db.useQuery({
    tags: {},
  });

  const availableTags = useScd0(data?.tags);
  const mealTags = useScd0(meal?.tags);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FieldValues>({
    defaultValues: {
      title: meal?.title || "",
      tags: mealTags?.map(tag => tag?.id) || [],
    },
    mode: "onChange",
  });

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
        .link({ createdBy: user?.id, tags: values.tags }),
    );
    closeEditor();
  };

  const handleUpdate = (values: FieldValues) => {
    if (!meal) return;
    db.transact(
      db.tx.meals[meal.id]
        .update({
          title: values.title,
          updatedAt: Date.now(),
        })
        .link({ tags: values.tags }),
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
        name="tags"
        control={control}
        aria-label="Gericht Tags"
        selectionMode="multiple"
        placeholder="Hinzufügen"
        items={availableTags.map(tag => ({
          key: tag?.id,
          children: tag?.title,
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
