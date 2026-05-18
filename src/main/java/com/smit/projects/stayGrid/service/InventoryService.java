package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.dto.HotelDto;
import com.smit.projects.stayGrid.dto.HotelPriceDto;
import com.smit.projects.stayGrid.dto.HotelSearchRequest;
import com.smit.projects.stayGrid.entity.Room;
import org.springframework.data.domain.Page;

public interface InventoryService {

    void initializeRoomForAYear(Room room);

    void deleteAllInventories(Room room);

    Page<HotelPriceDto> searchHotels(HotelSearchRequest hotelSearchRequest);
}
