import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import type { Room } from "@/lib/types";

export const Route = createFileRoute("/_mgr/manager/hotels/$hotelId/rooms")({
  component: RoomsPage,
});

const schema = z.object({
  type: z.string().min(1),
  basePrice: z.coerce.number().min(0),
  photos: z.string(),
  amenities: z.string(),
  totalCount: z.coerce.number().int().min(1),
  capacity: z.coerce.number().int().min(1),
});
type FormValues = z.infer<typeof schema>;

function RoomsPage() {
  const { hotelId } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-rooms", hotelId], queryFn: () => endpoints.adminListRooms(hotelId) });
  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; room?: Room } | null>(null);
  const [toDelete, setToDelete] = useState<Room | null>(null);

  const del = useMutation({
    mutationFn: (id: number) => endpoints.adminDeleteRoom(hotelId, id),
    onSuccess: () => { toast.success("Room deleted"); qc.invalidateQueries({ queryKey: ["admin-rooms", hotelId] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Button onClick={() => setDialog({ mode: "create" })}><Plus className="h-4 w-4 mr-1" />Add room</Button>
      </div>

      {!q.data?.length ? (
        <EmptyState title="No rooms yet" message="Add rooms to make this hotel bookable." action={<Button onClick={() => setDialog({ mode: "create" })}>Add first room</Button>} />
      ) : (
        <DataTable<Room>
          rows={q.data}
          getRowId={(r) => r.id}
          columns={[
            { key: "type", header: "Type" },
            { key: "capacity", header: "Capacity" },
            { key: "totalCount", header: "Total" },
            { key: "basePrice", header: "Price", render: (r) => `₹${Number(r.basePrice).toLocaleString()}` },
            {
              key: "actions", header: "", className: "text-right",
              render: (r) => (
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" asChild title="Inventory">
                    <Link to="/manager/hotels/$hotelId/rooms/$roomId/inventory" params={{ hotelId, roomId: String(r.id) }}><Calendar className="h-4 w-4" /></Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDialog({ mode: "edit", room: r })}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setToDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}

      {dialog && (
        <RoomDialog
          hotelId={hotelId}
          mode={dialog.mode}
          room={dialog.room}
          onClose={() => setDialog(null)}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Delete room?" destructive confirmLabel="Delete"
        onConfirm={() => { if (toDelete) del.mutate(toDelete.id); setToDelete(null); }}
      />
    </div>
  );
}

function RoomDialog({ hotelId, mode, room, onClose }: { hotelId: string; mode: "create" | "edit"; room?: Room; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: room ? {
      type: room.type, basePrice: room.basePrice,
      photos: (room.photos ?? []).join("\n"),
      amenities: (room.amenities ?? []).join(", "),
      totalCount: room.totalCount, capacity: room.capacity,
    } : { type: "", basePrice: 0, photos: "", amenities: "", totalCount: 1, capacity: 2 },
  });

  const mut = useMutation({
    mutationFn: (v: FormValues) => {
      const body = {
        type: v.type, basePrice: v.basePrice,
        photos: v.photos.split(/\n+/).map((s) => s.trim()).filter(Boolean),
        amenities: v.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        totalCount: v.totalCount, capacity: v.capacity,
      };
      return mode === "create" ? endpoints.adminCreateRoom(hotelId, body) : endpoints.adminUpdateRoom(hotelId, room!.id, body);
    },
    onSuccess: () => { toast.success(mode === "create" ? "Room added" : "Room updated"); qc.invalidateQueries({ queryKey: ["admin-rooms", hotelId] }); onClose(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{mode === "create" ? "Add room" : "Edit room"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit((v) => mut.mutate(v))} className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2"><Label>Type</Label><Input {...register("type")} />{formState.errors.type && <p className="text-xs text-destructive">{formState.errors.type.message}</p>}</div>
          <div><Label>Base price</Label><Input type="number" {...register("basePrice")} /></div>
          <div><Label>Capacity</Label><Input type="number" {...register("capacity")} /></div>
          <div><Label>Total count</Label><Input type="number" {...register("totalCount")} /></div>
          <div className="md:col-span-2"><Label>Amenities (comma separated)</Label><Input {...register("amenities")} /></div>
          <div className="md:col-span-2"><Label>Photos (one URL per line)</Label><Textarea rows={3} {...register("photos")} /></div>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
