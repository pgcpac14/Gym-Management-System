package com.gym.gateway.filter;

import com.gym.gateway.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Autowired
    private JwtService jwtService;

    // ==========================
    // Public URLs - no token required
    // ==========================
    private static final List<String> PUBLIC_URLS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/subscription/goals",
            "/api/subscription/packages",
            "/api/subscription/generate-diet-plan"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Allow CORS preflight straight through
        if (request.getMethod() != null && request.getMethod().name().equals("OPTIONS")) {
            return chain.filter(exchange);
        }

        if (PUBLIC_URLS.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        // ==========================
        // Read Authorization Header
        // ==========================
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        // ==========================
        // Validate JWT
        // ==========================
        if (!jwtService.isTokenValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // ==========================
        // Extract Claims
        // ==========================
        String username = jwtService.extractUsername(token);
        String role = jwtService.extractRole(token);
        System.out.println("Gateway - User: " + username + " | Role: " + role);

        if (role == null) {
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            return exchange.getResponse().setComplete();
        }

        // ==========================
        // Coarse Authorization matching the 4 gym microservices
        // ==========================
        if (path.startsWith("/api/admin")) {
            if (!role.equalsIgnoreCase("ADMIN")) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }

        if (path.startsWith("/api/trainer")) {
            if (!role.equalsIgnoreCase("TRAINER")) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }

        // /api/member/** and non-public /api/subscription/** both belong to member-service
        if (path.startsWith("/api/member") || path.startsWith("/api/subscription")) {
            if (!role.equalsIgnoreCase("MEMBER")) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }

        // ==========================
        // Forward request downstream
        // ==========================
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // run before routing
    }
}
