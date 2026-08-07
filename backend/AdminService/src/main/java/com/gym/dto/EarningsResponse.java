package com.gym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class EarningsResponse {
    private BigDecimal lifetimeEarnings;
    private Long totalPayments;
    private BigDecimal monthlyEarnings;
    private Long monthlyPayments;
    private List<PackageBreakdown> breakdown;

    @Data
    @AllArgsConstructor
    public static class PackageBreakdown {
        private String packageName;
        private Integer durationMonths;
        private BigDecimal price;
        private Long membersCount;
        private BigDecimal totalEarned;
    }
}