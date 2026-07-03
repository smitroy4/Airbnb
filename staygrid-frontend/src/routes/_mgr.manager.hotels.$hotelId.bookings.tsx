import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Booking } from "@/lib/types";

export const Route = createFileRoute("/_mgr/manager/hotels/$hotelId/bookings")({
  component: HotelBookingsPage,
});

function HotelBookingsPage() {
  const { hotelId } = Route.useParams();
  const q = useQuery({ queryKey: ["admin-bookings", hotelId], queryFn: () => endpoints.adminHotelBookings(hotelId) });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} />;
  if (!q.data?.length) return (<><h1 className="text-3xl font-bold mb-4">Bookings</h1><EmptyState title="No bookings yet" /></>);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Bookings</h1>
      <DataTable<Booking>
        rows={q.data}
        getRowId={(r) => (r.id ?? r.bookingId) as number}
        columns={[
          { key: "id", header: "ID", render: (r) => `#${r.id ?? r.bookingId}` },
          { key: "checkInDate", header: "Check-in" },
          { key: "checkOutDate", header: "Check-out" },
          { key: "roomsCount", header: "Rooms" },
          { key: "amount", header: "Amount", render: (r) => r.amount != null ? `₹${Number(r.amount).toLocaleString()}` : "—" },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.bookingStatus ?? r.status} /> },
          { key: "createdAt", header: "Created", render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—" },
          { key: "guests", header: "Guests", render: (r) => r.guests?.length ?? 0 },
        ]}
      />
    </div>
  );
}
