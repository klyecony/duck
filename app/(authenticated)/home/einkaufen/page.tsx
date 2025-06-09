"use client";
import { Creator } from "@/components/lib/Creator";
import Tag from "@/components/lib/Tag";
import { EntryForm } from "@/components/shopping/EntryForm";
import MealForm from "@/components/shopping/MealForm";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { useScd0 } from "@/lib/interface/instant";
import type {} from "@/types/db";
import { Accordion, AccordionItem, Checkbox, Chip, Divider } from "@heroui/react";
import { tx } from "@instantdb/react";
import { CaretDown } from "@phosphor-icons/react";
import { useDateFormatter } from "@react-aria/i18n";

const Page = () => {
  const { add } = useModalStack();
  const formatter = useDateFormatter({ weekday: "long" });

  const { isLoading, data } = db.useQuery({
    entries: {
      origin: {},
      tags: {},
      meals: {},
    },
    meals: {
      tags: {},
    },
  });

  const entries = useScd0(data?.entries);
  const meals = useScd0(data?.meals);

  if (!data) return <div>No data available</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Creator />
      <Accordion>
        <AccordionItem
          key="1"
          aria-label="gerichte öffnen"
          classNames={{
            content: "flex w-full flex-col items-start justify-start gap-2 pt-0 pb-4",
          }}
          indicator={<CaretDown size={24} className="fill-foreground" />}
          title={
            <Text weight="bold" variant="h2" behave="hug">
              Gerichte
            </Text>
          }
        >
          {meals.map(meal => (
            <div key={meal.id} className="flex w-full items-center justify-between gap-1">
              <div className="flex flex-col" onClick={() => add(<MealForm meal={meal} />)}>
                <Text weight="bold" variant="large" behave="hug">
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
                size="lg"
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
        </AccordionItem>
      </Accordion>
      <Divider />
      <div className="flex w-full grow flex-col items-start justify-start p-2">
        {entries.map(entry => (
          <div key={entry.id} className="flex w-full items-center justify-between gap-1">
            <div className="flex flex-col" onClick={() => add(<EntryForm entry={entry} />)}>
              <Text weight="bold" variant="large" behave="hug">
                {entry.title}
              </Text>
              <div className="flex gap-0.5">
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
              size="lg"
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
