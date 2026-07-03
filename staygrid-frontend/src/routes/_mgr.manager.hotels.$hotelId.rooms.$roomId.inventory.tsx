import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import type { Inventory } from "@/lib/types";

export const Route = createFileRoute("/_mgr/manager/hotels/$hotelId/rooms/$roomId/inventory")({
  component: InventoryPage,
});

const schema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  surgeFactor: z.coerce.number().min(0),
  closed: z.boolean(),
});

function InventoryPage() {
  const { hotelId, roomId } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["inventory", roomId], queryFn: () => endpoints.adminGetInventory(roomId) });

  const { register, control, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: "", endDate: "", surgeFactor: 1, closed: false },
  });

  const mut = useMutation({
    mutationFn: (v: z.infer<typeof schema>) => endpoints.adminUpdateInventory(roomId, v),
    onSuccess: () => { toast.success("Inventory updated"); qc.invalidateQueries({ queryKey: ["inventory", roomId] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory — Room #{roomId}</h1>

      <Card><CardContent className="p-6">
        <h2 className="font-semibold mb-4">Update inventory</h2>
        <form onSubmit={handleSubmit((v) => mut.mutate(v))} className="grid gap-3 md:grid-cols-5 items-end">
          <div><Label>Start date</Label><Input type="date" {...register("startDate")} /></div>
          <div><Label>End date</Label><Input type="date" {...register("endDate")} /></div>
          <div><Label>Surge factor</Label><Input type="number" step="0.1" {...register("surgeFactor")} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Controller control={control} name="closed" render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )} />
            <Label>Closed</Label>
          </div>
          <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Updating..." : "Apply"}</Button>
        </form>
        {formState.errors.startDate && <p className="text-xs text-destructive mt-2">{formState.errors.startDate.message}</p>}
      </CardContent></Card>

      {q.isLoading ? <LoadingState /> :
       q.isError ? <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} /> :
       (
        <DataTable<Inventory>
          rows={q.data ?? []}
          getRowId={(r) => r.id}
          columns={[
            { key: "date", header: "Date" },
            { key: "bookedCount", header: "Booked" },
            { key: "reservedCount", header: "Reserved" },
            { key: "totalCount", header: "Total" },
            { key: "surgeFactor", header: "Surge" },
            { key: "price", header: "Price", render: (r) => `₹${Number(r.price).toLocaleString()}` },
            { key: "closed", header: "Status", render: (r) => <StatusBadge status={r.closed ? "INACTIVE" : "ACTIVE"} /> },
          ]}
        />
       )}
    </div>
  );
}
