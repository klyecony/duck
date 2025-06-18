"use client";

export function getNext7DaysInGerman(): {
  label: string;
  date: Date;
}[] {
  const result: { label: string; date: Date }[] = [];

  const formatter = new Intl.DateTimeFormat("de-DE", { weekday: "long" });

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const label = i === 0 ? "Heute" : i === 1 ? "Morgen" : formatter.format(date);

    result.push({ label, date });
  }

  return result;
}

type Item = { plannedAt?: string | number | undefined };

export function getDaysUntilNextPlanned(items: Item[]): string {
  const now = new Date();

  const futureDates = items
    .map(item => (item.plannedAt ? new Date(item.plannedAt) : null))
    .filter((date): date is Date => !!date);

  if (futureDates.length === 0) return "Nicht geplant";

  const nextDate = futureDates.reduce((min, curr) => (curr < min ? curr : min));

  const diffInMs = nextDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Heute";
  if (diffInDays === 1) return "Morgen";
  return `In ${diffInDays} Tagen`;
}
