import Recipe from "@/components/Recipe";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { isNotDeleted } from "@/lib/shopping";
import { Button, DrawerBody, DrawerContent, DrawerHeader, ScrollShadow } from "@heroui/react";
import { Pencil, Swap, Trash } from "@phosphor-icons/react";
import { useDateFormatter } from "@react-aria/i18n";
import { PlannedAtForm } from "./PlannedAtForm";
import { FromRecipeForm } from "./FromRecipeForm";
import { tx } from "@instantdb/react";

const Meal = ({
  mealId,
}: {
  mealId: string;
}) => {
  const formatter = useDateFormatter({ weekday: "long" });
  const { add, remove } = useModalStack();
  const { data } = db.useQuery({
    meals: {
      $: {
        where: {
          ...isNotDeleted,
          id: mealId,
        },
      },
      recipe: {
        recipeIngredients: {
          ingredient: {},
        },
      },
    },
  });

  const meal = data?.meals[0];
  const recipe = data?.meals[0]?.recipe;

  return (
    <DrawerContent>
      <DrawerHeader className="flex items-center justify-between">
        <Button
          variant="light"
          color="danger"
          isIconOnly
          onPress={() => {
            remove();
            meal &&
              db.transact(
                tx.meals[meal.id].update({
                  deletedAt: Date.now(),
                }),
              );
          }}
        >
          <Trash />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            endContent={<Pencil />}
            color="secondary"
            onPress={() => meal && add(<PlannedAtForm meal={meal} />)}
          >
            {meal?.plannedAt ? formatter.format(new Date(meal.plannedAt)) : "Nicht geplant"}
          </Button>
          <Button
            variant="flat"
            color="secondary"
            isIconOnly
            onPress={() =>
              add(
                <FromRecipeForm
                  onRecipeSelect={newRecipe => {
                    meal &&
                      db
                        .transact(
                          tx.meals[meal.id]
                            .update({
                              title: newRecipe.title,
                              updatedAt: Date.now(),
                            })
                            .link({
                              recipe: newRecipe.id,
                            }),
                        )
                        .then(remove);
                  }}
                />,
              )
            }
          >
            <Swap />
          </Button>
        </div>
      </DrawerHeader>
      <DrawerBody>
        <ScrollShadow>
          <Text variant="h2" weight="semibold" className="my-4">
            {meal?.title}
          </Text>
          {/*// @ts-ignore*/}
          {recipe && <Recipe {...recipe} />}
        </ScrollShadow>
      </DrawerBody>
    </DrawerContent>
  );
};

export default Meal;
