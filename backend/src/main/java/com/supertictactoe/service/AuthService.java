package com.supertictactoe.service;

import com.supertictactoe.dto.request.LoginRequest;
import com.supertictactoe.dto.request.RegisterRequest;
import com.supertictactoe.dto.response.AuthResponse;
import com.supertictactoe.model.entity.User;
import com.supertictactoe.model.entity.UserStat;
import com.supertictactoe.repository.UserRepository;
import com.supertictactoe.repository.UserStatRepository;
import com.supertictactoe.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserStatRepository userStatRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email address is already in use!");
        }

        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword())
        );

        User savedUser = userRepository.save(user);

        UserStat userStat = new UserStat(savedUser);
        userStatRepository.save(userStat);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getUsername(),
                        registerRequest.getPassword()
                )
        );

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, savedUser.getUsername(), savedUser.getEmail(), "User registered successfully!");
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getPassword()
                    )
            );

            String token = tokenProvider.generateToken(authentication);

            // Only look up user AFTER authentication succeeds — no enumeration risk here
            User user = userRepository.findByUsernameOrEmail(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getUsernameOrEmail())
                    .orElseThrow(() -> new RuntimeException("Authentication error"));

            return new AuthResponse(token, user.getUsername(), user.getEmail(), "Login successful!");

        } catch (BadCredentialsException ex) {
            // Return a generic error — never reveal whether the username exists or not
            throw new RuntimeException("Invalid username or password");
        }
    }
}
