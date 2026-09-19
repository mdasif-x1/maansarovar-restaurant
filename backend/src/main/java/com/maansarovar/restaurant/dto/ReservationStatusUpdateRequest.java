package com.maansarovar.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ReservationStatusUpdateRequest {
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(NEW|CONTACTED|CONFIRMED|CLOSED)$", message = "Status must be NEW, CONTACTED, CONFIRMED, or CLOSED")
    private String status;
}
