package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.dto.BookingDto;
import com.smit.projects.stayGrid.dto.BookingRequest;
import com.smit.projects.stayGrid.dto.GuestDto;
import com.smit.projects.stayGrid.dto.HotelReportDto;
import com.smit.projects.stayGrid.entity.enums.BookingStatus;
import com.stripe.model.Event;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingDto initialiseBooking(BookingRequest bookingRequest);

    BookingDto addGuests(Long bookingId, List<Long> guestIdList);

    String initiatePayments(Long bookingId);

    void capturePayment(Event event);

    void cancelBooking(Long bookingId);

    BookingStatus getBookingStatus(Long bookingId);

    List<BookingDto> getAllBookingsByHotelId(Long hotelId);

    HotelReportDto getHotelReport(Long hotelId, LocalDate startDate, LocalDate endDate);

    List<BookingDto> getMyBookings();
}
