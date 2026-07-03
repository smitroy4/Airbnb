import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { endpoints } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/lib/api";
import { MapPin, Phone, Mail, Wifi, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { hotelImage } from "@/lib/images";

const searchSchema = z.object({
  city: z.string().catch(""),
  startDate: z.string().catch(""),
  endDate: z.string().catch(""),
  roomsCount: z.coerce.number().catch(1),
  page: z.coerce.number().catch(0),
  size: z.coerce.number().catch(10),
});

export const Route = createFileRoute("/search")({
  ssr: false,
  validateSearch: searchSchema,
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: search,
  });

  const q = useQuery({
    queryKey: ["search", search],
    queryFn: () => endpoints.searchHotels(search as any),
    enabled: !!search.city && !!search.startDate && !!search.endDate,
  });

  return (
    <AppLayout>
      <div className="relative gradient-ocean text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-300 animate-float" /> Explore stays{search.city ? ` in ${search.city}` : ""}
          </h1>
          <Card className="mt-4 shadow-xl border-0">
            <CardContent className="p-4">
              <form
                onSubmit={handleSubmit((v) => navigate({ to: "/search", search: { ...v, page: 0 } }))}
                className="grid gap-3 md:grid-cols-5"
              >
                <div className="md:col-span-2">
                  <Label className="text-xs">City</Label>
                  <Input {...register("city")} placeholder="City" />
                </div>
                <div><Label className="text-xs">Check-in</Label><Input type="date" {...register("startDate")} /></div>
                <div><Label className="text-xs">Check-out</Label><Input type="date" {...register("endDate")} /></div>
                <div><Label className="text-xs">Rooms</Label><Input type="number" min={1} {...register("roomsCount")} /></div>
                <div className="md:col-span-5"><Button type="submit" className="gradient-sunset text-white border-0">Update search</Button></div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {!search.city ? (
          <EmptyState title="Start your search" message="Enter a destination to see available hotels." />
        ) : q.isLoading ? (
          <LoadingState label="Searching hotels..." />
        ) : q.isError ? (
          <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : !q.data || q.data.content.length === 0 ? (
          <EmptyState title="No hotels found" message="Try a different city or date." />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {q.data.totalElements} stays in {search.city}
            </p>
            <div className="space-y-4">
              {q.data.content.map((item: any, idx: number) => {
                const hotel = item.hotel ?? item;
                const price = item.price ?? hotel.price;
                const photo = hotel.photos?.[0] || hotelImage(hotel.id ?? hotel.name ?? idx, 800, 600);
                return (
                  <Card
                    key={hotel.id}
                    className="overflow-hidden hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="grid md:grid-cols-[280px_1fr_200px]">
                      <div className="relative h-52 md:h-full overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                          style={{ backgroundImage: `url(${photo})` }}
                        />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-xl font-semibold">{hotel.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {hotel.city}
                        </p>
                        {hotel.amenities?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {hotel.amenities.slice(0, 5).map((a: string) => (
                              <span key={a} className="text-xs rounded-full bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 px-2 py-1 flex items-center gap-1">
                                <Wifi className="h-3 w-3" /> {a}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        {hotel.contactInfo && (
                          <div className="mt-3 text-xs text-muted-foreground flex flex-wrap gap-4">
                            {hotel.contactInfo.phoneNumber && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{hotel.contactInfo.phoneNumber}</span>}
                            {hotel.contactInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{hotel.contactInfo.email}</span>}
                          </div>
                        )}
                      </CardContent>
                      <div className="p-5 border-t md:border-t-0 md:border-l flex flex-col items-end justify-between gap-3">
                        <div className="text-right">
                          {price != null && (
                            <>
                              <p className="text-xs text-muted-foreground">from</p>
                              <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                                ₹{Number(price).toLocaleString()}
                              </p>
                            </>
                          )}
                        </div>
                        <Button asChild className="w-full gradient-tropical text-white border-0">
                          <Link
                            to="/hotels/$hotelId"
                            params={{ hotelId: String(hotel.id) }}
                            search={{ startDate: search.startDate, endDate: search.endDate, roomsCount: search.roomsCount }}
                          >
                            View details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={search.page <= 0}
                onClick={() => navigate({ to: "/search", search: { ...search, page: Math.max(0, search.page - 1) } })}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {q.data.number + 1} of {q.data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={q.data.number + 1 >= q.data.totalPages}
                onClick={() => navigate({ to: "/search", search: { ...search, page: search.page + 1 } })}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}