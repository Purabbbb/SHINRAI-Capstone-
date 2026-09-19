import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/lib/shinrai/types";

export function UrgencyGauge({ score, level }: { score: number; level: UrgencyLevel }) {
  const pct = Math.round(score * 100);
  const color = level === "HIGH" ? "bg-accent" : level === "MEDIUM" ? "bg-warn" : "bg-success";
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted">Urgency score</span>
        <span className="font-mono text-lg tabular-nums text-fg">{score.toFixed(2)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
        <div className={cn("h-full rounded-full transition-[width] duration-500", color)} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs font-medium tracking-wide text-muted">Priority {level}</div>
    </div>
  );
}
