"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { EntryType, MealType, Scd2, TagType } from "@/types/db";
import { Button, Form, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import { Trash } from "@phosphor-icons/react";
import { Select } from "../ui/Select";
import { useScd0 } from "@/lib/interface/instant";
import { useModalStack } from "../ui/StackedModal";
import { Text } from "../ui/Text";

interface EntryProps {
  entry?: Scd2<EntryType> & {
    meals: MealType[];
    tags: TagType[];
  };
}

type FieldValues = {
  title: string;
  meals: string[];
  tags: string[];
};

const EntryForm = ({ entry }: EntryProps) => {
  const { user } = db.useAuth();

  const { close } = useModalStack();

  const { data } = db.useQuery({
    meals: {},
    tags: {},
  });

  const availableMeals = useScd0(data?.meals);
  const entryMeals = useScd0(entry?.meals);

  const availableTags = useScd0(data?.tags);
  const entryTags = useScd0(entry?.tags);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FieldValues>({
    defaultValues: {
      title: entry?.title || "",
      meals: entryMeals.map(meal => meal?.id) || [],
      tags: entryTags?.map(tag => tag?.id) || [],
    },
    mode: "onChange",
  });

  const handleCreate = (values: FieldValues) => {
    const newId = id();
    db.transact(
      db.tx.entries[newId]
        .update({
          title: values.title,
          description: "",
          createdAt: Date.now(),
          isDeleted: false,
        })
        .link({
          createdBy: user?.id,
          origin: newId,
          meals: values.meals,
          tags: values.tags,
        }),
    );
  };

  const handleUpdate = (values: FieldValues) =>
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
          meals: values.meals,
          tags: values.tags,
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
    close();
  });

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="large" weight="bold">
          {entry ? "Eintrag bearbeiten" : "Neuen Eintrag erstellen"}
        </Text>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={submit}>
          <Input size="lg" autoFocus={!entry} control={control} name="title" />
          <Select
            size="lg"
            name="meals"
            control={control}
            aria-label="Gericht Zutaten"
            selectionMode="multiple"
            placeholder="Hinzufügen"
            items={availableMeals.map(meal => ({
              key: meal?.id,
              children: meal?.title,
            }))}
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
      </ModalBody>
    </ModalContent>
  );
};

export { EntryForm };
