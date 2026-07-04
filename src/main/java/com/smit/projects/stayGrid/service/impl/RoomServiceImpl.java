package com.smit.projects.stayGrid.service.impl;

import com.smit.projects.stayGrid.dto.RoomDto;
import com.smit.projects.stayGrid.entity.Hotel;
import com.smit.projects.stayGrid.entity.Room;
import com.smit.projects.stayGrid.entity.User;
import com.smit.projects.stayGrid.exception.ResourceNotFoundException;
import com.smit.projects.stayGrid.exception.UnAuthorizedException;
import com.smit.projects.stayGrid.repository.HotelRepository;
import com.smit.projects.stayGrid.repository.RoomRepository;
import com.smit.projects.stayGrid.service.InventoryService;
import com.smit.projects.stayGrid.service.RoomService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.smit.projects.stayGrid.util.AppUtils.getCurrentUser;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;
    private final HotelRepository hotelRepository;
    private final InventoryService inventoryService;

    @Override
    @Caching(evict = {
            @CacheEvict(value = "hotel", key = "#id"),
            @CacheEvict(value = "admin-hotels", allEntries = true),
            @CacheEvict(value = "hotel-info", allEntries = true),
            @CacheEvict(value = "hotel-search", allEntries = true)
    })
    public RoomDto createNewRoom(Long hotelId, RoomDto roomDto) {
        log.info("Creating to creating a new room in hotel with id: {}", hotelId);
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.equals(hotel.getOwner())){
            throw new UnAuthorizedException("This user does not own this hotel with id: " + hotelId);
        }

        Room room = modelMapper.map(roomDto, Room.class);
        room.setHotel(hotel);
        Room savedRoom = roomRepository.save(room);
        RoomDto savedRoomDto = modelMapper.map(savedRoom, RoomDto.class);
        log.info("Created a new room with ID: {}", savedRoomDto.getId());

        if(hotel.getActive()){
            inventoryService.initializeRoomForAYear(room);
        }

        return savedRoomDto;
    }


    @Override
    @Cacheable("room")
    public RoomDto getRoomById(Long id) {
        log.info("Getting room with id: {}", id);
        Room room = roomRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Room not found with ID:)) " + id));
        RoomDto foundRoom = modelMapper.map(room, RoomDto.class);
        return foundRoom;
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "hotel", key = "#id"),
            @CacheEvict(value = "admin-hotels", allEntries = true),
            @CacheEvict(value = "hotel-info", allEntries = true),
            @CacheEvict(value = "hotel-search", allEntries = true)
    })
    public void deleteRoomById(Long id) {
        log.info("Deleting room with id: {}", id);
        Room room = roomRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Room not found with ID:)) " + id));

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.equals(room.getHotel().getOwner())){
            throw new UnAuthorizedException("This user does not own this room with id: " + id);
        }

        inventoryService.deleteAllInventories(room);
        roomRepository.deleteById(id);

    }

    @Override
    @Transactional
    @Cacheable("hotel-rooms")
    public List<RoomDto> getRoomsByHotelId(Long hotelId) {
        log.info("Getting rooms for hotel with id: {}", hotelId);
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
        return hotel.getRooms().stream()
                .map((element) -> modelMapper.map(element, RoomDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "hotel", key = "#id"),
            @CacheEvict(value = "admin-hotels", allEntries = true),
            @CacheEvict(value = "hotel-info", allEntries = true),
            @CacheEvict(value = "hotel-search", allEntries = true)
    })
    public RoomDto updateRoomById(Long hotelId, Long roomId, RoomDto roomDto) {
        log.info("Updating the room with ID: {}", roomId);
        Hotel hotel = hotelRepository
                .findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: "+hotelId));

        User user = getCurrentUser();
        if(!user.equals(hotel.getOwner())) {
            throw new UnAuthorizedException("This user does not own this hotel with id: "+hotelId);
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: "+roomId));

        modelMapper.map(roomDto, room);
        room.setId(roomId);

//        TODO: if price or inventory is updated, then update the inventory for this room
        room = roomRepository.save(room);

        return modelMapper.map(room, RoomDto.class);
    }
}
