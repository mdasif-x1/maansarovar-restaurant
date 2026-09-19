package com.maansarovar.restaurant.controller;

import com.maansarovar.restaurant.dto.ApiResponse;
import com.maansarovar.restaurant.dto.UploadResponse;
import com.maansarovar.restaurant.service.ImageUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/uploads")
@RequiredArgsConstructor
@Tag(name = "Admin Image Upload Management", description = "Secure image uploads, reference checks, and persistent file management")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUploadController {

    private final ImageUploadService uploadService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image file (JPG, PNG, WebP only, max 5MB)")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadImage(@RequestParam("file") MultipartFile file) {
        UploadResponse response = uploadService.storeImage(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Image uploaded successfully"));
    }

    @GetMapping("/check-reference/{filename}")
    @Operation(summary = "Check usage references before file deletion")
    public ResponseEntity<ApiResponse<List<String>>> checkReference(@PathVariable String filename) {
        List<String> references = uploadService.getFileReferences(filename);
        return ResponseEntity.ok(ApiResponse.ok(references, "Usage references retrieved"));
    }

    @DeleteMapping("/image/{filename}")
    @Operation(summary = "Delete uploaded image file if unreferenced")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable String filename) {
        uploadService.deleteImage(filename);
        return ResponseEntity.ok(ApiResponse.ok(null, "Image deleted successfully"));
    }
}
