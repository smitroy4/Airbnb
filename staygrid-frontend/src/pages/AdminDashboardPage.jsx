import DashboardLayout from "../layouts/DashboardLayout";

function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">
            Hotels
          </h3>

          <p className="mt-3 text-4xl font-bold">
            --
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">
            Rooms
          </h3>

          <p className="mt-3 text-4xl font-bold">
            --
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">
            Bookings
          </h3>

          <p className="mt-3 text-4xl font-bold">
            --
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-gray-500">
            Revenue
          </h3>

          <p className="mt-3 text-4xl font-bold">
            --
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboardPage;