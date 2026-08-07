package com.gym.service;

import com.gym.dto.*;
import com.gym.entity.*;
import com.gym.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private static final Integer TRAINER_RID = 2;
    private static final Integer MEMBER_RID = 3;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MemDetailsRepository memDetailsRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // =====================
    // GET ALL MEMBERS
    // =====================
    public ResponseEntity<?> getAllMembers() {

        List<User> members = userRepository.findByRole_Rid(MEMBER_RID);
        List<MemberResponse> responseList = new ArrayList<>();

        for (User user : members) {
            MemberResponse dto = new MemberResponse();
            dto.setClientId(user.getUid());
            dto.setName(user.getUname());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPh());
            dto.setGender(user.getGender());
            dto.setCreatedAt(null);

            if (user.getDob() != null) {
                dto.setAge(Period.between(user.getDob(), LocalDate.now()).getYears());
            }

            Optional<MemDetails> memOpt = memDetailsRepository.findByUser_Uid(user.getUid());
            if (memOpt.isPresent()) {
                MemDetails mem = memOpt.get();

                if (mem.getGoal() != null) {
                    dto.setGoalName(mem.getGoal().getGname());
                }
                if (mem.getPlan() != null) {
                    dto.setPackageName(mem.getPlan().getPname());
                    dto.setDurationMonths(mem.getPlan().getDuration());
                    dto.setPrice(mem.getPlan().getPrice().doubleValue());
                }
                if (mem.getTrainerType() != null) {
                    dto.setWantsPersonalTrainer("Personal Trainer".equals(mem.getTrainerType().getTtype()));
                    dto.setTrainerType(mem.getTrainerType().getTtype());
                }
                if (mem.getAssignedTrainer() != null) {
                    dto.setTrainerName(mem.getAssignedTrainer().getUname());
                }
                
                dto.setSubscriptionStart(mem.getSubscriptionStart());
                dto.setSubscriptionEnd(mem.getSubscriptionEnd());
                dto.setTrainerAssignedDate(mem.getTrainerAssignedDate());
                dto.setTrainerEndDate(mem.getSubscriptionEnd()); // trainer access follows membership period
            }

            responseList.add(dto);
        }

        return ResponseEntity.ok(responseList);
    }

    // =====================
    // GET ALL TRAINERS
    // =====================
    public ResponseEntity<?> getAllTrainers() {

        List<User> trainers = userRepository.findByRole_Rid(TRAINER_RID);
        List<TrainerResponse> responseList = new ArrayList<>();

        for (User user : trainers) {
            TrainerResponse dto = new TrainerResponse();
            dto.setTrainerId(user.getUid());
            dto.setName(user.getUname());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPh());
            dto.setSpecialization(null);
            dto.setCreatedAt(null);
            responseList.add(dto);
        }

        return ResponseEntity.ok(responseList);
    }

    // =====================
    // CREATE TRAINER
    // =====================
    public ResponseEntity<?> createTrainer(CreateTrainerRequest request) {

        if (request.getName() == null || request.getName().isEmpty() ||
            request.getEmail() == null || request.getEmail().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty() ||
            request.getPhone() == null || request.getPhone().isEmpty() ||
            request.getGender() == null || request.getGender().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("All fields are required"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Email already registered"));
        }

        Optional<Role> trainerRoleOpt = roleRepository.findById(TRAINER_RID);
        if (trainerRoleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Trainer role not configured in database"));
        }

        User trainer = new User();
        trainer.setUname(request.getName());
        trainer.setEmail(request.getEmail());
        trainer.setPasswd(request.getPassword());
        trainer.setPh(request.getPhone());
        trainer.setGender(request.getGender());
        trainer.setRole(trainerRoleOpt.get());

        userRepository.save(trainer);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Trainer account created successfully"));
    }

    // =====================
    // GET UNASSIGNED MEMBERS
    // =====================
    public ResponseEntity<?> getUnassignedMembers() {

        List<MemDetails> unassigned = memDetailsRepository
                .findByTrainerType_TtypeAndAssignedTrainerIsNull("Personal Trainer");

        List<UnassignedMemberResponse> responseList = new ArrayList<>();

        for (MemDetails mem : unassigned) {
            UnassignedMemberResponse dto = new UnassignedMemberResponse();
            User user = mem.getUser();
            dto.setClientId(user.getUid());
            dto.setName(user.getUname());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPh());

            if (mem.getGoal() != null) {
                dto.setGoalName(mem.getGoal().getGname());
            }
            if (mem.getPlan() != null) {
                dto.setPackageName(mem.getPlan().getPname());
            }

            responseList.add(dto);
        }

        return ResponseEntity.ok(responseList);
    }

    // =====================
    // GET ASSIGNED MEMBERS (for reassign/unassign)
    // =====================
    public ResponseEntity<?> getAssignedMembers() {

        List<MemDetails> assigned = memDetailsRepository
                .findByTrainerType_TtypeAndAssignedTrainerIsNotNull("Personal Trainer");

        List<AssignedMemberResponse> responseList = new ArrayList<>();

        for (MemDetails mem : assigned) {
            AssignedMemberResponse dto = new AssignedMemberResponse();
            User user = mem.getUser();
            dto.setClientId(user.getUid());
            dto.setName(user.getUname());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPh());

            if (mem.getGoal() != null) {
                dto.setGoalName(mem.getGoal().getGname());
            }
            if (mem.getPlan() != null) {
                dto.setPackageName(mem.getPlan().getPname());
            }
            if (mem.getAssignedTrainer() != null) {
                dto.setTrainerName(mem.getAssignedTrainer().getUname());
            }

            responseList.add(dto);
        }

        return ResponseEntity.ok(responseList);
    }

    // =====================
    // ASSIGN TRAINER (also used for reassigning — simply overwrites)
    // =====================
    public ResponseEntity<?> assignTrainer(AssignTrainerRequest request) {

        Optional<MemDetails> memOpt = memDetailsRepository.findByUser_Uid(request.getClientId());
        if (memOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Member not found"));
        }

        Optional<User> trainerOpt = userRepository.findById(request.getTrainerId());
        if (trainerOpt.isEmpty() || !TRAINER_RID.equals(trainerOpt.get().getRole().getRid())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Trainer not found"));
        }

        MemDetails mem = memOpt.get();
        mem.setAssignedTrainer(trainerOpt.get());
        mem.setTrainerAssignedDate(LocalDate.now());
        mem.setTrainerEndDate(LocalDate.now().plusMonths(1)); // trainer coverage is always fixed 1 month
        memDetailsRepository.save(mem);

        return ResponseEntity.ok(new MessageResponse("Trainer assigned successfully"));
    }

    // =====================
    // UNASSIGN TRAINER
    // =====================
    public ResponseEntity<?> unassignTrainer(UnassignTrainerRequest request) {

        Optional<MemDetails> memOpt = memDetailsRepository.findByUser_Uid(request.getClientId());
        if (memOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Member not found"));
        }

        MemDetails mem = memOpt.get();
        if (mem.getAssignedTrainer() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("This member has no trainer assigned"));
        }

        mem.setAssignedTrainer(null);
        mem.setTrainerAssignedDate(null);
        mem.setTrainerEndDate(null);
        memDetailsRepository.save(mem);

        return ResponseEntity.ok(new MessageResponse("Trainer unassigned successfully"));
    }

    // =====================
    // GET EARNINGS
    // =====================
    public ResponseEntity<?> getEarnings() {

        BigDecimal lifetimeEarnings = paymentRepository.getTotalLifetimeEarnings();
        Long totalPayments = paymentRepository.count();
        BigDecimal monthlyEarnings = paymentRepository.getTotalMonthlyEarnings();
        Long monthlyPayments = paymentRepository.getMonthlyPaymentCount();

        List<EarningsResponse.PackageBreakdown> breakdown = new ArrayList<>();
        List<Plan> plans = planRepository.findAll();

        for (Plan plan : plans) {
            List<MemDetails> membersOnPlan = memDetailsRepository.findByPlan_Pid(plan.getPid());

            long count = membersOnPlan.size();
            BigDecimal total = membersOnPlan.stream()
                    .flatMap(m -> paymentRepository.findAll().stream()
                            .filter(p -> p.getMemDetails().getMid().equals(m.getMid())))
                    .map(Payment::getCharges)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            breakdown.add(new EarningsResponse.PackageBreakdown(
                    plan.getPname(),
                    plan.getDuration(),
                    plan.getPrice(),
                    count,
                    total
            ));
        }

        return ResponseEntity.ok(new EarningsResponse(
                lifetimeEarnings,
                totalPayments,
                monthlyEarnings,
                monthlyPayments,
                breakdown
        ));
    }
}