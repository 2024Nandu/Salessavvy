
package com.example.demo.filter;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class AuthenticationFilter implements Filter {

    private static final Logger logger =
            LoggerFactory.getLogger(AuthenticationFilter.class);

    private final AuthService authService;
    private final UserRepository userRepository;

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175"
    );

    private static final String[] UNAUTHENTICATED_PATHS = {
            "/api/users/register",
            "/api/auth/login"
    };

    public AuthenticationFilter(
            AuthService authService,
            UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest =
                (HttpServletRequest) request;
        HttpServletResponse httpResponse =
                (HttpServletResponse) response;

        try {
            executeFilterLogic(httpRequest, httpResponse, chain);
        } catch (Exception e) {
            logger.error("Unexpected error in AuthenticationFilter", e);

            if (!httpResponse.isCommitted()) {
                sendErrorResponse(
                        httpResponse,
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "Internal server error"
                );
            }
        }
    }

    private void executeFilterLogic(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        // Add CORS headers before authentication and error handling.
        setCORSHeaders(request, response);

        String requestURI = request.getRequestURI();

        logger.info(
                "Request: {} {}",
                request.getMethod(),
                requestURI
        );

        // Browser preflight requests must not require a JWT.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Keep registration and login accessible without an existing token.
        if (Arrays.asList(UNAUTHENTICATED_PATHS).contains(requestURI)) {
            chain.doFilter(request, response);
            return;
        }

        // Authenticate using the existing HttpOnly authToken cookie.
        String token = getAuthTokenFromCookies(request);

        if (token == null || !authService.validateToken(token)) {
            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: Invalid or missing token"
            );
            return;
        }

        String username = authService.extractUsername(token);

        Optional<User> userOptional =
                userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: User not found"
            );
            return;
        }

        User authenticatedUser = userOptional.get();
        Role role = authenticatedUser.getRole();

        logger.info(
                "Authenticated user: {}, role: {}",
                username,
                role
        );

        // Admin endpoints remain restricted to administrators.
        if (requestURI.startsWith("/admin/")
                && role != Role.ADMIN) {
            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Forbidden: Admin access required"
            );
            return;
        }

        // Preserve the existing customer-only API policy.
        if (requestURI.startsWith("/api/")
                && role != Role.CUSTOMER) {
            sendErrorResponse(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Forbidden: Customer access required"
            );
            return;
        }

        request.setAttribute("authenticatedUser", authenticatedUser);

        chain.doFilter(request, response);
    }

    private void setCORSHeaders(
            HttpServletRequest request,
            HttpServletResponse response) {

        String origin = request.getHeader("Origin");

        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Vary", "Origin");
            response.setHeader(
                    "Access-Control-Allow-Credentials",
                    "true"
            );
            response.setHeader(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PUT, DELETE, OPTIONS"
            );
            response.setHeader(
                    "Access-Control-Allow-Headers",
                    "Content-Type, Authorization, X-Requested-With"
            );
            response.setHeader("Access-Control-Max-Age", "3600");
        }
    }

    private void sendErrorResponse(
            HttpServletResponse response,
            int statusCode,
            String message) throws IOException {

        response.setStatus(statusCode);
        response.setContentType("text/plain;charset=UTF-8");
        response.getWriter().write(message);
    }

    private String getAuthTokenFromCookies(
            HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> "authToken".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
