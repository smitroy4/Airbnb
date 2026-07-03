import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/api";

export const Route = createFileRoute("/_auth")({
  ssr: false,
  component: AuthLayout,
  beforeLoad: () => {
    // Client-only check (ssr:false ensures this runs client-side)
    if (typeof window !== "undefined" && !getAccessToken()) {
      throw redirect({ to: "/login" });
    }
  },
});

function AuthLayout() {
  const auth = useAuth();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  if (!auth.isAuthenticated) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }
  return <Outlet />;
}
