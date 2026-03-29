package com.doctorpoint.http.dto;

import com.doctorpoint.service.ScheduleService;
import lombok.Data;
import java.util.Set;

@Data
public class CreateScheduleResponse {

    private ScheduleResponse schedule;
    private Set<AvailableSlotResponse> availableSlots;

    public static CreateScheduleResponse fromServiceResult(ScheduleService.ScheduleResult result) {
        CreateScheduleResponse response = new CreateScheduleResponse();

        if (result.getSchedule() != null) {
            response.setSchedule(ScheduleResponse.fromEntity(result.getSchedule()));
        }

        if (result.getAvailableSlots() != null) {
            response.setAvailableSlots(
                    result.getAvailableSlots().stream()
                            .map(AvailableSlotResponse::fromServiceSlot)
                            .collect(java.util.stream.Collectors.toSet())
            );
        }

        return response;
    }
}