package com.gym.dto;

import lombok.Data;

@Data
public class CreateTrainerRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String gender;
}