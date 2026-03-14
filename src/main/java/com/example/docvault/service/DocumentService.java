package com.example.docvault.service;

import com.example.docvault.dto.AppDTOs;
import com.example.docvault.entity.UploadedDocument;
import com.example.docvault.exception.AppException;
import com.example.docvault.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final FileStorageService fileStorageService;
    private final TextExtractionService textExtractionService;
    private final AiSummaryService aiSummaryService;

    public AppDTOs.DocumentDTO uploadDocument(MultipartFile file, String userEmail) {
        // 1. Store file
        String filePath = fileStorageService.storeFile(file);

        // 2. Extract text
        String extractedText = textExtractionService.extractText(file);

        // 3. Get AI summary
        String summary = aiSummaryService.summarize(extractedText);

        // 4. Save to MongoDB
        UploadedDocument document = UploadedDocument.builder()
                .fileName(file.getOriginalFilename())
                .filePath(filePath)
                .uploadedBy(userEmail)
                .summary(summary)
                .uploadedAt(LocalDateTime.now())
                .build();

        UploadedDocument saved = documentRepository.save(document);
        return toDTO(saved);
    }

    public List<AppDTOs.DocumentDTO> getDocumentsByUser(String userEmail) {
        return documentRepository.findByUploadedBy(userEmail)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AppDTOs.DocumentDTO> getAllDocuments() {
        return documentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AppDTOs.DocumentDTO updateDocument(String id, AppDTOs.UpdateDocumentRequest request) {
        UploadedDocument document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found"));

        if (request.getFileName() != null) document.setFileName(request.getFileName());
        if (request.getSummary() != null) document.setSummary(request.getSummary());

        return toDTO(documentRepository.save(document));
    }

    private AppDTOs.DocumentDTO toDTO(UploadedDocument doc) {
        return new AppDTOs.DocumentDTO(
                doc.getId(),
                doc.getFileName(),
                doc.getFilePath(),
                doc.getUploadedBy(),
                doc.getSummary(),
                doc.getUploadedAt()
        );
    }
}