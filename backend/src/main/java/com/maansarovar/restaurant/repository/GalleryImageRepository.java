package com.maansarovar.restaurant.repository;

import com.maansarovar.restaurant.entity.GalleryImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    List<GalleryImage> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<GalleryImage> findByCategoryAndIsActiveTrueOrderByDisplayOrderAsc(String category);
    Page<GalleryImage> findByIsActiveTrue(Pageable pageable);
}
