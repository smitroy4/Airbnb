import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const Route = createFileRoute("/_mgr/manager")({
  component: () => <DashboardLayout><Outlet /></DashboardLayout>,
});
