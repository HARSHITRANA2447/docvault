package com.example.docvault.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiSummaryService {

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String summarize(String text) {
        // If no real API key is configured, return a placeholder
        if (apiKey == null || apiKey.equals("YOUR_OPENAI_API_KEY_HERE") || apiKey.isBlank()) {
            return generatePlaceholderSummary(text);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> message = Map.of(
                    "role", "user",
                    "content", "Please summarize the following text in 3-5 sentences:\n\n" + text
            );

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(message),
                    "max_tokens", 300
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, String> messageResponse = (Map<String, String>) firstChoice.get("message");
                return messageResponse.get("content");
            }

            return "Summary unavailable.";
        } catch (Exception e) {
            return "Summary generation failed: " + e.getMessage();
        }
    }

    private String generatePlaceholderSummary(String text) {
        int wordCount = text.split("\\s+").length;
        int charCount = text.length();
        return String.format(
                "[AI PLACEHOLDER SUMMARY] Document contains approximately %d words and %d characters. " +
                        "To enable real AI summaries, add your OpenAI API key to application.properties (ai.api.key).",
                wordCount, charCount
        );
    }
}