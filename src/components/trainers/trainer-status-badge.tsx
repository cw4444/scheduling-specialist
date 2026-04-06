import { Badge } from "@/components/ui/badge";
import { TrainerStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<TrainerStatus, string> = {
  available: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  teaching: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  prep: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  holiday: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  sick: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function TrainerStatusBadge({ status }: { status: TrainerStatus }) {
  return (
    <Badge variant="secondary" className={cn("capitalize", statusStyles[status])}>
      {status}
    </Badge>
  );
}
