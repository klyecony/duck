"use client";
import type { EntryType, MealType, Scd2, TagType } from "@/types/db";
import { Button, Switch } from "@heroui/react";
import { useEditor } from "../lib/Editor";
import Tag from "../lib/Tag";
import { Text } from "../ui/Text";
import { tx } from "@instantdb/react";
import { db } from "@/db";
import { Pen } from "@phosphor-icons/react";
import { EntryForm } from "./EntryForm";

interface EntryProps {
  entry: Scd2<EntryType> & {
    meals: MealType[];
    tags: TagType[];
  };
}

const Entry = ({ entry }: EntryProps) => {
  const { openEditor } = useEditor();

  return (
    <div className="flex w-full items-center justify-between gap-1">
      <Text variant="large" weight="bold" behave="hug">
        {entry.title}
      </Text>
      <div className="flex grow gap-1">
        {entry.tags.map(tag => (
          <Tag size="sm" key={tag?.id} tag={tag} />
        ))}
      </div>
      <Switch
        color="success"
        size="sm"
        isSelected={entry.isDone}
        onChange={() => db.transact(tx.entries[entry.id].update({ isDone: !entry.isDone }))}
      />
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() =>
          openEditor({
            title: "Gericht bearbeiten",
            children: <EntryForm entry={entry} />,
          })
        }
      >
        <Pen />
      </Button>
    </div>
  );
};

export { Entry };
