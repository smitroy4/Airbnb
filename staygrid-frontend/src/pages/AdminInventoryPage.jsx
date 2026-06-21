import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getRoomInventory,
} from "../api/adminInventoryApi";

function AdminInventoryPage() {
  const { roomId } =
    useParams();

  const [
    inventory,
    setInventory,
  ] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory =
    async () => {
      try {
        const data =
          await getRoomInventory(
            roomId
          );

        setInventory(data);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8">
        <h1 className="mb-8 text-3xl font-bold">
          Inventory
        </h1>

        <div className="space-y-3">
          {inventory.map(
            (item) => (
              <div
                key={item.id}
                className="rounded-lg border p-4"
              >
                <p>
                  {
                    item.date
                  }
                </p>

                <p>
                  Available:
                  {" "}
                  {
                    item.totalCount -
                    item.bookedCount
                  }
                </p>

                <p>
                  Price:
                  ₹
                  {
                    item.price
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

export default AdminInventoryPage;