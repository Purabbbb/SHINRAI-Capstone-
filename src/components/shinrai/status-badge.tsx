import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/lib/shinrai/constants";
import type { ComplaintStatus, UrgencyLevel } from "@/lib/shinrai/types";

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const tone =
    status === "resolved" ? "success"
    : status === "verification_pending" || status === "resolution_submitted" ? "info"
    : status === "rejected" ? "high"
    : "neutral";
  return <Badge tone={tone}>{STATUS_LABEL[status]}</Badge>;
}

export function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  const tone = level === "HIGH" ? "high" : level === "MEDIUM" ? "medium" : "low";
  return <Badge tone={tone}>{level}</Badge>;
}
