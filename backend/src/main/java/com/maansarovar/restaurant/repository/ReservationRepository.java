package com.maansarovar.restaurant.repository;

import com.maansarovar.restaurant.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Page<Reservation> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Reservation> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    long countByGuestPhoneAndCreatedAtAfter(String guestPhone, LocalDateTime afterTime);
    boolean existsByGuestPhoneAndReservationDateAndReservationTimeAndStatusNot(
            String guestPhone, LocalDate reservationDate, java.time.LocalTime reservationTime, String excludedStatus);
}
