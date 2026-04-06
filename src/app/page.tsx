import { Users, CalendarDays, TrendingUp, PoundSterling } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingCourses } from "@/components/dashboard/upcoming-courses";
import { AiRecommendations, Recommendation } from "@/components/dashboard/ai-recommendations";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { trainerSkills } from "@/data/skills";
import {
  getDashboardStats,
  enrichAllCourses,
  getUpcomingCourses,
  getCoursesAtRisk,
  getSkillGaps,
} from "@/lib/analytics";
import { formatCurrency, formatPercentage } from "@/lib/utils";

export default function DashboardPage() {
  const stats = getDashboardStats(scheduledCourses, courses, trainers);
  const enriched = enrichAllCourses(scheduledCourses, courses, trainers, centers);
  const upcoming = getUpcomingCourses(enriched, 6);
  const atRisk = getCoursesAtRisk(enriched);
  const skillGaps = getSkillGaps(courses, trainerSkills);

  const recommendations: Recommendation[] = [];

  if (atRisk.length > 0) {
    const worst = atRisk[0];
    recommendations.push({
      type: "warning",
      title: `Cancel candidate: ${worst.course.code} (${formatPercentage(worst.fillRate)} fill)`,
      description: `Only ${worst.enrollmentCount}/${worst.course.maxCapacity} delegates enrolled. Consider cancelling and redeploying ${worst.trainer.name}.`,
    });
  }

  const sickTrainer = trainers.find((t) => t.status === "sick");
  if (sickTrainer) {
    const affected = scheduledCourses.filter(
      (sc) => sc.trainerId === sickTrainer.id && sc.status !== "cancelled"
    );
    if (affected.length > 0) {
      recommendations.push({
        type: "alert",
        title: `${sickTrainer.name} is sick - ${affected.length} courses need cover`,
        description: `Immediate action needed. Check Cover Management for replacement suggestions.`,
      });
    }
  }

  if (skillGaps.length > 0) {
    const critical = skillGaps.find((g) => g.certifiedCount <= 1);
    if (critical) {
      recommendations.push({
        type: "suggestion",
        title: `Skill gap: ${critical.course.code} has only ${critical.certifiedCount} certified trainer${critical.certifiedCount === 1 ? "" : "s"}`,
        description: `Single point of failure risk. Consider certifying additional trainers or hiring.`,
      });
    }
  }

  const highFill = enriched.filter((sc) => sc.fillRate > 85);
  if (highFill.length > 0) {
    recommendations.push({
      type: "opportunity",
      title: `${highFill.length} course${highFill.length > 1 ? "s" : ""} above 85% fill`,
      description: `Consider adding extra dates for ${highFill.map((c) => c.course.code).join(", ")} to capture demand.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Trainers"
          value={`${stats.activeTrainers}/${stats.totalTrainers}`}
          description={`${stats.totalTrainers - stats.activeTrainers} unavailable`}
          icon={Users}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Courses This Week"
          value={String(stats.coursesThisWeek)}
          description={`${stats.coursesThisMonth} this month`}
          icon={CalendarDays}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          title="Avg Fill Rate"
          value={formatPercentage(stats.avgFillRate)}
          description={`${stats.coursesAtRisk} at risk`}
          icon={TrendingUp}
          iconColor="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          description="Booked this month"
          icon={PoundSterling}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
      </div>

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingCourses courses={upcoming} />
        </div>
        <div>
          <AiRecommendations recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}
