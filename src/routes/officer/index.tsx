import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/officer/")({
  component: () => <Navigate to="/officer/dashboard" />,
});
