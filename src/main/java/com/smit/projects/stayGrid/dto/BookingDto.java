package com.smit.projects.stayGrid.dto;

import com.smit.projects.stayGrid.entity.Guest;
import com.smit.projects.stayGrid.entity.Hotel;
import com.smit.projects.stayGrid.entity.Room;
import com.smit.projects.stayGrid.entity.User;
import com.smit.projects.stayGrid.entity.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingDto {

    private Long id;
//    private Hotel hotel;
//    private Room room;
//    private User user;
    private Integer roomsCount;
    private LocalDate checkInDate;
    private LocalDate  checkOutDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BookingStatus bookingStatus;
    private Set<GuestDto> guests;

}
