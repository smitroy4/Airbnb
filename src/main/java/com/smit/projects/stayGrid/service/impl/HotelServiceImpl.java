package com.smit.projects.stayGrid.service.impl;

import com.smit.projects.stayGrid.dto.HotelDto;
import com.smit.projects.stayGrid.dto.HotelInfoDto;
import com.smit.projects.stayGrid.dto.RoomDto;
import com.smit.projects.stayGrid.entity.Hotel;
import com.smit.projects.stayGrid.entity.Room;
import com.smit.projects.stayGrid.exception.ResourceNotFoundException;
import com.smit.projects.stayGrid.repository.HotelRepository;
import com.smit.projects.stayGrid.repository.RoomRepository;
import com.smit.projects.stayGrid.service.HotelService;
import com.smit.projects.stayGrid.service.InventoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;
    private final InventoryService inventoryService;
    private final RoomRepository roomRepository;

    @Override
    public HotelDto createNewHotel(HotelDto hotelDto) {
        log.info("Creating new hotel with name {}", hotelDto.getName());
        Hotel hotel = modelMapper.map(hotelDto, Hotel.class);
        hotel.setActive(false);
        Hotel savedHotel =  hotelRepository.save(hotel);
        HotelDto savedHotelDto = modelMapper.map(savedHotel,HotelDto.class);
        log.info("Created a new hotel with ID: {}", hotelDto.getId());
        return savedHotelDto;
    }

    @Override
    public HotelDto getHotelById(Long id) {
        log.info("Creating new hotel with id {}", id);
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID: " + id));
        HotelDto foundHotel = modelMapper.map(hotel, HotelDto.class);
        return foundHotel;
    }

    @Override
    public HotelDto updateHotelById(Long id, HotelDto hotelDto) {
            log.info("Updating hotel with id {}", id);
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID: " + id));
        Hotel foundHotel = modelMapper.map(hotelDto, Hotel.class);

//      NOTE: HARD-CODED DUE TO UPDATE ERRORS
        foundHotel.setId(id);

        hotelRepository.save(foundHotel);
        HotelDto foundHotelDto = modelMapper.map(foundHotel, HotelDto.class);
        return foundHotelDto;
    }

    @Override
    @Transactional
    public Boolean deleteHotelById(Long id) {
        Hotel hotel = hotelRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID: " + id));


        for (Room room : hotel.getRooms()){
            inventoryService.deleteAllInventories(room);
            roomRepository.deleteById(room.getId());
        }
        hotelRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public void activateHotel(Long id) {
        log.info("Activating hotel with id {}", id);
        Hotel hotel = hotelRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID: " + id));

        hotel.setActive(true);

//        NOTE: Assuming only do it once
        for (Room room : hotel.getRooms()){
            inventoryService.initializeRoomForAYear(room);
        }
        
    }

    @Override
    public HotelInfoDto getHotelInfoById(Long hotelId) {

        Hotel hotel = hotelRepository
                .findById(hotelId)
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

        List<RoomDto> rooms = hotel.getRooms()
                .stream()
                .map((element -> modelMapper.map(element, RoomDto.class))).toList();

        return new HotelInfoDto(modelMapper.map(hotel,HotelDto.class), rooms);
    }
}
