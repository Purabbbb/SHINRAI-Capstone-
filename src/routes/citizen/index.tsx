import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/citizen/")({
  component: () => <Navigate to="/citizen/dashboard" />,
});
