package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.dto.BookingDto;
import com.smit.projects.stayGrid.dto.BookingRequest;
import com.smit.projects.stayGrid.dto.GuestDto;
import com.stripe.model.Event;
import jakarta.transaction.Transactional;

import java.util.List;

public interface BookingService {

    BookingDto initializeBooking(BookingRequest bookingRequest);


    BookingDto addGuests(Long bookingId, List<GuestDto> guestDtoList);

    String initiatePayment(Long bookingId);

    void capturePayment(Event event);

    void cancelBooking(Long bookingId);

    String getBookingStatus(Long bookingId);
}
