"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { enrichAllCourses } from "@/lib/analytics";
import { formatCurrency, formatPercentage, getFillRateColor, cn } from "@/lib/utils";
import { formatDateRange } from "@/lib/date-utils";
import { BarChart3, AlertTriangle, PoundSterling } from "lucide-react";

const fillColorMap = {
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
};

const progressColorMap = {
  red: "[&>div]:bg-red-500",
  amber: "[&>div]:bg-amber-500",
  green: "[&>div]:bg-green-500",
};

export default function FillRatesPage() {
  const enriched = useMemo(
    () =>
      enrichAllCourses(scheduledCourses, courses, trainers, centers).sort(
        (a, b) => a.fillRate - b.fillRate
      ),
    []
  );

  const avgFillRate =
    enriched.reduce((sum, sc) => sum + sc.fillRate, 0) / enriched.length;

  const atRisk = enriched.filter(
    (sc) => sc.fillRate < sc.course.minFillThreshold
  );

  const revenueAtRisk = atRisk.reduce((sum, sc) => sum + sc.revenue, 0);

  const potentialRevenue = enriched.reduce((sum, sc) => {
    const maxRevenue = sc.course.maxCapacity * sc.course.price;
    return sum + (maxRevenue - sc.revenue);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Average Fill Rate"
          value={formatPercentage(avgFillRate)}
          icon={BarChart3}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Courses at Risk"
          value={String(atRisk.length)}
          description={`${formatCurrency(revenueAtRisk)} revenue at risk`}
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
        />
        <StatCard
          title="Revenue Opportunity"
          value={formatCurrency(potentialRevenue)}
          description="If all courses filled to capacity"
          icon={PoundSterling}
          iconColor="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Scheduled Courses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Fill Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map((sc) => {
                const color = getFillRateColor(sc.fillRate);
                const isAtRisk = sc.fillRate < sc.course.minFillThreshold;
                return (
                  <TableRow
                    key={sc.id}
                    className={cn(isAtRisk && "bg-red-50/50 dark:bg-red-950/20")}
                  >
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">
                        {sc.course.code}
                      </span>
                      <p className="text-sm font-medium">{sc.course.name}</p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateRange(sc.startDate, sc.endDate)}
                    </TableCell>
                    <TableCell className="text-sm">{sc.center.name}</TableCell>
                    <TableCell className="text-sm">{sc.trainer.name}</TableCell>
                    <TableCell>
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>
                            {sc.enrollmentCount}/{sc.course.maxCapacity}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "h-5 text-[10px]",
                              fillColorMap[color]
                            )}
                          >
                            {formatPercentage(sc.fillRate)}
                          </Badge>
                        </div>
                        <Progress
                          value={Math.min(sc.fillRate, 100)}
                          className={cn("h-1.5", progressColorMap[color])}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatCurrency(sc.revenue)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {sc.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
