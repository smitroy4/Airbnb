import { useState } from "react";

import MainLayout from "../layouts/MainLayout";

import SearchForm from "../components/hotel/SearchForm";
import HotelGrid from "../components/hotel/HotelGrid";
import Loader from "../components/common/Loader";

import { searchHotels } from "../api/hotelApi";

function SearchHotelsPage() {
  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSearch = async (payload) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await searchHotels(payload);

      setHotels(response.content || []);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to search hotels."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold">
          Search Hotels
        </h1>

        <SearchForm
          onSearch={handleSearch}
          loading={loading}
        />

        <div className="mt-10">
          {loading && <Loader />}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {!loading && (
            <HotelGrid hotels={hotels} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default SearchHotelsPage;