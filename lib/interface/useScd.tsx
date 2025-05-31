import type { Scd } from "@/types/db";
import { useMemo } from "react";

interface HasIdAndcreatedAt {
  id: string;
  createdAt: string | number;
  isDeleted: boolean;
}

type UseScdProps<T extends HasIdAndcreatedAt> = Scd<T>[];

const useScd = <T extends HasIdAndcreatedAt>(list: UseScdProps<T>) => {
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
        .filter(i => !i.isDeleted),
    );
  }, [list]);
};

export default useScd;
