package com.smit.projects.stayGrid.repository;

import com.smit.projects.stayGrid.entity.Hotel;
import com.smit.projects.stayGrid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByOwner(User user);
}
