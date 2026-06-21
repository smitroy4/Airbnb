import api from "./axios";

export const getGuests = async () => {
  const response = await api.get("/users/guests");
  return response.data;
};

export const createGuest = async (guestData) => {
  const response = await api.post(
    "/users/guests",
    guestData
  );

  return response.data;
};

export const updateGuest = async (
  guestId,
  guestData
) => {
  const response = await api.put(
    `/users/guests/${guestId}`,
    guestData
  );

  return response.data;
};

export const deleteGuest = async (
  guestId
) => {
  await api.delete(
    `/users/guests/${guestId}`
  );
};