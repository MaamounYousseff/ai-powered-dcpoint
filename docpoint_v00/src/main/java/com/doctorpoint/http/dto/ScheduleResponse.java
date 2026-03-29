package com.doctorpoint.http.dto;

import com.doctorpoint.domain.Schedule;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class ScheduleResponse {

    private String id;
    private LocalDateTime startDateTime;
    private String type;
    private Integer duration;
    private BigDecimal fees;
    private String notes;
    private String phoneNumber;
    private String phoneNumber2;
    private String firstName;
    private String lastName;
    private LocalDateTime endDateTime;

    public static ScheduleResponse fromEntity(Schedule schedule) {
        ScheduleResponse response = new ScheduleResponse();
        response.setId(schedule.getId());
        response.setStartDateTime(schedule.getStartDateTime());
        response.setType(schedule.getType());
        response.setDuration(schedule.getDuration());
        response.setFees(schedule.getFees());
        response.setNotes(schedule.getNotes());
        response.setPhoneNumber(schedule.getPhoneNumber());
        response.setPhoneNumber2(schedule.getPhoneNumber2());
        response.setFirstName(schedule.getFirstName());
        response.setLastName(schedule.getLastName());
        response.setEndDateTime(schedule.getEndDateTime());
        return response;
    }
}