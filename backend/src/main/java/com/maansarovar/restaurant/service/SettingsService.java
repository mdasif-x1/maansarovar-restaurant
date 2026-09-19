package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.entity.RestaurantSettings;
import com.maansarovar.restaurant.repository.RestaurantSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final RestaurantSettingsRepository settingsRepository;

    public Map<String, String> getAllSettings() {
        List<RestaurantSettings> list = settingsRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (RestaurantSettings s : list) {
            map.put(s.getSettingKey(), s.getSettingValue());
        }
        return map;
    }

    @Transactional
    public Map<String, String> updateSettings(Map<String, String> newSettings) {
        for (Map.Entry<String, String> entry : newSettings.entrySet()) {
            RestaurantSettings setting = settingsRepository.findBySettingKey(entry.getKey())
                    .orElseGet(() -> RestaurantSettings.builder()
                            .settingKey(entry.getKey())
                            .settingGroup("general")
                            .build());

            setting.setSettingValue(entry.getValue());
            settingsRepository.save(setting);
        }
        return getAllSettings();
    }
}
