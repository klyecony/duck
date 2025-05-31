import type { Scd } from "@/types/db";
import { useMemo } from "react";

interface HasIdAndTimeStamp {
  id: string;
  timeStamp: string | number;
  isDeleted: boolean;
}

type UseScdProps<T extends HasIdAndTimeStamp> = Scd<T>[];

const useScd = <T extends HasIdAndTimeStamp>(list: UseScdProps<T>) => {
  const latest = useMemo(() => {
    if (!list || !Array.isArray(list)) return [];
    return list.reduce((map, entry) => {
      const originId = entry.origin.id;
      const existing = map.get(originId);
      const isNewer =
        !existing || new Date(entry.timeStamp).getTime() > new Date(existing.timeStamp).getTime();
      if (isNewer) map.set(originId, entry);
      return map;
    }, new Map<string, (typeof list)[number]>());
  }, [list]);

  return Array.from(latest.values()).filter(i => !i.isDeleted);
};

export default useScd;
