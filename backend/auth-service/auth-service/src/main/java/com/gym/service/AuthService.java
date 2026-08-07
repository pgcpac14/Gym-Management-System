package com.gym.service;

import com.gym.dto.LoginRequest;
import com.gym.dto.LoginResponse;
import com.gym.dto.MessageResponse;
import com.gym.dto.RegisterRequest;
import com.gym.dto.RegisterResponse;
import com.gym.entity.Goal;
import com.gym.entity.MemDetails;
import com.gym.entity.Role;
import com.gym.entity.User;
import com.gym.repository.GoalRepository;
import com.gym.repository.MemDetailsRepository;
import com.gym.repository.RoleRepository;
import com.gym.repository.UserRepository;
import com.gym.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private MemDetailsRepository memDetailsRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Integer MEMBER_RID = 3;

    // =====================
    // LOGIN
    // =====================
    public ResponseEntity<?> login(LoginRequest request) {

        Optional<User> userOpt = userRepository
                .findByEmailAndPasswd(request.getEmail(), request.getPassword());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Wrong Email or Password"));
        }

        User user = userOpt.get();
        String roleName = user.getRole().getRname().toUpperCase();

        String token = jwtUtil.generateToken(user.getUid(), user.getEmail(), roleName);

        return ResponseEntity.ok(new LoginResponse(
                token,
                user.getUid(),
                user.getUname(),
                user.getEmail(),
                roleName
        ));
    }

    // =====================
    // REGISTER (Members only)
    // =====================
    public ResponseEntity<?> register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Email already registered"));
        }

        if (request.getName() == null || request.getName().isEmpty() ||
            request.getEmail() == null || request.getEmail().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty() ||
            request.getPhone() == null || request.getPhone().isEmpty() ||
            request.getAge() == null ||
            request.getGender() == null || request.getGender().isEmpty() ||
            request.getGoalId() == null) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("All fields are required"));
        }

        // =====================
        // AGE VALIDATION
        // =====================
        if (request.getAge() <= 0 || request.getAge() > 120) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Please enter a valid age"));
        }

        Optional<Goal> goalOpt = goalRepository.findById(request.getGoalId());
        if (goalOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Invalid goal selected"));
        }

        Optional<Role> memberRoleOpt = roleRepository.findById(MEMBER_RID);
        if (memberRoleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Member role not configured in database"));
        }

        User newUser = new User();
        newUser.setUname(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPasswd(request.getPassword());
        newUser.setGender(request.getGender());
        newUser.setPh(request.getPhone());
        newUser.setRole(memberRoleOpt.get());
        newUser.setDob(LocalDate.now().minusYears(request.getAge()));

        userRepository.save(newUser);

        MemDetails memDetails = new MemDetails();
        memDetails.setUser(newUser);
        memDetails.setGoal(goalOpt.get());

        memDetailsRepository.save(memDetails);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(
                        "Registration successful",
                        newUser.getUid()
                ));
    }
}