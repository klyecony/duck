"use client";
import type { MealType, TagType } from "@/types/db";
import { Button, Switch } from "@heroui/react";
import MealForm from "./MealForm";
import Tag from "../lib/Tag";
import { Text } from "../ui/Text";
import { tx } from "@instantdb/react";
import { db } from "@/db";
import { Pen } from "@phosphor-icons/react";
import { useModalStack } from "../ui/StackedModal";

interface MealProps {
  meal: MealType & {
    tags: TagType[];
  };
}
const Meal = ({ meal }: MealProps) => {
  const { add } = useModalStack();

  return (
    <div className="flex w-full items-center justify-between gap-1">
      <Text variant="large" weight="bold" behave="hug">
        {meal.title}
      </Text>
      <div className="flex grow gap-1">
        {meal?.tags.map(tag => (
          <Tag size="sm" key={tag?.id} tag={tag} />
        ))}
      </div>
      <Switch
        color="success"
        size="sm"
        isSelected={meal.isDone}
        onChange={() => db.transact(tx.meals[meal.id].update({ isDone: !meal.isDone }))}
      />
      <Button isIconOnly size="sm" variant="light" onPress={() => add(<MealForm meal={meal} />)}>
        <Pen />
      </Button>
    </div>
  );
};

export { Meal };
