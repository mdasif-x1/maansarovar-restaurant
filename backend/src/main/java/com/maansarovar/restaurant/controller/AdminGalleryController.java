package com.maansarovar.restaurant.controller;

import com.maansarovar.restaurant.dto.ApiResponse;
import com.maansarovar.restaurant.dto.GalleryImageRequest;
import com.maansarovar.restaurant.entity.GalleryImage;
import com.maansarovar.restaurant.service.GalleryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/gallery")
@RequiredArgsConstructor
@Tag(name = "Admin Gallery Management", description = "CRUD operations for gallery images and metadata")
public class AdminGalleryController {

    private final GalleryService galleryService;

    @GetMapping
    @Operation(summary = "Get all gallery images (including inactive)")
    public ResponseEntity<ApiResponse<List<GalleryImage>>> getAllImages() {
        return ResponseEntity.ok(ApiResponse.ok(galleryService.getAllImagesAdmin()));
    }

    @PostMapping
    @Operation(summary = "Create a new gallery image entry")
    public ResponseEntity<ApiResponse<GalleryImage>> createImage(@Valid @RequestBody GalleryImageRequest request) {
        GalleryImage created = galleryService.createImage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Gallery image added successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update gallery image metadata")
    public ResponseEntity<ApiResponse<GalleryImage>> updateImage(@PathVariable Long id, @Valid @RequestBody GalleryImageRequest request) {
        GalleryImage updated = galleryService.updateImage(id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Gallery image updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a gallery image entry")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable Long id) {
        galleryService.deleteImage(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Gallery image deleted successfully"));
    }
}
