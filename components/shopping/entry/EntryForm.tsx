"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { EntryType, MealType } from "@/types/db";
import { Button, Form, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Trash } from "@phosphor-icons/react";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { isNotDeleted, isNotDone } from "@/lib/shopping";

interface EntryProps {
  entry?: EntryType & {
    meals: MealType[];
    // tags: TagType[];
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
    meals: {
      $: {
        where: {
          ...isNotDeleted,
          ...isNotDone,
        },
      },
    },
    tags: {
      $: {
        where: {
          ...isNotDeleted,
        },
      },
    },
    profiles: {
      $: {
        where: {
          id: user?.id || "",
        },
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FieldValues>({
    defaultValues: {
      title: entry?.title || "",
      meals: entry?.meals.map(meal => meal?.id) || [],
      // tags: entry?.tags?.map(tag => tag?.id) || [],
    },
    mode: "onChange",
  });

  const handleCreate = (values: FieldValues) => {
    db.transact(
      db.tx.entries[id()]
        .update({
          title: values.title,
          createdAt: Date.now(),
        })
        .link({
          createdBy: user?.id,
          meals: values.meals,
          tags: values.tags,
        }),
    );
  };

  const handleUpdate = (values: FieldValues) => {
    if (!entry) return;
    db.transact(
      db.tx.entries[entry.id]
        .update({
          title: values.title,
          updatedAt: Date.now(),
        })
        .unlink({
          meals: entry.meals.map(meal => meal?.id),
          // tags: entry.tags.map(tag => tag?.id),
        }),
    );
    db.transact(
      db.tx.entries[entry.id].link({
        meals: values.meals,
        // tags: values.tags,
      }),
    );
  };

  const handleDelete = () => {
    if (!entry) return;
    db.transact(
      db.tx.entries[entry.id].update({
        deletedAt: Date.now(),
      }),
    );
    close();
  };

  const submit = handleSubmit(values => {
    if (isDirty) {
      if (entry) {
        handleUpdate(values);
        close();
      } else {
        handleCreate(values);
        !data?.profiles?.[0]?.isMultiple && close();
      }
    }
  });

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="h2" weight="bold">
          {entry ? "Eintrag bearbeiten" : "Neuen Eintrag erstellen"}
        </Text>
      </ModalHeader>
      <Form onSubmit={submit} className="grow gap-0">
        <ModalBody className="w-full py-4">
          <Input
            size="lg"
            autoFocus={!entry}
            control={control}
            name="title"
            placeholder="Eintrag"
          />
          <Select
            size="lg"
            name="meals"
            control={control}
            aria-label="Gericht Zutaten"
            selectionMode="multiple"
            placeholder="Gerichte"
            items={
              data?.meals.map(meal => ({
                key: meal?.id,
                children: meal?.title,
              })) || []
            }
          />
          {/* <Select
            size="lg"
            name="tags"
            control={control}
            aria-label="Gericht Tags"
            selectionMode="multiple"
            placeholder="Tags"
            items={
              data?.tags.map(tag => ({
                key: tag?.id,
                children: tag?.title,
              })) || []
            }
          /> */}
        </ModalBody>
        <ModalFooter className="w-full">
          {entry && (
            <Button isIconOnly color="danger" onPress={handleDelete}>
              <Trash />
            </Button>
          )}
          <Button
            fullWidth
            type="submit"
            color="primary"
            isDisabled={!isDirty}
            className={entry ? "ml-2" : ""}
          >
            {entry ? "Aktualisieren" : "Erstellen"}
          </Button>
        </ModalFooter>
      </Form>
    </ModalContent>
  );
};

export { EntryForm };
