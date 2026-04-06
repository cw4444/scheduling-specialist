"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { trainerSkills } from "@/data/skills";
import { getAvailableTrainers, checkTrainerConflict, checkCenterConflict } from "@/lib/scheduling";
import { calculateEndDate } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function ScheduleCoursePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
      <ScheduleCoursePage />
    </Suspense>
  );
}

function ScheduleCoursePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedCourse = searchParams.get("courseId") || "";

  const [courseId, setCourseId] = useState(preselectedCourse);
  const [centerId, setCenterId] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [courseType, setCourseType] = useState<string>("public");
  const [enrollment, setEnrollment] = useState("0");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const selectedCourse = courses.find((c) => c.id === courseId);
  const endDate = selectedCourse && startDate
    ? calculateEndDate(startDate, selectedCourse.durationDays)
    : "";

  const availableTrainers = useMemo(() => {
    if (!courseId || !startDate || !endDate) return [];
    return getAvailableTrainers(
      courseId,
      startDate,
      endDate,
      trainers,
      trainerSkills,
      scheduledCourses
    );
  }, [courseId, startDate, endDate]);

  function handleSubmit() {
    const newErrors: string[] = [];

    if (!courseId) newErrors.push("Please select a course");
    if (!centerId) newErrors.push("Please select a centre");
    if (!trainerId) newErrors.push("Please select a trainer");
    if (!startDate) newErrors.push("Please select a start date");

    if (trainerId && startDate && endDate) {
      const conflict = checkTrainerConflict(trainerId, startDate, endDate, scheduledCourses);
      if (conflict.hasConflict) {
        newErrors.push(`Trainer has a scheduling conflict with another course`);
      }
    }

    if (centerId && startDate && endDate) {
      const centerCheck = checkCenterConflict(centerId, startDate, endDate, scheduledCourses, centers);
      if (centerCheck.hasConflict) {
        newErrors.push(`No rooms available at this centre for the selected dates`);
      }
    }

    setErrors(newErrors);
    if (newErrors.length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Course Scheduled!</h2>
        <p className="text-muted-foreground mb-6">
          {selectedCourse?.code} - {selectedCourse?.name} has been scheduled.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/calendar")}>View Calendar</Button>
          <Button variant="outline" onClick={() => {
            setSubmitted(false);
            setCourseId("");
            setCenterId("");
            setTrainerId("");
            setStartDate("");
            setEnrollment("0");
          }}>
            Schedule Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {errors.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="p-4">
            {errors.map((err, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {err}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Course</Label>
            <Select value={courseId} onValueChange={(v) => setCourseId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.code} - {c.name} ({c.durationDays}d)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourse && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Duration: {selectedCourse.durationDays} days</span>
              <span>Capacity: {selectedCourse.maxCapacity}</span>
              <span>Price: {formatCurrency(selectedCourse.price)}/delegate</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Training Centre</Label>
              <Select value={centerId} onValueChange={(v) => setCenterId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select centre" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.rooms.length} rooms)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course Type</Label>
              <Select value={courseType} onValueChange={(v) => setCourseType(v ?? "public")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="onsite">On Site</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date (auto-calculated)</Label>
              <Input type="date" value={endDate} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trainer Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Trainer{" "}
              {courseId && startDate && (
                <span className="text-muted-foreground font-normal">
                  ({availableTrainers.length} available)
                </span>
              )}
            </Label>
            <Select value={trainerId} onValueChange={(v) => setTrainerId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select trainer" />
              </SelectTrigger>
              <SelectContent>
                {availableTrainers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.type}
                    {t.dayRate ? ` - ${formatCurrency(t.dayRate)}/day` : ""})
                  </SelectItem>
                ))}
                {availableTrainers.length === 0 && courseId && startDate && (
                  <SelectItem value="_none" disabled>
                    No available trainers for this course/date
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Initial Enrollment</Label>
            <Input
              type="number"
              min="0"
              max={selectedCourse?.maxCapacity || 20}
              value={enrollment}
              onChange={(e) => setEnrollment(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        Schedule Course
      </Button>
    </div>
  );
}
