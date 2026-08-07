package com.gym.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MemberResponse {
    private Integer clientId;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private Integer age;
    private String createdAt;
    private String goalName;
    private String packageName;
    private Integer durationMonths;
    private Double price;
    private Boolean wantsPersonalTrainer;
    private String trainerType;
    private String trainerName;

    // NEW - subscription & trainer dates
    private LocalDate subscriptionStart;
    private LocalDate subscriptionEnd;
    private LocalDate trainerAssignedDate;
    private LocalDate trainerEndDate;
}