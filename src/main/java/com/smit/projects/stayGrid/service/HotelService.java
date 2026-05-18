package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.dto.HotelDto;
import com.smit.projects.stayGrid.dto.HotelInfoDto;

public interface HotelService {

    HotelDto createNewHotel(HotelDto hotelDto);
    HotelDto getHotelById(Long id);
    HotelDto updateHotelById(Long id, HotelDto hotelDto);
    Boolean deleteHotelById(Long id);
    void activateHotel(Long id);

    HotelInfoDto getHotelInfoById(Long hotelId);
}
