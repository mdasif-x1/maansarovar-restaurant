package com.maansarovar.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GalleryImageRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category; // Food, Ambience, Family Dining, Events

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private String caption;
    private Integer displayOrder = 0;
    private Boolean isActive = true;
}
