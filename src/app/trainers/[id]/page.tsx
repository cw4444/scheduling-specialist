"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrainerStatusBadge } from "@/components/trainers/trainer-status-badge";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { trainerSkills } from "@/data/skills";
import { availability } from "@/data/availability";
import { formatCurrency, getInitials, formatPercentage } from "@/lib/utils";
import { formatDateRange, formatFullDate } from "@/lib/date-utils";
import { getTrainerUtilization, enrichScheduledCourse } from "@/lib/analytics";
import { Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  getDay,
  addMonths,
  subMonths,
  isWeekend,
  parseISO,
} from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AvailabilityStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const availabilityColors: Record<AvailabilityStatus, string> = {
  available: "bg-green-200 dark:bg-green-900",
  teaching: "bg-blue-200 dark:bg-blue-900",
  prep: "bg-yellow-200 dark:bg-yellow-900",
  holiday: "bg-orange-200 dark:bg-orange-900",
  sick: "bg-red-200 dark:bg-red-900",
};

const proficiencyColors: Record<string, string> = {
  certified: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  expired: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function TrainerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trainer = trainers.find((t) => t.id === id);
  if (!trainer) notFound();

  const [calMonth, setCalMonth] = useState(new Date(2026, 3, 1)); // April 2026
  const utilization = getTrainerUtilization(trainer.id, scheduledCourses, courses);

  const trainerCourses = scheduledCourses
    .filter((sc) => sc.trainerId === trainer.id && sc.status !== "cancelled")
    .map((sc) => enrichScheduledCourse(sc, courses, trainers, centers));

  const skills = trainerSkills.filter((s) => s.trainerId === trainer.id);

  // Calendar data
  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7; // Monday = 0

  const trainerAvailability = availability.filter(
    (a) => a.trainerId === trainer.id
  );

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {getInitials(trainer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold">{trainer.name}</h2>
              <TrainerStatusBadge status={trainer.status} />
              <Badge variant="secondary" className="capitalize">
                {trainer.type}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {trainer.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {trainer.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {trainer.location}
              </span>
              {trainer.dayRate && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />{" "}
                  {formatCurrency(trainer.dayRate)}/day
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Hired{" "}
                {formatFullDate(trainer.hireDate)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{formatPercentage(utilization)}</p>
            <p className="text-xs text-muted-foreground">Utilization</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fill Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainerCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No scheduled courses
                      </TableCell>
                    </TableRow>
                  ) : (
                    trainerCourses.map((sc) => (
                      <TableRow key={sc.id}>
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
                        <TableCell>
                          <Badge variant="secondary" className="capitalize text-xs">
                            {sc.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {sc.enrollmentCount}/{sc.course.maxCapacity} (
                          {formatPercentage(sc.fillRate)})
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize text-xs">
                            {sc.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {format(calMonth, "MMMM yyyy")}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCalMonth(subMonths(calMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCalMonth(addMonths(calMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="py-2 font-medium text-muted-foreground">
                    {d}
                  </div>
                ))}
                {Array.from({ length: startPad }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const record = trainerAvailability.find((a) => a.date === dateStr);
                  const weekend = isWeekend(day);
                  return (
                    <div
                      key={dateStr}
                      className={cn(
                        "rounded-md py-2 text-xs",
                        weekend
                          ? "text-muted-foreground/40"
                          : record
                          ? availabilityColors[record.status]
                          : "bg-muted/50"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-3">
                {(
                  Object.entries(availabilityColors) as [AvailabilityStatus, string][]
                ).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5 text-xs">
                    <div className={cn("h-3 w-3 rounded", color)} />
                    <span className="capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Proficiency</TableHead>
                    <TableHead>Certified Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((skill) => {
                    const course = courses.find((c) => c.id === skill.courseId)!;
                    return (
                      <TableRow key={skill.courseId}>
                        <TableCell className="font-mono text-sm">
                          {course.code}
                        </TableCell>
                        <TableCell className="text-sm">{course.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "capitalize",
                              proficiencyColors[skill.proficiencyLevel]
                            )}
                          >
                            {skill.proficiencyLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {skill.certifiedDate
                            ? formatFullDate(skill.certifiedDate)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
