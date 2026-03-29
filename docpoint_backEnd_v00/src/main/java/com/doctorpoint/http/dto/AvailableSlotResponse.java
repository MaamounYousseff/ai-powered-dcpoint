package com.doctorpoint.http.dto;

import com.doctorpoint.service.ScheduleService;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AvailableSlotResponse {

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    public static AvailableSlotResponse fromServiceSlot(ScheduleService.AvailableSlot slot) {
        AvailableSlotResponse response = new AvailableSlotResponse();
        response.setStartDateTime(slot.getStartDateTime());
        response.setEndDateTime(slot.getEndDateTime());
        return response;
    }
}