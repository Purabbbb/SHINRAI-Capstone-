import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueMap } from "@/components/shinrai/issue-map";
import { analyticsBreakdown, analyticsOverview } from "@/lib/shinrai/server";
import type { AnalyticsOverview, MapPin } from "@/lib/shinrai/types";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const [days, setDays] = useState(90);
  const [ov, setOv] = useState<AnalyticsOverview | null>(null);
  const [trends, setTrends] = useState<{ day: string; count: number }[]>([]);
  const [dept, setDept] = useState<{ name: string; value: number }[]>([]);
  const [status, setStatus] = useState<{ name: string; value: number }[]>([]);
  const [heat, setHeat] = useState<MapPin[]>([]);

  useEffect(() => {
    void analyticsOverview().then(setOv).catch(() => undefined);
    void analyticsBreakdown({ data: { days } })
      .then((b) => {
        setTrends(b.trends);
        setDept(b.byDepartment);
        setStatus(b.byStatus);
        setHeat(
          b.heatmap.map((h, i) => ({
            id: `h-${i}`,
            title: h.category,
            category: h.category as MapPin["category"],
            urgencyLevel: "MEDIUM",
            status: "submitted",
            lat: Number(h.lat),
            lng: Number(h.lng),
            departmentId: null,
            duplicateCount: Number(h.weight),
          })),
        );
      })
      .catch(() => undefined);
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Analytics</h1>
          <p className="mt-1 text-sm text-muted">Charts use stored complaints — they do not randomize on refresh.</p>
        </div>
        <select
          className="h-9 rounded-md border border-border bg-bg px-2 text-sm"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>All demo data</option>
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Volume" value={ov?.total ?? "—"} />
        <Metric label="SLA compliance" value={ov ? `${ov.slaCompliance}%` : "—"} />
        <Metric label="Avg hours to close" value={ov?.avgResolutionHours ?? "—"} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Complaint trend</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <CartesianGrid stroke="#2a2940" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#9b97ad", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9b97ad", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#12121c", border: "1px solid #2a2940" }} />
              <Area dataKey="count" stroke="#8b7cff" fill="#8b7cff33" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department workload</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dept} layout="vertical">
                <CartesianGrid stroke="#2a2940" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9b97ad", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#9b97ad", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#12121c", border: "1px solid #2a2940" }} />
                <Bar dataKey="value" fill="#ff5a8a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolution status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={status}>
                <CartesianGrid stroke="#2a2940" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#9b97ad", fontSize: 10 }} interval={0} angle={-25} height={70} />
                <YAxis tick={{ fill: "#9b97ad", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#12121c", border: "1px solid #2a2940" }} />
                <Bar dataKey="value" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="mb-3 font-display text-xl">Recurring issue zones</h2>
        <IssueMap pins={heat} height={380} heat />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent>
        <div className="text-sm text-muted">{label}</div>
        <div className="mt-1 font-display text-2xl tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}
