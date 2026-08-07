package com.gym.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_no")
    private Integer billNo;

    @ManyToOne
    @JoinColumn(name = "mid")
    private MemDetails memDetails;

    @Column(name = "charges")
    private BigDecimal charges;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
}