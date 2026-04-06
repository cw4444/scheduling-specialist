import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { trainerSkills } from "@/data/skills";
import { formatCurrency } from "./utils";

export function buildSystemPrompt(): string {
  return `You are ScheduleAI, an AI copilot for a training company's scheduling specialist. You help manage trainer schedules, course planning, fill rate optimization, and resource allocation.

You have deep knowledge of the current scheduling data and should provide specific, actionable recommendations based on the real data provided in your context.

When making recommendations:
- Be specific - name trainers, courses, dates, and numbers
- Consider cost implications (internal trainers vs freelancers vs associates)
- Factor in skills, availability, and location
- Always explain your reasoning
- Format your responses clearly with bullet points and sections where appropriate
- Use £ for currency (this is a UK-based training company)

Current date: April 6, 2026`;
}

export function buildContext(): string {
  const trainerSummary = trainers.map((t) => {
    const skills = trainerSkills
      .filter((s) => s.trainerId === t.id && s.proficiencyLevel === "certified")
      .map((s) => courses.find((c) => c.id === s.courseId)?.code)
      .filter(Boolean);
    return `- ${t.name} (${t.type}, ${t.status}${t.dayRate ? `, ${formatCurrency(t.dayRate)}/day` : ""}, ${t.location}) — Skills: ${skills.join(", ") || "none certified"}`;
  });

  const scheduleSummary = scheduledCourses
    .filter((sc) => sc.status !== "cancelled")
    .map((sc) => {
      const course = courses.find((c) => c.id === sc.courseId)!;
      const trainer = trainers.find((t) => t.id === sc.trainerId)!;
      const center = centers.find((c) => c.id === sc.centerId)!;
      const fillRate = Math.round((sc.enrollmentCount / course.maxCapacity) * 100);
      return `- ${course.code} (${sc.startDate} to ${sc.endDate}) at ${center.name} — Trainer: ${trainer.name} — Fill: ${sc.enrollmentCount}/${course.maxCapacity} (${fillRate}%) — Revenue: ${formatCurrency(sc.revenue)} — Status: ${sc.status}`;
    });

  const gapCourses = courses.map((course) => {
    const certified = trainerSkills.filter(
      (s) => s.courseId === course.id && s.proficiencyLevel === "certified"
    ).length;
    return { code: course.code, certified };
  }).filter((g) => g.certified < 3);

  return `## Current Trainers (${trainers.length} total)
${trainerSummary.join("\n")}

## Scheduled Courses (${scheduledCourses.filter((sc) => sc.status !== "cancelled").length} active)
${scheduleSummary.join("\n")}

## Skill Gaps (courses with <3 certified trainers)
${gapCourses.map((g) => `- ${g.code}: ${g.certified} certified trainer(s)`).join("\n")}

## Training Centres
${centers.map((c) => `- ${c.name} (${c.location}) — ${c.rooms.length} rooms`).join("\n")}`;
}
