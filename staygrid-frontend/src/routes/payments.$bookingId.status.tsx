import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payments/$bookingId/status")({
  ssr: false,
  component: PaymentStatusPage,
});

function PaymentStatusPage() {
  const { bookingId } = Route.useParams();
  const q = useQuery({
    queryKey: ["booking-status", bookingId],
    queryFn: () => endpoints.bookingStatus(bookingId),
    refetchInterval: (query) => {
      const data: any = query.state.data;
      const status = data?.bookingStatus ?? data?.status;
      return status === "CONFIRMED" || status === "CANCELLED" || status === "EXPIRED" ? false : 5173;
    },
  });

  const status = (q.data as any)?.bookingStatus ?? (q.data as any)?.status;

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold">Booking #{bookingId}</h1>
            {q.isLoading ? <LoadingState label="Checking status..." /> :
              q.isError ? <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} /> :
              (
                <>
                  <div><StatusBadge status={status} /></div>
                  <p className="text-sm text-muted-foreground">
                    {status === "CONFIRMED" && "Your booking is confirmed. Have a great stay!"}
                    {status === "PAYMENT_PENDING" && "Waiting for payment confirmation..."}
                    {status === "CANCELLED" && "This booking was cancelled."}
                    {status === "EXPIRED" && "This booking has expired."}
                    {(status === "RESERVED" || status === "GUESTS_ADDED") && "Complete the payment to confirm your booking."}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild variant="outline"><Link to="/account/bookings">My bookings</Link></Button>
                    <Button asChild><Link to="/">Home</Link></Button>
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
