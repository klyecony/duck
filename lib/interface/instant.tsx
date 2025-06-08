import type { IsScd0, IsScd2, Scd0, Scd2 } from "@/types/db";
import { useMemo } from "react";

const useScd2 = <T extends IsScd2>(list: Scd2<T>[] | undefined) => {
  return useMemo(() => {
    if (!list || !Array.isArray(list)) return [];
    return Array.from(
      list
        .reduce((map, entry) => {
          const originId = entry.origin.id;
          const existing = map.get(originId);
          const isNewer =
            !existing ||
            new Date(entry.createdAt).getTime() > new Date(existing.createdAt).getTime();
          if (isNewer) map.set(originId, entry);
          return map;
        }, new Map<string, (typeof list)[number]>())
        .values()
        .filter(i => !i.deletedAt),
    );
  }, [list]);
};

const useScd0 = <T extends IsScd0>(list: Scd0<T>[] | undefined) => {
  return useMemo(() => {
    if (!list || !Array.isArray(list)) return [];
    return list.filter(i => i && !i.deletedAt);
  }, [list]);
};

export { useScd2, useScd0 };
