import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Pencil, Trash2, Power, Bed, Calendar, BookOpen, BarChart3 } from "lucide-react";
import type { Hotel } from "@/lib/types";

export const Route = createFileRoute("/_mgr/manager/hotels")({
  component: MyHotelsPage,
});

function MyHotelsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-hotels"], queryFn: endpoints.adminListHotels });
  const [toDelete, setToDelete] = useState<Hotel | null>(null);

  const del = useMutation({
    mutationFn: (id: number) => endpoints.adminDeleteHotel(id),
    onSuccess: () => { toast.success("Hotel deleted"); qc.invalidateQueries({ queryKey: ["admin-hotels"] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const activate = useMutation({
    mutationFn: (id: number) => endpoints.adminActivateHotel(id),
    onSuccess: () => { toast.success("Hotel activated"); qc.invalidateQueries({ queryKey: ["admin-hotels"] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My hotels</h1>
        <Button asChild><Link to="/manager/hotels/new"><Plus className="h-4 w-4 mr-1" />New hotel</Link></Button>
      </div>

      {!q.data?.length ? (
        <EmptyState title="No hotels yet" message="Create your first hotel to get started." action={<Button asChild><Link to="/manager/hotels/new">Create hotel</Link></Button>} />
      ) : (
        <DataTable<Hotel>
          rows={q.data}
          getRowId={(r) => r.id}
          columns={[
            { key: "name", header: "Name" },
            { key: "city", header: "City" },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.active === false ? "INACTIVE" : "ACTIVE"} /> },
            {
              key: "actions", header: "", className: "text-right",
              render: (r) => (
                <div className="flex justify-end gap-1 flex-wrap">
                  <Button size="sm" variant="ghost" asChild title="Rooms"><Link to="/manager/hotels/$hotelId/rooms" params={{ hotelId: String(r.id) }}><Bed className="h-4 w-4" /></Link></Button>
                  <Button size="sm" variant="ghost" asChild title="Bookings"><Link to="/manager/hotels/$hotelId/bookings" params={{ hotelId: String(r.id) }}><BookOpen className="h-4 w-4" /></Link></Button>
                  <Button size="sm" variant="ghost" asChild title="Reports"><Link to="/manager/hotels/$hotelId/reports" params={{ hotelId: String(r.id) }}><BarChart3 className="h-4 w-4" /></Link></Button>
                  <Button size="sm" variant="ghost" asChild title="Edit"><Link to="/manager/hotels/$hotelId/edit" params={{ hotelId: String(r.id) }}><Pencil className="h-4 w-4" /></Link></Button>
                  {r.active === false && <Button size="sm" variant="ghost" onClick={() => activate.mutate(r.id)} title="Activate"><Power className="h-4 w-4 text-emerald-600" /></Button>}
                  <Button size="sm" variant="ghost" onClick={() => setToDelete(r)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Delete hotel?"
        description={toDelete ? `Delete ${toDelete.name}? This cannot be undone.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (toDelete) del.mutate(toDelete.id); setToDelete(null); }}
      />
    </div>
  );
}
