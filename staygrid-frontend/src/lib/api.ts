import axios from "axios";

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";
import type {
  ApiEnvelope,
  Booking,
  Guest,
  Hotel,
  HotelInfoResponse,
  HotelPriceDto,
  HotelReport,
  HotelSearchRequest,
  Inventory,
  LoginResponse,
  PageResponse,
  Room,
  UserProfile,
} from "./types";

const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "https://staygrid-b02y.onrender.com/api/v1";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("sg_access_token", token);
    else localStorage.removeItem("sg_access_token");
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("sg_access_token");
  }
  return accessToken;
}

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = axios
    .post<ApiEnvelope<LoginResponse> | LoginResponse>(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    .then((res) => {
      const data: any = res.data;
      const payload = data?.data ?? data;
      const token = payload?.accessToken ?? null;
      if (token) setAccessToken(token);
      return token;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const url = original.url ?? "";
      if (!url.includes("/auth/login") && !url.includes("/auth/refresh")) {
        const token = await tryRefresh();
        if (token) {
          original.headers = { ...(original.headers as any), Authorization: `Bearer ${token}` };
          return api.request(original);
        }
      }
    }
    return Promise.reject(error);
  }
);

function unwrap<T>(payload: any): T {
  if (payload && typeof payload === "object" && "data" in payload && ("error" in payload || "timeStamp" in payload)) {
    if (payload.error) {
      const err: any = new Error(payload.error.message || "Request failed");
      err.apiError = payload.error;
      throw err;
    }
    return payload.data as T;
  }
  return payload as T;
}

async function request<T>(cfg: AxiosRequestConfig): Promise<T> {
  const res = await api.request<any>(cfg);
  return unwrap<T>(res.data);
}

export const endpoints = {
  // Auth
  signup: (body: { email: string; password: string; name: string }) =>
    request<UserProfile>({ method: "POST", url: "/auth/signup", data: body }),
  login: (body: { email: string; password: string }) =>
    request<LoginResponse>({ method: "POST", url: "/auth/login", data: body }),
  refresh: () => tryRefresh(),
  logout: () => request<void>({ method: "POST", url: "/auth/logout" }).catch(() => undefined),

  // Hotels (public)
  searchHotels: (body: HotelSearchRequest) =>
    request<PageResponse<HotelPriceDto>>({ method: "POST", url: "/hotels/search", data: body }),
  hotelInfo: (hotelId: number | string, body: { startDate: string; endDate: string; roomsCount: number }) =>
    request<HotelInfoResponse>({ method: "POST", url: `/hotels/${hotelId}/info`, data: body }),

  // Users
  getProfile: () => request<UserProfile>({ method: "GET", url: "/users/profile" }),
  updateProfile: (body: { name?: string; dateOfBirth?: string; gender?: string }) =>
    request<UserProfile>({ method: "PATCH", url: "/users/profile", data: body }),
  myBookings: () => request<Booking[]>({ method: "GET", url: "/users/myBookings" }),
  listGuests: () => request<Guest[]>({ method: "GET", url: "/users/guests" }),
  createGuest: (body: Omit<Guest, "id">) =>
    request<Guest>({ method: "POST", url: "/users/guests", data: body }),
  updateGuest: (id: number, body: Omit<Guest, "id">) =>
    request<Guest>({ method: "PUT", url: `/users/guests/${id}`, data: body }),
  deleteGuest: (id: number) => request<void>({ method: "DELETE", url: `/users/guests/${id}` }),

  // Booking flow
  initBooking: (body: {
    hotelId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    roomsCount: number;
  }) => request<Booking>({ method: "POST", url: "/bookings/init", data: body }),
  addGuestsToBooking: (bookingId: number | string, guestIds: number[]) =>
    request<Booking>({ method: "POST", url: `/bookings/${bookingId}/addGuests`, data: guestIds }),
  startPayment: (bookingId: number | string) =>
    request<{ sessionUrl: string }>({ method: "POST", url: `/bookings/${bookingId}/payments` }),
  bookingStatus: (bookingId: number | string) =>
    request<{ bookingStatus?: string; status?: string } & Booking>({
      method: "GET",
      url: `/bookings/${bookingId}/status`,
    }),
  cancelBooking: (bookingId: number | string) =>
    request<Booking>({ method: "POST", url: `/bookings/${bookingId}/cancel` }),

  // Admin - hotels
  adminListHotels: () => request<Hotel[]>({ method: "GET", url: "/admin/hotels" }),
  adminGetHotel: (id: number | string) => request<Hotel>({ method: "GET", url: `/admin/hotels/${id}` }),
  adminCreateHotel: (body: Partial<Hotel>) =>
    request<Hotel>({ method: "POST", url: "/admin/hotels", data: body }),
  adminUpdateHotel: (id: number | string, body: Partial<Hotel>) =>
    request<Hotel>({ method: "PUT", url: `/admin/hotels/${id}`, data: body }),
  adminDeleteHotel: (id: number | string) =>
    request<void>({ method: "DELETE", url: `/admin/hotels/${id}` }),
  adminActivateHotel: (id: number | string) =>
    request<Hotel>({ method: "PATCH", url: `/admin/hotels/${id}/activate` }),

  // Admin - rooms
  adminListRooms: (hotelId: number | string) =>
    request<Room[]>({ method: "GET", url: `/admin/hotels/${hotelId}/rooms` }),
  adminGetRoom: (hotelId: number | string, roomId: number | string) =>
    request<Room>({ method: "GET", url: `/admin/hotels/${hotelId}/rooms/${roomId}` }),
  adminCreateRoom: (hotelId: number | string, body: Partial<Room>) =>
    request<Room>({ method: "POST", url: `/admin/hotels/${hotelId}/rooms`, data: body }),
  adminUpdateRoom: (hotelId: number | string, roomId: number | string, body: Partial<Room>) =>
    request<Room>({ method: "PUT", url: `/admin/hotels/${hotelId}/rooms/${roomId}`, data: body }),
  adminDeleteRoom: (hotelId: number | string, roomId: number | string) =>
    request<void>({ method: "DELETE", url: `/admin/hotels/${hotelId}/rooms/${roomId}` }),

  // Admin - inventory
  adminGetInventory: (roomId: number | string) =>
    request<Inventory[]>({ method: "GET", url: `/admin/inventory/rooms/${roomId}` }),
  adminUpdateInventory: (
    roomId: number | string,
    body: { startDate: string; endDate: string; surgeFactor?: number; closed?: boolean }
  ) => request<void>({ method: "PATCH", url: `/admin/inventory/rooms/${roomId}`, data: body }),

  // Admin - bookings & reports
  adminHotelBookings: (hotelId: number | string) =>
    request<Booking[]>({ method: "GET", url: `/admin/hotels/${hotelId}/bookings` }),
  adminHotelReport: (hotelId: number | string, startDate: string, endDate: string) =>
    request<HotelReport>({
      method: "GET",
      url: `/admin/hotels/${hotelId}/reports`,
      params: { startDate, endDate },
    }),
};

export function getApiErrorMessage(err: unknown): string {
  const anyErr = err as any;
  return (
    anyErr?.apiError?.message ||
    anyErr?.response?.data?.error?.message ||
    anyErr?.response?.data?.message ||
    anyErr?.message ||
    "Something went wrong"
  );
}
