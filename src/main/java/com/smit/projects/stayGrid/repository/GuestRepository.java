package com.smit.projects.stayGrid.repository;

import com.smit.projects.stayGrid.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}
