import { Link } from "react-router-dom";

function HotelCard({ hotel }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      <img
        src={
          hotel.photos?.[0] ||
          "https://placehold.co/600x400"
        }
        alt={hotel.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold">
          {hotel.name}
        </h3>

        <p className="mt-2 text-gray-500">
          {hotel.city}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-blue-600">
              ₹{hotel.price}
            </p>

            <p className="text-xs text-gray-500">
              per night
            </p>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;