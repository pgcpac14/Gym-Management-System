package com.gym.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "goal")
@Data
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gid")
    private Integer gid;

    @Column(name = "gname")
    private String gname;
}
