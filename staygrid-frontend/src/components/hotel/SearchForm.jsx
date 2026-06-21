import { useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";

function SearchForm({ onSearch, loading }) {
  const [formData, setFormData] = useState({
    city: "",
    startDate: "",
    endDate: "",
    roomsCount: 1,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch({
      city: formData.city,
      startDate: formData.startDate,
      endDate: formData.endDate,
      roomsCount: Number(formData.roomsCount),
      page: 0,
      size: 10,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-4"
    >
      <Input
        label="City"
        name="city"
        placeholder="Kolkata"
        value={formData.city}
        onChange={handleChange}
      />

      <Input
        label="Check In"
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
      />

      <Input
        label="Check Out"
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
      />

      <Input
        label="Rooms"
        type="number"
        name="roomsCount"
        min="1"
        value={formData.roomsCount}
        onChange={handleChange}
      />

      <div className="md:col-span-4">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Hotels"}
        </Button>
      </div>
    </form>
  );
}

export default SearchForm;