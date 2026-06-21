function RoomCard({
  room,
  onSelect,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <img
        src={
          room.photos?.[0] ||
          "https://placehold.co/600x400"
        }
        alt={room.type}
        className="h-56 w-full rounded-xl object-cover"
      />

      <h3 className="mt-4 text-xl font-bold">
        {room.type}
      </h3>

      <p className="mt-2 text-gray-500">
        Capacity: {room.capacity || "N/A"}
      </p>

      <p className="mt-3 text-2xl font-bold text-blue-600">
        ₹{room.price}
      </p>

      <button
        onClick={() => onSelect(room)}
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
      >
        Select Room
      </button>
    </div>
  );
}

export default RoomCard;