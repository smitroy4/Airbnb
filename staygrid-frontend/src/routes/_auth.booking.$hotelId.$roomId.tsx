import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";

const searchSchema = z.object({
  startDate: z.string().catch(""),
  endDate: z.string().catch(""),
  roomsCount: z.coerce.number().catch(1),
});

export const Route = createFileRoute("/_auth/booking/$hotelId/$roomId")({
  validateSearch: searchSchema,
  component: BookingFlowPage,
});

type Step = 1 | 2 | 3;

function BookingFlowPage() {
  const { hotelId, roomId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const guestsQ = useQuery({ queryKey: ["guests"], queryFn: endpoints.listGuests });

  const initMut = useMutation({
    mutationFn: () => endpoints.initBooking({
      hotelId: Number(hotelId), roomId: Number(roomId),
      checkInDate: search.startDate, checkOutDate: search.endDate, roomsCount: search.roomsCount,
    }),
    onSuccess: (b) => {
      const id = (b.id ?? b.bookingId) as number;
      setBookingId(id);
      setStep(2);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const addGuestsMut = useMutation({
    mutationFn: () => endpoints.addGuestsToBooking(bookingId!, selected),
    onSuccess: () => setStep(3),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const payMut = useMutation({
    mutationFn: () => endpoints.startPayment(bookingId!),
    onSuccess: (res) => {
      if (res.sessionUrl) window.location.href = res.sessionUrl;
      else toast.error("Payment session unavailable");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Complete your booking</h1>

        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              {step >= n ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
              <span className={step === n ? "font-medium" : "text-muted-foreground text-sm"}>
                {n === 1 ? "Reserve" : n === 2 ? "Add guests" : "Payment"}
              </span>
              {n < 3 && <div className="w-8 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="font-semibold">Reservation summary</h2>
                <p className="text-sm text-muted-foreground">Hotel #{hotelId} · Room #{roomId}</p>
                <p className="text-sm mt-2">Check-in: {search.startDate} · Check-out: {search.endDate} · Rooms: {search.roomsCount}</p>
              </div>
              <Button onClick={() => initMut.mutate()} disabled={initMut.isPending} className="w-full">
                {initMut.isPending ? "Reserving..." : "Reserve room"}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Select guests for this booking</h2>
              {guestsQ.isLoading ? <LoadingState /> :
               guestsQ.isError ? <ErrorState message={getApiErrorMessage(guestsQ.error)} /> :
               !guestsQ.data?.length ? (
                <EmptyState title="No guests" message="Add guests from your account first." action={<Button variant="outline" onClick={() => navigate({ to: "/account/guests" })}>Manage guests</Button>} />
               ) : (
                <div className="space-y-2">
                  {guestsQ.data.map((g) => (
                    <label key={g.id} className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                      <Checkbox
                        checked={selected.includes(g.id)}
                        onCheckedChange={(c) => setSelected((prev) => c ? [...prev, g.id] : prev.filter((x) => x !== g.id))}
                      />
                      <div>
                        <p className="font-medium">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.gender} · Age {g.age}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <Button
                onClick={() => addGuestsMut.mutate()}
                disabled={addGuestsMut.isPending || selected.length === 0}
                className="w-full"
              >
                {addGuestsMut.isPending ? "Adding..." : `Continue with ${selected.length} guest${selected.length === 1 ? "" : "s"}`}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Proceed to payment</h2>
              <p className="text-sm text-muted-foreground">You'll be redirected to Stripe Checkout to complete your payment securely.</p>
              <Button onClick={() => payMut.mutate()} disabled={payMut.isPending} className="w-full">
                {payMut.isPending ? "Preparing payment..." : "Pay now"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
