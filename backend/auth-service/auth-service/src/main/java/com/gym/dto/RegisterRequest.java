package com.gym.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private Integer age;
    private String gender;

    @JsonProperty("goal_id")
    private Integer goalId;
}
