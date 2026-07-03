import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HotelForm, type HotelFormValues } from "./_mgr.manager.hotels.$hotelId.edit";
import { toast } from "sonner";

export const Route = createFileRoute("/_mgr/manager/hotels/new")({
  component: NewHotelPage,
});

function NewHotelPage() {
  const navigate = useNavigate();
  const mut = useMutation({
    mutationFn: (v: HotelFormValues) => endpoints.adminCreateHotel({
      name: v.name,
      city: v.city,
      photos: v.photos.split(/\n+/).map((s) => s.trim()).filter(Boolean),
      amenities: v.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      contactInfo: { address: v.address, phoneNumber: v.phoneNumber, email: v.email, location: v.location },
    }),
    onSuccess: (h) => {
      toast.success("Hotel created");
      navigate({ to: "/manager/hotels/$hotelId", params: { hotelId: String(h.id) } });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Create hotel</h1>
      <Card><CardContent className="p-6">
        <HotelForm onSubmit={(v) => mut.mutate(v)} submitting={mut.isPending} />
      </CardContent></Card>
    </div>
  );
}
