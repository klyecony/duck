"use client";
import type { EntryType, MealType, Scd2, TagType } from "@/types/db";
import { Card, CardHeader } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { EntryForm } from "./EntryForm";

interface EntryProps {
  entry?: Scd2<EntryType> & {
    meals: MealType[];
    tags: TagType[];
  };
}

const Entry = ({ entry }: EntryProps) => {
  const { openEditor } = useEditor();

  return (
    <Card
      isPressable
      isHoverable
      onPress={() =>
        openEditor({
          title: entry ? "Eintrag bearbeiten" : "Eintrag erstellen",
          children: <EntryForm entry={entry} />,
        })
      }
    >
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
        <h4 className="font-bold text-large">{entry?.title || "Erstellen"}</h4>
      </CardHeader>
    </Card>
  );
};

export { Entry };
