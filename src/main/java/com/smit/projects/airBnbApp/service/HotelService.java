package com.smit.projects.airBnbApp.service;

import com.smit.projects.airBnbApp.dto.HotelDto;
import com.smit.projects.airBnbApp.entity.Hotel;

public interface HotelService {

    HotelDto createNewHotel(HotelDto hotelDto);
    HotelDto getHotelById(Long id);
    HotelDto updateHotelById(Long id, HotelDto hotelDto);
    Boolean deleteHotelById(Long id);

}
