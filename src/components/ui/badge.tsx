import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.ComponentProps<"span"> & { tone?: "neutral" | "high" | "medium" | "low" | "success" | "warn" | "info" }) {
  const tones = {
    neutral: "bg-surface-2 text-muted border-border",
    high: "bg-accent/15 text-accent border-accent/30",
    medium: "bg-warn/15 text-warn border-warn/30",
    low: "bg-success/15 text-success border-success/30",
    success: "bg-success/15 text-success border-success/30",
    warn: "bg-warn/15 text-warn border-warn/30",
    info: "bg-primary/15 text-primary border-primary/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
