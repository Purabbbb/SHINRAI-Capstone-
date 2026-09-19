import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalGate } from "@/components/shinrai/portal-gate";

export const Route = createFileRoute("/officer")({
  component: () => (
    <PortalGate role="officer">
      <Outlet />
    </PortalGate>
  ),
});
