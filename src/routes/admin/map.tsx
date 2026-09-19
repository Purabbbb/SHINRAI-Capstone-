import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { IssueMap, MapFilters } from "@/components/shinrai/issue-map";
import { CATEGORIES, STATUS_LABEL } from "@/lib/shinrai/constants";
import { getPublicPins } from "@/lib/shinrai/server";
import type { MapPin } from "@/lib/shinrai/types";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/map")({ component: AdminMap });

function AdminMap() {
  const navigate = useNavigate();
  const [pins, setPins] = useState<MapPin[]>([]);
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [status, setStatus] = useState("");
  const [heat, setHeat] = useState(false);

  useEffect(() => {
    void getPublicPins()
      .then((rows) =>
        setPins(
          rows.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            urgencyLevel: r.urgency_level,
            status: r.status,
            lat: Number(r.lat),
            lng: Number(r.lng),
            departmentId: r.department_id,
            duplicateCount: r.duplicate_count,
          })),
        ),
      )
      .catch(() => setPins([]));
  }, []);

  const filtered = useMemo(
    () =>
      pins.filter(
        (p) =>
          (!category || p.category === category) &&
          (!urgency || p.urgencyLevel === urgency) &&
          (!status || p.status === status),
      ),
    [pins, category, urgency, status],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Live issue map</h1>
          <p className="mt-1 text-sm text-muted">OpenStreetMap · Faridabad / NCR demo pins</p>
        </div>
        <Button variant={heat ? "default" : "secondary"} onClick={() => setHeat((v) => !v)}>
          {heat ? "Heat view on" : "Density view"}
        </Button>
      </div>
      <MapFilters
        category={category}
        urgency={urgency}
        status={status}
        onCategory={setCategory}
        onUrgency={setUrgency}
        onStatus={setStatus}
        categories={[...CATEGORIES]}
        statuses={Object.keys(STATUS_LABEL)}
      />
      <IssueMap
        pins={filtered}
        height={560}
        heat={heat}
        onSelect={(id) => void navigate({ to: "/admin/complaints/$id", params: { id } })}
      />
    </div>
  );
}
