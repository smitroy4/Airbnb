package com.smit.projects.stayGrid.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BookingRequest {

    private Long hotelId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer roomsCount;

}
