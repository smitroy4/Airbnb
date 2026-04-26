package com.smit.projects.stayGrid.service.impl;

import com.smit.projects.stayGrid.dto.BookingDto;
import com.smit.projects.stayGrid.dto.BookingRequest;
import com.smit.projects.stayGrid.entity.*;
import com.smit.projects.stayGrid.entity.enums.BookingStatus;
import com.smit.projects.stayGrid.exception.ResourceNotFoundException;
import com.smit.projects.stayGrid.repository.BookingRepository;
import com.smit.projects.stayGrid.repository.HotelRepository;
import com.smit.projects.stayGrid.repository.InventoryRepository;
import com.smit.projects.stayGrid.repository.RoomRepository;
import com.smit.projects.stayGrid.service.BookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final InventoryRepository inventoryRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public BookingDto initializeBooking(BookingRequest bookingRequest) {

        log.info("Initializing booking for hotel: {}, room: {}, date: {} - {}",
                bookingRequest.getHotelId(),
                bookingRequest.getRoomId(),
                bookingRequest.getCheckInDate(),
                bookingRequest.getCheckOutDate()
                );

        Hotel hotel = hotelRepository.findById(bookingRequest.getHotelId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hotel not found with id: " + bookingRequest.getHotelId()));

        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + bookingRequest.getRoomId()));

        //        NOTE: PESSIMISTIC LOCK IMPLEMENTED

        List<Inventory> inventoryList = inventoryRepository.findAndLockAvailableInventory(room.getId(),
                bookingRequest.getCheckInDate(),
                bookingRequest.getCheckOutDate(),
                bookingRequest.getRoomsCount());

        long daysCount = ChronoUnit.DAYS.between(bookingRequest.getCheckInDate(),
                bookingRequest.getCheckOutDate()) +1;

        if(inventoryList.size() != daysCount){
            throw new IllegalStateException("Room is not available anymore");
        }

//        Reserve the room/ update the booked count of inventories

        for(Inventory inventory : inventoryList){
            inventory.setReservedCount(inventory.getReservedCount() + bookingRequest.getRoomsCount());
        }

        inventoryRepository.saveAll(inventoryList);

//        Create the booking

        User user = new User();
        user.setId(1L); //TODO: REMOVE DUMMY USER

//        TODO: CALCULATE DYNAMIC AMOUNT

        Booking booking;
        booking = Booking.builder()
                .bookingStatus(BookingStatus.RESERVED)
                .hotel(hotel)
                .room(room)
                .checkInDate(bookingRequest.getCheckInDate())
                .checkOutDate(bookingRequest.getCheckOutDate())
                .user(user)
                .roomsCount(bookingRequest.getRoomsCount())
                .amount(BigDecimal.TEN)
                .build();

        booking = bookingRepository.save(booking);

        return modelMapper.map(booking, BookingDto.class);

    }
}
