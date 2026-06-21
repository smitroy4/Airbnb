import api from "./axios";

export const getHotelReport =
  async (
    hotelId,
    startDate,
    endDate
  ) => {
    const response =
      await api.get(
        `/admin/hotels/${hotelId}/reports`,
        {
          params: {
            startDate,
            endDate,
          },
        }
      );

    return response.data;
  };