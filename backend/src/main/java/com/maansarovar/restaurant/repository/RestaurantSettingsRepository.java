package com.maansarovar.restaurant.repository;

import com.maansarovar.restaurant.entity.RestaurantSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantSettingsRepository extends JpaRepository<RestaurantSettings, Long> {
    Optional<RestaurantSettings> findBySettingKey(String settingKey);
    List<RestaurantSettings> findBySettingGroup(String settingGroup);
}
