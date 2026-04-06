"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { trainerSkills } from "@/data/skills";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, CalendarPlus } from "lucide-react";

const categoryColors: Record<string, string> = {
  Cloud: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  Testing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  "Project Management": "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  DevOps: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  Security: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  Cyber: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(
    () => [...new Set(courses.map((c) => c.category))],
    []
  );

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.code.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
      return true;
    });
  }, [search, categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Trainers</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((course) => {
                const certifiedCount = trainerSkills.filter(
                  (s) =>
                    s.courseId === course.id &&
                    s.proficiencyLevel === "certified"
                ).length;
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-mono text-sm font-medium">
                      {course.code}
                    </TableCell>
                    <TableCell className="text-sm">{course.name}</TableCell>
                    <TableCell className="text-sm">
                      {course.durationDays} day{course.durationDays > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          categoryColors[course.category] || ""
                        )}
                      >
                        {course.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{course.maxCapacity}</TableCell>
                    <TableCell className="text-sm">
                      {formatCurrency(course.price)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className={cn(certifiedCount < 2 && "text-red-600 font-medium")}>
                        {certifiedCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/courses/schedule?courseId=${course.id}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "h-7 text-xs"
                        )}
                      >
                        <CalendarPlus className="mr-1 h-3 w-3" />
                        Schedule
                      </Link>
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
