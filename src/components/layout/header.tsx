"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/trainers": "Trainers",
  "/courses": "Course Catalog",
  "/courses/schedule": "Schedule a Course",
  "/calendar": "Calendar",
  "/fill-rates": "Fill Rate Monitor",
  "/skills-matrix": "Skills Matrix",
  "/cover": "Cover Management",
  "/reports": "Reports",
  "/onboarding": "Onboarding",
};

export function Header() {
  const pathname = usePathname();

  // Match exact path first, then parent path, then check for dynamic segments
  const title =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(
      ([key]) => key !== "/" && pathname.startsWith(key)
    )?.[1] ||
    "ScheduleAI";

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <ThemeToggle />
    </header>
  );
}
