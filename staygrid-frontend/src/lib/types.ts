export type Gender = "MALE" | "FEMALE" | "OTHERS";

export type BookingStatus =
  | "RESERVED"
  | "GUESTS_ADDED"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export interface ApiEnvelope<T> {
  timeStamp?: string;
  data: T;
  error: null | {
    status: string;
    message: string;
    subErrors?: unknown[];
  };
}

export interface ContactInfo {
  address: string;
  phoneNumber: string;
  email: string;
  location: string;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  photos: string[];
  amenities: string[];
  contactInfo: ContactInfo;
  active?: boolean;
}

export interface Room {
  id: number;
  type: string;
  basePrice: number;
  photos: string[];
  amenities: string[];
  totalCount: number;
  capacity: number;
  price?: number;
}

export interface HotelInfoResponse {
  hotel: Hotel;
  rooms: Room[];
}

export interface HotelSearchRequest {
  city: string;
  startDate: string;
  endDate: string;
  roomsCount: number;
  page?: number;
  size?: number;
}

export interface HotelPriceDto {
  hotel: Hotel;
  price: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
}

export interface UserProfile {
  id?: number;
  email: string;
  name: string;
  dateOfBirth?: string;
  gender?: Gender;
  roles?: string[];
}

export interface Guest {
  id: number;
  name: string;
  gender: Gender;
  age: number;
  dateOfBirth?: string;
}

export interface Booking {
  id?: number;
  bookingId?: number;
  hotelId?: number;
  roomId?: number;
  checkInDate: string;
  checkOutDate: string;
  roomsCount: number;
  amount?: number;
  bookingStatus?: BookingStatus;
  status?: BookingStatus;
  createdAt?: string;
  guests?: Guest[];
}

export interface Inventory {
  id: number;
  date: string;
  bookedCount: number;
  reservedCount: number;
  totalCount: number;
  surgeFactor: number;
  price: number;
  closed: boolean;
}

export interface HotelReport {
  totalBookings: number;
  totalRevenueOfConfirmedBookings: number;
  avgRevenue: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}
