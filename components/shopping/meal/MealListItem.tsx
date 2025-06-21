"use client";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { getNext7DaysInGerman } from "@/lib/shopping";
import type { MealType } from "@/types/db";
import { Checkbox, Chip } from "@heroui/react";
import { tx } from "@instantdb/react";
import { Pen, Star } from "@phosphor-icons/react";
import { useDateFormatter } from "@react-aria/i18n";
import { useModalStack } from "../../ui/StackedModal";
import MealForm from "./MealForm";
import { PlannedAtForm } from "./PlannedAtForm";

interface MealListItemProps {
  meal: MealType;
}

export const MealListItem = ({ meal }: MealListItemProps) => {
  const { add } = useModalStack();
  const formatter = useDateFormatter({ weekday: "long" });

  const handleFavoriteChange = (isFavorite: boolean) => {
    db.transact(tx.meals[meal.id].update({ favorite: isFavorite }));
  };

  const getDateLabel = () => {
    if (!meal.plannedAt) return "Nicht Geplant";

    const plannedDate = new Date(meal.plannedAt);
    const weekdayMatch = getNext7DaysInGerman().find(
      day => day.date.toDateString() === plannedDate.toDateString(),
    );

    return weekdayMatch?.label || formatter.format(plannedDate);
  };

  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between py-0.5"
      onClick={() => add(<MealForm meal={meal} />)}
    >
      <Text weight="bold" behave="hug">
        {meal.title}
      </Text>
      <div className="flex gap-0.5">
        <Chip
          radius="sm"
          color="secondary"
          variant="light"
          size="sm"
          endContent={<Pen />}
          onClose={() => add(<PlannedAtForm meal={meal} />)}
          className="cursor-pointer"
        >
          {getDateLabel()}
        </Chip>
        <Checkbox
          classNames={{
            wrapper: "m-0",
          }}
          icon={({ isSelected: _, isIndeterminate: __, disableAnimation: ___, ...props }) => (
            <Star {...props} />
          )}
          color="secondary"
          isSelected={meal.favorite}
          onValueChange={handleFavoriteChange}
          onClick={e => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
