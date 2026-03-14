package com.example.docvault.service;

import com.example.docvault.dto.AppDTOs;
import com.example.docvault.entity.User;
import com.example.docvault.exception.AppException;
import com.example.docvault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<AppDTOs.UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AppDTOs.UserDTO updateUser(String id, AppDTOs.UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getRole() != null) user.setRole(request.getRole());

        return toDTO(userRepository.save(user));
    }

    private AppDTOs.UserDTO toDTO(User user) {
        return new AppDTOs.UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}