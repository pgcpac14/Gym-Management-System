package com.gym.repository;
import com.gym.entity.MemDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemDetailsRepository extends JpaRepository<MemDetails, Integer> {
    Optional<MemDetails> findByUser_Uid(Integer uid);
    List<MemDetails> findByTrainerType_TtypeAndAssignedTrainerIsNull(String ttype);
    List<MemDetails> findByTrainerType_TtypeAndAssignedTrainerIsNotNull(String ttype);
    List<MemDetails> findByPlan_Pid(Integer pid);
}