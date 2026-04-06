"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrainerStatusBadge } from "@/components/trainers/trainer-status-badge";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { trainerSkills } from "@/data/skills";
import { getCoursesNeedingCover, findReplacementTrainers } from "@/lib/scheduling";
import { enrichScheduledCourse } from "@/lib/analytics";
import { formatDateRange } from "@/lib/date-utils";
import { formatCurrency, formatPercentage, getInitials, cn } from "@/lib/utils";
import { Shield, UserCheck, AlertTriangle } from "lucide-react";

export default function CoverPage() {
  const [selectedTrainer, setSelectedTrainer] = useState("");

  // Pre-detect trainers needing cover
  const trainersNeedingCover = trainers.filter(
    (t) => t.status === "sick" || t.status === "holiday"
  );

  const affectedCourses = useMemo(() => {
    if (!selectedTrainer) return [];
    return getCoursesNeedingCover(
      selectedTrainer,
      "2026-04-01",
      "2026-06-01",
      scheduledCourses
    ).map((sc) => enrichScheduledCourse(sc, courses, trainers, centers));
  }, [selectedTrainer]);

  const replacements = useMemo(() => {
    if (!selectedTrainer || affectedCourses.length === 0) return {};
    const result: Record<string, ReturnType<typeof findReplacementTrainers>> = {};
    for (const sc of affectedCourses) {
      result[sc.id] = findReplacementTrainers(
        selectedTrainer,
        sc.courseId,
        sc.startDate,
        sc.endDate,
        trainers,
        trainerSkills,
        scheduledCourses
      );
    }
    return result;
  }, [selectedTrainer, affectedCourses]);

  return (
    <div className="space-y-6">
      {/* Alert for trainers already needing cover */}
      {trainersNeedingCover.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-medium">Trainers Currently Unavailable</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {trainersNeedingCover.map((t) => (
                  <Button
                    key={t.id}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSelectedTrainer(t.id)}
                  >
                    {t.name}{" "}
                    <TrainerStatusBadge status={t.status} />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trainer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Report Absence / Find Cover
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Select Trainer</Label>
            <Select value={selectedTrainer} onValueChange={(v) => setSelectedTrainer(v ?? "")}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Choose a trainer" />
              </SelectTrigger>
              <SelectContent>
                {trainers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.type})
                    {(t.status === "sick" || t.status === "holiday") &&
                      ` - ${t.status.toUpperCase()}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Affected Courses */}
      {selectedTrainer && (
        <div className="space-y-4">
          {affectedCourses.length === 0 ? (
            <Card>
              <CardContent className="flex items-center gap-2 p-6 text-center justify-center text-muted-foreground">
                <UserCheck className="h-5 w-5" />
                <span>No scheduled courses affected for this trainer.</span>
              </CardContent>
            </Card>
          ) : (
            affectedCourses.map((sc) => (
              <Card key={sc.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {sc.course.code} - {sc.course.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                      Needs Cover
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(sc.startDate, sc.endDate)} at {sc.center.name} ·{" "}
                    {sc.enrollmentCount} delegates enrolled
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-2">Replacement Suggestions</p>
                  {(replacements[sc.id] || []).length === 0 ? (
                    <p className="text-sm text-red-600">
                      No available replacement trainers found for this course and date range.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trainer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Skill Level</TableHead>
                          <TableHead>Day Rate</TableHead>
                          <TableHead>Match Score</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(replacements[sc.id] || []).map((rep) => {
                          const skill = trainerSkills.find(
                            (s) => s.trainerId === rep.id && s.courseId === sc.courseId
                          );
                          return (
                            <TableRow key={rep.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px]">
                                      {getInitials(rep.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{rep.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="capitalize text-xs">
                                  {rep.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "capitalize text-xs",
                                    skill?.proficiencyLevel === "certified"
                                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                  )}
                                >
                                  {skill?.proficiencyLevel || "—"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {rep.dayRate
                                  ? formatCurrency(rep.dayRate) + "/day"
                                  : "Internal"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <div
                                    className="h-2 rounded-full bg-primary"
                                    style={{ width: `${rep.matchScore}px` }}
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {rep.matchScore}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  Assign
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
