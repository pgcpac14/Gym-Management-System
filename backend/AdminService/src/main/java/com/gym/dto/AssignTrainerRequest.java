package com.gym.dto;

import lombok.Data;

@Data
public class AssignTrainerRequest {
    private Integer clientId;
    private Integer trainerId;
}