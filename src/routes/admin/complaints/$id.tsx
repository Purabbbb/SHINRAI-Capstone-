import { createFileRoute } from "@tanstack/react-router";
import { ComplaintView } from "@/components/shinrai/complaint-view";
import { getComplaint } from "@/lib/shinrai/server";
import type { Complaint, ComplaintEvent } from "@/lib/shinrai/types";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/complaints/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const [data, setData] = useState<{ complaint: Complaint; events: ComplaintEvent[] } | null>(null);
  useEffect(() => {
    void getComplaint({ data: id }).then((r) => {
      if (r?.complaint) setData({ complaint: r.complaint, events: r.events });
    });
  }, [id]);
  if (!data) return <p className="text-sm text-muted">Loading complaint…</p>;
  return (
    <ComplaintView
      role="admin"
      complaint={data.complaint}
      events={data.events}
      onChange={(c) => setData((d) => (d ? { ...d, complaint: c } : d))}
    />
  );
}
