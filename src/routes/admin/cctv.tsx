import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FARIDABAD } from "@/lib/shinrai/constants";
import { analyzeCctv, listIncidents } from "@/lib/shinrai/server";
import type { AccidentIncident } from "@/lib/shinrai/types";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cctv")({ component: CctvPage });

function CctvPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraId, setCameraId] = useState("CAM-21A");
  const [location, setLocation] = useState("Sector 21, Faridabad");
  const [fileName, setFileName] = useState("");
  const [frame, setFrame] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [incidents, setIncidents] = useState<AccidentIncident[]>([]);
  const [last, setLast] = useState<Awaited<ReturnType<typeof analyzeCctv>> | null>(null);

  useEffect(() => {
    void listIncidents().then(setIncidents).catch(() => setIncidents([]));
  }, []);

  function grabFrame(): string | null {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  }

  async function run() {
    setBusy(true);
    try {
      const still = grabFrame() ?? frame;
      const res = await analyzeCctv({
        data: {
          cameraId,
          locationLabel: location,
          lat: FARIDABAD.lat,
          lng: FARIDABAD.lng,
          frameData: still,
          hint: fileName,
        },
      });
      setLast(res);
      setFrame(still);
      toast.success(res.detected ? "Prototype detection: incident flagged" : "Prototype detection: no incident");
      const list = await listIncidents();
      setIncidents(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Detection failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">CCTV incident module</h1>
          <p className="mt-1 text-sm text-muted">
            Prototype detection. This is not production-grade accident detection and is not connected to live city
            cameras.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upload a traffic clip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Camera ID</Label>
                <Input value={cameraId} onChange={(e) => setCameraId(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f || !videoRef.current) return;
                setFileName(f.name);
                videoRef.current.src = URL.createObjectURL(f);
              }}
            />
            <video ref={videoRef} controls className="w-full rounded-lg bg-bg" onLoadedData={() => setFrame(grabFrame())} />
            <Button disabled={busy} onClick={() => void run()}>
              {busy ? "Running detector…" : "Extract frames & detect"}
            </Button>
          </CardContent>
        </Card>
        {last && (
          <Card>
            <CardHeader>
              <CardTitle>{last.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Confidence: {last.confidence}</div>
              <div>Camera: {cameraId}</div>
              <div>Location: {location}</div>
              <div>Source: {last.source === "grok" ? "Grok vision (prototype)" : "Heuristic prototype detector"}</div>
              <p className="text-muted">{last.notes}</p>
              <div className="text-xs uppercase tracking-wide text-faint">Prototype Detection</div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="space-y-3">
        <h2 className="font-display text-xl">Incident log</h2>
        {incidents.map((inc) => (
          <Card key={inc.id}>
            <CardContent className="space-y-1 py-4 text-sm">
              <div className="font-medium">{inc.detection}</div>
              <div className="text-muted">
                {inc.cameraId} · {inc.locationLabel}
              </div>
              <div className="font-mono text-xs text-faint">
                {format(new Date(inc.createdAt), "dd MMM HH:mm")} · conf {inc.confidence} · {inc.alertStatus}
              </div>
              {inc.prototype && <div className="text-xs text-faint">Prototype detection</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
