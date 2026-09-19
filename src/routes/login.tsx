import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShinraiMark } from "@/components/shinrai/logo";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ROLE_HOME } from "@/lib/shinrai/constants";
import { bootstrapMe } from "@/lib/shinrai/server";
import type { Role } from "@/lib/shinrai/types";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="grid min-h-dvh place-items-center text-muted">Loading session…</div>;
  if (user) return <PortalPicker name={user.displayName} />;
  return <AuthForm />;
}

function PortalPicker({ name }: { name: string | null }) {
  const [busy, setBusy] = useState<Role | null>(null);
  const [go, setGo] = useState<string | null>(null);
  if (go) return <Navigate to={go} />;
  return (
    <main className="hero-wash grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <ShinraiMark />
          <CardTitle className="mt-3">Choose a portal</CardTitle>
          <p className="text-sm text-muted">
            Signed in{name ? ` as ${name}` : ""}. This prototype lets you open any role on your account so the full
            workflow can be demonstrated.
          </p>
        </CardHeader>
        <CardContent className="grid gap-2">
          {([
            ["citizen", "Citizen", "Report issues and track them"],
            ["officer", "Officer", "Work the field queue with before/after evidence"],
            ["admin", "Admin", "Analytics, SLA, map, and verification"],
          ] as const).map(([role, label, hint]) => (
            <Button
              key={role}
              variant="secondary"
              className="h-auto flex-col items-start py-3"
              disabled={!!busy}
              onClick={async () => {
                setBusy(role);
                await bootstrapMe({ data: { role, displayName: name } });
                setGo(ROLE_HOME[role]);
              }}
            >
              <span className="font-medium">{busy === role ? "Opening…" : `Continue as ${label}`}</span>
              <span className="text-xs font-normal text-muted">{hint}</span>
            </Button>
          ))}
          <Button asChild variant="ghost">
            <Link to="/">Back to landing</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fn =
      mode === "up"
        ? authClient.signUp.email({ email, password, name: name || "Citizen" })
        : authClient.signIn.email({ email, password });
    const { error: err } = await fn;
    setBusy(false);
    if (err) setError(err.message ?? "Could not sign in");
  }

  return (
    <main className="hero-wash grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <ShinraiMark />
          <CardTitle className="mt-3">Enter Shinrai</CardTitle>
          <p className="text-sm text-muted">Sign in to report issues or run a demo of the three portals.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                variant="secondary"
                className="w-full"
                onClick={() => void signIn(p.providerId, { callbackURL: "/login" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
          <div className="relative py-1 text-center text-xs text-faint">
            <span className="bg-surface px-2">or email</span>
          </div>
          <form className="space-y-3" onSubmit={(e) => void submit(e)}>
            {mode === "up" && (
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"}
            </Button>
          </form>
          <button className="text-sm text-muted underline-offset-4 hover:underline" onClick={() => setMode(mode === "up" ? "in" : "up")}>
            {mode === "up" ? "Have an account? Sign in" : "Need an account? Create one"}
          </button>
        </CardContent>
      </Card>
    </main>
  );
}
