package com.example.docvault.entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "documents")
public class UploadedDocument {

    @Id
    private String id;

    private String fileName;

    private String filePath;

    private String uploadedBy; // user email

    private String summary;

    private LocalDateTime uploadedAt;
}
