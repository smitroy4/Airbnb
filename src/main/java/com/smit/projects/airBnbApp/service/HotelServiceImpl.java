package com.smit.projects.airBnbApp.service;

import com.smit.projects.airBnbApp.dto.HotelDto;
import com.smit.projects.airBnbApp.entity.Hotel;
import com.smit.projects.airBnbApp.exception.ResourceNotFoundException;
import com.smit.projects.airBnbApp.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelServiceImpl implements HotelService{

    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;

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
//      HARD-CODED DUE TO UPDATE ERRORS
        foundHotel.setId(id);
        hotelRepository.save(foundHotel);
        HotelDto foundHotelDto = modelMapper.map(foundHotel, HotelDto.class);
        return foundHotelDto;
    }

    @Override
    public Boolean deleteHotelById(Long id) {
        Boolean exists = hotelRepository.existsById(id);
        if(!exists) throw new ResourceNotFoundException("Hotel not found with ID: "+id);
        hotelRepository.deleteById(id);
//        TODO: delete the future inventories for this hotel
        return true;
    }
}
