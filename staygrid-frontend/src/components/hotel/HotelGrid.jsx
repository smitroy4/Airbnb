import HotelCard from "./HotelCard";

function HotelGrid({ hotels }) {
  if (!hotels.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">
          No hotels found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
        />
      ))}
    </div>
  );
}

export default HotelGrid;