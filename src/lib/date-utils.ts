import {
  format,
  isThisWeek as fnsIsThisWeek,
  isThisMonth as fnsIsThisMonth,
  parseISO,
  addDays,
  isWeekend,
  differenceInBusinessDays,
} from "date-fns";

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM");
}

export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), "d MMMM yyyy");
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (startDate === endDate) {
    return format(start, "d MMM yyyy");
  }
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "d")}-${format(end, "d MMM yyyy")}`;
  }
  return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
}

export function isThisWeek(dateStr: string): boolean {
  return fnsIsThisWeek(parseISO(dateStr), { weekStartsOn: 1 });
}

export function isThisMonth(dateStr: string): boolean {
  return fnsIsThisMonth(parseISO(dateStr));
}

export function calculateEndDate(startDate: string, durationDays: number): string {
  let current = parseISO(startDate);
  let remaining = durationDays - 1; // start date counts as day 1
  while (remaining > 0) {
    current = addDays(current, 1);
    if (!isWeekend(current)) {
      remaining--;
    }
  }
  return format(current, "yyyy-MM-dd");
}

export function getBusinessDaysBetween(startDate: string, endDate: string): number {
  return differenceInBusinessDays(parseISO(endDate), parseISO(startDate)) + 1;
}
