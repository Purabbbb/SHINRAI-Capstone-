import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shinrai/stat-card";
import { StatusBadge, UrgencyBadge } from "@/components/shinrai/status-badge";
import { citizenStats, listMyComplaints } from "@/lib/shinrai/server";
import type { Complaint } from "@/lib/shinrai/types";
import { CheckCircle2, CircleDashed, ClipboardList, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/citizen/dashboard")({ component: CitizenDashboard });

function CitizenDashboard() {
  const [rows, setRows] = useState<Complaint[] | null>(null);
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, pending: 0 });
  useEffect(() => {
    void listMyComplaints().then(setRows).catch(() => setRows([]));
    void citizenStats().then(setStats).catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">My reports</h1>
          <p className="mt-1 text-sm text-muted">Track every issue from concern to completion.</p>
        </div>
        <Button asChild>
          <Link to="/citizen/report">
            <Plus className="size-4" /> Report new issue
          </Link>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My complaints" value={stats.total} icon={ClipboardList} />
        <StatCard label="Open" value={stats.open} icon={CircleDashed} />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} tone="ok" />
        <StatCard label="Pending actions" value={stats.pending} icon={CircleDashed} />
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Recent complaints</h2>
        {rows === null && <p className="text-sm text-faint">Loading…</p>}
        {rows && rows.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted">No complaints found.</p>
              <Button asChild className="mt-4">
                <Link to="/citizen/report">File the first report</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {rows?.map((c) => (
          <Link key={c.id} to="/citizen/complaints/$id" params={{ id: c.id }} className="block">
            <Card>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-muted">{c.id}</div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-muted">{c.category} · {c.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <UrgencyBadge level={c.urgencyLevel} />
                  <StatusBadge status={c.status} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
