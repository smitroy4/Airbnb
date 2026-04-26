package com.smit.projects.stayGrid.dto;

import com.smit.projects.stayGrid.entity.User;
import com.smit.projects.stayGrid.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class GuestDto {

    private Long id;
    private User user;
    private String name;
    private Gender gender;
    private Integer age;

}
