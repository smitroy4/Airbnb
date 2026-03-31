package com.smit.projects.airBnbApp.controller;

import com.smit.projects.airBnbApp.dto.HotelDto;
import com.smit.projects.airBnbApp.entity.Hotel;
import com.smit.projects.airBnbApp.service.HotelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/hotels")
@RequiredArgsConstructor
@Slf4j
public class HotelController {

    private final HotelService hotelService;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<HotelDto> createNewHotel(@RequestBody HotelDto hotelDto){
        log.info("Attempting to create a new hotel with name: {}", hotelDto.getName());
        HotelDto creatableHotel = hotelService.createNewHotel(hotelDto);
        return new ResponseEntity<>(creatableHotel, HttpStatus.CREATED);
    }


    @GetMapping("/{hotelId}")
    public ResponseEntity<HotelDto> getHotelById(@PathVariable Long hotelId){
        HotelDto hotelDto = hotelService.getHotelById(hotelId);
        return ResponseEntity.ok(hotelDto);
    }

    @PutMapping("/{hotelId}")
    public ResponseEntity<HotelDto> updateHotelById(@PathVariable Long hotelId, @RequestBody HotelDto hotelDto){
        log.info("Attempting to update hotel with name: {}", hotelDto.getName());
        HotelDto updatableHotel = hotelService.updateHotelById(hotelId,hotelDto);
        return ResponseEntity.ok(hotelDto);
    }

    @DeleteMapping("/{hotelId}")
    public ResponseEntity<Void> deleteHotelById(@PathVariable Long hotelId){
        log.info("Attempting to update hotel with id: {}",hotelId);
        hotelService.deleteHotelById(hotelId);
        return ResponseEntity.noContent().build();
    }

}
