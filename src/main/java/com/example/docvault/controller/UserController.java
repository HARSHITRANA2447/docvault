package com.example.docvault.controller;


import com.example.docvault.dto.AppDTOs;
import com.example.docvault.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<AppDTOs.DocumentDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        AppDTOs.DocumentDTO result = documentService.uploadDocument(file, userDetails.getUsername());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/documents")
    public ResponseEntity<List<AppDTOs.DocumentDTO>> getMyDocuments(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<AppDTOs.DocumentDTO> docs = documentService.getDocumentsByUser(userDetails.getUsername());
        return ResponseEntity.ok(docs);
    }
}