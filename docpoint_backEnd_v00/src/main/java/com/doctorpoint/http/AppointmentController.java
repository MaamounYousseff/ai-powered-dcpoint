package com.doctorpoint.http;

import com.doctorpoint.domain.ApiResponse;
import com.doctorpoint.domain.ResponseUtil;
import com.doctorpoint.domain.Schedule;
import com.doctorpoint.http.dto.*;
import com.doctorpoint.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final ScheduleService scheduleService;

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getAllSchedules() {
        try {
            List<Schedule> schedules = scheduleService.getAllSchedules();
            List<ScheduleResponse> response = schedules.stream()
                    .map(ScheduleResponse::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(
                    ResponseUtil.createSuccessResponse(response, "Schedules retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.createErrorResponse("Failed to retrieve schedules: " + e.getMessage()));
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByFilter(
            @ModelAttribute ScheduleFilterRequest filterRequest) {
        try {
            List<Schedule> schedules;

            if (filterRequest.getStartDate() != null && filterRequest.getEndDate() != null) {
                LocalDateTime startDateTime = filterRequest.getStartDate().atStartOfDay();
                LocalDateTime endDateTime = filterRequest.getEndDate().atTime(23, 59, 59);
                schedules = scheduleService.getSchedulesByDateRange(startDateTime, endDateTime);
            } else if (filterRequest.getType() != null && !filterRequest.getType().isEmpty()) {
                schedules = scheduleService.getSchedulesByType(filterRequest.getType());
            } else if (filterRequest.getMinFees() != null && filterRequest.getMaxFees() != null) {
                schedules = scheduleService.getSchedulesByFeesRange(filterRequest.getMinFees(), filterRequest.getMaxFees());
            } else if (filterRequest.getPatientName() != null && !filterRequest.getPatientName().isEmpty()) {
                schedules = scheduleService.getSchedulesByPatientName(filterRequest.getPatientName());
            } else if (filterRequest.getPatientPhone() != null && !filterRequest.getPatientPhone().isEmpty()) {
                schedules = scheduleService.getSchedulesByPhoneNumber(filterRequest.getPatientPhone());
            } else {
                schedules = scheduleService.getAllSchedules();
            }

            List<ScheduleResponse> response = schedules.stream()
                    .map(ScheduleResponse::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(
                    ResponseUtil.createSuccessResponse(response, "Filtered schedules retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.createErrorResponse("Failed to filter schedules: " + e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CreateScheduleResponse>> createSchedule(
            @Valid @RequestBody ScheduleCreateRequest request) {
        try {
            Schedule schedule = mapToEntity(request);
            ScheduleService.ScheduleResult result = scheduleService.createSchedule(schedule);

            CreateScheduleResponse response = CreateScheduleResponse.fromServiceResult(result);

            if (result.isSuccess()) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ResponseUtil.createSuccessResponse(response, result.getMessage()));
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ResponseUtil.createErrorResponse(response, result.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.createErrorResponse("Failed to create schedule: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getScheduleById(@PathVariable String id) {
        try {
            Optional<Schedule> schedule = scheduleService.getScheduleById(id);

            if (schedule.isPresent()) {
                ScheduleResponse response = ScheduleResponse.fromEntity(schedule.get());
                return ResponseEntity.ok(
                        ResponseUtil.createSuccessResponse(response, "Schedule retrieved successfully")
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ResponseUtil.createErrorResponse("Schedule not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.createErrorResponse("Failed to retrieve schedule: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CreateScheduleResponse>> updateSchedule(
            @PathVariable String id,
            @Valid @RequestBody ScheduleUpdateRequest request) {
        try {
            Schedule schedule = mapToEntity(request);
            ScheduleService.ScheduleResult result = scheduleService.updateSchedule(id, schedule);

            CreateScheduleResponse response = CreateScheduleResponse.fromServiceResult(result);

            if (result.isSuccess()) {
                return ResponseEntity.ok(
                        ResponseUtil.createSuccessResponse(response, result.getMessage())
                );
            } else {
                HttpStatus status = result.getMessage().contains("not found") ?
                        HttpStatus.NOT_FOUND : HttpStatus.CONFLICT;
                return ResponseEntity.status(status)
                        .body(ResponseUtil.createErrorResponse(response, result.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.createErrorResponse("Failed to update schedule: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSchedule(@PathVariable String id) {
        try {
            boolean deleted = scheduleService.deleteSchedule(id);

            if (deleted) {
                return ResponseEntity.ok(
                        ResponseUtil.createSuccessResponse("Schedule deleted successfully")
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ResponseUtil.createErrorResponse("Schedule not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.createErrorResponse("Failed to delete schedule: " + e.getMessage()));
        }
    }

    private Schedule mapToEntity(ScheduleCreateRequest request) {
        Schedule schedule = new Schedule();
        schedule.setStartDateTime(request.getDatetime());
        schedule.setType(request.getType());
        schedule.setDuration(request.getDuration());
        schedule.setFees(request.getFees());
        schedule.setNotes(request.getNotes());
        schedule.setPhoneNumber(request.getPhoneNumber());
        schedule.setPhoneNumber2(request.getPhoneNumber2());
        schedule.setFirstName(request.getFirstName());
        schedule.setLastName(request.getLastName());
        return schedule;
    }

    private Schedule mapToEntity(ScheduleUpdateRequest request) {
        Schedule schedule = new Schedule();
        schedule.setStartDateTime(request.getDatetime());
        schedule.setType(request.getType());
        schedule.setDuration(request.getDuration());
        schedule.setFees(request.getFees());
        schedule.setNotes(request.getNotes());
        schedule.setPhoneNumber(request.getPhoneNumber());
        schedule.setPhoneNumber2(request.getPhoneNumber2());
        schedule.setFirstName(request.getFirstName());
        schedule.setLastName(request.getLastName());
        return schedule;
    }
}