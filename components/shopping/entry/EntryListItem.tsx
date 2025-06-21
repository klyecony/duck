"use client";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import type { EntryTypeWithMeals } from "@/types/shopping";
import { Checkbox, Chip } from "@heroui/react";
import { tx } from "@instantdb/react";
import { EntryForm } from "./EntryForm";
import { useModalStack } from "../../ui/StackedModal";
import { getDaysUntilNextPlanned } from "@/lib/shopping";

interface EntryListItemProps {
  entry: EntryTypeWithMeals;
}

export const EntryListItem = ({ entry }: EntryListItemProps) => {
  const { add } = useModalStack();
  const handleDoneChange = (isDone: boolean) => {
    db.transact(
      tx.entries[entry.id].update({
        doneAt: isDone ? Date.now() : null,
      }),
    );
  };

  const getUrgencyInfo = () => {
    const daysUntil = getDaysUntilNextPlanned(entry.meals);
    const isUrgent = ["Heute", "Morgen"].includes(daysUntil);

    return {
      label: daysUntil,
      color: isUrgent ? "danger" : "secondary",
    };
  };

  const urgencyInfo = getUrgencyInfo();

  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-between gap-1 py-0.5 transition-opacity duration-300 ${
        entry?.doneAt ? "opacity-30" : "opacity-100"
      }`}
      onClick={() => add(<EntryForm entry={entry} />)}
    >
      <Text weight="bold" behave="hug">
        {entry.title}
      </Text>
      <div className="flex gap-0.5">
        <Chip
          radius="sm"
          color={urgencyInfo.color as "danger" | "secondary"}
          variant="light"
          size="sm"
        >
          {urgencyInfo.label}
        </Chip>
        <Checkbox
          classNames={{
            wrapper: "m-0",
          }}
          color="secondary"
          isSelected={!!entry.doneAt}
          onValueChange={handleDoneChange}
          onClick={e => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
