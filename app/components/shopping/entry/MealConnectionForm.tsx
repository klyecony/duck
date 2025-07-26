import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { isNotDeleted, isNotPlanned } from "@/lib/shopping";
import type { EntryType } from "@/types/db";
import {
  Listbox,
  ListboxItem,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";
import { tx } from "@instantdb/react";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { type Key, useMemo } from "react";

interface MealConnectionFormProps {
  entry: { id: string } & Partial<EntryType>;
  then?: () => void;
}

export const MealConnectionForm = ({ entry, then }: MealConnectionFormProps) => {
  const { data } = db.useQuery({
    meals: {
      entries: {},
      $: {
        where: {
          ...isNotPlanned,
          ...isNotDeleted,
        },
      },
    },
  });

  const items = useMemo(
    () => [
      {
        key: "notPlanned",
        label: "Nicht Geplant",
      },
      ...(data?.meals ?? []).map(meal => ({
        key: meal.id,
        label: meal.title || "Nicht benannt",
      })),
    ],
    [data],
  );

  const action = (key: Key) => {
    db.transact([
      tx.entries[entry.id].update({ ...entry }),
      ...(key === "notPlanned" ? [] : [tx.entries[entry.id].link({ meals: key as string })]),
    ]).then(then);
  };

  const hasEntry = (key: string) => data?.meals.some(m => m.entries?.some(e => e.id === key));

  return (
    <ModalContent>
      <ModalHeader>
        <Text variant="large" weight="bold">
          Gericht auswählen?
        </Text>
      </ModalHeader>
      <ModalBody className="px-4 pb-4">
        <ScrollShadow>
          <Listbox
            aria-label="Gericht auswählen"
            emptyContent="Keine Gericht verfügbar..."
            selectionMode="none"
            items={items}
            onAction={action}
          >
            {item => (
              <ListboxItem
                variant="flat"
                key={item.key}
                isReadOnly={hasEntry(item.key)}
                startContent={hasEntry(item.key) ? <CheckCircle /> : <Circle />}
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
