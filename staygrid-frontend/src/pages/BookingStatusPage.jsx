import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getBookingStatus,
} from "../api/bookingApi";

function BookingStatusPage() {
  const { bookingId } =
    useParams();

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const loadStatus =
    async () => {
      try {
        const response =
          await getBookingStatus(
            bookingId
          );

        setStatus(
          response.bookingStatus
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadStatus();

    const interval =
      setInterval(
        loadStatus,
        5000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [bookingId]);

  const getStatusColor =
    () => {
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

  const getMessage =
    () => {
      switch (
        status
      ) {
        case "CONFIRMED":
          return "Your booking has been confirmed successfully.";

        case "PAYMENT_PENDING":
          return "Waiting for payment confirmation.";

        case "RESERVED":
          return "Booking reserved successfully.";

        case "GUESTS_ADDED":
          return "Guests have been added successfully.";

        case "CANCELLED":
          return "This booking was cancelled.";

        case "EXPIRED":
          return "This booking has expired.";

        default:
          return "Checking booking status...";
      }
    };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold">
            Booking Status
          </h1>

          {loading ? (
            <p>
              Loading...
            </p>
          ) : (
            <>
              <div
                className={`inline-flex rounded-full px-4 py-2 font-semibold ${getStatusColor()}`}
              >
                {status}
              </div>

              <p className="mt-6 text-lg text-gray-600">
                {getMessage()}
              </p>

              <div className="mt-8 rounded-xl bg-gray-50 p-4">
                <p>
                  <strong>
                    Booking ID:
                  </strong>{" "}
                  {bookingId}
                </p>
              </div>

              {status ===
                "CONFIRMED" && (
                <div className="mt-8 rounded-xl bg-green-50 p-6">
                  <h2 className="text-xl font-semibold text-green-700">
                    🎉 Booking Confirmed
                  </h2>

                  <p className="mt-2 text-green-600">
                    Your hotel reservation is now confirmed.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BookingStatusPage;