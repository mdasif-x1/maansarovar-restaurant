package com.maansarovar.restaurant.repository;

import com.maansarovar.restaurant.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByIsActiveTrueOrderByDisplayOrderAsc();
    Optional<MenuCategory> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
