"use client";

import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { getNext7DaysInGerman, isNotDeleted } from "@/lib/shopping";
import {
  Listbox,
  ListboxItem,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { tx } from "@instantdb/react";
import { BowlFood, Circle } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useModalStack } from "../../ui/StackedModal";
import type { MealType } from "@/types/db";

interface PlannedAtFormProps {
  meal: MealType;
}

export const PlannedAtForm = ({ meal }: PlannedAtFormProps) => {
  const { close } = useModalStack();
  const { data } = db.useQuery({
    meals: {
      $: {
        where: {
          ...isNotDeleted,
        },
      },
    },
  });

  const weekdayItems = useMemo(
    () =>
      getNext7DaysInGerman().map(({ date, label }) => ({
        key: date.toDateString(),
        label: label,
      })),
    [],
  );

  const selectedKeys = useMemo(() => {
    if (!meal.plannedAt) return new Set([]);
    return new Set([new Date(meal.plannedAt).toDateString()]);
  }, [meal.plannedAt]);

  const handleSelectionChange = (selection: any) => {
    const selectedDate = [...selection][0];
    if (selectedDate) {
      db.transact(
        tx.meals[meal.id].update({
          plannedAt: new Date(selectedDate).getTime(),
        }),
      ).then(close);
    }
  };

  const isDateOccupied = (dateKey: string) => {
    return data?.meals.some(
      m => m.id !== meal.id && m.plannedAt && new Date(m.plannedAt).toDateString() === dateKey,
    );
  };

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="large" weight="bold">
          Datum ändern
        </Text>
      </ModalHeader>
      <ModalBody className="overflow-scroll px-2">
        <Listbox
          aria-label="Datum auswählen"
          emptyContent="Keine Termine verfügbar..."
          selectionMode="single"
          items={weekdayItems}
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          {item => (
            <ListboxItem
              variant="flat"
              key={item.key}
              startContent={isDateOccupied(item.key) ? <BowlFood /> : <Circle />}
              textValue={item.label}
            >
              <Text behave="truncate">{item.label}</Text>
            </ListboxItem>
          )}
        </Listbox>
      </ModalBody>
      <ModalFooter />
    </ModalContent>
  );
};
