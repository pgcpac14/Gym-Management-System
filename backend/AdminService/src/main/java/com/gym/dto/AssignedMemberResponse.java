package com.gym.dto;

import lombok.Data;

@Data
public class AssignedMemberResponse {
    private Integer clientId;
    private String name;
    private String email;
    private String phone;
    private String goalName;
    private String packageName;
    private String trainerName;
}