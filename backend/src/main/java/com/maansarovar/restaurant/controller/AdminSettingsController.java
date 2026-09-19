package com.maansarovar.restaurant.controller;

import com.maansarovar.restaurant.dto.ApiResponse;
import com.maansarovar.restaurant.dto.SettingsUpdateRequest;
import com.maansarovar.restaurant.service.SettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
@Tag(name = "Admin Settings Management", description = "Update restaurant key-value configurations and home content")
public class AdminSettingsController {

    private final SettingsService settingsService;

    @PutMapping
    @Operation(summary = "Update restaurant key-value settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> updateSettings(@Valid @RequestBody SettingsUpdateRequest request) {
        Map<String, String> updated = settingsService.updateSettings(request.getSettings());
        return ResponseEntity.ok(ApiResponse.ok(updated, "Restaurant settings updated successfully"));
    }
}
