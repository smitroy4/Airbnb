import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel as HotelIcon, CheckCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/_mgr/manager/")({
  component: ManagerDashboard,
});

function ManagerDashboard() {
  const hotelsQ = useQuery({ queryKey: ["admin-hotels"], queryFn: endpoints.adminListHotels });

  if (hotelsQ.isLoading) return <LoadingState />;
  if (hotelsQ.isError) return <ErrorState message={getApiErrorMessage(hotelsQ.error)} onRetry={() => hotelsQ.refetch()} />;

  const hotels = hotelsQ.data ?? [];
  const active = hotels.filter((h) => h.active !== false).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground">Manage your hotels and bookings</p>
        </div>
        <Button asChild><Link to="/manager/hotels/new"><Plus className="h-4 w-4 mr-1" />New hotel</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total hotels" value={hotels.length} icon={HotelIcon} />
        <StatCard label="Active hotels" value={active} icon={CheckCircle} />
        <StatCard label="Inactive" value={hotels.length - active} icon={HotelIcon} />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-3">Your hotels</h2>
          {hotels.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hotels yet. Create your first hotel to get started.</p>
          ) : (
            <ul className="divide-y">
              {hotels.slice(0, 5).map((h) => (
                <li key={h.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.city}</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/manager/hotels/$hotelId" params={{ hotelId: String(h.id) }}>Open</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
