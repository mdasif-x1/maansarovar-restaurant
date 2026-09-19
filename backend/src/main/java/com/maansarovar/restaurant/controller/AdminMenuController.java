package com.maansarovar.restaurant.controller;

import com.maansarovar.restaurant.dto.ApiResponse;
import com.maansarovar.restaurant.dto.MenuCategoryRequest;
import com.maansarovar.restaurant.dto.MenuItemRequest;
import com.maansarovar.restaurant.entity.FeaturedDish;
import com.maansarovar.restaurant.entity.MenuCategory;
import com.maansarovar.restaurant.entity.MenuItem;
import com.maansarovar.restaurant.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/menu")
@RequiredArgsConstructor
@Tag(name = "Admin Menu Management", description = "CRUD operations for Categories, Menu Items, and Featured Dishes")
public class AdminMenuController {

    private final MenuService menuService;

    // --- Categories ---
    @GetMapping("/categories")
    @Operation(summary = "Get all categories (including inactive)")
    public ResponseEntity<ApiResponse<List<MenuCategory>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllCategoriesAdmin()));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new menu category")
    public ResponseEntity<ApiResponse<MenuCategory>> createCategory(@Valid @RequestBody MenuCategoryRequest request) {
        MenuCategory created = menuService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Category created successfully"));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update an existing menu category")
    public ResponseEntity<ApiResponse<MenuCategory>> updateCategory(@PathVariable Long id, @Valid @RequestBody MenuCategoryRequest request) {
        MenuCategory updated = menuService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Category updated successfully"));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete a menu category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Category deleted successfully"));
    }

    // --- Menu Items ---
    @GetMapping("/items")
    @Operation(summary = "Get all menu items")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getAllMenuItems() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllMenuItemsAdmin()));
    }

    @PostMapping("/items")
    @Operation(summary = "Create a new menu item")
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItem created = menuService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Menu item created successfully"));
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Update a menu item")
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        MenuItem updated = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Menu item updated successfully"));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Delete a menu item")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Menu item deleted successfully"));
    }

    // --- Featured Dishes ---
    @PostMapping("/featured")
    @Operation(summary = "Add a menu item to featured list")
    public ResponseEntity<ApiResponse<FeaturedDish>> addFeaturedDish(
            @RequestParam Long menuItemId,
            @RequestParam(required = false) String subtitle,
            @RequestParam(required = false, defaultValue = "0") Integer displayOrder) {
        FeaturedDish created = menuService.addFeaturedDish(menuItemId, subtitle, displayOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Featured dish added"));
    }

    @DeleteMapping("/featured/{id}")
    @Operation(summary = "Remove a featured dish")
    public ResponseEntity<ApiResponse<Void>> removeFeaturedDish(@PathVariable Long id) {
        menuService.removeFeaturedDish(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Featured dish removed"));
    }
}
