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

    private final ImageStorageService activeStorageService;
    private final MenuItemRepository menuItemRepository;
    private final GalleryImageRepository galleryRepository;
    private final RestaurantSettingsRepository settingsRepository;

    public UploadResponse storeImage(MultipartFile file) {
        return activeStorageService.storeImage(file);
    }

    public List<String> getFileReferences(String filename) {
        String safeFilename = Paths.get(filename).getFileName().toString();
        List<String> references = new ArrayList<>();

        // Check Menu Items
        List<MenuItem> menuItems = menuItemRepository.findAll();
        for (MenuItem item : menuItems) {
            if (item.getImageUrl() != null && item.getImageUrl().contains(safeFilename)) {
                references.add("Menu Item: " + item.getName() + " (ID: " + item.getId() + ")");
            }
        }

        // Check Gallery Images
        List<GalleryImage> galleryImages = galleryRepository.findAll();
        for (GalleryImage img : galleryImages) {
            if (img.getImageUrl() != null && img.getImageUrl().contains(safeFilename)) {
                references.add("Gallery Photo: " + img.getTitle() + " (ID: " + img.getId() + ")");
            }
        }

        // Check Restaurant Settings
        List<RestaurantSettings> settings = settingsRepository.findAll();
        for (RestaurantSettings s : settings) {
            if (s.getSettingValue() != null && s.getSettingValue().contains(safeFilename)) {
                references.add("Setting Key: " + s.getSettingKey());
            }
        }

        return references;
    }

    public void deleteImage(String filename) {
        String safeFilename = Paths.get(filename).getFileName().toString();
        List<String> references = getFileReferences(safeFilename);
        if (!references.isEmpty()) {
            throw new IllegalStateException("Cannot delete file because it is currently in use by: " + String.join(", ", references));
        }

        activeStorageService.deleteImage(safeFilename);
    }
}

