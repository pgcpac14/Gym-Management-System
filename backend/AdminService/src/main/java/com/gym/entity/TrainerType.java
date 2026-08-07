package com.gym.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "trainer_type")
@Data
public class TrainerType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trainer_type_id")
    private Integer trainerTypeId;

    @Column(name = "ttype")
    private String ttype;

    @Column(name = "charges")
    private BigDecimal charges;
}