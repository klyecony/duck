import { Text } from "@/components/ui/Text";
import { db } from "@/db";
import type {
  EntryType,
  IngredientType,
  MealType,
  RecipeIngredientType,
  RecipeType,
  UserType,
} from "@/types/db";
import { Card, Chip } from "@heroui/react";
import { id, tx } from "@instantdb/react";
import { CheckCircle, ChefHat, Clock, PlusCircle, Users } from "@phosphor-icons/react";

type RecipeProps = RecipeType & {
  createdBy?: UserType;
  recipeIngredients: (RecipeIngredientType & {
    ingredient: IngredientType;
  })[];
  meal?: {
    entries: EntryType[];
  } & MealType;
};

const Recipe = ({
  prepTime = 0,
  cookTime = 0,
  servings,
  recipeIngredients,
  instructions,
  meal,
}: RecipeProps) => {
  const overallTime = prepTime + cookTime;

  return (
    <div className="w-full space-y-6 px-2.5 py-0.5">
      <Card shadow="sm" className="flex p-4">
        {recipeIngredients.map(recipeIngredient => (
          <div key={recipeIngredient.id} className="flex flex-row items-center gap-2">
            <Text variant="small" behave="truncate" weight="semibold" className="flex-grow ">
              {recipeIngredient.ingredient.title}
            </Text>
            <Text
              variant="small"
              behave="hug"
              className="min-w-14 whitespace-nowrap text-orange-600"
            >
              {recipeIngredient.amount} {recipeIngredient.unit}
            </Text>
            {meal?.entries?.find(entry => entry?.title === recipeIngredient?.ingredient?.title) ? (
              <CheckCircle className="shrink-0" />
            ) : (
              <PlusCircle
                className="shrink-0"
                onClick={() => {
                  if (meal) {
                    console.log("Adding ingredient to meal", recipeIngredient.ingredient.title);
                    db.transact(
                      tx.entries[id()]
                        .update({
                          title: recipeIngredient.ingredient.title,
                          createdAt: Date.now(),
                        })
                        .link({
                          ingredient: recipeIngredient.ingredient.id,
                          meals: meal.id,
                        }),
                    );
                  }
                }}
              />
            )}
          </div>
        ))}
      </Card>
      <div className="flex items-center gap-2">
        {overallTime > 0 && (
          <Chip color="secondary" size="sm" variant="light" startContent={<Clock />}>
            <Text variant="tiny" weight="medium">
              {prepTime + cookTime} Min
            </Text>
          </Chip>
        )}
        <Chip color="secondary" size="sm" variant="light" startContent={<Users />}>
          <Text variant="tiny" weight="medium">
            {servings} Portionen
          </Text>
        </Chip>
        <Chip color="secondary" size="sm" variant="light" startContent={<ChefHat />}>
          <Text variant="tiny" weight="medium">
            Einfach
          </Text>
        </Chip>
      </div>

      {instructions && (
        <div className="space-y-2">
          <Text variant="large" weight="semibold">
            Kochen
          </Text>
          <div className="prose max-w-none">
            {instructions.split("\n\n").map((step, index) => (
              <div key={index} className="mb-4">
                <Text variant="medium" className="text-gray-700 leading-relaxed">
                  {step}
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
