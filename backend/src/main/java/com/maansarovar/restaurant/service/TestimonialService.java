package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.entity.Testimonial;
import com.maansarovar.restaurant.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;

    public List<Testimonial> getApprovedTestimonials() {
        return testimonialRepository.findByIsApprovedTrueOrderByCreatedAtDesc();
    }

    public List<Testimonial> getAllTestimonialsAdmin() {
        return testimonialRepository.findAll();
    }

    public Testimonial saveTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }

    public void deleteTestimonial(Long id) {
        testimonialRepository.deleteById(id);
    }
}
