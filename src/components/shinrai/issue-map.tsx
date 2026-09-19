import { useEffect, useMemo, useState } from "react";
import { CATEGORY_COLOR, FARIDABAD } from "@/lib/shinrai/constants";
import type { Category, ComplaintStatus, MapPin, UrgencyLevel } from "@/lib/shinrai/types";
import { cn } from "@/lib/utils";

type Props = {
  pins: MapPin[];
  height?: number;
  onSelect?: (id: string) => void;
  pickMode?: boolean;
  picked?: { lat: number; lng: number } | null;
  onPick?: (lat: number, lng: number) => void;
  heat?: boolean;
  className?: string;
};

export function IssueMap(props: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return <div className={cn("rounded-xl bg-surface-2", props.className)} style={{ height: props.height ?? 420 }} />;
  }
  return <LeafletMap {...props} />;
}

function LeafletMap({ pins, height = 420, onSelect, pickMode, picked, onPick, heat, className }: Props) {
  const [Lmod, setLmod] = useState<typeof import("leaflet") | null>(null);
  const [RL, setRL] = useState<typeof import("react-leaflet") | null>(null);

  useEffect(() => {
    void Promise.all([import("leaflet"), import("react-leaflet"), import("leaflet/dist/leaflet.css")]).then(
      ([leaflet, reactLeaflet]) => {
        setLmod(leaflet);
        setRL(reactLeaflet);
      },
    );
  }, []);

  const center = useMemo<[number, number]>(() => {
    if (picked) return [picked.lat, picked.lng];
    if (pins[0]) return [pins[0].lat, pins[0].lng];
    return [FARIDABAD.lat, FARIDABAD.lng];
  }, [pins, picked]);

  if (!Lmod || !RL) {
    return <div className={cn("rounded-xl bg-surface-2", className)} style={{ height }} />;
  }

  const { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } = RL;

  function ClickCatcher() {
    useMapEvents({
      click(e) {
        if (pickMode) onPick?.(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)} style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ClickCatcher />
        {pins.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={heat ? 8 + Math.min(14, p.duplicateCount * 3) : 8}
            pathOptions={{
              color: CATEGORY_COLOR[p.category as Category] ?? "#8b7cff",
              fillColor: CATEGORY_COLOR[p.category as Category] ?? "#8b7cff",
              fillOpacity: heat ? 0.28 : 0.85,
              weight: heat ? 0 : 1,
            }}
            eventHandlers={{ click: () => onSelect?.(p.id) }}
          >
            <Popup>
              <div className="min-w-40 text-sm">
                <div className="font-mono text-xs">{p.id}</div>
                <div className="font-medium">{p.title}</div>
                <div className="mt-1 text-xs">
                  {p.category} · {p.urgencyLevel} · {p.status}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {picked && (
          <CircleMarker
            center={[picked.lat, picked.lng]}
            radius={10}
            pathOptions={{ color: "#ff5a8a", fillColor: "#ff5a8a", fillOpacity: 0.9 }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export function MapFilters(props: {
  category: string;
  urgency: string;
  status: string;
  onCategory: (v: string) => void;
  onUrgency: (v: string) => void;
  onStatus: (v: string) => void;
  categories: string[];
  statuses: string[];
}) {
  const sel = "h-9 rounded-md border border-border bg-bg px-2 text-sm text-fg";
  return (
    <div className="flex flex-wrap gap-2">
      <select className={sel} value={props.category} onChange={(e) => props.onCategory(e.target.value)}>
        <option value="">All categories</option>
        {props.categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select className={sel} value={props.urgency} onChange={(e) => props.onUrgency(e.target.value)}>
        <option value="">All urgency</option>
        {(["HIGH", "MEDIUM", "LOW"] as UrgencyLevel[]).map((u) => (
          <option key={u}>{u}</option>
        ))}
      </select>
      <select className={sel} value={props.status} onChange={(e) => props.onStatus(e.target.value)}>
        <option value="">All status</option>
        {props.statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

void (0 as unknown as ComplaintStatus);
