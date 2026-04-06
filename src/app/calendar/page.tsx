"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trainers } from "@/data/trainers";
import { courses } from "@/data/courses";
import { centers } from "@/data/centers";
import { scheduledCourses } from "@/data/scheduled-courses";
import { enrichAllCourses } from "@/lib/analytics";
import { formatPercentage, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";

const categoryColors: Record<string, string> = {
  Cloud: "bg-sky-500",
  Testing: "bg-emerald-500",
  "Project Management": "bg-violet-500",
  DevOps: "bg-orange-500",
  Security: "bg-red-500",
  Cyber: "bg-rose-500",
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1));
  const [centerFilter, setCenterFilter] = useState("all");

  const enriched = useMemo(
    () => enrichAllCourses(scheduledCourses, courses, trainers, centers),
    []
  );

  const filtered = useMemo(() => {
    if (centerFilter === "all") return enriched;
    return enriched.filter((sc) => sc.centerId === centerFilter);
  }, [enriched, centerFilter]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function prevMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[160px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select value={centerFilter} onValueChange={(v) => setCenterFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Centres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Centres</SelectItem>
            {centers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-2">
          <div className="grid grid-cols-7">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="border-b p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}
            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);

              const dayCourses = filtered.filter(
                (sc) => dateStr >= sc.startDate && dateStr <= sc.endDate
              );

              return (
                <div
                  key={dateStr}
                  className={cn(
                    "min-h-[100px] border-b border-r p-1",
                    !inMonth && "opacity-30"
                  )}
                >
                  <div
                    className={cn(
                      "mb-1 text-xs font-medium",
                      today &&
                        "inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5">
                    {dayCourses.slice(0, 3).map((sc) => (
                      <div
                        key={sc.id}
                        className={cn(
                          "rounded px-1 py-0.5 text-[10px] leading-tight text-white truncate",
                          categoryColors[sc.course.category] || "bg-gray-500"
                        )}
                        title={`${sc.course.code} - ${sc.trainer.name} (${formatPercentage(sc.fillRate)} fill)`}
                      >
                        {sc.course.code} · {sc.trainer.name.split(" ")[0]}
                      </div>
                    ))}
                    {dayCourses.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1">
                        +{dayCourses.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs">
            <div className={cn("h-3 w-3 rounded", color)} />
            <span>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
