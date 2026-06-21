import { Link } from "react-router-dom";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold text-blue-600">
            StayGrid
          </h2>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link
            to="/profile"
            className="rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </Link>

          <Link
            to="/my-bookings"
            className="rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            My Bookings
          </Link>

          <Link
            to="/guests"
            className="rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Guests
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-slate-50 p-6">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;