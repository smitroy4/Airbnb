import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { BookOpen, DollarSign, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";

const schema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export const Route = createFileRoute("/_mgr/manager/hotels/$hotelId/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { hotelId } = Route.useParams();
  const [range, setRange] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: range,
  });

  const q = useQuery({
    queryKey: ["report", hotelId, range],
    queryFn: () => endpoints.adminHotelReport(hotelId, range.startDate, range.endDate),
    enabled: !!range.startDate && !!range.endDate,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      <Card><CardContent className="p-6">
        <form onSubmit={handleSubmit((v) => setRange(v))} className="grid gap-3 md:grid-cols-3 items-end">
          <div><Label>From</Label><Input type="date" {...register("startDate")} /></div>
          <div><Label>To</Label><Input type="date" {...register("endDate")} /></div>
          <Button type="submit">Apply</Button>
        </form>
      </CardContent></Card>

      {q.isLoading ? <LoadingState /> :
       q.isError ? <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} /> :
       q.data && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total bookings" value={q.data.totalBookings ?? 0} icon={BookOpen} />
          <StatCard label="Total revenue" value={`₹${Number(q.data.totalRevenueOfConfirmedBookings ?? 0).toLocaleString()}`} icon={DollarSign} />
          <StatCard label="Avg revenue" value={`₹${Number(q.data.avgRevenue ?? 0).toLocaleString()}`} icon={TrendingUp} />
        </div>
       )}
    </div>
  );
}
