"use client";
import type { MealType } from "@/types/db";
import { Card, CardHeader } from "@heroui/react";
import { useEditor } from "../lib/editor";
import MealForm from "./MealForm";

interface MealProps {
  meal?: MealType;
}
const Meal = ({ meal }: MealProps) => {
  const { openEditor } = useEditor();

  return (
    <Card
      isPressable
      isHoverable
      onPress={() =>
        openEditor({
          title: meal ? "Gericht bearbeiten" : "Gericht erstellen",
          children: <MealForm meal={meal} />,
        })
      }
    >
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
        <h4 className="font-bold text-large">{meal?.title || "Erstellen"}</h4>
      </CardHeader>
    </Card>
  );
};

export { Meal };
