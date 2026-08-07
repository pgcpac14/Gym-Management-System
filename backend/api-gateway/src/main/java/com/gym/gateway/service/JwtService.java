package com.gym.gateway.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

    // MUST be identical to the SECRET used in JwtUtil.java in all 4 microservices,
    // otherwise a token issued by auth-service will not validate here.
    private static final String SECRET = "gymManagementSystemSuperSecretKeyForJWTSigning123456";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        // adjust the claim key here if your JwtUtil uses a different claim name for email/username
        Claims claims = extractAllClaims(token);
        Object email = claims.get("email");
        return email != null ? email.toString() : claims.getSubject();
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        Object role = claims.get("role");
        return role != null ? role.toString() : null;
    }
}
