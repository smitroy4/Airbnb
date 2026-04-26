package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.dto.BookingDto;
import com.smit.projects.stayGrid.dto.BookingRequest;

public interface BookingService {

    BookingDto initializeBooking(BookingRequest bookingRequest);
}
