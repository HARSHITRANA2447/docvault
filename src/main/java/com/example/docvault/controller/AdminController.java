package com.example.docvault.controller;

import com.example.docvault.dto.AppDTOs;
import com.example.docvault.service.AdminService;
import com.example.docvault.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final DocumentService documentService;

    @GetMapping("/users")
    public ResponseEntity<List<AppDTOs.UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/documents")
    public ResponseEntity<List<AppDTOs.DocumentDTO>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<AppDTOs.UserDTO> updateUser(
            @PathVariable String id,
            @RequestBody AppDTOs.UpdateUserRequest request) {

        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    @PutMapping("/document/{id}")
    public ResponseEntity<AppDTOs.DocumentDTO> updateDocument(
            @PathVariable String id,
            @RequestBody AppDTOs.UpdateDocumentRequest request) {

        return ResponseEntity.ok(documentService.updateDocument(id, request));
    }
}