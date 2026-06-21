import api from "./axios";

export const getHotels = async () => {
  const response = await api.get(
    "/admin/hotels"
  );

  return response.data;
};

export const getHotel = async (
  hotelId
) => {
  const response = await api.get(
    `/admin/hotels/${hotelId}`
  );

  return response.data;
};

export const createHotel =
  async (hotelData) => {
    const response =
      await api.post(
        "/admin/hotels",
        hotelData
      );

    return response.data;
  };

export const updateHotel =
  async (
    hotelId,
    hotelData
  ) => {
    const response =
      await api.put(
        `/admin/hotels/${hotelId}`,
        hotelData
      );

    return response.data;
  };

export const deleteHotel =
  async (hotelId) => {
    await api.delete(
      `/admin/hotels/${hotelId}`
    );
  };

export const activateHotel =
  async (hotelId) => {
    await api.patch(
      `/admin/hotels/${hotelId}/activate`
    );
  };

  export const getHotelBookings =
  async (hotelId) => {
    const response =
      await api.get(
        `/admin/hotels/${hotelId}/bookings`
      );

    return response.data;
  };