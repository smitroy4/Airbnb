import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Loader from "../components/common/Loader";
import RoomCard from "../components/hotel/RoomCard";

import { getHotelDetails } from "../api/hotelApi";

import { useBooking } from "../features/bookings/BookingContext";

function HotelDetailsPage() {
  const { hotelId } = useParams();

  const navigate = useNavigate();

  const { setBookingData } =
    useBooking();

  const [hotelInfo, setHotelInfo] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [searchData, setSearchData] =
    useState({
      startDate: "",
      endDate: "",
      roomsCount: 1,
    });

  useEffect(() => {
    loadHotel();
  }, []);

  const loadHotel = async () => {
    try {
      setLoading(true);

      const response =
        await getHotelDetails(
          hotelId,
          {
            startDate:
              new Date()
                .toISOString()
                .split("T")[0],

            endDate:
              new Date(
                Date.now() +
                  86400000
              )
                .toISOString()
                .split("T")[0],

            roomsCount: 1,
          }
        );

      setHotelInfo(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelection =
    (room) => {
      setBookingData({
        hotel:
          hotelInfo.hotelDto,
        room,
        checkInDate:
          searchData.startDate,
        checkOutDate:
          searchData.endDate,
        roomsCount:
          Number(
            searchData.roomsCount
          ),
        guests: [],
        bookingId: null,
      });

      navigate(
        "/booking/summary"
      );
    };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (!hotelInfo) {
    return (
      <MainLayout>
        <div className="p-10">
          Hotel not found
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <img
          src={
            hotelInfo.hotelDto
              .photos?.[0] ||
            "https://placehold.co/1200x600"
          }
          alt={
            hotelInfo.hotelDto
              .name
          }
          className="h-[500px] w-full rounded-3xl object-cover"
        />

        <h1 className="mt-6 text-5xl font-bold">
          {
            hotelInfo.hotelDto
              .name
          }
        </h1>

        <p className="mt-2 text-gray-500">
          {
            hotelInfo.hotelDto
              .city
          }
        </p>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-2xl font-bold">
            Booking Details
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="date"
              value={
                searchData.startDate
              }
              onChange={(e) =>
                setSearchData(
                  (
                    prev
                  ) => ({
                    ...prev,
                    startDate:
                      e.target
                        .value,
                  })
                )
              }
              className="rounded-xl border border-gray-300 p-3"
            />

            <input
              type="date"
              value={
                searchData.endDate
              }
              onChange={(e) =>
                setSearchData(
                  (
                    prev
                  ) => ({
                    ...prev,
                    endDate:
                      e.target
                        .value,
                  })
                )
              }
              className="rounded-xl border border-gray-300 p-3"
            />

            <input
              type="number"
              min="1"
              value={
                searchData.roomsCount
              }
              onChange={(e) =>
                setSearchData(
                  (
                    prev
                  ) => ({
                    ...prev,
                    roomsCount:
                      e.target
                        .value,
                  })
                )
              }
              className="rounded-xl border border-gray-300 p-3"
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-bold">
            Available Rooms
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hotelInfo.rooms.map(
              (room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelect={
                    handleRoomSelection
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HotelDetailsPage;