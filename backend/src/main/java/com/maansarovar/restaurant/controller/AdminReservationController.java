package com.maansarovar.restaurant.controller;

import com.maansarovar.restaurant.dto.ApiResponse;
import com.maansarovar.restaurant.dto.ReservationStatusUpdateRequest;
import com.maansarovar.restaurant.entity.Reservation;
import com.maansarovar.restaurant.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reservations")
@RequiredArgsConstructor
@Tag(name = "Admin Reservations Management", description = "View and manage incoming table reservation requests")
public class AdminReservationController {

    private final ReservationService reservationService;

    @GetMapping
    @Operation(summary = "Get reservations with optional status filter and pagination")
    public ResponseEntity<ApiResponse<Page<Reservation>>> getReservations(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<Reservation> reservations = reservationService.getReservationsAdmin(status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(reservations));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update reservation status (NEW, CONTACTED, CONFIRMED, CLOSED)")
    public ResponseEntity<ApiResponse<Reservation>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReservationStatusUpdateRequest request) {
        Reservation updated = reservationService.updateReservationStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok(updated, "Reservation status updated to " + request.getStatus()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a reservation entry")
    public ResponseEntity<ApiResponse<Void>> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Reservation deleted successfully"));
    }
}
