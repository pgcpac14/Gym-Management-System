package com.gym.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    // NOTE: the lb://XXXX names below must exactly match (case-insensitive)
    // the spring.application.name set in each microservice's application.properties.
    // e.g. auth-service must have: spring.application.name=authservice

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service",
                        r -> r.path("/api/auth/**")
                                .uri("lb://AUTHSERVICE"))
                .route("admin-service",
                        r -> r.path("/api/admin/**")
                                .uri("lb://ADMINSERVICE"))
                .route("trainer-service",
                        r -> r.path("/api/trainer/**")
                                .uri("lb://TRAINERSERVICE"))
                .route("member-service-subscription",
                        r -> r.path("/api/subscription/**")
                                .uri("lb://MEMBERSERVICE"))
                .route("member-service-member",
                        r -> r.path("/api/member/**")
                                .uri("lb://MEMBERSERVICE"))
                .build();
    }
}
