package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
@ConditionalOnProperty(name = "app.image-storage.provider", havingValue = "cloudinary")
@RequiredArgsConstructor
@Slf4j
public class CloudinaryImageStorageService implements ImageStorageService {

    @Value("${app.cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${app.cloudinary.api-key:}")
    private String apiKey;

    @Value("${app.cloudinary.api-secret:}")
    private String apiSecret;

    @Value("${app.cloudinary.upload-preset:}")
    private String uploadPreset;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public UploadResponse storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Upload file cannot be null or empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 5 MB.");
        }

        String detectedExtension = ImageValidationUtils.validateAndDetectFormat(file);

        if (cloudName == null || cloudName.isBlank()) {
            throw freshConfigurationException("Cloudinary cloud name is missing.");
        }

        try {
            String safePublicId = "maansarovar_" + UUID.randomUUID();
            String uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload" + detectedExtension;
                }
            };

            body.add("file", fileResource);
            body.add("public_id", safePublicId);
            body.add("folder", "maansarovar");

            if (uploadPreset != null && !uploadPreset.isBlank()) {
                body.add("upload_preset", uploadPreset);
            } else if (apiKey != null && !apiKey.isBlank() && apiSecret != null && !apiSecret.isBlank()) {
                long timestamp = System.currentTimeMillis() / 1000L;
                body.add("api_key", apiKey);
                body.add("timestamp", String.valueOf(timestamp));

                Map<String, String> paramsToSign = new TreeMap<>();
                paramsToSign.put("folder", "maansarovar");
                paramsToSign.put("public_id", safePublicId);
                paramsToSign.put("timestamp", String.valueOf(timestamp));

                String signature = generateSignature(paramsToSign, apiSecret);
                body.add("signature", signature);
            } else {
                throw freshConfigurationException("Neither Cloudinary upload_preset nor api_key/api_secret pair is configured.");
            }

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map responseBody = response.getBody();
                String secureUrl = (String) responseBody.get("secure_url");
                String returnedPublicId = (String) responseBody.get("public_id");

                log.info("Successfully uploaded image to Cloudinary (public_id: {})", returnedPublicId);

                return UploadResponse.builder()
                        .imageUrl(secureUrl)
                        .filename(returnedPublicId)
                        .contentType(file.getContentType())
                        .size(file.getSize())
                        .build();
            } else {
                log.error("Cloudinary upload returned non-2xx status code");
                throw new RuntimeException("External image storage service returned an error response.");
            }

        } catch (IOException e) {
            log.error("Failed to read image byte content for Cloudinary upload", e);
            throw new RuntimeException("Could not read uploaded image file.", e);
        } catch (Exception e) {
            log.error("Cloudinary upload request failed", e);
            throw new RuntimeException("External image storage upload failed.", e);
        }
    }

    @Override
    public void deleteImage(String publicIdOrFilename) {
        if (publicIdOrFilename == null || publicIdOrFilename.isBlank()) {
            throw new IllegalArgumentException("Image identifier cannot be null or empty.");
        }

        if (apiKey == null || apiKey.isBlank() || apiSecret == null || apiSecret.isBlank()) {
            log.warn("Cloudinary API key or Secret missing; skipping remote Cloudinary destruction for: {}", publicIdOrFilename);
            return;
        }

        try {
            String destroyUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/destroy";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            long timestamp = System.currentTimeMillis() / 1000L;
            Map<String, String> paramsToSign = new TreeMap<>();
            paramsToSign.put("public_id", publicIdOrFilename);
            paramsToSign.put("timestamp", String.valueOf(timestamp));

            String signature = generateSignature(paramsToSign, apiSecret);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("public_id", publicIdOrFilename);
            body.add("api_key", apiKey);
            body.add("timestamp", String.valueOf(timestamp));
            body.add("signature", signature);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(destroyUrl, HttpMethod.POST, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Successfully deleted image from Cloudinary (public_id: {})", publicIdOrFilename);
            } else {
                log.error("Cloudinary delete returned non-2xx status code for public_id: {}", publicIdOrFilename);
            }
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary (public_id: {})", publicIdOrFilename, e);
            throw new RuntimeException("External image deletion failed.", e);
        }
    }

    private String generateSignature(Map<String, String> params, String secret) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (sb.length() > 0) sb.append("&");
            sb.append(entry.getKey()).append("=").append(entry.getValue());
        }
        sb.append(secret);

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : digest) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-1 digest algorithm not available", e);
        }
    }

    private IllegalStateException freshConfigurationException(String msg) {
        log.error("Cloudinary Configuration Error: {}", msg);
        return new IllegalStateException("Cloudinary storage provider is selected but improperly configured.");
    }
}
