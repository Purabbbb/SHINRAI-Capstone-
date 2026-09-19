import { Link, useRouterState } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Bell, LayoutDashboard, Map, Shield, Siren, ClipboardList, Plus, BarChart3, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ShinraiWordmark } from "./logo";
import { bootstrapMe, listNotifications, markNotificationRead } from "@/lib/shinrai/server";
import type { NotificationItem, Role } from "@/lib/shinrai/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV: Record<Role, { to: string; label: string; icon: typeof Map }[]> = {
  citizen: [
    { to: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/citizen/report", label: "Report issue", icon: Plus },
  ],
  officer: [{ to: "/officer/dashboard", label: "Queue", icon: ClipboardList }],
  admin: [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/complaints", label: "Queue", icon: ClipboardList },
    { to: "/admin/map", label: "Issue map", icon: Map },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/cctv", label: "CCTV", icon: Siren },
  ],
};

export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<NotificationItem[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const unread = notes.filter((n) => !n.isRead).length;

  useEffect(() => {
    void bootstrapMe({ data: { displayName: user?.displayName, role } }).catch(() => undefined);
    void listNotifications()
      .then(setNotes)
      .catch(() => setNotes([]));
  }, [role, user?.displayName]);

  const links = NAV[role];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <button className="grid size-10 place-items-center rounded-md md:hidden" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Link to="/">
              <ShinraiWordmark compact />
            </Link>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-md px-3 text-sm text-muted hover:bg-surface-2 hover:text-fg",
                  pathname.startsWith(l.to) && "bg-surface-2 text-fg",
                )}
              >
                <l.icon className="size-4" />
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <RoleChips current={role} />
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowNotes((v) => !v)} aria-label="Notifications">
                <Bell className="size-4" />
              </Button>
              {unread > 0 && (
                <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] text-primary-fg">
                  {unread}
                </span>
              )}
              {showNotes && (
                <div className="absolute right-0 top-11 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface p-2 shadow-xl">
                  <div className="px-2 py-1 text-xs font-medium text-muted">Notifications</div>
                  {notes.length === 0 && <p className="px-2 py-4 text-sm text-faint">No notifications yet.</p>}
                  <div className="max-h-80 overflow-auto">
                    {notes.map((n) => (
                      <button
                        key={n.id}
                        className="w-full rounded-lg px-2 py-2 text-left hover:bg-surface-2"
                        onClick={() => {
                          void markNotificationRead({ data: n.id });
                          setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
                        }}
                      >
                        <div className={cn("text-sm", n.isRead ? "text-muted" : "text-fg")}>{n.title}</div>
                        <div className="text-xs text-faint">{n.body}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <UserButton />
          </div>
        </div>
        {open && (
          <div className="border-t border-border px-4 py-3 md:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center gap-2 text-sm"
              >
                <l.icon className="size-4" />
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

function RoleChips({ current }: { current: Role }) {
  const items: { role: Role; to: string; label: string }[] = [
    { role: "citizen", to: "/citizen/dashboard", label: "Citizen" },
    { role: "officer", to: "/officer/dashboard", label: "Officer" },
    { role: "admin", to: "/admin/dashboard", label: "Admin" },
  ];
  return (
    <div className="hidden items-center rounded-full border border-border p-0.5 sm:flex">
      {items.map((it) => (
        <Link
          key={it.role}
          to={it.to}
          className={cn(
            "flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] text-muted",
            current === it.role && "bg-surface-2 text-fg",
          )}
        >
          {it.role === "admin" && <Shield className="size-3" />}
          {it.label}
        </Link>
      ))}
    </div>
  );
}
