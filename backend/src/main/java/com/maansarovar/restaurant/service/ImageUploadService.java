package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.UploadResponse;
import com.maansarovar.restaurant.entity.MenuItem;
import com.maansarovar.restaurant.entity.GalleryImage;
import com.maansarovar.restaurant.entity.RestaurantSettings;
import com.maansarovar.restaurant.repository.MenuItemRepository;
import com.maansarovar.restaurant.repository.GalleryImageRepository;
import com.maansarovar.restaurant.repository.RestaurantSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUploadService {

    @Value("${app.upload.dir:/app/uploads}")
    private String uploadDir;

    private final MenuItemRepository menuItemRepository;
    private final GalleryImageRepository galleryRepository;
    private final RestaurantSettingsRepository settingsRepository;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    public UploadResponse storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Upload file cannot be null or empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 5 MB.");
        }

        String detectedExtension = validateAndDetectFormat(file);

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
            log.info("Successfully stored uploaded image: {} ({} bytes)", publicUrl, file.getSize());

            return UploadResponse.builder()
                    .imageUrl(publicUrl)
                    .filename(safeFilename)
                    .contentType(file.getContentType())
                    .size(file.getSize())
                    .build();

        } catch (IOException e) {
            log.error("Failed to store uploaded file", e);
            throw new RuntimeException("Could not store file on server. Storage error.", e);
        }
    }

    public List<String> getFileReferences(String filename) {
        String safeFilename = Paths.get(filename).getFileName().toString();
        String imageUrl = "/uploads/" + safeFilename;

        List<String> references = new ArrayList<>();

        // Check Menu Items
        List<MenuItem> menuItems = menuItemRepository.findAll();
        for (MenuItem item : menuItems) {
            if (imageUrl.equalsIgnoreCase(item.getImageUrl())) {
                references.add("Menu Item: " + item.getName() + " (ID: " + item.getId() + ")");
            }
        }

        // Check Gallery Images
        List<GalleryImage> galleryImages = galleryRepository.findAll();
        for (GalleryImage img : galleryImages) {
            if (imageUrl.equalsIgnoreCase(img.getImageUrl())) {
                references.add("Gallery Photo: " + img.getTitle() + " (ID: " + img.getId() + ")");
            }
        }

        // Check Restaurant Settings
        List<RestaurantSettings> settings = settingsRepository.findAll();
        for (RestaurantSettings s : settings) {
            if (imageUrl.equalsIgnoreCase(s.getSettingValue())) {
                references.add("Setting Key: " + s.getSettingKey());
            }
        }

        return references;
    }

    public void deleteImage(String filename) {
        String safeFilename = Paths.get(filename).getFileName().toString();
        Path targetDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = targetDir.resolve(safeFilename).normalize();

        if (!filePath.getParent().equals(targetDir)) {
            throw new SecurityException("Attempted directory traversal in delete request.");
        }

        List<String> references = getFileReferences(safeFilename);
        if (!references.isEmpty()) {
            throw new IllegalStateException("Cannot delete file because it is currently in use by: " + String.join(", ", references));
        }

        try {
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Successfully deleted uploaded file: {}", safeFilename);
            } else {
                throw new IllegalArgumentException("File not found on server: " + safeFilename);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", safeFilename, e);
            throw new RuntimeException("Could not delete file from storage.", e);
        }
    }

    private String validateAndDetectFormat(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int bytesRead = is.read(header);
            if (bytesRead < 4) {
                throw new IllegalArgumentException("File header is corrupted or too short.");
            }

            // Check JPEG (FF D8 FF)
            if ((header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
                return ".jpg";
            }

            // Check PNG (89 50 4E 47)
            if ((header[0] & 0xFF) == 0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G') {
                return ".png";
            }

            // Check WebP (RIFF....WEBP)
            if (bytesRead >= 12 &&
                header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F' &&
                header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
                return ".webp";
            }

            throw new IllegalArgumentException("Invalid file format. Only JPEG, PNG, and WebP images are allowed.");

        } catch (IOException e) {
            throw new IllegalArgumentException("Unable to inspect file headers.", e);
        }
    }
}
