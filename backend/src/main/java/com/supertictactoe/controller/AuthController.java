package com.supertictactoe.controller;

import com.supertictactoe.dto.request.LoginRequest;
import com.supertictactoe.dto.request.RegisterRequest;
import com.supertictactoe.dto.response.AuthResponse;
import com.supertictactoe.security.JwtTokenProvider;
import com.supertictactoe.security.TokenBlacklist;
import com.supertictactoe.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private TokenBlacklist tokenBlacklist;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Server-side logout: revokes the JWT so it cannot be reused even if stolen.
     * The token is blacklisted until its natural expiry time.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            if (tokenProvider.validateToken(token)) {
                long expiryMs = System.currentTimeMillis() + jwtExpirationMs;
                tokenBlacklist.revoke(token, expiryMs);
            }
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
