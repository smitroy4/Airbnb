import {
  createContext,
  useContext,
  useState,
} from "react";

const BookingContext =
  createContext();

export function BookingProvider({
  children,
}) {
  const [
    bookingData,
    setBookingData,
  ] = useState({
    hotel: null,
    room: null,
    checkInDate: "",
    checkOutDate: "",
    roomsCount: 1,
    guests: [],
    bookingId: null,
  });

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking =
  () => useContext(
    BookingContext
  );