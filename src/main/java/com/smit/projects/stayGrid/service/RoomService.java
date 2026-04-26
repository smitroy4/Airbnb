package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.dto.RoomDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoomService {

    RoomDto createNewRoom(Long hotelId, RoomDto roomDto);
    RoomDto getRoomById(Long id);
    void deleteRoomById(Long id);
    List<RoomDto> getRoomsByHotelId(Long hotelId);
//    RoomDto updateRoomById(Long id, RoomDto roomDto);

}
