import { Text } from "@/components/ui/Text";
import type { IngredientType, RecipeIngredientType, RecipeType, UserType } from "@/types/db";
import { Card, Chip } from "@heroui/react";
import { ChefHat, Clock, Users } from "@phosphor-icons/react";
import { Fragment } from "react";

type RecipeProps = RecipeType & {
  createdBy?: UserType;
  recipeIngredients: (RecipeIngredientType & {
    ingredient: IngredientType;
  })[];
};

const Recipe = ({
  prepTime = 0,
  cookTime = 0,
  servings,
  recipeIngredients,
  instructions,
}: RecipeProps) => {
  const overallTime = prepTime + cookTime;
  return (
    <div className="w-full space-y-6 px-2.5 py-0.5">
      <Card shadow="sm" className="grid grid-cols-3 gap-y-0.5 p-4">
        {recipeIngredients.map(recipeIngredient => (
          <Fragment key={recipeIngredient.id}>
            <Text variant="small" behave="truncate" weight="semibold" className="col-span-2">
              {recipeIngredient.ingredient.title}
            </Text>
            <Text variant="small" behave="truncate" className="text-orange-600">
              {recipeIngredient.amount} {recipeIngredient.unit}
            </Text>
          </Fragment>
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
