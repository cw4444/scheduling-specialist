import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  type: "warning" | "suggestion" | "opportunity" | "alert";
  title: string;
  description: string;
}

const iconMap = {
  warning: AlertTriangle,
  suggestion: Lightbulb,
  opportunity: TrendingUp,
  alert: UserX,
};

const colorMap = {
  warning: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
  suggestion: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
  opportunity: "text-green-500 bg-green-50 dark:bg-green-950/50",
  alert: "text-red-500 bg-red-50 dark:bg-red-950/50",
};

export function AiRecommendations({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, i) => {
          const Icon = iconMap[rec.type];
          return (
            <div
              key={i}
              className={cn(
                "flex gap-3 rounded-lg p-3",
                colorMap[rec.type]
              )}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{rec.title}</p>
                <p className="text-xs opacity-80 mt-0.5">{rec.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export type { Recommendation };
