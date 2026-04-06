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
import { EnrichedScheduledCourse } from "@/lib/types";
import { formatDateRange } from "@/lib/date-utils";
import { formatPercentage, getFillRateColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

const fillColorMap = {
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
};

export function UpcomingCourses({
  courses,
}: {
  courses: EnrichedScheduledCourse[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4" />
          Upcoming Courses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Centre</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead className="text-right">Fill Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((sc) => {
              const color = getFillRateColor(sc.fillRate);
              return (
                <TableRow key={sc.id}>
                  <TableCell>
                    <div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {sc.course.code}
                      </span>
                      <p className="text-sm font-medium">{sc.course.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDateRange(sc.startDate, sc.endDate)}
                  </TableCell>
                  <TableCell className="text-sm">{sc.center.name}</TableCell>
                  <TableCell className="text-sm">{sc.trainer.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className={cn("font-mono", fillColorMap[color])}
                    >
                      {sc.enrollmentCount}/{sc.course.maxCapacity} (
                      {formatPercentage(sc.fillRate)})
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
