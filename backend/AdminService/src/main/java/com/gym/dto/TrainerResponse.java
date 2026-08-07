package com.gym.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TrainerResponse {
    private Integer trainerId;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private LocalDateTime createdAt;
}