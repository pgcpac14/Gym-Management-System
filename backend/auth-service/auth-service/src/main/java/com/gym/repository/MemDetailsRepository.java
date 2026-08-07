package com.gym.repository;

import com.gym.entity.MemDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemDetailsRepository extends JpaRepository<MemDetails, Integer> {
}
