package com.smit.projects.airBnbApp.service;

import com.smit.projects.airBnbApp.dto.HotelDto;
import com.smit.projects.airBnbApp.dto.HotelSearchRequest;
import com.smit.projects.airBnbApp.entity.Room;
import org.springframework.data.domain.Page;

public interface InventoryService {

    void initializeRoomForAYear(Room room);

    void deleteAllInventories(Room room);

    Page<HotelDto> searchHotels(HotelSearchRequest hotelSearchRequest);
}
