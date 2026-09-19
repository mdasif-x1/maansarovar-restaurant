package com.maansarovar.restaurant.service;

import com.maansarovar.restaurant.dto.ReservationRequest;
import com.maansarovar.restaurant.entity.Reservation;
import com.maansarovar.restaurant.exception.BadRequestException;
import com.maansarovar.restaurant.exception.ResourceNotFoundException;
import com.maansarovar.restaurant.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    @Transactional
    public Reservation createReservation(ReservationRequest request) {
        // Validation: Past Date/Time check
        LocalDate today = LocalDate.now();
        LocalTime nowTime = LocalTime.now();
        if (request.getReservationDate().isBefore(today)) {
            throw new BadRequestException("Reservation date cannot be in the past.");
        }
        if (request.getReservationDate().isEqual(today) && request.getReservationTime().isBefore(nowTime)) {
            throw new BadRequestException("Reservation time cannot be in the past for today's date.");
        }

        // Operating Hours Validation: 09:00 AM to 23:00 PM
        LocalTime openingTime = LocalTime.of(9, 0);
        LocalTime closingTime = LocalTime.of(23, 0);
        if (request.getReservationTime().isBefore(openingTime) || request.getReservationTime().isAfter(closingTime)) {
            throw new BadRequestException("Reservations are only accepted during operating hours (9:00 AM – 11:00 PM).");
        }

        // Rate-limiting / anti-spam check: max 3 requests per phone per hour
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long recentBookingsCount = reservationRepository.countByGuestPhoneAndCreatedAtAfter(request.getGuestPhone(), oneHourAgo);

        if (recentBookingsCount >= 3) {
            throw new com.maansarovar.restaurant.exception.TooManyRequestsException("Multiple reservation requests detected for this phone number. Please call the restaurant directly for urgent assistance.");
        }

        Reservation reservation = Reservation.builder()
                .guestName(request.getGuestName().trim())
                .guestPhone(request.getGuestPhone().trim())
                .guestEmail(request.getGuestEmail() != null ? request.getGuestEmail().trim() : null)
                .reservationDate(request.getReservationDate())
                .reservationTime(request.getReservationTime())
                .numberOfGuests(request.getNumberOfGuests())
                .occasion(request.getOccasion() != null && !request.getOccasion().isBlank() ? request.getOccasion().trim() : "Regular Dining")
                .specialRequest(request.getSpecialRequest() != null ? request.getSpecialRequest().trim() : null)
                .status("NEW")
                .build();

        return reservationRepository.save(reservation);
    }

    public Page<Reservation> getReservationsAdmin(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return reservationRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase(), pageable);
        }
        return reservationRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public Reservation updateReservationStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        reservation.setStatus(status.toUpperCase());
        return reservationRepository.save(reservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reservation not found with id: " + id);
        }
        reservationRepository.deleteById(id);
    }
}
