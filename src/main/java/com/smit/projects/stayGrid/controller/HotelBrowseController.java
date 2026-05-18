package com.smit.projects.stayGrid.controller;

import com.smit.projects.stayGrid.dto.HotelDto;
import com.smit.projects.stayGrid.dto.HotelInfoDto;
import com.smit.projects.stayGrid.dto.HotelPriceDto;
import com.smit.projects.stayGrid.dto.HotelSearchRequest;
import com.smit.projects.stayGrid.service.HotelService;
import com.smit.projects.stayGrid.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
@Slf4j
public class HotelBrowseController {

    private final InventoryService inventoryService;
    private final HotelService hotelService;

    @GetMapping("/search")
    public ResponseEntity<Page<HotelPriceDto>> searchHotels(@RequestBody HotelSearchRequest hotelSearchRequest){
        var page = inventoryService.searchHotels(hotelSearchRequest);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{hotelId}/info")
    public ResponseEntity<HotelInfoDto> getHotelInfo(@PathVariable Long hotelId){
        return ResponseEntity.ok(hotelService.getHotelInfoById(hotelId));
    }


}
