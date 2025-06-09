"use client";

import { db } from "@/db";
import { id } from "@instantdb/react";
import type { MealType, TagType } from "@/types/db";
import { Button, Form, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Trash } from "@phosphor-icons/react";
import { useScd0 } from "@/lib/interface/instant";
import { Select } from "@/components/ui/Select";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { DateInput } from "@/components/ui/DateInput";
import { type CalendarDate, getLocalTimeZone, parseDate } from "@internationalized/date";

interface MealFormProps {
  meal?: MealType & {
    tags: TagType[];
  };
}

type FieldValues = {
  title: string;
  tags: string[];
  plannedAt: CalendarDate;
};

const MealForm = ({ meal }: MealFormProps) => {
  const { user } = db.useAuth();
  const { close } = useModalStack();

  const { data } = db.useQuery({
    tags: {},
    profiles: {
      $: {
        where: {
          id: user?.id || "",
        },
      },
    },
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
      plannedAt: meal?.plannedAt
        ? parseDate(new Date(meal?.plannedAt).toLocaleDateString("en-CA"))
        : undefined,
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
          plannedAt: values.plannedAt.toDate(getLocalTimeZone()).toISOString(),
        })
        .link({ createdBy: user?.id, tags: values.tags }),
    );
  };

  const handleUpdate = (values: FieldValues) => {
    if (!meal) return;
    db.transact(
      db.tx.meals[meal.id]
        .update({
          title: values.title,
          updatedAt: Date.now(),
          plannedAt: values.plannedAt.toDate(getLocalTimeZone()).toISOString(),
        })
        .unlink({
          tags: meal.tags.map(tag => tag?.id).filter((id): id is string => typeof id === "string"),
        }),
    );
    db.transact(
      db.tx.meals[meal.id].link({
        tags: values.tags,
      }),
    );
  };

  const handleDelete = () => {
    if (!meal) return;
    db.transact(
      db.tx.meals[meal.id].update({
        deletedAt: new Date().toISOString(),
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
        <Text variant="large" weight="bold">
          {meal ? "Gericht bearbeiten" : "Neues Gericht erstellen"}
        </Text>
      </ModalHeader>
      <ModalBody className="overflow-scroll">
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
          <DateInput size="lg" name="plannedAt" control={control} aria-label="Geplantes Datum" />
          <div className="flex w-full">
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
          </div>
        </Form>
      </ModalBody>
    </ModalContent>
  );
};

export default MealForm;
