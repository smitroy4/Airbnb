import api from "./axios";

export const searchHotels = async (
  searchRequest
) => {
  const response = await api.post(
    "/hotels/search",
    searchRequest
  );

  return response.data;
};

export const getHotelDetails = async (
  hotelId,
  request
) => {
  const response = await api.post(
    `/hotels/${hotelId}/info`,
    request
  );

  return response.data;
};