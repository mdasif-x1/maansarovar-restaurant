package com.maansarovar.restaurant.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationRequest {

    @NotBlank(message = "Guest name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String guestName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+\\-\\s()]{8,20}$", message = "Please enter a valid phone number")
    private String guestPhone;

    @Email(message = "Please enter a valid email address")
    private String guestEmail;

    @NotNull(message = "Reservation date is required")
    @FutureOrPresent(message = "Reservation date cannot be in the past")
    private LocalDate reservationDate;

    @NotNull(message = "Reservation time is required")
    private LocalTime reservationTime;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "At least 1 guest required")
    @Max(value = 50, message = "For groups over 50, please call the restaurant directly")
    private Integer numberOfGuests;

    private String occasion;
    private String specialRequest;
}
