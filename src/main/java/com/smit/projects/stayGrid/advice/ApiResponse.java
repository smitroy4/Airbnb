package com.smit.projects.stayGrid.advice;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApiResponse<T> {

    private LocalDateTime timeStamp;
    private T data;
    private ApiError error;

    public ApiResponse(LocalDateTime timeStamp) {this.timeStamp = LocalDateTime.now();}

    public ApiResponse(T data){
        this();
        this.data = data;
    }


    public ApiResponse(ApiError error) {
        this();
        this.error = error;
    }

    public ApiResponse() {

    }
}
