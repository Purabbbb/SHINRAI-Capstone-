import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalGate } from "@/components/shinrai/portal-gate";

export const Route = createFileRoute("/citizen")({
  component: () => (
    <PortalGate role="citizen">
      <Outlet />
    </PortalGate>
  ),
});
