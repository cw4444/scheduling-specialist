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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrainerStatusBadge } from "@/components/trainers/trainer-status-badge";
import { trainers } from "@/data/trainers";
import { trainerSkills } from "@/data/skills";
import { formatCurrency, getInitials } from "@/lib/utils";
import { TrainerType, TrainerStatus } from "@/lib/types";
import { Search } from "lucide-react";

const typeColors: Record<TrainerType, string> = {
  internal: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  freelance: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  associate: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
};

export default function TrainersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return trainers.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trainers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
            <SelectItem value="associate">Associate</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="teaching">Teaching</SelectItem>
            <SelectItem value="prep">Prep</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
            <SelectItem value="sick">Sick</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Day Rate</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((trainer) => {
                const skillCount = trainerSkills.filter(
                  (s) => s.trainerId === trainer.id && s.proficiencyLevel === "certified"
                ).length;
                return (
                  <TableRow key={trainer.id}>
                    <TableCell>
                      <Link
                        href={`/trainers/${trainer.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(trainer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{trainer.name}</p>
                          <p className="text-xs text-muted-foreground">{trainer.email}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={typeColors[trainer.type]}>
                        {trainer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TrainerStatusBadge status={trainer.status} />
                    </TableCell>
                    <TableCell className="text-sm">{skillCount} courses</TableCell>
                    <TableCell className="text-sm">
                      {trainer.dayRate ? formatCurrency(trainer.dayRate) + "/day" : "N/A"}
                    </TableCell>
                    <TableCell className="text-sm">{trainer.location}</TableCell>
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
