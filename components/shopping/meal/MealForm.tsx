"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { MealType } from "@/types/db";
import { Button, Form, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Trash } from "@phosphor-icons/react";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getNext7DaysInGerman, isNotDeleted } from "@/lib/shopping";

interface MealFormProps {
  meal?: MealType;
}

type FieldValues = {
  title: string;
  tags: string[];
  plannedAt: string;
};

const MealForm = ({ meal }: MealFormProps) => {
  const { user } = db.useAuth();
  const { close } = useModalStack();

  const { data } = db.useQuery({
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
      title: meal?.title || "",
      // tags: meal?.tags?.map(tag => tag?.id) || [],
      plannedAt: meal?.plannedAt ? new Date(meal?.plannedAt).toDateString() : undefined,
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
          favorite: false,
          createdAt: Date.now(),
          plannedAt: values.plannedAt && new Date(values.plannedAt).getTime(),
        })
        .link({ createdBy: user?.id, tags: values.tags }),
    );
  };

  const handleUpdate = (values: FieldValues) => {
    if (!meal) return;
    db.transact(
      db.tx.meals[meal.id].update({
        title: values.title,
        updatedAt: Date.now(),
        plannedAt: new Date(values.plannedAt).getTime(),
      }),
      // .unlink({
      //   tags: meal.tags.map(tag => tag?.id).filter((id): id is string => typeof id === "string"),
      // }),
    );
    // db.transact(
    //   db.tx.meals[meal.id].link({
    //     tags: values.tags,
    //   }),
    // );
  };

  const handleDelete = () => {
    if (!meal) return;
    db.transact(
      db.tx.meals[meal.id].update({
        deletedAt: Date.now(),
      }),
    );
    close();
  };

  const submit = handleSubmit(values => {
    if (isDirty) {
      if (meal) {
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
          {meal ? "Gericht bearbeiten" : "Neues Gericht erstellen"}
        </Text>
      </ModalHeader>
      <Form onSubmit={submit} className="grow gap-0">
        <ModalBody className="w-full">
          <Input
            size="lg"
            fullWidth
            autoFocus={!meal}
            name="title"
            aria-label="Gericht Titel"
            control={control}
          />
          {/* <Select
            size="lg"
            name="tags"
            control={control}
            aria-label="Gericht Tags"
            selectionMode="multiple"
            placeholder="Hinzufügen"
            items={
              data?.tags?.map(tag => ({
                key: tag?.id,
                children: tag?.title,
              })) || []
            }
          /> */}
          <Select
            size="lg"
            name="plannedAt"
            control={control}
            aria-label="Geplantes Datum"
            selectionMode="single"
            placeholder="Geplantes Datum"
            items={
              getNext7DaysInGerman().map(tag => ({
                key: tag?.date.toDateString(),
                children: tag?.label,
              })) || []
            }
          />
        </ModalBody>
        <ModalFooter className="w-full">
          {meal && (
            <Button isIconOnly color="danger" onPress={handleDelete}>
              <Trash />
            </Button>
          )}
          <Button
            fullWidth
            type="submit"
            color="primary"
            isDisabled={!isDirty}
            className={meal ? "ml-2" : ""}
          >
            {meal ? "Aktualisieren" : "Erstellen"}
          </Button>
        </ModalFooter>
      </Form>
    </ModalContent>
  );
};

export default MealForm;
