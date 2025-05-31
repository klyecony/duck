"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { EntryType, MealType, Scd } from "@/types/db";
import { Card, CardHeader, Form, SelectItem } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import useScd from "@/lib/interface/useScd";

interface mealProps {
  meal?: Scd<
    MealType & {
      entries?: Scd<EntryType>[];
    }
  >;
}

const Meal = ({ meal }: mealProps) => {
  const { user } = db.useAuth();
  const { openEditor, closeEditor } = useEditor();

  const { control, handleSubmit } = useForm<{
    title: string;
    entries: any;
  }>({
    defaultValues: {
      title: meal?.title || "",
    },
    mode: "onChange",
  });

  const { isLoading, data } = db.useQuery({
    entries: {
      origin: {},
    },
  });

  const latest = useScd((data?.entries as Scd<EntryType>[]) || []);

  const handleCreate = (input: { title: string }) => {
    const newId = id();
    db.transact(
      db.tx.meals[newId]
        .update({
          title: input.title,
          description: "",
          timeStamp: Date.now(),
          isDeleted: false,
        })
        .link({ createdBy: user?.id, origin: newId }),
    );
    closeEditor();
  };

  const handleUpdate = (values: { title: string }) =>
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
        }),
    );

  const handleDelete = (values: { title: string }) => {
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
        }),
    );
  };

  const submit = handleSubmit(values => {
    if (values.title !== meal?.title) {
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
    <Card
      isPressable
      isHoverable
      onPress={() =>
        openEditor({
          children: (
            <Form onSubmit={submit}>
              <Input
                size="lg"
                autoFocus={!meal}
                name="title"
                label="Neuer Eintrag"
                control={control}
              />
              <Select
                size="lg"
                name="entries"
                control={control}
                label="Zutaten"
                placeholder="Hinzufügen"
                selectedKeys={latest
                  .filter(latest => meal?.entries?.map(e => e.origin.id).includes(latest.origin.id))
                  .map(latest => latest.id)}
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                {latest.map(latest => (
                  <SelectItem key={latest.id}>{latest.title}</SelectItem>
                ))}
              </Select>
            </Form>
          ),
        })
      }
    >
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
        <h4 className="font-bold text-large">{meal?.title || "Erstellen"}</h4>
      </CardHeader>
    </Card>
  );
};

export default Meal;
