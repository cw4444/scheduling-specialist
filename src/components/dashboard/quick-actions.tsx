import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CalendarPlus, Shield, BarChart3, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Schedule Course",
    href: "/courses/schedule",
    icon: CalendarPlus,
  },
  {
    label: "Manage Cover",
    href: "/cover",
    icon: Shield,
  },
  {
    label: "Fill Rates",
    href: "/fill-rates",
    icon: BarChart3,
  },
  {
    label: "Skills Matrix",
    href: "/skills-matrix",
    icon: Grid3X3,
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-auto flex-col gap-2 py-4"
          )}
        >
          <action.icon className="h-5 w-5" />
          <span className="text-xs">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
