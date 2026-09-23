package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "app.image-storage.provider", havingValue = "local", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class LocalImageStorageService implements ImageStorageService {

    @Value("${app.upload.dir:/app/uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    @Override
    public UploadResponse storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Upload file cannot be null or empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 5 MB.");
        }

        String detectedExtension = ImageValidationUtils.validateAndDetectFormat(file);

        try {
            Path targetDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            String safeFilename = UUID.randomUUID().toString() + detectedExtension;
            Path destination = targetDir.resolve(safeFilename).normalize();

            if (!destination.getParent().equals(targetDir)) {
                throw new SecurityException("Target file path is outside the designated upload directory.");
            }

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String publicUrl = "/uploads/" + safeFilename;
            log.info("Successfully stored uploaded local image: {} ({} bytes)", publicUrl, file.getSize());

            return UploadResponse.builder()
                    .imageUrl(publicUrl)
                    .filename(safeFilename)
                    .contentType(file.getContentType())
                    .size(file.getSize())
                    .build();

        } catch (IOException e) {
            log.error("Failed to store uploaded local file", e);
            throw new RuntimeException("Could not store file on local server storage.", e);
        }
    }

    @Override
    public void deleteImage(String filename) {
        String safeFilename = Paths.get(filename).getFileName().toString();
        Path targetDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = targetDir.resolve(safeFilename).normalize();

        if (!filePath.getParent().equals(targetDir)) {
            throw new SecurityException("Attempted directory traversal in delete request.");
        }

        try {
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Successfully deleted uploaded local file: {}", safeFilename);
            } else {
                throw new IllegalArgumentException("File not found on local storage: " + safeFilename);
            }
        } catch (IOException e) {
            log.error("Error deleting local file: {}", safeFilename, e);
            throw new RuntimeException("Could not delete file from local storage.", e);
        }
    }
}
