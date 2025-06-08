"use client";
import type { EntryType, MealType, Scd2, TagType } from "@/types/db";
import { Button, Switch } from "@heroui/react";
import Tag from "../lib/Tag";
import { Text } from "../ui/Text";
import { tx } from "@instantdb/react";
import { db } from "@/db";
import { Pen } from "@phosphor-icons/react";
import { EntryForm } from "./EntryForm";
import { useModalStack } from "../ui/StackedModal";

interface EntryProps {
  entry: Scd2<EntryType> & {
    meals: MealType[];
    tags: TagType[];
  };
}

const Entry = ({ entry }: EntryProps) => {
  const { add } = useModalStack();

  return (
    <div className="flex w-full items-center justify-between gap-1">
      <Text variant="large" weight="bold" behave="hug">
        {entry.title}
      </Text>
      <div className="flex grow gap-1">
        {entry.tags.map(tag => (
          <Tag size="sm" variant="light" key={tag?.id} tag={tag} />
        ))}
      </div>
      <Switch
        color="success"
        size="sm"
        isSelected={entry.isDone}
        onChange={() => db.transact(tx.entries[entry.id].update({ isDone: !entry.isDone }))}
      />
      <Button isIconOnly size="sm" variant="light" onPress={() => add(<EntryForm entry={entry} />)}>
        <Pen />
      </Button>
    </div>
  );
};

export { Entry };
