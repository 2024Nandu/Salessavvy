
        package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.security.Key;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.JWTToken;
import com.example.demo.entity.User;
import com.example.demo.repository.JWTTokenRepository;
import com.example.demo.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {

    private final Key SIGNING_KEY;

    private final UserRepository userRepository;
    private final JWTTokenRepository jwtTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            JWTTokenRepository jwtTokenRepository,
            @Value("${jwt.secret}") String jwtSecret) {

        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();

        // HS512 requires a sufficiently long secret key.
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
            throw new IllegalArgumentException(
                    "JWT_SECRET in application.properties must be at least 64 bytes long for HS512.");
        }

        this.SIGNING_KEY = Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    public String generateToken(User user) {
        LocalDateTime now = LocalDateTime.now();

        JWTToken existingToken =
                jwtTokenRepository.findByUserId(user.getUserId());

        // Reuse an existing token only if its database expiry is valid.
        if (existingToken != null
                && now.isBefore(existingToken.getExpiresAt())) {

            return existingToken.getToken();
        }

        // Remove the expired token before creating a new one.
        if (existingToken != null) {
            jwtTokenRepository.delete(existingToken);
        }

        String token = generateNewToken(user);
        saveToken(user, token);

        return token;
    }

    private String generateNewToken(User user) {
        long expirationMillis = 24L * 60 * 60 * 1000;

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(
                        System.currentTimeMillis() + expirationMillis))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public void saveToken(User user, String token) {
        // Keep database expiry aligned with the 24-hour JWT expiry.
        JWTToken jwtToken = new JWTToken(
                user,
                token,
                LocalDateTime.now().plusHours(24));

        jwtTokenRepository.save(jwtToken);
    }

    public void logout(User user) {
        jwtTokenRepository.deleteByUserId(user.getUserId());
    }

    public boolean validateToken(String token) {
        try {
            // Validate the JWT signature and its built-in expiration.
            Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token);

            // Confirm that the token also exists in the database.
            Optional<JWTToken> jwtToken =
                    jwtTokenRepository.findByToken(token);

            if (jwtToken.isPresent()) {
                LocalDateTime currentTime = LocalDateTime.now();
                LocalDateTime expiry =
                        jwtToken.get().getExpiresAt();

                System.err.println("Token Expiry: " + expiry);
                System.err.println("Current Time: " + currentTime);

                return expiry != null && expiry.isAfter(currentTime);
            }

            return false;

        } catch (Exception e) {
            System.err.println(
                    "Token validation failed: " + e.getMessage());
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}