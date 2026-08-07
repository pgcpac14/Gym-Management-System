package com.gym.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "workout_plan")
@Data
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wo_pid")
    private Integer woPid;

    @Column(name = "wname")
    private String wname;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "gid")
    private Goal goal;
}