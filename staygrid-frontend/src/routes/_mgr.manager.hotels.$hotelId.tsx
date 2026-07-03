import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, BookOpen, BarChart3, Pencil } from "lucide-react";

export const Route = createFileRoute("/_mgr/manager/hotels/$hotelId")({
  component: HotelDetailManagerPage,
});

function HotelDetailManagerPage() {
  const { hotelId } = Route.useParams();
  const q = useQuery({ queryKey: ["admin-hotel", hotelId], queryFn: () => endpoints.adminGetHotel(hotelId) });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} />;
  const h = q.data!;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">{h.name}</h1>
          <p className="text-muted-foreground">{h.city}</p>
        </div>
        <Button asChild variant="outline"><Link to="/manager/hotels/$hotelId/edit" params={{ hotelId }}><Pencil className="h-4 w-4 mr-1" />Edit</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/manager/hotels/$hotelId/rooms" params={{ hotelId }}>
          <Card className="hover:shadow-md transition-shadow"><CardContent className="p-6">
            <Bed className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">Rooms</h3>
            <p className="text-sm text-muted-foreground">Manage rooms & inventory</p>
          </CardContent></Card>
        </Link>
        <Link to="/manager/hotels/$hotelId/bookings" params={{ hotelId }}>
          <Card className="hover:shadow-md transition-shadow"><CardContent className="p-6">
            <BookOpen className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">Bookings</h3>
            <p className="text-sm text-muted-foreground">View reservations</p>
          </CardContent></Card>
        </Link>
        <Link to="/manager/hotels/$hotelId/reports" params={{ hotelId }}>
          <Card className="hover:shadow-md transition-shadow"><CardContent className="p-6">
            <BarChart3 className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">Reports</h3>
            <p className="text-sm text-muted-foreground">Revenue & analytics</p>
          </CardContent></Card>
        </Link>
      </div>

      <Card><CardContent className="p-6 space-y-2 text-sm">
        <h3 className="font-semibold mb-2">Contact</h3>
        {h.contactInfo?.address && <p><span className="text-muted-foreground">Address:</span> {h.contactInfo.address}</p>}
        {h.contactInfo?.phoneNumber && <p><span className="text-muted-foreground">Phone:</span> {h.contactInfo.phoneNumber}</p>}
        {h.contactInfo?.email && <p><span className="text-muted-foreground">Email:</span> {h.contactInfo.email}</p>}
        {h.amenities?.length ? <p><span className="text-muted-foreground">Amenities:</span> {h.amenities.join(", ")}</p> : null}
      </CardContent></Card>
    </div>
  );
}
