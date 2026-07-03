import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, MapPin, Calendar, Users, Star, ShieldCheck, Sparkles, Plane } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api";
import { format, addDays } from "date-fns";
import { cityImage } from "@/lib/images";

export const Route = createFileRoute("/")({
  ssr: false,
  component: HomePage,
});

const schema = z.object({
  city: z.string().min(1, "City is required"),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  roomsCount: z.coerce.number().int().min(1).max(10),
});
type FormValues = z.infer<typeof schema>;

const FEATURED_CITIES = ["Mumbai", "Bengaluru", "Delhi", "Goa", "Jaipur", "Chennai", "Kolkata", "Hyderabad"];

function HomePage() {
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { city: "", startDate: today, endDate: tomorrow, roomsCount: 1 },
  });

  const onSubmit = (v: FormValues) => {
    navigate({ to: "/search", search: v });
  };

  return (
    <AppLayout>
      {/* HERO */}
      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/80 via-indigo-700/70 to-cyan-500/70" />
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-pink-400/40 blur-3xl animate-blob" />
        <div className="absolute top-32 -right-16 h-80 w-80 rounded-full bg-amber-300/40 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/40 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Discover extraordinary stays
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight drop-shadow">
              Find your{" "}
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-200 bg-clip-text text-transparent">
                perfect stay
              </span>
            </h1>
            <p className="mt-4 text-lg opacity-95">
              Search thousands of hotels, compare rooms, and book instantly with StayGrid.
            </p>
          </div>

          <Card className="mt-10 shadow-2xl border-0 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <Label className="flex items-center gap-1 text-xs mb-1"><MapPin className="h-3 w-3" />City</Label>
                  <Input placeholder="e.g. Mumbai" {...register("city")} />
                  {formState.errors.city && <p className="text-xs text-destructive mt-1">{formState.errors.city.message}</p>}
                </div>
                <div>
                  <Label className="flex items-center gap-1 text-xs mb-1"><Calendar className="h-3 w-3" />Check-in</Label>
                  <Input type="date" {...register("startDate")} />
                </div>
                <div>
                  <Label className="flex items-center gap-1 text-xs mb-1"><Calendar className="h-3 w-3" />Check-out</Label>
                  <Input type="date" {...register("endDate")} />
                </div>
                <div>
                  <Label className="flex items-center gap-1 text-xs mb-1"><Users className="h-3 w-3" />Rooms</Label>
                  <Input type="number" min={1} max={10} {...register("roomsCount")} />
                </div>
                <div className="md:col-span-5">
                  <Button type="submit" size="lg" className="w-full md:w-auto gap-2 gradient-sunset text-white border-0 hover:opacity-90">
                    <Search className="h-4 w-4" /> Search hotels
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-500">Trending</span>
            <h2 className="text-3xl font-bold mt-1">Popular destinations</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_CITIES.map((city, i) => (
            <div key={city} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <FeaturedCityCard city={city} startDate={today} endDate={tomorrow} />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 gradient-tropical opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Why StayGrid</span>
            <h2 className="text-3xl font-bold mt-1">Book with confidence</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "Handpicked hotels", desc: "Curated stays across popular destinations.", tint: "from-pink-500 to-rose-500" },
              { icon: ShieldCheck, title: "Secure payments", desc: "Pay safely via Stripe Checkout.", tint: "from-indigo-500 to-cyan-500" },
              { icon: Star, title: "Best price promise", desc: "Transparent pricing, no hidden fees.", tint: "from-amber-500 to-orange-500" },
            ].map(({ icon: Icon, title, desc, tint }, i) => (
              <div
                key={title}
                className="hover-lift rounded-2xl border bg-background p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`rounded-xl bg-gradient-to-br ${tint} text-white p-3 w-fit shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl gradient-ocean p-10 md:p-16 text-white">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-blob" />
          <Plane className="absolute right-10 top-10 h-16 w-16 opacity-30 animate-float" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold">Your next adventure starts here</h2>
            <p className="mt-3 opacity-90">Sign up for early deals, curated collections, and last-minute steals.</p>
            <Button asChild size="lg" className="mt-6 bg-white text-indigo-700 hover:bg-white/90">
              <a href="/signup">Create free account</a>
            </Button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function FeaturedCityCard({ city, startDate, endDate }: { city: string; startDate: string; endDate: string }) {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["featured", city],
    queryFn: () => endpoints.searchHotels({ city, startDate, endDate, roomsCount: 1, page: 0, size: 1 }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const count = data?.totalElements ?? 0;
  return (
    <button
      onClick={() => navigate({ to: "/search", search: { city, startDate, endDate, roomsCount: 1 } })}
      className="group relative w-full overflow-hidden rounded-2xl border bg-background text-left hover-lift"
    >
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${cityImage(city, 600, 400)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-lg drop-shadow">{city}</h3>
          <p className="text-xs opacity-90">{count ? `${count} stays available` : "Explore hotels"}</p>
        </div>
      </div>
    </button>
  );
}