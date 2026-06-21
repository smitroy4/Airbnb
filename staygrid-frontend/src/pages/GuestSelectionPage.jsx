import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getGuests,
} from "../api/guestApi";

import {
  addGuestsToBooking,
} from "../api/bookingApi";

import {
  useBooking,
} from "../features/bookings/BookingContext";

function GuestSelectionPage() {
  const navigate =
    useNavigate();

  const {
    bookingData,
  } = useBooking();

  const [guests, setGuests] =
    useState([]);

  const [
    selectedGuests,
    setSelectedGuests,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const data =
        await getGuests();

      setGuests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleGuest = (
    guestId
  ) => {
    setSelectedGuests(
      (prev) =>
        prev.includes(
          guestId
        )
          ? prev.filter(
              (id) =>
                id !==
                guestId
            )
          : [
              ...prev,
              guestId,
            ]
    );
  };

  const continueToPayment =
    async () => {
      try {
        setLoading(true);

        await addGuestsToBooking(
          bookingData.bookingId,
          selectedGuests
        );

        navigate(
          "/booking/payment"
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
        <h1 className="mb-6 text-3xl font-bold">
          Select Guests
        </h1>

        <div className="space-y-4">
          {guests.map(
            (guest) => (
              <label
                key={guest.id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-4"
              >
                <input
                  type="checkbox"
                  checked={selectedGuests.includes(
                    guest.id
                  )}
                  onChange={() =>
                    toggleGuest(
                      guest.id
                    )
                  }
                />

                <div>
                  <p className="font-medium">
                    {
                      guest.name
                    }
                  </p>

                  <p className="text-sm text-gray-500">
                    {
                      guest.gender
                    }
                  </p>
                </div>
              </label>
            )
          )}
        </div>

        <button
          onClick={
            continueToPayment
          }
          disabled={loading}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          {loading
            ? "Saving Guests..."
            : "Continue"}
        </button>
      </div>
    </DashboardLayout>
  );
}

export default GuestSelectionPage;