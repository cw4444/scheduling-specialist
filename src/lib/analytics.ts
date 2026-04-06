import {
  Course,
  DashboardStats,
  EnrichedScheduledCourse,
  ScheduledCourse,
  Trainer,
  TrainerSkill,
  TrainingCenter,
} from "./types";
import { calculateFillRate } from "./utils";
import { isThisWeek, isThisMonth } from "./date-utils";

export function enrichScheduledCourse(
  sc: ScheduledCourse,
  courses: Course[],
  trainers: Trainer[],
  centers: TrainingCenter[]
): EnrichedScheduledCourse {
  const course = courses.find((c) => c.id === sc.courseId)!;
  const trainer = trainers.find((t) => t.id === sc.trainerId)!;
  const center = centers.find((c) => c.id === sc.centerId)!;
  return {
    ...sc,
    course,
    trainer,
    center,
    fillRate: calculateFillRate(sc.enrollmentCount, course.maxCapacity),
  };
}

export function enrichAllCourses(
  scheduledCourses: ScheduledCourse[],
  courses: Course[],
  trainers: Trainer[],
  centers: TrainingCenter[]
): EnrichedScheduledCourse[] {
  return scheduledCourses
    .filter((sc) => sc.status !== "cancelled")
    .map((sc) => enrichScheduledCourse(sc, courses, trainers, centers));
}

export function getDashboardStats(
  scheduledCourses: ScheduledCourse[],
  courses: Course[],
  trainers: Trainer[]
): DashboardStats {
  const active = scheduledCourses.filter((sc) => sc.status !== "cancelled");
  const thisWeek = active.filter((sc) => isThisWeek(sc.startDate));
  const thisMonth = active.filter((sc) => isThisMonth(sc.startDate));

  const fillRates = active.map((sc) => {
    const course = courses.find((c) => c.id === sc.courseId)!;
    return calculateFillRate(sc.enrollmentCount, course.maxCapacity);
  });
  const avgFillRate = fillRates.length > 0
    ? fillRates.reduce((a, b) => a + b, 0) / fillRates.length
    : 0;

  const coursesAtRisk = active.filter((sc) => {
    const course = courses.find((c) => c.id === sc.courseId)!;
    return calculateFillRate(sc.enrollmentCount, course.maxCapacity) < course.minFillThreshold;
  });

  return {
    totalTrainers: trainers.length,
    activeTrainers: trainers.filter((t) => t.status !== "holiday" && t.status !== "sick").length,
    coursesThisWeek: thisWeek.length,
    coursesThisMonth: thisMonth.length,
    avgFillRate,
    monthlyRevenue: thisMonth.reduce((sum, sc) => sum + sc.revenue, 0),
    coursesAtRisk: coursesAtRisk.length,
  };
}

export function getUpcomingCourses(
  enrichedCourses: EnrichedScheduledCourse[],
  limit: number = 5
): EnrichedScheduledCourse[] {
  const today = new Date().toISOString().split("T")[0];
  return enrichedCourses
    .filter((sc) => sc.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

export function getCoursesAtRisk(
  enrichedCourses: EnrichedScheduledCourse[]
): EnrichedScheduledCourse[] {
  return enrichedCourses
    .filter((sc) => sc.fillRate < sc.course.minFillThreshold)
    .sort((a, b) => a.fillRate - b.fillRate);
}

export function getSkillGaps(
  courses: Course[],
  skills: TrainerSkill[]
): { course: Course; certifiedCount: number; trainers: string[] }[] {
  return courses
    .map((course) => {
      const certified = skills.filter(
        (s) => s.courseId === course.id && s.proficiencyLevel === "certified"
      );
      return {
        course,
        certifiedCount: certified.length,
        trainers: certified.map((s) => s.trainerId),
      };
    })
    .filter((g) => g.certifiedCount < 3)
    .sort((a, b) => a.certifiedCount - b.certifiedCount);
}

export function getTrainerUtilization(
  trainerId: string,
  scheduledCourses: ScheduledCourse[],
  courses: Course[]
): number {
  const thisMonthCourses = scheduledCourses.filter(
    (sc) => sc.trainerId === trainerId && sc.status !== "cancelled" && isThisMonth(sc.startDate)
  );
  const teachingDays = thisMonthCourses.reduce((sum, sc) => {
    const course = courses.find((c) => c.id === sc.courseId)!;
    return sum + course.durationDays;
  }, 0);
  const workingDaysInMonth = 22;
  return (teachingDays / workingDaysInMonth) * 100;
}
