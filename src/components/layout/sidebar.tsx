"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  BarChart3,
  Grid3X3,
  Shield,
  FileText,
  UserPlus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Trainers", href: "/trainers", icon: Users },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Fill Rates", href: "/fill-rates", icon: BarChart3 },
  { label: "Skills Matrix", href: "/skills-matrix", icon: Grid3X3 },
  { label: "Cover", href: "/cover", icon: Shield },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Onboarding", href: "/onboarding", icon: UserPlus },
];

interface SidebarProps {
  onOpenCopilot: () => void;
}

export function Sidebar({ onOpenCopilot }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <CalendarDays className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg tracking-tight">ScheduleAI</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto h-7 w-7", collapsed && "ml-0")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Copilot button */}
      <div className="border-t p-2">
        <Button
          variant="outline"
          className={cn(
            "w-full",
            collapsed ? "justify-center" : "justify-start gap-2"
          )}
          onClick={onOpenCopilot}
        >
          <Sparkles className="h-4 w-4" />
          {!collapsed && "AI Copilot"}
        </Button>
      </div>
    </aside>
  );
}
