package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.MenuCategoryRequest;
import com.maansarovar.restaurant.dto.MenuItemRequest;
import com.maansarovar.restaurant.entity.FeaturedDish;
import com.maansarovar.restaurant.entity.MenuCategory;
import com.maansarovar.restaurant.entity.MenuItem;
import com.maansarovar.restaurant.exception.BadRequestException;
import com.maansarovar.restaurant.exception.ResourceNotFoundException;
import com.maansarovar.restaurant.repository.FeaturedDishRepository;
import com.maansarovar.restaurant.repository.MenuCategoryRepository;
import com.maansarovar.restaurant.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final FeaturedDishRepository featuredDishRepository;

    public List<MenuCategory> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public List<MenuCategory> getAllCategoriesAdmin() {
        return categoryRepository.findAll();
    }

    public List<MenuItem> getAllAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrueOrderByDisplayOrderAsc();
    }

    public List<MenuItem> getAllMenuItemsAdmin() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryIdAndIsAvailableTrueOrderByDisplayOrderAsc(categoryId);
    }

    public List<FeaturedDish> getFeaturedDishes() {
        return featuredDishRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Transactional
    public MenuCategory createCategory(MenuCategoryRequest request) {
        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
        if (categoryRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis() % 1000;
        }

        MenuCategory category = MenuCategory.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return categoryRepository.save(category);
    }

    @Transactional
    public MenuCategory updateCategory(Long id, MenuCategoryRequest request) {
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsActive() != null) category.setIsActive(request.getIsActive());

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Transactional
    public MenuItem createMenuItem(MenuItemRequest request) {
        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        MenuItem menuItem = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(category)
                .isVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : true)
                .isChefSpecial(request.getIsChefSpecial() != null ? request.getIsChefSpecial() : false)
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .imageUrl(request.getImageUrl())
                .imageAltText(request.getImageAltText())
                .imageSourceType(request.getImageSourceType() != null ? request.getImageSourceType() : "OWNER_PHOTO")
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setCategory(category);
        if (request.getIsVegetarian() != null) menuItem.setIsVegetarian(request.getIsVegetarian());
        if (request.getIsChefSpecial() != null) menuItem.setIsChefSpecial(request.getIsChefSpecial());
        if (request.getIsAvailable() != null) menuItem.setIsAvailable(request.getIsAvailable());
        if (request.getImageUrl() != null) menuItem.setImageUrl(request.getImageUrl());
        if (request.getImageAltText() != null) menuItem.setImageAltText(request.getImageAltText());
        if (request.getImageSourceType() != null) menuItem.setImageSourceType(request.getImageSourceType());
        if (request.getDisplayOrder() != null) menuItem.setDisplayOrder(request.getDisplayOrder());

        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    @Transactional
    public FeaturedDish addFeaturedDish(Long menuItemId, String subtitle, Integer displayOrder) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + menuItemId));

        FeaturedDish featured = FeaturedDish.builder()
                .menuItem(menuItem)
                .subtitle(subtitle)
                .displayOrder(displayOrder != null ? displayOrder : 0)
                .build();

        return featuredDishRepository.save(featured);
    }

    @Transactional
    public void removeFeaturedDish(Long id) {
        if (!featuredDishRepository.existsById(id)) {
            throw new ResourceNotFoundException("Featured dish record not found with id: " + id);
        }
        featuredDishRepository.deleteById(id);
    }
}
