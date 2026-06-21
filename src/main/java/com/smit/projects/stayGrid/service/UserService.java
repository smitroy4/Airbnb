package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.dto.ProfileUpdateRequestDto;
import com.smit.projects.stayGrid.dto.UserDto;
import com.smit.projects.stayGrid.entity.User;

public interface UserService {

    User getUserById(Long id);

    void updateProfile(ProfileUpdateRequestDto profileUpdateRequestDto);

    UserDto getMyProfile();

}
