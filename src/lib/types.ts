// ── Status & Type Enums ──────────────────────────────────────────────

export type TrainerType = "internal" | "freelance" | "associate";
export type TrainerStatus = "available" | "teaching" | "prep" | "holiday" | "sick";
export type CourseType = "public" | "closed" | "onsite";
export type ScheduleStatus = "confirmed" | "provisional" | "cancelled";
export type ProficiencyLevel = "certified" | "in-progress" | "expired";
export type AvailabilityStatus = "available" | "holiday" | "sick" | "prep" | "teaching";
export type OnboardingStatus = "in-progress" | "on-hold" | "completed";

// ── Core Models ──────────────────────────────────────────────────────

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: TrainerType;
  status: TrainerStatus;
  dayRate?: number; // only for freelance/associate
  location: string;
  hireDate: string; // ISO date
  avatar?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  durationDays: number;
  category: string;
  maxCapacity: number;
  minFillThreshold: number; // percentage (0-100)
  price: number; // per delegate, GBP
}

export interface TrainingCenter {
  id: string;
  name: string;
  location: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface ScheduledCourse {
  id: string;
  courseId: string;
  centerId: string;
  trainerId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  type: CourseType;
  enrollmentCount: number;
  revenue: number;
  status: ScheduleStatus;
}

export interface TrainerSkill {
  trainerId: string;
  courseId: string;
  proficiencyLevel: ProficiencyLevel;
  certifiedDate?: string; // ISO date
}

export interface Availability {
  trainerId: string;
  date: string; // ISO date
  status: AvailabilityStatus;
}

export interface OnboardingRecord {
  id: string;
  newTrainerId: string;
  buddyId: string;
  startDate: string;
  status: OnboardingStatus;
  sitInCourses: SitInCourse[];
  checklist: ChecklistItem[];
}

export interface SitInCourse {
  courseId: string;
  scheduledDate: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

// ── Enriched / Computed Types ────────────────────────────────────────

export interface EnrichedScheduledCourse extends ScheduledCourse {
  course: Course;
  trainer: Trainer;
  center: TrainingCenter;
  fillRate: number;
}

export interface DashboardStats {
  totalTrainers: number;
  activeTrainers: number;
  coursesThisWeek: number;
  coursesThisMonth: number;
  avgFillRate: number;
  monthlyRevenue: number;
  coursesAtRisk: number;
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
