import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_auth/account")({
  component: AccountLayout,
});

const tabs = [
  { to: "/account/profile", label: "Profile" },
  { to: "/account/guests", label: "Guests" },
  { to: "/account/bookings", label: "My Bookings" },
];

function AccountLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My account</h1>
        <div className="border-b mb-6 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap",
                path === t.to ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <Outlet />
      </div>
    </AppLayout>
  );
}
