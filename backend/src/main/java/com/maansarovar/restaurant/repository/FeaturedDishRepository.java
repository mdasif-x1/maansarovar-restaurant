package com.maansarovar.restaurant.repository;

import com.maansarovar.restaurant.entity.FeaturedDish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeaturedDishRepository extends JpaRepository<FeaturedDish, Long> {
    List<FeaturedDish> findAllByOrderByDisplayOrderAsc();
}
