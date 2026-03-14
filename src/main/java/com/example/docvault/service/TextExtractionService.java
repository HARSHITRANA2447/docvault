package com.example.docvault.service;

import com.example.docvault.exception.AppException;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class TextExtractionService {

    private final Tika tika = new Tika();

    public String extractText(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            String text = tika.parseToString(inputStream);
            // Limit to first 3000 characters to avoid huge AI prompts
            if (text.length() > 3000) {
                text = text.substring(0, 3000);
            }
            return text;
        } catch (Exception e) {
            throw new AppException("Failed to extract text from file: " + e.getMessage());
        }
    }
}