"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { enrichAllCourses, getTrainerUtilization } from "@/lib/analytics";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  CalendarDays,
  Users,
  PoundSterling,
  TrendingUp,
} from "lucide-react";

export default function ReportsPage() {
  const enriched = useMemo(
    () => enrichAllCourses(scheduledCourses, courses, trainers, centers),
    []
  );

  // Trainer utilization data
  const trainerUtil = useMemo(
    () =>
      trainers.map((t) => ({
        trainer: t,
        utilization: getTrainerUtilization(t.id, scheduledCourses, courses),
      })).sort((a, b) => b.utilization - a.utilization),
    []
  );

  // Center stats
  const centerStats = useMemo(() => {
    return centers.map((center) => {
      const centerCourses = enriched.filter((sc) => sc.centerId === center.id);
      const totalRevenue = centerCourses.reduce((sum, sc) => sum + sc.revenue, 0);
      const avgFill =
        centerCourses.length > 0
          ? centerCourses.reduce((sum, sc) => sum + sc.fillRate, 0) / centerCourses.length
          : 0;
      return {
        center,
        courseCount: centerCourses.length,
        totalRevenue,
        avgFillRate: avgFill,
      };
    });
  }, [enriched]);

  // Weekly summary stats
  const totalDelegates = enriched.reduce((sum, sc) => sum + sc.enrollmentCount, 0);
  const totalRevenue = enriched.reduce((sum, sc) => sum + sc.revenue, 0);
  const avgFillRate =
    enriched.reduce((sum, sc) => sum + sc.fillRate, 0) / enriched.length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Courses"
          value={String(enriched.length)}
          icon={CalendarDays}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          title="Total Delegates"
          value={String(totalDelegates)}
          icon={Users}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={PoundSterling}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
        <StatCard
          title="Avg Fill Rate"
          value={formatPercentage(avgFillRate)}
          icon={TrendingUp}
          iconColor="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
      </div>

      <Tabs defaultValue="utilization">
        <TabsList>
          <TabsTrigger value="utilization">Trainer Utilization</TabsTrigger>
          <TabsTrigger value="centers">Centre Performance</TabsTrigger>
          <TabsTrigger value="summary">Weekly Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="mt-4 space-y-3">
          {trainerUtil.map(({ trainer, utilization }) => (
            <Card key={trainer.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-40 shrink-0">
                  <p className="text-sm font-medium">{trainer.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{trainer.type}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          utilization > 70
                            ? "bg-green-500"
                            : utilization > 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                        )}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono w-12 text-right">
                      {formatPercentage(utilization)}
                    </span>
                  </div>
                </div>
                {utilization < 30 && (
                  <span className="text-xs text-red-500 font-medium">Under-utilized</span>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="centers" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {centerStats.map(({ center, courseCount, totalRevenue, avgFillRate }) => (
              <Card key={center.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{center.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{center.location}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Courses</p>
                      <p className="font-semibold">{courseCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Rooms</p>
                      <p className="font-semibold">{center.rooms.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Revenue</p>
                      <p className="font-semibold">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Avg Fill</p>
                      <p className="font-semibold">{formatPercentage(avgFillRate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Scheduling Report</CardTitle>
              <p className="text-sm text-muted-foreground">
                Week of 6th April 2026
              </p>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                This week sees <strong>{enriched.filter((sc) => sc.startDate <= "2026-04-10" && sc.endDate >= "2026-04-06").length} courses</strong> running across our three centres, with a combined enrollment
                of <strong>{enriched.filter((sc) => sc.startDate <= "2026-04-10" && sc.endDate >= "2026-04-06").reduce((s, sc) => s + sc.enrollmentCount, 0)} delegates</strong>.
              </p>

              <h4>Key Issues</h4>
              <ul>
                <li>
                  <strong>Michael O&apos;Brien is currently on sick leave</strong> with 3 upcoming courses requiring cover: K8s Admin (Apr 13-17),
                  AZ-900 (Apr 15), and AZ-104 (Apr 20-23). Replacement trainers should be assigned urgently.
                </li>
                <li>
                  <strong>AZ-900 on Apr 15 has only 15% fill rate</strong> (3/20 delegates). Recommend cancellation
                  and redeploying the trainer.
                </li>
                <li>
                  <strong>AWS-DVA on Apr 27 has 25% fill</strong> (4/16). Monitor closely - may need cancellation by Apr 20.
                </li>
              </ul>

              <h4>Opportunities</h4>
              <ul>
                <li>
                  AWS-SA courses are consistently high-fill (88%). Consider adding an additional date in May.
                </li>
                <li>
                  Tom Baker and David Kim have low utilization this month. Both could take additional courses.
                </li>
              </ul>

              <h4>Skill Gap Alert</h4>
              <ul>
                <li>
                  CISSP has only 1 certified trainer (Sarah Chen). This is a single point of failure for a high-value course (£2,500/delegate).
                  Recommend fast-tracking Lisa Martinez&apos;s certification.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
