import api from "./axios";

export const getRoomInventory =
  async (roomId) => {
    const response =
      await api.get(
        `/admin/inventory/rooms/${roomId}`
      );

    return response.data;
  };

export const updateInventory =
  async (
    roomId,
    payload
  ) => {
    await api.patch(
      `/admin/inventory/rooms/${roomId}`,
      payload
    );
  };