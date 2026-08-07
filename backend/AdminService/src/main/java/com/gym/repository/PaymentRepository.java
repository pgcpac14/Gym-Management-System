package com.gym.repository;
import com.gym.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT COALESCE(SUM(p.charges),0) FROM Payment p")
    BigDecimal getTotalLifetimeEarnings();

    @Query(value = "SELECT COALESCE(SUM(charges),0) FROM payment " +
            "WHERE MONTH(payment_date) = MONTH(CURRENT_DATE()) " +
            "AND YEAR(payment_date) = YEAR(CURRENT_DATE())", nativeQuery = true)
    BigDecimal getTotalMonthlyEarnings();

    @Query(value = "SELECT COUNT(*) FROM payment " +
            "WHERE MONTH(payment_date) = MONTH(CURRENT_DATE()) " +
            "AND YEAR(payment_date) = YEAR(CURRENT_DATE())", nativeQuery = true)
    Long getMonthlyPaymentCount();
}