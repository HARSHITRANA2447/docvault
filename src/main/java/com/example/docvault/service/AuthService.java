package com.example.docvault.service;


import com.example.docvault.dto.AuthDTOs;
import com.example.docvault.entity.User;
import com.example.docvault.exception.AppException;
import com.example.docvault.repository.UserRepository;
import com.example.docvault.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthDTOs.AuthResponse signup(AuthDTOs.SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthDTOs.AuthResponse(token, user.getRole(), user.getEmail());
    }

    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthDTOs.AuthResponse(token, user.getRole(), user.getEmail());
    }
}