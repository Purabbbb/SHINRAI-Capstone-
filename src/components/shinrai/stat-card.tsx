import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "high" | "ok";
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-muted">{label}</div>
          <div className="mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
          {hint && <div className="mt-1 text-xs text-faint">{hint}</div>}
        </div>
        <span
          className={cn(
            "grid size-10 place-items-center rounded-lg border border-border bg-surface-2 text-primary",
            tone === "high" && "text-accent",
            tone === "ok" && "text-success",
          )}
        >
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  );
}
