

package com.doctorpoint.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;
        import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "schedules")
public class Schedule {

    @Id
    private String id;

    @NotNull(message = "Start date time is required")
    @Future(message = "Start date time must be in the future")
    private LocalDateTime startDateTime;

    @NotBlank(message = "Type is required")
    private String type;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer duration; // in minutes

    @NotNull(message = "Fees are required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Fees must be greater than 0")
    private BigDecimal fees;

    private String notes;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber2;

    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;

    private LocalDateTime endDateTime;

    // Business validation methods
    public boolean hasTimeCollision(LocalDateTime otherStart, LocalDateTime otherEnd) {
        if (this.endDateTime == null) {
            this.endDateTime = this.startDateTime.plusMinutes(this.duration);
        }
        return !(this.endDateTime.isBefore(otherStart) || otherEnd.isBefore(this.startDateTime));
    }

    public void calculateEndDateTime() {
        if (this.startDateTime != null && this.duration != null) {
            this.endDateTime = this.startDateTime.plusMinutes(this.duration);
        }
    }

    public boolean isOnSameDay(LocalDateTime dateTime) {
        return this.startDateTime.toLocalDate().equals(dateTime.toLocalDate());
    }
}