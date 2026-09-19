import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shinrai/stat-card";
import { analyticsBreakdown, analyticsOverview } from "@/lib/shinrai/server";
import type { AnalyticsOverview } from "@/lib/shinrai/types";
import { AlertTriangle, CheckCircle2, Clock, Inbox, Shield, Siren } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

const COLORS = ["#8b7cff", "#ff5a8a", "#34d399", "#fbbf24", "#38bdf8", "#fb923c", "#2dd4bf", "#9b97ad"];

function AdminDashboard() {
  const [ov, setOv] = useState<AnalyticsOverview | null>(null);
  const [cats, setCats] = useState<{ name: string; value: number }[]>([]);
  const [urg, setUrg] = useState<{ name: string; value: number }[]>([]);
  useEffect(() => {
    void analyticsOverview().then(setOv).catch(() => undefined);
    void analyticsBreakdown({ data: { days: 90 } })
      .then((b) => {
        setCats(b.byCategory);
        setUrg(b.byUrgency);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Governance overview</h1>
        <p className="mt-1 text-sm text-muted">Seeded Faridabad demo data plus any live reports from this session.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total complaints" value={ov?.total ?? "—"} icon={Inbox} />
        <StatCard label="Open" value={ov?.open ?? "—"} icon={Clock} />
        <StatCard label="Resolved" value={ov?.resolved ?? "—"} icon={CheckCircle2} tone="ok" />
        <StatCard label="High priority" value={ov?.highPriority ?? "—"} icon={Siren} tone="high" />
        <StatCard label="Avg resolution (hrs)" value={ov?.avgResolutionHours ?? "—"} icon={Clock} />
        <StatCard label="SLA compliance" value={ov ? `${ov.slaCompliance}%` : "—"} hint={`${ov?.slaBreached ?? 0} currently breached`} icon={Shield} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by category</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cats}>
                <CartesianGrid stroke="#2a2940" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9b97ad", fontSize: 11 }} interval={0} angle={-20} height={60} />
                <YAxis tick={{ fill: "#9b97ad", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#12121c", border: "1px solid #2a2940" }} />
                <Bar dataKey="value" fill="#8b7cff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Urgency distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={urg} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {urg.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#12121c", border: "1px solid #2a2940" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <Link className="rounded-md border border-border px-3 py-2" to="/admin/complaints">
          Open complaint queue
        </Link>
        <Link className="rounded-md border border-border px-3 py-2" to="/admin/map">
          Issue map
        </Link>
        <Link className="rounded-md border border-border px-3 py-2" to="/admin/cctv">
          CCTV prototype
        </Link>
        {ov && ov.slaBreached > 0 && (
          <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 px-3 py-2 text-accent">
            <AlertTriangle className="size-4" /> {ov.slaBreached} SLA breaches
          </span>
        )}
      </div>
    </div>
  );
}
