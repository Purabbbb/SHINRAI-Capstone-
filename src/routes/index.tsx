import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShinraiMark } from "@/components/shinrai/logo";
import { IssueMap } from "@/components/shinrai/issue-map";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getPublicPins } from "@/lib/shinrai/server";
import { SUBTITLE, TAGLINE } from "@/lib/shinrai/constants";
import type { MapPin } from "@/lib/shinrai/types";
import { Bell, Brain, Camera, CheckCircle2, MapPin as MapIcon, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const [pins, setPins] = useState<MapPin[]>([]);
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

  return (
    <div className="hero-wash min-h-dvh">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <ShinraiMark />
          <span className="font-display text-lg font-bold">Shinrai</span>
        </div>
        <div className="flex items-center gap-2">
          {isPending ? <div className="h-8 w-24 animate-pulse rounded-full bg-surface-2" /> : null}
          <SignedOut>
            <Button asChild variant="secondary" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="stagger-in max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Civic OS for cities</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl">Shinrai</h1>
          <p className="mt-3 text-xl text-muted">{TAGLINE}</p>
          <p className="mt-5 text-base leading-relaxed text-muted">{SUBTITLE}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Button asChild size="lg">
                <Link to="/citizen/report">Report an issue</Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/login">Report an issue</Link>
              </Button>
            )}
            {user ? (
              <Button asChild size="lg" variant="secondary">
                <Link to="/admin/dashboard">Explore dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary">
                <Link to="/login">Explore dashboard</Link>
              </Button>
            )}
          </div>
          <p className="mt-6 max-w-md text-xs text-faint">
            Capstone prototype. AI routing, duplicate matching, and CCTV detection are demonstration modules — not live
            municipal infrastructure.
          </p>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <IssueMap pins={pins} height={340} />
            <div className="flex items-center justify-between px-4 py-3 text-xs text-muted">
              <span>Live issue map · Faridabad / Delhi NCR demo data</span>
              <span className="tabular-nums">{pins.length} reports</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="font-display text-2xl font-semibold">How Shinrai works</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            { n: "01", t: "Report", d: "Photo, video, or text with GPS." },
            { n: "02", t: "Analyze", d: "Classify, score urgency, find duplicates." },
            { n: "03", t: "Route", d: "Send to the right department and officer." },
            { n: "04", t: "Verify", d: "Before/after evidence, then close." },
          ].map((s) => (
            <Card key={s.n}>
              <CardContent>
                <div className="font-mono text-xs text-primary">{s.n}</div>
                <div className="mt-2 font-display text-lg">{s.t}</div>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-display text-2xl font-semibold">Key features</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, t: "AI-powered governance", d: "Issue type, urgency, and department from the report itself." },
            { icon: Bell, t: "Real-time issue tracking", d: "A visible lifecycle from submitted to resolved." },
            { icon: CheckCircle2, t: "Verified resolution", d: "Field teams must file before and after photos." },
            { icon: Camera, t: "CCTV incident detection", d: "Prototype module for accident stills and alerts." },
            { icon: MapIcon, t: "Geospatial intelligence", d: "Heatmap, clustering of nearby reports, SLA view." },
            { icon: Shield, t: "Accountable queues", d: "Admin, officer, and citizen portals on one platform." },
          ].map((f) => (
            <Card key={f.t}>
              <CardContent className="flex gap-3">
                <f.icon className="mt-0.5 size-4 text-primary" />
                <div>
                  <div className="font-medium">{f.t}</div>
                  <p className="mt-1 text-sm text-muted">{f.d}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
