import { startOfDay, addMinutes, isSameDay, isBefore } from "date-fns";
import { format } from "date-fns";

export function getTimeOptions(startDate: Date) {
  const start = startOfDay(startDate);
  return Array.from({ length: 96 }, (_, i) => {
    const date = addMinutes(start, i * 15);

    const value = format(date, "p");
    const label = format(date, "p");

    const now = new Date();
    const isToday = isSameDay(startDate, now);
    const isDisabled = isToday && isBefore(date, now);

    return { value, label, isDisabled };
  });
}
