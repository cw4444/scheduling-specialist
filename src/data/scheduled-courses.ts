import { ScheduledCourse } from "@/lib/types";

// Dates relative to "today" = early April 2026
export const scheduledCourses: ScheduledCourse[] = [
  // ── This week (Apr 6-10) ────────────────────────────────────────
  {
    id: "sc1",
    courseId: "c1", // AWS-SA
    centerId: "ctr1",
    trainerId: "t1", // Sarah Chen (teaching)
    startDate: "2026-04-06",
    endDate: "2026-04-08",
    type: "public",
    enrollmentCount: 14,
    revenue: 25200,
    status: "confirmed",
  },
  {
    id: "sc2",
    courseId: "c10", // Docker
    centerId: "ctr2",
    trainerId: "t7", // Rachel Green (teaching)
    startDate: "2026-04-06",
    endDate: "2026-04-07",
    type: "public",
    enrollmentCount: 10,
    revenue: 12000,
    status: "confirmed",
  },
  {
    id: "sc3",
    courseId: "c7", // PRINCE2 Foundation
    centerId: "ctr3",
    trainerId: "t2", // James Wilson
    startDate: "2026-04-08",
    endDate: "2026-04-10",
    type: "closed",
    enrollmentCount: 12,
    revenue: 16800,
    status: "confirmed",
  },

  // ── Next week (Apr 13-17) ───────────────────────────────────────
  {
    id: "sc4",
    courseId: "c3", // AZ-900 — LOW FILL (cancel candidate)
    centerId: "ctr1",
    trainerId: "t4", // Michael O'Brien (SICK - needs cover!)
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    type: "public",
    enrollmentCount: 3,
    revenue: 1500,
    status: "provisional",
  },
  {
    id: "sc5",
    courseId: "c1", // AWS-SA — HIGH FILL
    centerId: "ctr2",
    trainerId: "t3", // Priya Patel
    startDate: "2026-04-13",
    endDate: "2026-04-15",
    type: "public",
    enrollmentCount: 14,
    revenue: 25200,
    status: "confirmed",
  },
  {
    id: "sc6",
    courseId: "c11", // K8s Admin
    centerId: "ctr1",
    trainerId: "t4", // Michael O'Brien (SICK - needs cover!)
    startDate: "2026-04-13",
    endDate: "2026-04-17",
    type: "public",
    enrollmentCount: 9,
    revenue: 25200,
    status: "confirmed",
  },
  {
    id: "sc7",
    courseId: "c5", // ISTQB Foundation
    centerId: "ctr3",
    trainerId: "t5", // Emma Thompson
    startDate: "2026-04-14",
    endDate: "2026-04-16",
    type: "public",
    enrollmentCount: 11,
    revenue: 16500,
    status: "confirmed",
  },

  // ── Week 3 (Apr 20-24) ─────────────────────────────────────────
  {
    id: "sc8",
    courseId: "c4", // AZ-104
    centerId: "ctr1",
    trainerId: "t4", // Michael O'Brien (SICK - needs cover!)
    startDate: "2026-04-20",
    endDate: "2026-04-23",
    type: "public",
    enrollmentCount: 8,
    revenue: 17600,
    status: "confirmed",
  },
  {
    id: "sc9",
    courseId: "c13", // CISSP — only 1 certified trainer (Sarah)
    centerId: "ctr1",
    trainerId: "t1", // Sarah Chen
    startDate: "2026-04-20",
    endDate: "2026-04-24",
    type: "public",
    enrollmentCount: 12,
    revenue: 30000,
    status: "confirmed",
  },
  {
    id: "sc10",
    courseId: "c8", // PRINCE2 Practitioner
    centerId: "ctr2",
    trainerId: "t2", // James Wilson
    startDate: "2026-04-21",
    endDate: "2026-04-22",
    type: "public",
    enrollmentCount: 8,
    revenue: 9600,
    status: "confirmed",
  },
  {
    id: "sc11",
    courseId: "c12", // CI/CD
    centerId: "ctr3",
    trainerId: "t3", // Priya Patel
    startDate: "2026-04-22",
    endDate: "2026-04-23",
    type: "onsite",
    enrollmentCount: 10,
    revenue: 11000,
    status: "confirmed",
  },

  // ── Week 4 (Apr 27 - May 1) ────────────────────────────────────
  {
    id: "sc12",
    courseId: "c15", // CEH
    centerId: "ctr1",
    trainerId: "t9", // Lisa Martinez
    startDate: "2026-04-27",
    endDate: "2026-05-01",
    type: "public",
    enrollmentCount: 7,
    revenue: 19600,
    status: "confirmed",
  },
  {
    id: "sc13",
    courseId: "c2", // AWS-DVA — LOW FILL
    centerId: "ctr2",
    trainerId: "t6", // David Kim
    startDate: "2026-04-27",
    endDate: "2026-04-29",
    type: "public",
    enrollmentCount: 4,
    revenue: 7200,
    status: "provisional",
  },
  {
    id: "sc14",
    courseId: "c9", // AgilePM
    centerId: "ctr3",
    trainerId: "t10", // Ahmed Hassan
    startDate: "2026-04-28",
    endDate: "2026-04-30",
    type: "public",
    enrollmentCount: 10,
    revenue: 16000,
    status: "confirmed",
  },
  {
    id: "sc15",
    courseId: "c14", // CompTIA Security+
    centerId: "ctr1",
    trainerId: "t12", // Chris Johnson
    startDate: "2026-04-27",
    endDate: "2026-05-01",
    type: "public",
    enrollmentCount: 13,
    revenue: 26000,
    status: "confirmed",
  },

  // ── May Week 1 (May 4-8) ───────────────────────────────────────
  {
    id: "sc16",
    courseId: "c1", // AWS-SA
    centerId: "ctr1",
    trainerId: "t6", // David Kim
    startDate: "2026-05-04",
    endDate: "2026-05-06",
    type: "public",
    enrollmentCount: 6,
    revenue: 10800,
    status: "provisional",
  },
  {
    id: "sc17",
    courseId: "c6", // ISTQB Advanced — LOW FILL
    centerId: "ctr2",
    trainerId: "t2", // James Wilson
    startDate: "2026-05-04",
    endDate: "2026-05-08",
    type: "public",
    enrollmentCount: 3,
    revenue: 7500,
    status: "provisional",
  },
  {
    id: "sc18",
    courseId: "c10", // Docker
    centerId: "ctr1",
    trainerId: "t7", // Rachel Green
    startDate: "2026-05-05",
    endDate: "2026-05-06",
    type: "closed",
    enrollmentCount: 12,
    revenue: 14400,
    status: "confirmed",
  },
  {
    id: "sc19",
    courseId: "c3", // AZ-900
    centerId: "ctr3",
    trainerId: "t3", // Priya Patel
    startDate: "2026-05-07",
    endDate: "2026-05-07",
    type: "public",
    enrollmentCount: 16,
    revenue: 8000,
    status: "confirmed",
  },

  // ── May Week 2 (May 11-15) ─────────────────────────────────────
  {
    id: "sc20",
    courseId: "c11", // K8s
    centerId: "ctr2",
    trainerId: "t7", // Rachel Green
    startDate: "2026-05-11",
    endDate: "2026-05-15",
    type: "public",
    enrollmentCount: 8,
    revenue: 22400,
    status: "confirmed",
  },
  {
    id: "sc21",
    courseId: "c7", // PRINCE2 Foundation
    centerId: "ctr1",
    trainerId: "t5", // Emma Thompson
    startDate: "2026-05-11",
    endDate: "2026-05-13",
    type: "public",
    enrollmentCount: 14,
    revenue: 19600,
    status: "confirmed",
  },
  {
    id: "sc22",
    courseId: "c15", // CEH — BORDERLINE FILL
    centerId: "ctr3",
    trainerId: "t12", // Chris Johnson
    startDate: "2026-05-11",
    endDate: "2026-05-15",
    type: "public",
    enrollmentCount: 5,
    revenue: 14000,
    status: "provisional",
  },

  // ── May Week 3 (May 18-22) ─────────────────────────────────────
  {
    id: "sc23",
    courseId: "c4", // AZ-104
    centerId: "ctr2",
    trainerId: "t1", // Sarah Chen
    startDate: "2026-05-18",
    endDate: "2026-05-21",
    type: "public",
    enrollmentCount: 11,
    revenue: 24200,
    status: "confirmed",
  },
  {
    id: "sc24",
    courseId: "c9", // AgilePM — LOW FILL
    centerId: "ctr1",
    trainerId: "t10", // Ahmed Hassan
    startDate: "2026-05-18",
    endDate: "2026-05-20",
    type: "public",
    enrollmentCount: 4,
    revenue: 6400,
    status: "provisional",
  },
  {
    id: "sc25",
    courseId: "c2", // AWS-DVA
    centerId: "ctr3",
    trainerId: "t6", // David Kim
    startDate: "2026-05-19",
    endDate: "2026-05-21",
    type: "onsite",
    enrollmentCount: 12,
    revenue: 21600,
    status: "confirmed",
  },
  {
    id: "sc26",
    courseId: "c14", // CompTIA Sec+ — BORDERLINE
    centerId: "ctr2",
    trainerId: "t9", // Lisa Martinez
    startDate: "2026-05-18",
    endDate: "2026-05-22",
    type: "public",
    enrollmentCount: 7,
    revenue: 14000,
    status: "provisional",
  },
  {
    id: "sc27",
    courseId: "c5", // ISTQB FL
    centerId: "ctr1",
    trainerId: "t8", // Tom Baker
    startDate: "2026-05-20",
    endDate: "2026-05-22",
    type: "public",
    enrollmentCount: 15,
    revenue: 22500,
    status: "confirmed",
  },
];
