import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getMyBookings,
} from "../api/bookingApi";

function MyBookingsPage() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings =
    async () => {
      try {
        const response =
          await getMyBookings();

        setBookings(
          response || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const getStatusColor =
    (status) => {
      switch (
        status
      ) {
        case "CONFIRMED":
          return "bg-green-100 text-green-700";

        case "PAYMENT_PENDING":
          return "bg-yellow-100 text-yellow-700";

        case "RESERVED":
          return "bg-blue-100 text-blue-700";

        case "GUESTS_ADDED":
          return "bg-indigo-100 text-indigo-700";

        case "CANCELLED":
          return "bg-red-100 text-red-700";

        case "EXPIRED":
          return "bg-gray-100 text-gray-700";

        default:
          return "bg-gray-100 text-gray-700";
      }
    };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8">
        <h1 className="mb-8 text-3xl font-bold">
          My Bookings
        </h1>

        {loading && (
          <p>
            Loading bookings...
          </p>
        )}

        {!loading &&
          bookings.length ===
            0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-500">
                No bookings
                found.
              </p>
            </div>
          )}

        <div className="space-y-5">
          {bookings.map(
            (booking) => (
              <div
                key={
                  booking.id
                }
                className="rounded-xl border border-gray-200 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Booking #
                      {
                        booking.id
                      }
                    </h3>

                    <p className="mt-2 text-gray-500">
                      Check In:
                      {" "}
                      {
                        booking.checkInDate
                      }
                    </p>

                    <p className="text-gray-500">
                      Check Out:
                      {" "}
                      {
                        booking.checkOutDate
                      }
                    </p>

                    <p className="text-gray-500">
                      Rooms:
                      {" "}
                      {
                        booking.roomsCount
                      }
                    </p>

                    <p className="mt-2 font-semibold">
                      ₹
                      {
                        booking.amount
                      }
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                        booking.bookingStatus
                      )}`}
                    >
                      {
                        booking.bookingStatus
                      }
                    </span>

                    <Link
                      to={`/payments/${booking.id}/status`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                      View Status
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyBookingsPage;