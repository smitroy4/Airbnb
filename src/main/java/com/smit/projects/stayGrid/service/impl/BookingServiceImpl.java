package com.smit.projects.stayGrid.service.impl;

import com.smit.projects.stayGrid.dto.BookingDto;
import com.smit.projects.stayGrid.dto.BookingRequest;
import com.smit.projects.stayGrid.dto.GuestDto;
import com.smit.projects.stayGrid.entity.*;
import com.smit.projects.stayGrid.entity.enums.BookingStatus;
import com.smit.projects.stayGrid.exception.ResourceNotFoundException;
import com.smit.projects.stayGrid.exception.UnAuthorizedException;
import com.smit.projects.stayGrid.repository.*;
import com.smit.projects.stayGrid.service.BookingService;
import com.smit.projects.stayGrid.service.CheckoutService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private final GuestRepository guestRepository;
    private final CheckoutService checkoutService;

    @Value("${frontend.url}")
    private String frontendUrl;

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
                .user(getCurrentUser())
                .roomsCount(bookingRequest.getRoomsCount())
                .amount(BigDecimal.TEN)
                .build();

        booking = bookingRepository.save(booking);

        return modelMapper.map(booking, BookingDto.class);

    }

//    created the addGuest service

    @Override
    @Transactional
    public BookingDto addGuests(Long bookingId, List<GuestDto> guestDtoList) {

        log.info("Add guests for booking with id - {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found with id: "+bookingId));

        User user = getCurrentUser();

        if(user.equals(booking.getUser())){
            throw new UnAuthorizedException("Booking does not belong to this user with id: " + bookingId);
        }

        if(hasBookingExpired(booking)){
            throw new IllegalStateException("Booking has already expired");
        }

        if(booking.getBookingStatus() != BookingStatus.RESERVED){
            throw new IllegalStateException(("Booking is not under reserved state, cannot add guests"));
        }

        for(GuestDto guestDto : guestDtoList){
            Guest guest = modelMapper.map(guestDto, Guest.class);
            guest.setUser(user);
            guest = guestRepository.save(guest);
            booking.getGuests().add(guest);

        }

        booking.setBookingStatus(BookingStatus.GUESTS_ADDED);
        booking = bookingRepository.save(booking);
        return modelMapper.map(booking, BookingDto.class);
    }

    @Override
    @Transactional
    public String initiatePayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with Booking Id: " + bookingId));
        User user = getCurrentUser();

        if(user.equals(booking.getUser())){
            throw new UnAuthorizedException("Booking does not belong to this user with id: " + bookingId);
        }

        if(hasBookingExpired(booking)){
            throw new IllegalStateException("Booking has already expired");
        }

        String sessionUrl =
        checkoutService.getCheckoutSession(booking,frontendUrl+"/payments/success",frontendUrl+"/payments/cancel" );

        booking.setBookingStatus(BookingStatus.PAYMENT_PENDING);
        bookingRepository.save(booking);

        return sessionUrl;
    }


    @Transactional
    @Override
    public void capturePayment(Event event) {
        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session == null) return;

            String sessionId = session.getId();
            Booking booking =
                    bookingRepository.findByPaymentSessionId(sessionId).orElseThrow(() ->
                            new ResourceNotFoundException("Booking not found for session ID: " + sessionId));

            booking.setBookingStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            inventoryRepository.findAndLockReservedInventory(booking.getRoom().getId(), booking.getCheckInDate(),
                    booking.getCheckOutDate(), booking.getRoomsCount());

            inventoryRepository.confirmBooking(booking.getRoom().getId(), booking.getCheckInDate(),
                    booking.getCheckOutDate(), booking.getRoomsCount());

            log.info("Successfully confirmed the booking for Booking ID: {}", booking.getId());
        } else {
            log.warn("Unhandled event type: {}", event.getType());
        }
    }

    public boolean hasBookingExpired(Booking booking){
        return booking.getCreatedAt().plusMinutes(10).isBefore(LocalDateTime.now());
    }

    public User getCurrentUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }


}
