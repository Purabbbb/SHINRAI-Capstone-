import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IssueMap } from "@/components/shinrai/issue-map";
import { UrgencyGauge } from "@/components/shinrai/urgency-gauge";
import { CATEGORIES, FARIDABAD } from "@/lib/shinrai/constants";
import { analyzeComplaint, createComplaint } from "@/lib/shinrai/server";
import type { Category, DuplicateMatch, MediaItem } from "@/lib/shinrai/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/citizen/report")({ component: ReportIssue });

const STEPS = [
  "Extracting information",
  "Identifying issue type",
  "Estimating urgency",
  "Checking duplicate complaints",
  "Determining department",
];

function ReportIssue() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [lat, setLat] = useState(FARIDABAD.lat);
  const [lng, setLng] = useState(FARIDABAD.lng);
  const [address, setAddress] = useState("Faridabad, Haryana");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [geoNote, setGeoNote] = useState<string | null>(null);
  const [phase, setPhase] = useState<"form" | "analyzing" | "result">("form");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Awaited<ReturnType<typeof analyzeComplaint>> | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoNote("Location permission unavailable. Please select the location manually.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setAddress("Current location (GPS)");
      },
      () => setGeoNote("Location permission unavailable. Please select the location manually."),
    );
  }, []);

  async function onFiles(files: FileList | null, type: "image" | "video") {
    if (!files?.[0]) return;
    const file = files[0];
    if (file.size > 900_000) {
      toast.error("Keep uploads under 900KB for this prototype.");
      return;
    }
    const url = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
    setMedia((m) => [...m, { type, url, name: file.name }]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Add a title.");
      return;
    }
    try {
      const created = await createComplaint({
        data: { title, description, category, lat, lng, address, media },
      });
      setId(created.id);
      setPhase("analyzing");
      setStep(0);
      const timer = window.setInterval(() => setStep((s) => Math.min(STEPS.length, s + 1)), 450);
      const analyzed = await analyzeComplaint({ data: { id: created.id } });
      window.clearInterval(timer);
      setStep(STEPS.length);
      setResult(analyzed);
      setPhase("result");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI analysis failed. You can still submit the complaint.");
      if (id) void navigate({ to: "/citizen/complaints/$id", params: { id } });
    }
  }

  if (phase === "analyzing") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Analyzing your complaint…</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 text-sm">
              {i < step ? <Check className="size-4 text-success" /> : <Loader2 className="size-4 animate-spin text-muted" />}
              <span className={i < step ? "text-fg" : "text-muted"}>{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (phase === "result" && result?.complaint) {
    const a = result.complaint.aiAnalysis;
    const dups = result.duplicates as DuplicateMatch[];
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI analysis result</CardTitle>
            <p className="text-xs text-faint">
              {a?.source === "grok" ? "Classified with Grok, then routed by Shinrai rules." : "Prototype classifier — replaceable with a trained NLP model."}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row k="Issue type" v={a?.issueType ?? result.complaint.category} />
            <Row k="Confidence" v={`${Math.round((a?.confidence ?? 0) * 100)}%`} />
            {a && <UrgencyGauge score={a.urgencyScore} level={a.priority} />}
            <Row k="Recommended department" v={a?.departmentName ?? "—"} />
            <Row k="Nearby similar reports" v={String(dups.length)} />
          </CardContent>
        </Card>
        {dups[0] && (
          <Card>
            <CardHeader>
              <CardTitle>This issue may already have been reported.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dups.map((d) => (
                <div key={d.id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="font-mono text-xs">{d.id}</div>
                  <div>{d.title}</div>
                  <div className="text-muted">Similarity {d.similarity}% · Distance {d.distanceMeters}m</div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary">
                  <Link to="/citizen/complaints/$id" params={{ id: dups[0].id }}>
                    View existing complaint
                  </Link>
                </Button>
                <Button
                  onClick={async () => {
                    if (!id) return;
                    const merged = await analyzeComplaint({ data: { id, attachTo: dups[0].id } });
                    void navigate({ to: "/citizen/complaints/$id", params: { id: merged.mergedInto ?? dups[0].id } });
                  }}
                >
                  Add my report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <Button asChild className="w-full">
          <Link to="/citizen/complaints/$id" params={{ id: result.mergedInto ?? result.complaint.id }}>
            Open complaint {result.complaint.id}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="mx-auto max-w-2xl space-y-5" onSubmit={(e) => void submit(e)}>
      <div>
        <h1 className="font-display text-3xl font-semibold">Report an issue</h1>
        <p className="mt-1 text-sm text-muted">Multimedia civic reporting with GPS tagging.</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Large pothole on Mathura Road" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happened, how severe, who is affected…" />
      </div>
      <div className="space-y-1">
        <Label>Category (optional)</Label>
        <select
          className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "")}
        >
          <option value="">Let AI decide</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="rounded-lg border border-dashed border-border p-4 text-sm">
          Image upload
          <input type="file" accept="image/*" className="mt-2 block w-full text-xs" onChange={(e) => void onFiles(e.target.files, "image")} />
        </label>
        <label className="rounded-lg border border-dashed border-border p-4 text-sm">
          Video upload
          <input type="file" accept="video/*" className="mt-2 block w-full text-xs" onChange={(e) => void onFiles(e.target.files, "video")} />
        </label>
      </div>
      {media[0] && (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((m, i) =>
            m.type === "image" ? (
              <img key={i} src={m.url} alt="" className="h-24 rounded-md object-cover" />
            ) : (
              <video key={i} src={m.url} className="h-24 rounded-md" />
            ),
          )}
        </div>
      )}
      <div className="rounded-lg border border-border p-4">
        <div className="text-sm font-medium">Voice note</div>
        <p className="mt-1 text-xs text-faint">Prototype placeholder — type the complaint or use the description field. Speech-to-text is not wired in this demo.</p>
      </div>
      {geoNote && <p className="text-sm text-warn">{geoNote}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Latitude</Label>
          <Input value={lat} onChange={(e) => setLat(Number(e.target.value))} />
        </div>
        <div className="space-y-1">
          <Label>Longitude</Label>
          <Input value={lng} onChange={(e) => setLng(Number(e.target.value))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Location</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <p className="text-sm text-muted">Choose location manually on the map</p>
      <IssueMap
        height={280}
        pins={[]}
        pickMode
        picked={{ lat, lng }}
        onPick={(a, b) => {
          setLat(a);
          setLng(b);
          setAddress("Pinned on map");
        }}
      />
      <Button className="w-full" size="lg">
        Submit complaint
      </Button>
    </form>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted">{k}</span>
      <span className="text-fg">{v}</span>
    </div>
  );
}
