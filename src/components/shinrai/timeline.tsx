import { STATUS_LABEL, STATUS_ORDER } from "@/lib/shinrai/constants";
import type { ComplaintEvent, ComplaintStatus } from "@/lib/shinrai/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function ComplaintTimeline({
  status,
  events,
}: {
  status: ComplaintStatus;
  events: ComplaintEvent[];
}) {
  const currentIdx = Math.max(0, STATUS_ORDER.indexOf(status === "rejected" ? "in_progress" : status));
  return (
    <div className="space-y-6">
      <ol className="space-y-3">
        {STATUS_ORDER.map((step, i) => {
          const done = i <= currentIdx && status !== "rejected";
          const active = i === currentIdx;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-2.5 rounded-full",
                  done ? "bg-primary" : "bg-border",
                  active && "ring-4 ring-primary/20",
                )}
              />
              <span className={cn("text-sm", done ? "text-fg" : "text-faint")}>{STATUS_LABEL[step]}</span>
            </li>
          );
        })}
      </ol>
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-sm font-medium text-muted">Updates</h4>
        {events.length === 0 && <p className="text-sm text-faint">No updates yet.</p>}
        {events.map((e) => (
          <div key={e.id} className="rounded-lg bg-surface-2 px-3 py-2">
            <div className="text-sm text-fg">{e.message}</div>
            <div className="mt-1 font-mono text-[11px] tabular-nums text-faint">
              {format(new Date(e.createdAt), "dd MMM, HH:mm")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
