import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";
import type { Booking } from "@/lib/types";

export const Route = createFileRoute("/_auth/account/bookings")({
  component: MyBookingsPage,
});

function MyBookingsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["my-bookings"], queryFn: endpoints.myBookings });
  const [toCancel, setToCancel] = useState<Booking | null>(null);

  const cancel = useMutation({
    mutationFn: (id: number) => endpoints.cancelBooking(id),
    onSuccess: () => { toast.success("Booking cancelled"); qc.invalidateQueries({ queryKey: ["my-bookings"] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} />;
  if (!q.data?.length) return <EmptyState title="No bookings yet" message="Your future stays will show up here." />;

  const cancellable = (s?: string) => s === "RESERVED" || s === "GUESTS_ADDED" || s === "PAYMENT_PENDING" || s === "CONFIRMED";

  return (
    <>
      <DataTable<Booking>
        rows={q.data}
        getRowId={(r) => (r.id ?? r.bookingId) as number}
        columns={[
          { key: "id", header: "Booking", render: (r) => `#${r.id ?? r.bookingId}` },
          { key: "checkInDate", header: "Check-in" },
          { key: "checkOutDate", header: "Check-out" },
          { key: "roomsCount", header: "Rooms" },
          { key: "amount", header: "Amount", render: (r) => r.amount != null ? `₹${Number(r.amount).toLocaleString()}` : "—" },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.bookingStatus ?? r.status} /> },
          {
            key: "actions", header: "", className: "text-right",
            render: (r) => cancellable(r.bookingStatus ?? r.status) ? (
              <Button size="sm" variant="outline" onClick={() => setToCancel(r)}>Cancel</Button>
            ) : null,
          },
        ]}
      />
      <ConfirmDialog
        open={!!toCancel}
        onOpenChange={(v) => !v && setToCancel(null)}
        title="Cancel this booking?"
        description="This action cannot be undone."
        confirmLabel="Yes, cancel"
        destructive
        onConfirm={() => {
          const id = (toCancel?.id ?? toCancel?.bookingId) as number;
          if (id) cancel.mutate(id);
          setToCancel(null);
        }}
      />
    </>
  );
}
