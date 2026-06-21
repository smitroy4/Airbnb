import MainLayout from "../layouts/MainLayout";

import { Link } from "react-router-dom";

function HomePage() {
  return (
    <MainLayout>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold leading-tight">
              Find your next stay with
              <span className="text-blue-600">
                {" "}
                StayGrid
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Search hotels, compare rooms,
              manage bookings, and enjoy
              seamless travel experiences.
            </p>

            <div className="mt-8">
              <Link
                to="/search"
                className="rounded-xl bg-blue-600 px-6 py-4 text-white"
              >
                Explore Hotels
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default HomePage;