import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getHotels,
} from "../api/adminHotelApi";

function AdminHotelsPage() {
  const [hotels, setHotels] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels =
    async () => {
      try {
        const data =
          await getHotels();

        setHotels(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Hotels
          </h1>

          <Link
            to="/admin/hotels/new"
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            Add Hotel
          </Link>
        </div>

        {loading && (
          <p>
            Loading...
          </p>
        )}

        <div className="space-y-4">
          {hotels.map(
            (hotel) => (
              <div
                key={hotel.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <h3 className="font-semibold">
                  {hotel.name}
                </h3>

                <p className="text-gray-500">
                  {hotel.city}
                </p>

                <div className="mt-4">
                  <Link
                    to={`/admin/hotels/${hotel.id}`}
                    className="text-blue-600"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminHotelsPage;