package com.example.docvault.config;  // ✅ matches your project

import com.example.docvault.entity.User;
import com.example.docvault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@docvault.com";

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("✅ Admin already exists — skipping seed.");
            return;
        }

        User admin = User.builder()
                .name("Admin User")
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .build();

        userRepository.save(admin);
        log.info("✅ Admin user created → email: {} | password: admin123", adminEmail);
    }
}