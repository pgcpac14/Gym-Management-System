package com.gym.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    // NOTE: Actual JWT validation and role-based authorization is handled by
    // JwtAuthenticationFilter (a GlobalFilter) in the filter package below, not here.
    // We intentionally permitAll() at the Spring Security layer and disable its
    // built-in auth mechanism, otherwise it would block requests BEFORE our custom
    // filter ever runs, and we'd need a full ReactiveAuthenticationManager just to
    // duplicate what the GlobalFilter already does.
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges.anyExchange().permitAll())
                .build();
    }
}
