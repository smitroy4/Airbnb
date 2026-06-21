import api from "./axios";

export const initialiseBooking = async (
  bookingData
) => {
  const response = await api.post(
    "/bookings/init",
    bookingData
  );

  return response.data;
};

export const addGuestsToBooking = async (
  bookingId,
  guestIds
) => {
  const response = await api.post(
    `/bookings/${bookingId}/addGuests`,
    guestIds
  );

  return response.data;
};

export const initiatePayment = async (
  bookingId
) => {
  const response = await api.post(
    `/bookings/${bookingId}/payments`
  );

  return response.data;
};

export const getBookingStatus = async (
  bookingId
) => {
  const response = await api.get(
    `/bookings/${bookingId}/status`
  );

  return response.data;
};

export const getMyBookings =
  async () => {
    const response =
      await api.get(
        "/users/myBookings"
      );

    return response.data;
  };