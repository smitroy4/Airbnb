import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Users } from "lucide-react";
import { hotelGallery, roomImage } from "@/lib/images";

const searchSchema = z.object({
  startDate: z.string().catch(""),
  endDate: z.string().catch(""),
  roomsCount: z.coerce.number().catch(1),
});

export const Route = createFileRoute("/hotels/$hotelId")({
  ssr: false,
  validateSearch: searchSchema,
  component: HotelDetailsPage,
});

function HotelDetailsPage() {
  const { hotelId } = Route.useParams();
  const search = Route.useSearch();

  const q = useQuery({
    queryKey: ["hotel", hotelId, search],
    queryFn: () => endpoints.hotelInfo(hotelId, { startDate: search.startDate, endDate: search.endDate, roomsCount: search.roomsCount }),
    enabled: !!search.startDate && !!search.endDate,
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {q.isLoading ? <LoadingState /> : q.isError ? <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} /> : q.data && (
          <>
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                {q.data.hotel.name}
              </h1>
              <p className="mt-2 text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" />{q.data.hotel.city}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3 mb-8">
              {(q.data.hotel.photos?.length ? q.data.hotel.photos : hotelGallery(q.data.hotel.id ?? q.data.hotel.name, 3)).slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-cover bg-center rounded-2xl overflow-hidden hover-scale animate-fade-in-up shadow-md"
                  style={{ backgroundImage: `url(${p})`, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                {q.data.hotel.amenities?.length ? (
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {q.data.hotel.amenities.map((a) => (
                          <span key={a} className="text-xs rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 px-3 py-1">{a}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                <div>
                  <h2 className="text-xl font-semibold mb-4">Available rooms</h2>
                  <div className="space-y-4">
                    {q.data.rooms?.length ? q.data.rooms.map((room, i) => (
                      <Card
                        key={room.id}
                        className="overflow-hidden hover-lift animate-fade-in-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="grid md:grid-cols-[200px_1fr_180px]">
                          <div
                            className="h-40 md:h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${room.photos?.[0] || roomImage(room.id ?? room.type, 400, 300)})` }}
                          />
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{room.type}</h3>
                            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Sleeps {room.capacity}</p>
                            {room.amenities?.length ? (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {room.amenities.slice(0, 4).map((a) => (
                                  <span key={a} className="text-xs rounded-full bg-muted px-2 py-0.5">{a}</span>
                                ))}
                              </div>
                            ) : null}
                          </CardContent>
                          <div className="p-4 border-t md:border-t-0 md:border-l flex flex-col items-end justify-between gap-3">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">per night from</p>
                              <p className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                                ₹{Number(room.price ?? room.basePrice).toLocaleString()}
                              </p>
                            </div>
                            <Button asChild size="sm" className="w-full gradient-tropical text-white border-0">
                              <Link
                                to="/booking/$hotelId/$roomId"
                                params={{ hotelId: String(q.data!.hotel.id), roomId: String(room.id) }}
                                search={search}
                              >
                                Reserve
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )) : <p className="text-muted-foreground text-sm">No rooms available for the selected dates.</p>}
                  </div>
                </div>
              </div>

              <Card className="h-fit">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold">Contact</h3>
                  {q.data.hotel.contactInfo?.address && <p className="text-sm flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{q.data.hotel.contactInfo.address}</p>}
                  {q.data.hotel.contactInfo?.phoneNumber && <p className="text-sm flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" />{q.data.hotel.contactInfo.phoneNumber}</p>}
                  {q.data.hotel.contactInfo?.email && <p className="text-sm flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" />{q.data.hotel.contactInfo.email}</p>}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}