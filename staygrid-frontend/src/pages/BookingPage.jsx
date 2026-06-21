import {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  initialiseBooking,
} from "../api/bookingApi";

import DashboardLayout from "../layouts/DashboardLayout";

function BookingPage() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    hotel,
    room,
  } = location.state;

  const [loading, setLoading] =
    useState(false);

  const createBooking =
    async () => {
      try {
        setLoading(true);

        const booking =
          await initialiseBooking(
            {
              hotelId:
                hotel.id,
              roomId:
                room.id,
              checkInDate:
                "2026-07-01",
              checkOutDate:
                "2026-07-05",
              roomsCount: 1,
            }
          );

        navigate(
          `/booking/${booking.id}`
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-6">
        <h1 className="text-3xl font-bold">
          Booking Summary
        </h1>

        <div className="mt-6">
          <p>
            Hotel:
            {hotel.name}
          </p>

          <p>
            Room:
            {room.type}
          </p>

          <p>
            Price:
            ₹{room.price}
          </p>
        </div>

        <button
          onClick={
            createBooking
          }
          disabled={loading}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          {loading
            ? "Creating..."
            : "Confirm Booking"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default BookingPage;