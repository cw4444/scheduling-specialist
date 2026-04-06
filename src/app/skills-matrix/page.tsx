"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { trainerSkills } from "@/data/skills";
import { getSkillGaps } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

export default function SkillsMatrixPage() {
  const gaps = useMemo(() => getSkillGaps(courses, trainerSkills), []);

  return (
    <div className="space-y-6">
      {/* Gap Analysis */}
      {gaps.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Skill Gap Analysis</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gaps.map((gap) => (
              <Card
                key={gap.course.id}
                className={cn(
                  gap.certifiedCount <= 1
                    ? "border-red-200 dark:border-red-900"
                    : "border-amber-200 dark:border-amber-900"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        gap.certifiedCount <= 1 ? "text-red-500" : "text-amber-500"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {gap.course.code} - {gap.course.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {gap.certifiedCount === 0
                          ? "No certified trainers!"
                          : gap.certifiedCount === 1
                          ? "Only 1 certified trainer (single point of failure)"
                          : `${gap.certifiedCount} certified trainers`}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {gap.trainers.map((tid) => {
                          const t = trainers.find((tr) => tr.id === tid)!;
                          return (
                            <Badge key={tid} variant="secondary" className="text-xs">
                              {t.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Matrix Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="sticky left-0 z-10 bg-card px-4 py-2 text-left font-medium">
                    Trainer
                  </th>
                  {courses.map((course) => (
                    <th
                      key={course.id}
                      className="px-2 py-2 text-center font-medium"
                    >
                      <div
                        className="writing-mode-vertical text-xs whitespace-nowrap"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        {course.code}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer) => (
                  <tr key={trainer.id} className="border-b hover:bg-muted/50">
                    <td className="sticky left-0 z-10 bg-card px-4 py-2 font-medium whitespace-nowrap">
                      {trainer.name}
                    </td>
                    {courses.map((course) => {
                      const skill = trainerSkills.find(
                        (s) =>
                          s.trainerId === trainer.id && s.courseId === course.id
                      );
                      return (
                        <td key={course.id} className="px-2 py-2 text-center">
                          {skill ? (
                            <div
                              className="flex items-center justify-center"
                              title={`${skill.proficiencyLevel}${skill.certifiedDate ? ` (${skill.certifiedDate})` : ""}`}
                            >
                              {skill.proficiencyLevel === "certified" && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              {skill.proficiencyLevel === "in-progress" && (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                              {skill.proficiencyLevel === "expired" && (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex gap-4 border-t p-4">
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" /> Certified
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 text-yellow-500" /> In Progress
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <XCircle className="h-3.5 w-3.5 text-red-400" /> Expired
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
