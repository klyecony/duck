"use client";

import Tag from "@/components/Tag";
import { EntryForm } from "@/components/shopping/EntryForm";
import MealForm from "@/components/shopping/MealForm";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { getDaysUntilNextPlanned } from "@/lib/interface/data";
import { isNotDeleted, isNotDone } from "@/lib/interface/instant";
import { Checkbox, Chip, Divider } from "@heroui/react";
import { tx } from "@instantdb/react";
import { useDateFormatter } from "@react-aria/i18n";

const Page = () => {
  const { add } = useModalStack();
  const formatter = useDateFormatter({ weekday: "long" });

  const { data, error } = db.useQuery({
    entries: {
      tags: {
        $: {
          where: {
            ...isNotDeleted,
          },
        },
      },
      meals: {
        $: {
          where: {
            ...isNotDeleted,
            ...isNotDone,
          },
        },
      },
    },
    meals: {
      $: {
        where: {
          ...isNotDeleted,
          ...isNotDone,
        },
      },
      tags: {
        $: {
          where: {
            ...isNotDeleted,
          },
        },
      },
    },
  });

  // const [activeTab, setActiveTab] = useState("entries");

  error && console.log(error);

  return (
    <>
      <div className="flex w-full grow flex-col items-start justify-start px-1 py-1.5">
        {data?.meals?.map(meal => (
          <div
            key={meal.id}
            className={`flex w-full items-center justify-between gap-1 transition-opacity duration-300 ${meal.doneAt ? "opacity-30" : "opacity-100"}`}
          >
            <div className="flex flex-col" onClick={() => add(<MealForm meal={meal} />)}>
              <Text weight="bold" behave="hug">
                {meal.title}
              </Text>
              <div className="flex gap-0.5">
                <Chip radius="sm" color="secondary" variant="flat" size="sm">
                  {meal.plannedAt ? formatter.format(new Date(meal.plannedAt)) : "Nicht Geplant"}
                </Chip>
                {meal?.tags.length > 0 && "-"}
                {meal?.tags.map(tag => (
                  <Tag size="sm" variant="light" key={tag?.id} tag={tag} />
                ))}
              </div>
            </div>
            <div className="block grow" />
            <Checkbox
              color="secondary"
              classNames={{
                wrapper: "m-0",
              }}
              isSelected={!!meal.doneAt}
              onValueChange={v =>
                db.transact(tx.meals[meal.id].update({ doneAt: v ? Date.now() : null }))
              }
            />
          </div>
        ))}
      </div>
      <Divider />
      <div className="flex w-full grow flex-col items-start justify-start px-1 py-1.5">
        {data?.entries?.map(entry => (
          <div
            key={entry.id}
            className={`flex w-full items-center justify-between gap-1 transition-opacity duration-300 ${
              entry.doneAt ? "opacity-30" : "opacity-100"
            }`}
          >
            <div className="flex flex-col" onClick={() => add(<EntryForm entry={entry} />)}>
              <Text weight="bold" behave="hug">
                {entry.title}
              </Text>
              <div className="flex gap-0.5">
                <Chip
                  radius="sm"
                  color={
                    ["Heute", "Morgen"].includes(getDaysUntilNextPlanned(entry.meals))
                      ? "danger"
                      : "secondary"
                  }
                  variant="flat"
                  size="sm"
                >
                  {entry.meals.some(e => e.plannedAt !== undefined)
                    ? getDaysUntilNextPlanned(entry.meals)
                    : "Vorrat"}
                </Chip>
                {entry?.tags.length > 0 && "-"}
                {entry?.tags.map(tag => (
                  <Tag size="sm" variant="light" key={tag?.id} tag={tag} />
                ))}
              </div>
            </div>
            <div className="grow" />
            <Checkbox
              classNames={{
                wrapper: "m-0",
              }}
              color="secondary"
              isSelected={!!entry.doneAt}
              onValueChange={v =>
                db.transact(tx.entries[entry.id].update({ doneAt: v ? Date.now() : null }))
              }
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
