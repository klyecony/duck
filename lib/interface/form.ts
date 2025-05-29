import { useForm, type UseFormProps, type UseFormReturn, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import type { DB, AppSchema } from "@/db/instant.schema";

import { z, type ZodTypeAny } from "zod";
import type { DataAttrDef } from "@instantdb/react";
import schema from "@/db/instant.schema";

export function useInstantForm<T extends keyof AppSchema["entities"]>(
  entity: T,
  options?: UseFormProps<DB<T>>,
  zodSchema?: ZodType<DB<T>>,
): UseFormReturn<DB<T>> {
  const attrs = schema.entities[entity].attrs as Record<string, DataAttrDef<any, any>>;
  const finalSchema = zodSchema ?? createZodSchemaFromEntity(attrs);

  return useForm<DB<T>>({
    ...options,
    resolver: zodResolver(finalSchema) as Resolver<DB<T>>,
  });
}

export function createZodSchemaFromEntity(attrs: Record<string, DataAttrDef<any, any>>) {
  const shape: Record<string, ZodTypeAny> = {};

  const { id, ...filteredAttrs } = attrs;

  for (const key in filteredAttrs) {
    const def = attrs[key];
    if (!def) continue;
    const valueType = def.valueType as string;
    let zodType: ZodTypeAny;

    switch (valueType) {
      case "string":
        zodType = z.string();
        break;
      // case "json":
      //TODO: Create generic from type HARD
      case "number":
        zodType = z.number();
        break;
      case "boolean":
        zodType = z.boolean();
        break;
      case "date":
        zodType = z.coerce.date();
        break;
      default:
        zodType = z.any();
    }

    if (def.required === false) zodType = zodType.optional();
    shape[key] = zodType;
  }

  return z.object(shape);
}
