import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalGate } from "@/components/shinrai/portal-gate";

export const Route = createFileRoute("/admin")({
  component: () => (
    <PortalGate role="admin">
      <Outlet />
    </PortalGate>
  ),
});
