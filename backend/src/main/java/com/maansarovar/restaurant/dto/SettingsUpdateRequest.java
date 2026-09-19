package com.maansarovar.restaurant.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.Map;

@Data
public class SettingsUpdateRequest {
    @NotEmpty(message = "Settings map cannot be empty")
    private Map<String, String> settings;
}
