package com.gym.dto;

public class RegisterResponse {
    private String message;
    private Integer uid;

    public RegisterResponse(String message, Integer uid) {
        this.message = message;
        this.uid = uid;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Integer getUid() { return uid; }
    public void setUid(Integer uid) { this.uid = uid; }
}