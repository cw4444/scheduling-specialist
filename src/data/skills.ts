import { TrainerSkill } from "@/lib/types";

export const trainerSkills: TrainerSkill[] = [
  // Sarah Chen (t1) - Cloud + Security specialist
  { trainerId: "t1", courseId: "c1", proficiencyLevel: "certified", certifiedDate: "2020-06-15" },
  { trainerId: "t1", courseId: "c2", proficiencyLevel: "certified", certifiedDate: "2020-08-20" },
  { trainerId: "t1", courseId: "c4", proficiencyLevel: "certified", certifiedDate: "2021-03-10" },
  { trainerId: "t1", courseId: "c13", proficiencyLevel: "certified", certifiedDate: "2022-01-15" }, // CISSP - ONLY certified trainer!
  { trainerId: "t1", courseId: "c14", proficiencyLevel: "certified", certifiedDate: "2021-11-20" },

  // James Wilson (t2) - PM + Testing
  { trainerId: "t2", courseId: "c5", proficiencyLevel: "certified", certifiedDate: "2021-02-10" },
  { trainerId: "t2", courseId: "c6", proficiencyLevel: "certified", certifiedDate: "2021-09-15" },
  { trainerId: "t2", courseId: "c7", proficiencyLevel: "certified", certifiedDate: "2021-04-20" },
  { trainerId: "t2", courseId: "c8", proficiencyLevel: "certified", certifiedDate: "2021-06-01" },
  { trainerId: "t2", courseId: "c9", proficiencyLevel: "certified", certifiedDate: "2022-01-10" },

  // Priya Patel (t3) - Cloud + DevOps
  { trainerId: "t3", courseId: "c1", proficiencyLevel: "certified", certifiedDate: "2021-08-15" },
  { trainerId: "t3", courseId: "c3", proficiencyLevel: "certified", certifiedDate: "2021-05-20" },
  { trainerId: "t3", courseId: "c10", proficiencyLevel: "certified", certifiedDate: "2022-03-10" },
  { trainerId: "t3", courseId: "c11", proficiencyLevel: "certified", certifiedDate: "2022-07-15" },
  { trainerId: "t3", courseId: "c12", proficiencyLevel: "certified", certifiedDate: "2022-05-01" },

  // Michael O'Brien (t4) - Cloud + DevOps (currently sick)
  { trainerId: "t4", courseId: "c1", proficiencyLevel: "certified", certifiedDate: "2019-06-15" },
  { trainerId: "t4", courseId: "c2", proficiencyLevel: "certified", certifiedDate: "2019-09-20" },
  { trainerId: "t4", courseId: "c3", proficiencyLevel: "certified", certifiedDate: "2019-04-10" },
  { trainerId: "t4", courseId: "c4", proficiencyLevel: "certified", certifiedDate: "2020-01-15" },
  { trainerId: "t4", courseId: "c10", proficiencyLevel: "certified", certifiedDate: "2020-06-01" },
  { trainerId: "t4", courseId: "c11", proficiencyLevel: "in-progress" },

  // Emma Thompson (t5) - Testing + PM
  { trainerId: "t5", courseId: "c5", proficiencyLevel: "certified", certifiedDate: "2022-09-15" },
  { trainerId: "t5", courseId: "c7", proficiencyLevel: "certified", certifiedDate: "2023-01-20" },
  { trainerId: "t5", courseId: "c8", proficiencyLevel: "certified", certifiedDate: "2023-03-10" },
  { trainerId: "t5", courseId: "c9", proficiencyLevel: "in-progress" },

  // David Kim (t6) - Cloud freelancer
  { trainerId: "t6", courseId: "c1", proficiencyLevel: "certified", certifiedDate: "2023-04-15" },
  { trainerId: "t6", courseId: "c2", proficiencyLevel: "certified", certifiedDate: "2023-06-20" },
  { trainerId: "t6", courseId: "c3", proficiencyLevel: "certified", certifiedDate: "2023-03-10" },
  { trainerId: "t6", courseId: "c4", proficiencyLevel: "in-progress" },

  // Rachel Green (t7) - DevOps freelancer
  { trainerId: "t7", courseId: "c10", proficiencyLevel: "certified", certifiedDate: "2022-10-15" },
  { trainerId: "t7", courseId: "c11", proficiencyLevel: "certified", certifiedDate: "2023-02-20" },
  { trainerId: "t7", courseId: "c12", proficiencyLevel: "certified", certifiedDate: "2022-12-10" },

  // Tom Baker (t8) - Cloud + Testing freelancer (low utilization target)
  { trainerId: "t8", courseId: "c3", proficiencyLevel: "certified", certifiedDate: "2023-08-15" },
  { trainerId: "t8", courseId: "c5", proficiencyLevel: "certified", certifiedDate: "2023-10-20" },
  { trainerId: "t8", courseId: "c7", proficiencyLevel: "expired", certifiedDate: "2021-06-10" },

  // Lisa Martinez (t9) - Security freelancer
  { trainerId: "t9", courseId: "c13", proficiencyLevel: "in-progress" },
  { trainerId: "t9", courseId: "c14", proficiencyLevel: "certified", certifiedDate: "2022-05-15" },
  { trainerId: "t9", courseId: "c15", proficiencyLevel: "certified", certifiedDate: "2022-08-20" },

  // Ahmed Hassan (t10) - PM associate
  { trainerId: "t10", courseId: "c7", proficiencyLevel: "certified", certifiedDate: "2023-06-15" },
  { trainerId: "t10", courseId: "c8", proficiencyLevel: "certified", certifiedDate: "2023-08-20" },
  { trainerId: "t10", courseId: "c9", proficiencyLevel: "certified", certifiedDate: "2023-10-10" },

  // Sophie Taylor (t11) - Cloud associate (on holiday)
  { trainerId: "t11", courseId: "c1", proficiencyLevel: "certified", certifiedDate: "2023-01-15" },
  { trainerId: "t11", courseId: "c3", proficiencyLevel: "certified", certifiedDate: "2022-11-20" },
  { trainerId: "t11", courseId: "c4", proficiencyLevel: "in-progress" },

  // Chris Johnson (t12) - Cyber/Security associate
  { trainerId: "t12", courseId: "c14", proficiencyLevel: "certified", certifiedDate: "2023-11-15" },
  { trainerId: "t12", courseId: "c15", proficiencyLevel: "certified", certifiedDate: "2024-01-20" },
  { trainerId: "t12", courseId: "c13", proficiencyLevel: "in-progress" },
];
