import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shinrai/stat-card";
import { StatusBadge, UrgencyBadge } from "@/components/shinrai/status-badge";
import { listOfficerQueue } from "@/lib/shinrai/server";
import type { Complaint } from "@/lib/shinrai/types";
import { AlertTriangle, CheckCircle2, ClipboardList, Timer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/officer/dashboard")({ component: OfficerDashboard });

function OfficerDashboard() {
  const [rows, setRows] = useState<Complaint[] | null>(null);
  useEffect(() => {
    void listOfficerQueue().then(setRows).catch(() => setRows([]));
  }, []);
  const stats = useMemo(() => {
    const list = rows ?? [];
    return {
      assigned: list.filter((c) => c.status === "assigned" || c.status === "ai_analyzed").length,
      progress: list.filter((c) => ["officer_accepted", "in_progress"].includes(c.status)).length,
      verify: list.filter((c) => c.status === "verification_pending" || c.status === "resolution_submitted").length,
      breached: list.filter((c) => c.slaBreached).length,
    };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Field queue</h1>
        <p className="mt-1 text-sm text-muted">Accept, work, and submit verified evidence. Closure is admin-only.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned" value={stats.assigned} icon={ClipboardList} />
        <StatCard label="In progress" value={stats.progress} icon={Timer} />
        <StatCard label="Awaiting verify" value={stats.verify} icon={CheckCircle2} tone="ok" />
        <StatCard label="SLA breached" value={stats.breached} icon={AlertTriangle} tone="high" />
      </div>
      <div className="space-y-3">
        {rows === null && <p className="text-sm text-faint">Loading queue…</p>}
        {rows && rows.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted">No tasks in your queue.</CardContent>
          </Card>
        )}
        {rows?.map((c) => (
          <Link key={c.id} to="/officer/complaints/$id" params={{ id: c.id }} className="block">
            <Card>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-muted">{c.id}</div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-muted">{c.address}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <UrgencyBadge level={c.urgencyLevel} />
                  <StatusBadge status={c.status} />
                  <span className={`text-xs ${c.slaBreached ? "text-accent" : "text-muted"}`}>
                    {c.slaDeadline
                      ? c.slaBreached
                        ? "SLA breached"
                        : `SLA ${formatDistanceToNow(new Date(c.slaDeadline))}`
                      : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
