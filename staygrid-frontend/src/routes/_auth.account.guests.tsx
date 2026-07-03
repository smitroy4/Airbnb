import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Guest } from "@/lib/types";

export const Route = createFileRoute("/_auth/account/guests")({
  component: GuestsPage,
});

const schema = z.object({
  name: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
  age: z.coerce.number().int().min(0).max(150),
  dateOfBirth: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function GuestsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["guests"], queryFn: endpoints.listGuests });
  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; guest?: Guest } | null>(null);
  const [toDelete, setToDelete] = useState<Guest | null>(null);

  const del = useMutation({
    mutationFn: (id: number) => endpoints.deleteGuest(id),
    onSuccess: () => { toast.success("Guest removed"); qc.invalidateQueries({ queryKey: ["guests"] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialog({ mode: "create" })}><Plus className="h-4 w-4 mr-1" />Add guest</Button>
      </div>
      {q.data && q.data.length === 0 ? (
        <EmptyState title="No guests yet" message="Add guests to use during bookings." action={<Button onClick={() => setDialog({ mode: "create" })}>Add first guest</Button>} />
      ) : (
        <DataTable<Guest>
          rows={q.data ?? []}
          getRowId={(r) => r.id}
          columns={[
            { key: "name", header: "Name" },
            { key: "gender", header: "Gender" },
            { key: "age", header: "Age" },
            { key: "dateOfBirth", header: "DOB", render: (r) => r.dateOfBirth ?? "—" },
            {
              key: "actions", header: "", className: "text-right",
              render: (r) => (
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setDialog({ mode: "edit", guest: r })}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setToDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ),
            },
          ]}
        />
      )}

      {dialog && <GuestDialog mode={dialog.mode} guest={dialog.guest} onClose={() => setDialog(null)} />}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Delete guest?"
        description={toDelete ? `Remove ${toDelete.name} from your guest list?` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (toDelete) del.mutate(toDelete.id); setToDelete(null); }}
      />
    </div>
  );
}

function GuestDialog({ mode, guest, onClose }: { mode: "create" | "edit"; guest?: Guest; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: guest ? { name: guest.name, gender: guest.gender, age: guest.age, dateOfBirth: guest.dateOfBirth ?? "" } : { name: "", gender: "MALE", age: 18, dateOfBirth: "" },
  });

  const mut = useMutation({
    mutationFn: (v: FormValues) => mode === "create" ? endpoints.createGuest(v) : endpoints.updateGuest(guest!.id, v),
    onSuccess: () => {
      toast.success(mode === "create" ? "Guest added" : "Guest updated");
      qc.invalidateQueries({ queryKey: ["guests"] });
      onClose();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{mode === "create" ? "Add guest" : "Edit guest"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit((v) => mut.mutate(v))} className="space-y-4">
          <div><Label>Name</Label><Input {...register("name")} />{formState.errors.name && <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>}</div>
          <div>
            <Label>Gender</Label>
            <Controller control={control} name="gender" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHERS">Others</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          <div><Label>Age</Label><Input type="number" {...register("age")} /></div>
          <div><Label>Date of birth</Label><Input type="date" {...register("dateOfBirth")} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
