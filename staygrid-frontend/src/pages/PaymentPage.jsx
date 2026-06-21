import {
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  initiatePayment,
} from "../api/bookingApi";

import {
  useBooking,
} from "../features/bookings/BookingContext";

function PaymentPage() {
  const {
    bookingData,
  } = useBooking();

  const [loading, setLoading] =
    useState(false);

  const handlePayment =
    async () => {
      try {
        setLoading(true);

        const response =
          await initiatePayment(
            bookingData.bookingId
          );

        window.location.href =
          response.sessionUrl;
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
          Payment
        </h1>

        <p className="mt-4 text-gray-500">
          Complete your
          booking using
          Stripe Checkout.
        </p>

        <button
          onClick={
            handlePayment
          }
          disabled={loading}
          className="mt-8 rounded-xl bg-green-600 px-6 py-3 text-white"
        >
          {loading
            ? "Redirecting..."
            : "Proceed To Payment"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default PaymentPage;