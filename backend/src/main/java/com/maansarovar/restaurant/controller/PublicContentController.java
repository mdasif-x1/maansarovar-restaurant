package com.maansarovar.restaurant.controller;

import com.maansarovar.restaurant.dto.ApiResponse;
import com.maansarovar.restaurant.entity.*;
import com.maansarovar.restaurant.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@Tag(name = "Public Content", description = "Public endpoints for Menu, Gallery, Settings, and Testimonials")
public class PublicContentController {

    private final MenuService menuService;
    private final GalleryService galleryService;
    private final SettingsService settingsService;
    private final TestimonialService testimonialService;

    @GetMapping("/settings")
    @Operation(summary = "Get all public restaurant settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok(settingsService.getAllSettings()));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all active menu categories")
    public ResponseEntity<ApiResponse<List<MenuCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllActiveCategories()));
    }

    @GetMapping("/menu")
    @Operation(summary = "Get all available menu items")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenuItems(
            @RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuItemsByCategory(categoryId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllAvailableMenuItems()));
    }

    @GetMapping("/featured-dishes")
    @Operation(summary = "Get featured dishes for homepage")
    public ResponseEntity<ApiResponse<List<FeaturedDish>>> getFeaturedDishes() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getFeaturedDishes()));
    }

    @GetMapping("/gallery")
    @Operation(summary = "Get active gallery images by category")
    public ResponseEntity<ApiResponse<List<GalleryImage>>> getGallery(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok(galleryService.getPublicGallery(category)));
    }

    @GetMapping("/gallery/paged")
    @Operation(summary = "Get paged active gallery images")
    public ResponseEntity<ApiResponse<Page<GalleryImage>>> getGalleryPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.ok(galleryService.getGalleryPaged(page, size)));
    }

    @GetMapping("/testimonials")
    @Operation(summary = "Get approved testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getTestimonials() {
        return ResponseEntity.ok(ApiResponse.ok(testimonialService.getApprovedTestimonials()));
    }
}
