import { OnboardingRecord } from "@/lib/types";

export const onboardingRecords: OnboardingRecord[] = [
  {
    id: "ob1",
    newTrainerId: "t12", // Chris Johnson
    buddyId: "t9", // Lisa Martinez
    startDate: "2026-03-01",
    status: "in-progress",
    sitInCourses: [
      { courseId: "c14", scheduledDate: "2026-03-10", completed: true },
      { courseId: "c15", scheduledDate: "2026-03-24", completed: true },
      { courseId: "c13", scheduledDate: "2026-04-20", completed: false },
    ],
    checklist: [
      { id: "ch1", label: "IT setup & system access", completed: true },
      { id: "ch2", label: "HR induction complete", completed: true },
      { id: "ch3", label: "Course materials reviewed", completed: true },
      { id: "ch4", label: "Sit-in on Security+ (with buddy)", completed: true },
      { id: "ch5", label: "Sit-in on CEH (with buddy)", completed: true },
      { id: "ch6", label: "Sit-in on CISSP", completed: false },
      { id: "ch7", label: "First solo delivery observed", completed: false },
      { id: "ch8", label: "Post-delivery feedback session", completed: false },
      { id: "ch9", label: "Sign-off by training manager", completed: false },
    ],
  },
  {
    id: "ob2",
    newTrainerId: "t10", // Ahmed Hassan
    buddyId: "t2", // James Wilson
    startDate: "2026-01-15",
    status: "completed",
    sitInCourses: [
      { courseId: "c7", scheduledDate: "2026-01-20", completed: true },
      { courseId: "c8", scheduledDate: "2026-02-03", completed: true },
      { courseId: "c9", scheduledDate: "2026-02-17", completed: true },
    ],
    checklist: [
      { id: "ch10", label: "IT setup & system access", completed: true },
      { id: "ch11", label: "HR induction complete", completed: true },
      { id: "ch12", label: "Course materials reviewed", completed: true },
      { id: "ch13", label: "Sit-in on PRINCE2 Foundation", completed: true },
      { id: "ch14", label: "Sit-in on PRINCE2 Practitioner", completed: true },
      { id: "ch15", label: "Sit-in on AgilePM", completed: true },
      { id: "ch16", label: "First solo delivery observed", completed: true },
      { id: "ch17", label: "Post-delivery feedback session", completed: true },
      { id: "ch18", label: "Sign-off by training manager", completed: true },
    ],
  },
  {
    id: "ob3",
    newTrainerId: "t8", // Tom Baker
    buddyId: "t5", // Emma Thompson
    startDate: "2026-02-10",
    status: "on-hold",
    sitInCourses: [
      { courseId: "c5", scheduledDate: "2026-02-17", completed: true },
      { courseId: "c3", scheduledDate: "2026-03-05", completed: false },
    ],
    checklist: [
      { id: "ch19", label: "IT setup & system access", completed: true },
      { id: "ch20", label: "HR induction complete", completed: true },
      { id: "ch21", label: "Course materials reviewed", completed: false },
      { id: "ch22", label: "Sit-in on ISTQB Foundation", completed: true },
      { id: "ch23", label: "Sit-in on Azure Fundamentals", completed: false },
      { id: "ch24", label: "First solo delivery observed", completed: false },
      { id: "ch25", label: "Post-delivery feedback session", completed: false },
      { id: "ch26", label: "Sign-off by training manager", completed: false },
    ],
  },
];
