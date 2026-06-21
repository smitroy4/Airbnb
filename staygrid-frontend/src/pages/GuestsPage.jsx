import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getGuests,
} from "../api/guestApi";

function GuestsPage() {
  const [guests, setGuests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8">
        <h1 className="mb-6 text-3xl font-bold">
          My Guests
        </h1>

        {loading && (
          <p>Loading guests...</p>
        )}

        {!loading &&
          guests.length === 0 && (
            <p>
              No guests found.
            </p>
          )}

        <div className="space-y-4">
          {guests.map(
            (guest) => (
              <div
                key={guest.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <h3 className="font-semibold">
                  {guest.name}
                </h3>

                <p>
                  Gender:
                  {" "}
                  {guest.gender}
                </p>

                <p>
                  Age:
                  {" "}
                  {guest.age}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default GuestsPage;