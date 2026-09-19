import { IssueMap } from "./issue-map";
import { StatusBadge, UrgencyBadge } from "./status-badge";
import { ComplaintTimeline } from "./timeline";
import { UrgencyGauge } from "./urgency-gauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DEPARTMENTS, STATUS_LABEL } from "@/lib/shinrai/constants";
import { patchComplaint } from "@/lib/shinrai/server";
import type { Complaint, ComplaintEvent, Role, UrgencyLevel } from "@/lib/shinrai/types";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

function slaLabel(c: Complaint) {
  if (c.status === "resolved") return "Closed";
  if (!c.slaDeadline) return "No SLA";
  const t = new Date(c.slaDeadline).getTime() - Date.now();
  if (t <= 0 || c.slaBreached) return "SLA breached";
  return `SLA ${formatDistanceToNow(new Date(c.slaDeadline))} left`;
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function ComplaintView({
  complaint,
  events,
  role,
  onChange,
}: {
  complaint: Complaint;
  events: ComplaintEvent[];
  role: Role;
  onChange: (c: Complaint) => void;
}) {
  const [notes, setNotes] = useState(complaint.resolutionNotes ?? "");
  const [busy, setBusy] = useState(false);
  const c = complaint;

  async function act(action: Parameters<typeof patchComplaint>[0]["data"]["action"], extra: Record<string, unknown> = {}) {
    setBusy(true);
    try {
      const next = await patchComplaint({ data: { id: c.id, action, ...extra } as never });
      if (next) onChange(next);
      toast.success("Updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div>
          <div className="font-mono text-xs text-muted">{c.id}</div>
          <h1 className="mt-1 font-display text-3xl font-semibold">{c.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={c.status} />
            <UrgencyBadge level={c.urgencyLevel} />
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">{c.category}</span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
              {c.departmentName ?? "Unassigned"}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${c.slaBreached ? "border-accent/40 text-accent" : "border-border text-muted"}`}>
              {slaLabel(c)}
            </span>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted">
            <p className="text-fg">{c.description}</p>
            <div>{c.address}</div>
            {c.officerName && <div>Officer: {c.officerName}</div>}
            {c.duplicateCount > 1 && <div>{c.duplicateCount} citizen reports linked</div>}
          </CardContent>
        </Card>
        {c.media[0] && (
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {c.media.map((m, i) =>
                m.type === "image" ? (
                  <img key={i} src={m.url} alt="" className="h-48 w-full rounded-lg object-cover" />
                ) : (
                  <video key={i} src={m.url} controls className="h-48 w-full rounded-lg bg-bg" />
                ),
              )}
            </CardContent>
          </Card>
        )}
        {(c.beforeImage || c.afterImage || role === "officer" || role === "admin") && (
          <Card>
            <CardHeader>
              <CardTitle>Before / after verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs text-muted">Before</div>
                  {c.beforeImage ? (
                    <img src={c.beforeImage} alt="Before" className="h-44 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="grid h-44 place-items-center rounded-lg border border-dashed border-border text-sm text-faint">
                      No before photo
                    </div>
                  )}
                </div>
                <div>
                  <div className="mb-2 text-xs text-muted">After</div>
                  {c.afterImage ? (
                    <img src={c.afterImage} alt="After" className="h-44 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="grid h-44 place-items-center rounded-lg border border-dashed border-border text-sm text-faint">
                      No after photo
                    </div>
                  )}
                </div>
              </div>
              {c.resolutionNotes && <p className="text-sm text-muted">{c.resolutionNotes}</p>}
              {role === "officer" && c.status !== "resolved" && (
                <OfficerResolution busy={busy} notes={notes} setNotes={setNotes} onAct={act} />
              )}
              {role === "admin" && (c.status === "verification_pending" || c.status === "resolution_submitted") && (
                <div className="flex flex-wrap gap-2">
                  <Button disabled={busy} onClick={() => void act("verify")}>
                    Verify resolution
                  </Button>
                  <Button variant="danger" disabled={busy} onClick={() => void act("reject_resolution", { notes })}>
                    Reject resolution
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        <IssueMap
          height={280}
          pins={[{
            id: c.id,
            title: c.title,
            category: c.category,
            urgencyLevel: c.urgencyLevel,
            status: c.status,
            lat: c.lat,
            lng: c.lng,
            departmentId: c.departmentId,
            duplicateCount: c.duplicateCount,
          }]}
        />
      </div>
      <div className="space-y-4">
        {c.aiAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>AI analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs uppercase tracking-wide text-faint">
                {c.aiAnalysis.source === "grok" ? "Grok classification" : "Prototype classifier"}
              </div>
              <div className="text-sm">
                Issue type <span className="text-fg">{c.aiAnalysis.issueType}</span>
                <span className="ml-2 font-mono text-muted">{Math.round(c.aiAnalysis.confidence * 100)}%</span>
              </div>
              <UrgencyGauge score={c.urgencyScore} level={c.urgencyLevel} />
              <p className="text-sm text-muted">{c.aiAnalysis.rationale}</p>
              <div className="text-sm text-muted">Nearby similar reports: {c.aiAnalysis.similarReports}</div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintTimeline status={c.status} events={events} />
          </CardContent>
        </Card>
        {role === "admin" && <AdminActions c={c} busy={busy} onAct={act} />}
        {role === "officer" && c.status !== "resolved" && (
          <Card>
            <CardHeader>
              <CardTitle>Officer actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {c.status === "assigned" || c.status === "ai_analyzed" ? (
                <Button disabled={busy} onClick={() => void act("accept")}>Accept</Button>
              ) : null}
              {(c.status === "officer_accepted" || c.status === "assigned") && (
                <Button disabled={busy} onClick={() => void act("start")}>Start work</Button>
              )}
              <Button variant="outline" disabled={busy} onClick={() => void act("escalate")}>
                Escalate
              </Button>
            </CardContent>
          </Card>
        )}
        <p className="text-xs text-faint">
          Prototype note: notifications stay in-app. There is no SMS, WhatsApp, or government dispatch in this demo.
        </p>
      </div>
    </div>
  );
}

function OfficerResolution({
  busy,
  notes,
  setNotes,
  onAct,
}: {
  busy: boolean;
  notes: string;
  setNotes: (v: string) => void;
  onAct: (a: "save_before" | "submit_resolution", extra?: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      <Textarea placeholder="Resolution notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm">
          Before photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              onAct("save_before", { image: await readFile(f) });
            }}
          />
        </label>
        <label className="inline-flex h-10 items-center rounded-md bg-primary px-3 text-sm text-primary-fg">
          Submit with after photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              onAct("submit_resolution", { afterImage: await readFile(f), notes });
            }}
          />
        </label>
      </div>
      <p className="text-xs text-faint">Officers cannot mark a complaint permanently resolved. Admin verification is required.</p>
      {busy && <p className="text-xs text-muted">Saving…</p>}
    </div>
  );
}

function AdminActions({
  c,
  busy,
  onAct,
}: {
  c: Complaint;
  busy: boolean;
  onAct: (a: "assign_department" | "change_priority" | "escalate", extra?: Record<string, unknown>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <select
          className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
          defaultValue={c.departmentId ?? ""}
          onChange={(e) => onAct("assign_department", { departmentId: e.target.value })}
        >
          <option value="">Assign department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
          defaultValue={c.urgencyLevel}
          onChange={(e) => onAct("change_priority", { priority: e.target.value as UrgencyLevel })}
        >
          <option>HIGH</option>
          <option>MEDIUM</option>
          <option>LOW</option>
        </select>
        <Button variant="outline" disabled={busy} onClick={() => onAct("escalate")}>
          Escalate
        </Button>
        <div className="text-xs text-faint">Current status: {STATUS_LABEL[c.status]}</div>
      </CardContent>
    </Card>
  );
}
