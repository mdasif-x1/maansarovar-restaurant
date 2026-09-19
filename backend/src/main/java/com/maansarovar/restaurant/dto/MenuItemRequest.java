package com.maansarovar.restaurant.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class MenuItemRequest {

    @NotBlank(message = "Item name is required")
    @Size(max = 150)
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Boolean isVegetarian = true;
    private Boolean isChefSpecial = false;
    private Boolean isAvailable = true;
    private String imageUrl;
    private String imageAltText;
    private String imageSourceType = "OWNER_PHOTO";
    private Integer displayOrder = 0;
}
