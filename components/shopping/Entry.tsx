"use client";
import type { EntryType, Scd } from "@/types/db";
import { Card, CardHeader } from "@heroui/react";
import { useEditor } from "../lib/editor";
import { EntryForm } from "./EntryForm";

interface EntryProps {
  entry?: Scd<
    EntryType & {
      entries?: Scd<EntryType>[];
    }
  >;
}

const Entry = ({ entry }: EntryProps) => {
  const { openEditor } = useEditor();

  return (
    <Card
      isPressable
      isHoverable
      onPress={() =>
        openEditor({
          title: entry ? "Gericht bearbeiten" : "Gericht erstellen",
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
