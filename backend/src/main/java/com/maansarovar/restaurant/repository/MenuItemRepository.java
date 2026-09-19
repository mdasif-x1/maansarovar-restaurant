package com.maansarovar.restaurant.repository;

import com.maansarovar.restaurant.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsAvailableTrueOrderByDisplayOrderAsc();
    List<MenuItem> findByCategoryIdAndIsAvailableTrueOrderByDisplayOrderAsc(Long categoryId);
    List<MenuItem> findByIsChefSpecialTrueAndIsAvailableTrue();
}
