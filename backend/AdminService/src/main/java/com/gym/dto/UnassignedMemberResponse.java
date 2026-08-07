package com.gym.dto;

import lombok.Data;

@Data
public class UnassignedMemberResponse {
    private Integer clientId;
    private String name;
    private String email;
    private String phone;
    private String goalName;
    private String packageName;
}