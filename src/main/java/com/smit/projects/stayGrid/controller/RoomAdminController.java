package com.smit.projects.stayGrid.controller;

import com.smit.projects.stayGrid.dto.RoomDto;
import com.smit.projects.stayGrid.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/hotels/{hotelId}/rooms")
public class RoomAdminController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDto> createNewRoom(@PathVariable Long hotelId,
                                                 @RequestBody RoomDto roomDto){
        RoomDto createdRoom = roomService.createNewRoom(hotelId, roomDto);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RoomDto>> getRoomsByHotelId(@PathVariable Long hotelId){
        List<RoomDto> listOfRoomsInHotel = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(listOfRoomsInHotel);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable Long hotelId,
                                               @PathVariable Long roomId){
        RoomDto foundRoomInHotel = roomService.getRoomById(roomId);
        return ResponseEntity.ok(foundRoomInHotel);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<RoomDto> deleteRoomById(@PathVariable Long hotelId,
                                                  @PathVariable Long roomId){
        roomService.deleteRoomById(roomId);
        return ResponseEntity.noContent().build();
    }

}
