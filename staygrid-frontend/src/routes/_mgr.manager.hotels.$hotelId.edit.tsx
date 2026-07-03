import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  photos: z.string(),
  amenities: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  location: z.string(),
});
export type HotelFormValues = z.infer<typeof schema>;

export function HotelForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues?: Partial<HotelFormValues>;
  onSubmit: (v: HotelFormValues) => void;
  submitting?: boolean;
}) {
  const { register, handleSubmit, reset, formState } = useForm<HotelFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", city: "", photos: "", amenities: "", address: "", phoneNumber: "", email: "", location: "",
      ...defaultValues,
    },
  });
  useEffect(() => { if (defaultValues) reset({ name: "", city: "", photos: "", amenities: "", address: "", phoneNumber: "", email: "", location: "", ...defaultValues }); }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div><Label>Name</Label><Input {...register("name")} />{formState.errors.name && <p className="text-xs text-destructive">{formState.errors.name.message}</p>}</div>
      <div><Label>City</Label><Input {...register("city")} /></div>
      <div className="md:col-span-2"><Label>Photos (one URL per line)</Label><Textarea rows={3} {...register("photos")} /></div>
      <div className="md:col-span-2"><Label>Amenities (comma separated)</Label><Input {...register("amenities")} /></div>
      <div className="md:col-span-2"><Label>Address</Label><Input {...register("address")} /></div>
      <div><Label>Phone</Label><Input {...register("phoneNumber")} /></div>
      <div><Label>Email</Label><Input type="email" {...register("email")} /></div>
      <div className="md:col-span-2"><Label>Location (lat,lng or map link)</Label><Input {...register("location")} /></div>
      <div className="md:col-span-2"><Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save hotel"}</Button></div>
    </form>
  );
}

export const Route = createFileRoute("/_mgr/manager/hotels/$hotelId/edit")({
  component: EditHotelPage,
});

function EditHotelPage() {
  const { hotelId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirmDel, setConfirmDel] = useState(false);

  const q = useQuery({ queryKey: ["admin-hotel", hotelId], queryFn: () => endpoints.adminGetHotel(hotelId) });

  const mut = useMutation({
    mutationFn: (v: HotelFormValues) => endpoints.adminUpdateHotel(hotelId, {
      name: v.name, city: v.city,
      photos: v.photos.split(/\n+/).map((s) => s.trim()).filter(Boolean),
      amenities: v.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      contactInfo: { address: v.address, phoneNumber: v.phoneNumber, email: v.email, location: v.location },
    }),
    onSuccess: () => { toast.success("Hotel updated"); qc.invalidateQueries({ queryKey: ["admin-hotel", hotelId] }); qc.invalidateQueries({ queryKey: ["admin-hotels"] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const del = useMutation({
    mutationFn: () => endpoints.adminDeleteHotel(hotelId),
    onSuccess: () => { toast.success("Hotel deleted"); navigate({ to: "/manager/hotels" }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} />;
  const h = q.data!;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit hotel</h1>
        <Button variant="outline" onClick={() => setConfirmDel(true)}><Trash2 className="h-4 w-4 mr-1 text-destructive" />Delete</Button>
      </div>
      <Card><CardContent className="p-6">
        <HotelForm
          defaultValues={{
            name: h.name, city: h.city,
            photos: (h.photos ?? []).join("\n"),
            amenities: (h.amenities ?? []).join(", "),
            address: h.contactInfo?.address ?? "",
            phoneNumber: h.contactInfo?.phoneNumber ?? "",
            email: h.contactInfo?.email ?? "",
            location: h.contactInfo?.location ?? "",
          }}
          onSubmit={(v) => mut.mutate(v)}
          submitting={mut.isPending}
        />
      </CardContent></Card>
      <ConfirmDialog open={confirmDel} onOpenChange={setConfirmDel} title="Delete hotel?" destructive confirmLabel="Delete" onConfirm={() => del.mutate()} />
    </div>
  );
}
