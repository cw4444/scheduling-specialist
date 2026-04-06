import { Availability } from "@/lib/types";
import { eachDayOfInterval, format, isWeekend, parseISO } from "date-fns";
import { scheduledCourses } from "./scheduled-courses";
import { trainers } from "./trainers";

function generateAvailability(): Availability[] {
  const records: Availability[] = [];
  const start = parseISO("2026-04-01");
  const end = parseISO("2026-05-31");
  const days = eachDayOfInterval({ start, end });

  for (const trainer of trainers) {
    for (const day of days) {
      if (isWeekend(day)) continue;

      const dateStr = format(day, "yyyy-MM-dd");

      // Check if teaching
      const isTeaching = scheduledCourses.some(
        (sc) =>
          sc.trainerId === trainer.id &&
          sc.status !== "cancelled" &&
          dateStr >= sc.startDate &&
          dateStr <= sc.endDate
      );

      if (isTeaching) {
        records.push({ trainerId: trainer.id, date: dateStr, status: "teaching" });
        continue;
      }

      // Michael O'Brien sick Apr 10-24
      if (trainer.id === "t4" && dateStr >= "2026-04-10" && dateStr <= "2026-04-24") {
        records.push({ trainerId: trainer.id, date: dateStr, status: "sick" });
        continue;
      }

      // Sophie Taylor holiday Apr 6-17
      if (trainer.id === "t11" && dateStr >= "2026-04-06" && dateStr <= "2026-04-17") {
        records.push({ trainerId: trainer.id, date: dateStr, status: "holiday" });
        continue;
      }

      // Prep days: day before teaching starts
      const hasTeachingTomorrow = scheduledCourses.some((sc) => {
        const dayBefore = format(
          new Date(parseISO(sc.startDate).getTime() - 86400000),
          "yyyy-MM-dd"
        );
        return sc.trainerId === trainer.id && sc.status !== "cancelled" && dateStr === dayBefore;
      });

      if (hasTeachingTomorrow) {
        records.push({ trainerId: trainer.id, date: dateStr, status: "prep" });
        continue;
      }

      records.push({ trainerId: trainer.id, date: dateStr, status: "available" });
    }
  }

  return records;
}

export const availability: Availability[] = generateAvailability();
