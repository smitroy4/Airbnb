import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/api";

export const Route = createFileRoute("/_mgr")({
  ssr: false,
  component: ManagerGuard,
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getAccessToken()) {
      throw redirect({ to: "/login" });
    }
  },
});

function ManagerGuard() {
  const auth = useAuth();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  if (!auth.isAuthenticated) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }
  // Backend enforces roles; show a friendly notice for definitely-not-manager users only if we could decode.
  if (auth.roles.length > 0 && !auth.isManager) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Manager access required</h1>
          <p className="mt-2 text-muted-foreground">Your account doesn't have hotel manager permissions.</p>
        </div>
      </AppLayout>
    );
  }
  return <Outlet />;
}
