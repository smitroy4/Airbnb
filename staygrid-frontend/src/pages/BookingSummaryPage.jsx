import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import { useBooking } from "../features/bookings/BookingContext";

import { initialiseBooking } from "../api/bookingApi";

function BookingSummaryPage() {
  const navigate =
    useNavigate();

  const {
    bookingData,
    setBookingData,
  } = useBooking();

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
                bookingData.hotel
                  .id,

              roomId:
                bookingData.room
                  .id,

              checkInDate:
                bookingData.checkInDate,

              checkOutDate:
                bookingData.checkOutDate,

              roomsCount:
                bookingData.roomsCount,
            }
          );

        setBookingData(
          (
            prev
          ) => ({
            ...prev,
            bookingId:
              booking.id,
          })
        );

        navigate(
          "/booking/guests"
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8">
        <h1 className="text-3xl font-bold">
          Booking Summary
        </h1>

        <div className="mt-8 space-y-4">
          <p>
            Hotel:
            {
              bookingData.hotel
                ?.name
            }
          </p>

          <p>
            Room:
            {
              bookingData.room
                ?.type
            }
          </p>

          <p>
            Check In:
            {
              bookingData.checkInDate
            }
          </p>

          <p>
            Check Out:
            {
              bookingData.checkOutDate
            }
          </p>

          <p>
            Rooms:
            {
              bookingData.roomsCount
            }
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
            ? "Creating Booking..."
            : "Continue"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default BookingSummaryPage;