import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getRooms,
} from "../api/adminRoomApi";

function AdminRoomsPage() {
  const { hotelId } =
    useParams();

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms =
    async () => {
      try {
        const data =
          await getRooms(
            hotelId
          );

        setRooms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8">
        <h1 className="mb-8 text-3xl font-bold">
          Rooms
        </h1>

        {loading && (
          <p>
            Loading rooms...
          </p>
        )}

        <div className="space-y-4">
          {rooms.map(
            (room) => (
              <div
                key={room.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <h3 className="font-semibold">
                  {
                    room.type
                  }
                </h3>

                <p>
                  Capacity:
                  {" "}
                  {
                    room.capacity
                  }
                </p>

                <p>
                  Total:
                  {" "}
                  {
                    room.totalCount
                  }
                </p>

                <p>
                  ₹
                  {
                    room.basePrice
                  }
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminRoomsPage;