import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Hotel as HotelIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { to: "/manager", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/manager/hotels", label: "My Hotels", icon: HotelIcon },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <HotelIcon className="h-6 w-6 text-primary" />
            <span>StayGrid</span>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Manager Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t space-y-1">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{auth.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => auth.logout()}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
}
