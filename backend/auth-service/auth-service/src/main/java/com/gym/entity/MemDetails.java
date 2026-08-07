package com.gym.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "mem_details")
@Data
public class MemDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mid")
    private Integer mid;

    @ManyToOne
    @JoinColumn(name = "uid")
    private User user;

    @ManyToOne
    @JoinColumn(name = "gid")
    private Goal goal;

    @ManyToOne
    @JoinColumn(name = "pid")
    private Plan plan;

    @ManyToOne
    @JoinColumn(name = "trainer_type_id")
    private TrainerType trainerType;

    @Column(name = "fees")
    private BigDecimal fees;

    @ManyToOne
    @JoinColumn(name = "diet_plan_id")
    private DietPlan dietPlan;

    @ManyToOne
    @JoinColumn(name = "workout_plan_id")
    private WorkoutPlan workoutPlan;

    @ManyToOne
    @JoinColumn(name = "trainer_uid")
    private User assignedTrainer;

    @Column(name = "subscription_start")
    private LocalDate subscriptionStart;

    @Column(name = "subscription_end")
    private LocalDate subscriptionEnd;
}
