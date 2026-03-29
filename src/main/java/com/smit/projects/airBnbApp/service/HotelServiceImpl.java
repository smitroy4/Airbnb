package com.smit.projects.airBnbApp.service;

import com.smit.projects.airBnbApp.dto.HotelDto;
import com.smit.projects.airBnbApp.entity.Hotel;
import com.smit.projects.airBnbApp.repository.HotelRepository;
import lombok.AllArgsConstructor;
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
        return null;
    }
}
