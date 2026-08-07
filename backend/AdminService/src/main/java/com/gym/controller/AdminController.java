package com.gym.controller;

import com.gym.dto.*;
import com.gym.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/members")
    public ResponseEntity<?> getAllMembers() {
        return adminService.getAllMembers();
    }

    @GetMapping("/trainers")
    public ResponseEntity<?> getAllTrainers() {
        return adminService.getAllTrainers();
    }

    @PostMapping("/create-trainer")
    public ResponseEntity<?> createTrainer(@RequestBody CreateTrainerRequest request) {
        return adminService.createTrainer(request);
    }

    @GetMapping("/unassigned-members")
    public ResponseEntity<?> getUnassignedMembers() {
        return adminService.getUnassignedMembers();
    }

    @GetMapping("/assigned-members")
    public ResponseEntity<?> getAssignedMembers() {
        return adminService.getAssignedMembers();
    }

    @PutMapping("/assign-trainer")
    public ResponseEntity<?> assignTrainer(@RequestBody AssignTrainerRequest request) {
        return adminService.assignTrainer(request);
    }

    @PutMapping("/unassign-trainer")
    public ResponseEntity<?> unassignTrainer(@RequestBody UnassignTrainerRequest request) {
        return adminService.unassignTrainer(request);
    }

    @GetMapping("/earnings")
    public ResponseEntity<?> getEarnings() {
        return adminService.getEarnings();
    }
}