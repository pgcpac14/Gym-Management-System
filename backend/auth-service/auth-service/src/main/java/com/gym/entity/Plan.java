package com.gym.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "plan")
@Data
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pid")
    private Integer pid;

    @Column(name = "pname")
    private String pname;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "duration")
    private Integer duration;
}
