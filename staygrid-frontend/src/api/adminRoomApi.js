import api from "./axios";

export const getRooms = async (hotelId) => {
  const response = await api.get(
    `/admin/hotels/${hotelId}/rooms`
  );

  return response.data;
};

export const getRoom = async (
  hotelId,
  roomId
) => {
  const response = await api.get(
    `/admin/hotels/${hotelId}/rooms/${roomId}`
  );

  return response.data;
};

export const createRoom = async (
  hotelId,
  roomData
) => {
  const response = await api.post(
    `/admin/hotels/${hotelId}/rooms`,
    roomData
  );

  return response.data;
};

export const updateRoom = async (
  hotelId,
  roomId,
  roomData
) => {
  const response = await api.put(
    `/admin/hotels/${hotelId}/rooms/${roomId}`,
    roomData
  );

  return response.data;
};

export const deleteRoom = async (
  hotelId,
  roomId
) => {
  await api.delete(
    `/admin/hotels/${hotelId}/rooms/${roomId}`
  );
};