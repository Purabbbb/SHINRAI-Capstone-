import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell } from "./app-shell";
import type { Role } from "@/lib/shinrai/types";
import { Skeleton } from "@/components/ui/skeleton";

export function PortalGate({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="min-h-dvh bg-bg p-6">
        <Skeleton className="h-14 w-full" />
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <AppShell role={role}>{children}</AppShell>;
}
