package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.GalleryImageRequest;
import com.maansarovar.restaurant.entity.GalleryImage;
import com.maansarovar.restaurant.exception.ResourceNotFoundException;
import com.maansarovar.restaurant.repository.GalleryImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryImageRepository galleryImageRepository;

    public List<GalleryImage> getPublicGallery(String category) {
        if (category != null && !category.trim().isEmpty() && !"All".equalsIgnoreCase(category)) {
            return galleryImageRepository.findByCategoryAndIsActiveTrueOrderByDisplayOrderAsc(category);
        }
        return galleryImageRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public Page<GalleryImage> getGalleryPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayOrder").ascending());
        return galleryImageRepository.findByIsActiveTrue(pageable);
    }

    public List<GalleryImage> getAllImagesAdmin() {
        return galleryImageRepository.findAll();
    }

    @Transactional
    public GalleryImage createImage(GalleryImageRequest request) {
        GalleryImage image = GalleryImage.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .caption(request.getCaption())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return galleryImageRepository.save(image);
    }

    @Transactional
    public GalleryImage updateImage(Long id, GalleryImageRequest request) {
        GalleryImage image = galleryImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery image not found with id: " + id));

        image.setTitle(request.getTitle());
        image.setCategory(request.getCategory());
        image.setImageUrl(request.getImageUrl());
        image.setCaption(request.getCaption());
        if (request.getDisplayOrder() != null) image.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsActive() != null) image.setIsActive(request.getIsActive());

        return galleryImageRepository.save(image);
    }

    @Transactional
    public void deleteImage(Long id) {
        if (!galleryImageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Gallery image not found with id: " + id);
        }
        galleryImageRepository.deleteById(id);
    }
}
