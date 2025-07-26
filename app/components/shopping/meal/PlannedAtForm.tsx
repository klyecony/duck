import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { getNext7DaysInGerman, isNotDeleted } from "@/lib/shopping";
import {
  Listbox,
  ListboxItem,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";
import { tx } from "@instantdb/react";
import { BowlFoodIcon, CircleIcon } from "@phosphor-icons/react";
import { type Key, useMemo } from "react";
import type { MealType } from "@/types/db";

interface PlannedAtFormProps {
  meal: { id: string } & Partial<MealType>;
  then?: () => void;
  before?: () => void;
}

export const PlannedAtForm = ({ meal, then, before }: PlannedAtFormProps) => {
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
    () => [
      {
        key: "not planned",
        label: "Nicht Geplant",
      },
      ...getNext7DaysInGerman().map(({ date, label }) => ({
        key: date.toDateString(),
        label: label,
      })),
    ],
    [data],
  );

  const handleSelectionChange = (data: Key) => {
    if (before) before();
    db.transact(
      tx.meals[meal.id].update({
        ...meal,
        plannedAt: data === "not planned" ? null : new Date(data as string).getTime(),
      }),
    ).then(then);
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
      <ModalBody className="px-4 pb-4">
        <ScrollShadow>
          <Listbox
            aria-label="Datum auswählen"
            emptyContent="Keine Termine verfügbar..."
            selectionMode="none"
            items={weekdayItems}
            onAction={handleSelectionChange}
          >
            {item => (
              <ListboxItem
                variant="flat"
                key={item.key}
                startContent={isDateOccupied(item.key) ? <BowlFoodIcon /> : <CircleIcon />}
                textValue={item.label}
              >
                <Text behave="truncate">{item.label}</Text>
              </ListboxItem>
            )}
          </Listbox>
        </ScrollShadow>
      </ModalBody>
    </ModalContent>
  );
};
