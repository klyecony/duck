import Recipe from "@/components/Recipe";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import { isNotDeleted } from "@/lib/shopping";
import { Button, DrawerBody, DrawerContent, DrawerHeader, ScrollShadow } from "@heroui/react";
import { Pencil, Star, Trash } from "@phosphor-icons/react";
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

  const { user } = db.useAuth();
  const { data } = db.useQuery({
    profiles: {
      $: {
        where: {
          id: user?.id || "",
        },
      },
      favoriteRecipes: {},
    },
    meals: {
      recipe: {
        recipeIngredients: {
          ingredient: {},
        },
      },
      entries: {},
      $: {
        where: {
          ...isNotDeleted,
          id: mealId,
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
          size="sm"
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
            variant="light"
            size="sm"
            color="secondary"
            onPress={() => meal && add(<PlannedAtForm meal={meal} then={remove} />)}
          >
            {meal?.plannedAt ? formatter.format(new Date(meal.plannedAt)) : "Nicht geplant"}
          </Button>
          {recipe && (
            <Button
              size="sm"
              variant="light"
              color="secondary"
              isIconOnly
              onPress={() => {
                if (meal?.recipe?.id && user?.id) {
                  const isFavorite = data?.profiles[0]?.favoriteRecipes?.some(
                    (fav: any) => fav.id === recipe?.id,
                  );
                  if (isFavorite) {
                    db.transact(
                      tx.profiles[user.id].unlink({
                        favoriteRecipes: recipe?.id || "",
                      }),
                    );
                  } else {
                    db.transact(
                      tx.profiles[user.id].link({
                        favoriteRecipes: recipe?.id || "",
                      }),
                    );
                  }
                }
              }}
            >
              <Star
                weight={
                  data?.profiles[0]?.favoriteRecipes?.some((fav: any) => fav.id === recipe?.id)
                    ? "fill"
                    : "regular"
                }
              />
            </Button>
          )}
          <Button
            size="sm"
            variant="light"
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
            <Pencil />
          </Button>
        </div>
      </DrawerHeader>
      <DrawerBody>
        <ScrollShadow>
          <Text variant="h2" weight="semibold" className="my-4">
            {meal?.title}
          </Text>
          {/*// @ts-ignore*/}
          {recipe && <Recipe {...recipe} meal={meal} />}
        </ScrollShadow>
      </DrawerBody>
    </DrawerContent>
  );
};

export default Meal;
