"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { onboardingRecords } from "@/data/onboarding";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { formatShortDate } from "@/lib/date-utils";
import { getInitials, cn } from "@/lib/utils";
import { OnboardingStatus } from "@/lib/types";
import { UserPlus, CheckCircle } from "lucide-react";

const statusColors: Record<OnboardingStatus, string> = {
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
};

const columns: { status: OnboardingStatus; label: string }[] = [
  { status: "in-progress", label: "In Progress" },
  { status: "on-hold", label: "On Hold" },
  { status: "completed", label: "Completed" },
];

export default function OnboardingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(
    onboardingRecords.find((r) => r.status === "in-progress")?.id || null
  );

  const selected = onboardingRecords.find((r) => r.id === selectedId);

  return (
    <div className="space-y-6">
      {/* Pipeline Board */}
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((col) => {
          const records = onboardingRecords.filter((r) => r.status === col.status);
          return (
            <div key={col.status}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {records.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {records.map((record) => {
                  const newTrainer = trainers.find((t) => t.id === record.newTrainerId)!;
                  const buddy = trainers.find((t) => t.id === record.buddyId)!;
                  const completedCount = record.checklist.filter((c) => c.completed).length;
                  const progress = (completedCount / record.checklist.length) * 100;

                  return (
                    <Card
                      key={record.id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedId === record.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedId(record.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(newTrainer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{newTrainer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Buddy: {buddy.name}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>
                              {completedCount}/{record.checklist.length}
                            </span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selected && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4" />
                Onboarding Details
              </CardTitle>
              <Badge
                variant="secondary"
                className={cn("capitalize", statusColors[selected.status])}
              >
                {selected.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Started {formatShortDate(selected.startDate)}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Checklist */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Checklist</h4>
              <div className="space-y-2">
                {selected.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Checkbox checked={item.completed} disabled />
                    <span
                      className={cn(
                        "text-sm",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sit-in Courses */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Sit-in Courses</h4>
              <div className="space-y-2">
                {selected.sitInCourses.map((sitIn) => {
                  const course = courses.find((c) => c.id === sitIn.courseId)!;
                  return (
                    <div
                      key={sitIn.courseId}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {course.code} - {course.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatShortDate(sitIn.scheduledDate)}
                        </p>
                      </div>
                      {sitIn.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
