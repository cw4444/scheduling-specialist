import {
  Course,
  ScheduledCourse,
  Trainer,
  TrainerSkill,
  TrainingCenter,
} from "./types";
import { calculateEndDate } from "./date-utils";
import { parseISO } from "date-fns";

function datesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 <= end2 && start2 <= end1;
}

export function checkTrainerConflict(
  trainerId: string,
  startDate: string,
  endDate: string,
  scheduledCourses: ScheduledCourse[],
  excludeId?: string
): { hasConflict: boolean; conflictingCourse?: ScheduledCourse } {
  const conflict = scheduledCourses.find(
    (sc) =>
      sc.id !== excludeId &&
      sc.trainerId === trainerId &&
      sc.status !== "cancelled" &&
      datesOverlap(startDate, endDate, sc.startDate, sc.endDate)
  );
  return { hasConflict: !!conflict, conflictingCourse: conflict };
}

export function checkCenterConflict(
  centerId: string,
  startDate: string,
  endDate: string,
  scheduledCourses: ScheduledCourse[],
  centers: TrainingCenter[],
  excludeId?: string
): { hasConflict: boolean; roomsAvailable: number } {
  const center = centers.find((c) => c.id === centerId);
  if (!center) return { hasConflict: true, roomsAvailable: 0 };

  const overlapping = scheduledCourses.filter(
    (sc) =>
      sc.id !== excludeId &&
      sc.centerId === centerId &&
      sc.status !== "cancelled" &&
      datesOverlap(startDate, endDate, sc.startDate, sc.endDate)
  );

  const roomsAvailable = center.rooms.length - overlapping.length;
  return { hasConflict: roomsAvailable <= 0, roomsAvailable: Math.max(0, roomsAvailable) };
}

export function getAvailableTrainers(
  courseId: string,
  startDate: string,
  endDate: string,
  trainers: Trainer[],
  skills: TrainerSkill[],
  scheduledCourses: ScheduledCourse[]
): Trainer[] {
  const certifiedTrainerIds = skills
    .filter(
      (s) =>
        s.courseId === courseId &&
        (s.proficiencyLevel === "certified" || s.proficiencyLevel === "in-progress")
    )
    .map((s) => s.trainerId);

  return trainers.filter((trainer) => {
    if (!certifiedTrainerIds.includes(trainer.id)) return false;
    if (trainer.status === "sick" || trainer.status === "holiday") return false;
    const { hasConflict } = checkTrainerConflict(
      trainer.id,
      startDate,
      endDate,
      scheduledCourses
    );
    return !hasConflict;
  });
}

export function findReplacementTrainers(
  trainerId: string,
  courseId: string,
  startDate: string,
  endDate: string,
  trainers: Trainer[],
  skills: TrainerSkill[],
  scheduledCourses: ScheduledCourse[]
): (Trainer & { matchScore: number })[] {
  const available = getAvailableTrainers(
    courseId,
    startDate,
    endDate,
    trainers,
    skills,
    scheduledCourses
  ).filter((t) => t.id !== trainerId);

  return available
    .map((trainer) => {
      let score = 0;
      const skill = skills.find(
        (s) => s.trainerId === trainer.id && s.courseId === courseId
      );
      if (skill?.proficiencyLevel === "certified") score += 50;
      if (skill?.proficiencyLevel === "in-progress") score += 20;
      if (trainer.type === "internal") score += 30;
      if (trainer.type === "associate") score += 15;
      // freelance gets 0 bonus (most expensive)
      return { ...trainer, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getCoursesNeedingCover(
  trainerId: string,
  startDate: string,
  endDate: string,
  scheduledCourses: ScheduledCourse[]
): ScheduledCourse[] {
  return scheduledCourses.filter(
    (sc) =>
      sc.trainerId === trainerId &&
      sc.status !== "cancelled" &&
      datesOverlap(startDate, endDate, sc.startDate, sc.endDate)
  );
}
