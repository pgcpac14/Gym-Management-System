package com.gym.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "diet_plan")
@Data
public class DietPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_plan_id")
    private Integer dietPlanId;

    @ManyToOne
    @JoinColumn(name = "gid")
    private Goal goal;

    @Column(name = "description")
    private String description;
}
