import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { StatusBadge, UrgencyBadge } from "@/components/shinrai/status-badge";
import { CATEGORIES, DEPARTMENTS, STATUS_LABEL } from "@/lib/shinrai/constants";
import { listAdminComplaints } from "@/lib/shinrai/server";
import type { Complaint, ComplaintStatus } from "@/lib/shinrai/types";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/complaints/")({ component: AdminQueue });

function AdminQueue() {
  const [rows, setRows] = useState<Complaint[]>([]);
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [status, setStatus] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "urgency" | "sla">("newest");

  useEffect(() => {
    void listAdminComplaints({ data: { category, urgency, status, departmentId, sort } }).then(setRows).catch(() => setRows([]));
  }, [category, urgency, status, departmentId, sort]);

  const sel = "h-9 rounded-md border border-border bg-bg px-2 text-sm";
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-semibold">Complaint queue</h1>
        <p className="mt-1 text-sm text-muted">Filter, sort, and open any report.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <select className={sel} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className={sel} value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option value="">Urgency</option>
          <option>HIGH</option>
          <option>MEDIUM</option>
          <option>LOW</option>
        </select>
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select className={sel} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">Department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select className={sel} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="urgency">Highest urgency</option>
          <option value="sla">SLA first</option>
        </select>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-faint">
            <tr>
              {["ID", "Issue", "Category", "Urgency", "Location", "Department", "Officer", "Status", "SLA", "Created"].map((h) => (
                <th key={h} className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-surface-2">
                <td className="px-3 py-3 font-mono text-xs">
                  <Link to="/admin/complaints/$id" params={{ id: c.id }} className="text-primary">
                    {c.id}
                  </Link>
                </td>
                <td className="px-3 py-3">{c.title}</td>
                <td className="px-3 py-3">{c.category}</td>
                <td className="px-3 py-3">
                  <UrgencyBadge level={c.urgencyLevel} />
                </td>
                <td className="max-w-40 truncate px-3 py-3 text-muted">{c.address}</td>
                <td className="px-3 py-3 text-muted">{c.departmentName ?? "—"}</td>
                <td className="px-3 py-3 text-muted">{c.officerName ?? "—"}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={c.status as ComplaintStatus} />
                </td>
                <td className={`px-3 py-3 ${c.slaBreached ? "text-accent" : "text-muted"}`}>
                  {c.slaBreached ? "Breached" : "On track"}
                </td>
                <td className="px-3 py-3 font-mono text-xs text-faint">{format(new Date(c.createdAt), "dd MMM")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-8 text-center text-sm text-muted">No complaints found.</p>}
      </Card>
    </div>
  );
}
