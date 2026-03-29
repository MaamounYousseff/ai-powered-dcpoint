package com.doctorpoint.service;

import com.doctorpoint.domain.Schedule;
import com.doctorpoint.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(String id) {
        return scheduleRepository.findById(id);
    }

    public ScheduleResult createSchedule(Schedule schedule) {
        schedule.calculateEndDateTime();

        LocalDate requestedDate = schedule.getStartDateTime().toLocalDate();
        LocalDateTime startOfDay = requestedDate.atStartOfDay();
        LocalDateTime endOfDay = requestedDate.atTime(23, 59, 59);

        List<Schedule> daySchedules = scheduleRepository.findByStartDateTimeBetween(startOfDay, endOfDay);

        return checkAndSchedule(schedule, daySchedules, schedule.getStartDateTime(), new StringBuilder());
    }

    public ScheduleResult updateSchedule(String id, Schedule updatedSchedule) {
        Optional<Schedule> existingSchedule = scheduleRepository.findById(id);
        if (existingSchedule.isEmpty()) {
            return ScheduleResult.error("Schedule not found");
        }

        updatedSchedule.setId(id);
        updatedSchedule.calculateEndDateTime();

        LocalDate requestedDate = updatedSchedule.getStartDateTime().toLocalDate();
        LocalDateTime startOfDay = requestedDate.atStartOfDay();
        LocalDateTime endOfDay = requestedDate.atTime(23, 59, 59);

        List<Schedule> daySchedules = scheduleRepository.findByStartDateTimeBetween(startOfDay, endOfDay)
                .stream()
                .filter(s -> !s.getId().equals(id))
                .collect(Collectors.toList());

        return checkAndSchedule(updatedSchedule, daySchedules, updatedSchedule.getStartDateTime(), new StringBuilder());
    }

    public boolean deleteSchedule(String id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Schedule> getSchedulesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return scheduleRepository.findByDateRange(startDate, endDate);
    }

    public List<Schedule> getSchedulesByType(String type) {
        return scheduleRepository.findByType(type);
    }

    public List<Schedule> getSchedulesByFeesRange(Double minFees, Double maxFees) {
        return scheduleRepository.findByFeesRange(minFees, maxFees);
    }

    public List<Schedule> getSchedulesByPatientName(String patientName) {
        return scheduleRepository.findByPatientName(patientName);
    }

    public List<Schedule> getSchedulesByPhoneNumber(String phoneNumber) {
        return scheduleRepository.findByPhoneNumber(phoneNumber);
    }

    private ScheduleResult checkAndSchedule(Schedule schedule, List<Schedule> daySchedules,
                                            LocalDateTime originalDateTime, StringBuilder messageBuilder) {

        if (!schedule.getStartDateTime().toLocalDate().equals(originalDateTime.toLocalDate())) {
            return ScheduleResult.error("Cannot schedule on a different day");
        }

        Schedule predecessor = findPredecessor(daySchedules, schedule.getStartDateTime());
        Schedule successor = findSuccessor(daySchedules, schedule.getStartDateTime());

        // Base case 1: No conflicts
        if (predecessor == null && successor == null) {
            Schedule savedSchedule = scheduleRepository.save(schedule);
            return ScheduleResult.success(savedSchedule, "Schedule created successfully");
        }

        // Base case 2: Only successor exists
        if (predecessor == null && successor != null) {
            if (!schedule.hasTimeCollision(successor.getStartDateTime(), successor.getEndDateTime())) {
                Schedule savedSchedule = scheduleRepository.save(schedule);
                return ScheduleResult.success(savedSchedule, "Schedule created successfully");
            } else {
                return findAvailableSlots(schedule, daySchedules, originalDateTime);
            }
        }

        // Base case 3: Only predecessor exists
        if (predecessor != null && successor == null) {
            if (!schedule.hasTimeCollision(predecessor.getStartDateTime(), predecessor.getEndDateTime())) {
                Schedule savedSchedule = scheduleRepository.save(schedule);
                return ScheduleResult.success(savedSchedule, "Schedule created successfully");
            } else {
                return findAvailableSlots(schedule, daySchedules, originalDateTime);
            }
        }

        // Base case 4: Both predecessor and successor exist
        if (predecessor != null && successor != null) {
            if (!schedule.hasTimeCollision(predecessor.getStartDateTime(), predecessor.getEndDateTime()) &&
                    !schedule.hasTimeCollision(successor.getStartDateTime(), successor.getEndDateTime())) {
                Schedule savedSchedule = scheduleRepository.save(schedule);
                return ScheduleResult.success(savedSchedule, "Schedule created successfully");
            } else {
                return findAvailableSlots(schedule, daySchedules, originalDateTime);
            }
        }

        return ScheduleResult.error("Unable to schedule at the requested time");
    }

    private Schedule findPredecessor(List<Schedule> schedules, LocalDateTime dateTime) {
        return schedules.stream()
                .filter(s -> s.getStartDateTime().isBefore(dateTime) || s.getStartDateTime().equals(dateTime))
                .max(Comparator.comparing(Schedule::getEndDateTime))
                .orElse(null);
    }

    private Schedule findSuccessor(List<Schedule> schedules, LocalDateTime dateTime) {
        return schedules.stream()
                .filter(s -> s.getStartDateTime().isAfter(dateTime) || s.getStartDateTime().equals(dateTime))
                .min(Comparator.comparing(Schedule::getStartDateTime))
                .orElse(null);
    }

    private ScheduleResult findAvailableSlots(Schedule requestedSchedule, List<Schedule> daySchedules,
                                              LocalDateTime originalDateTime) {
        Set<AvailableSlot> availableSlots = new HashSet<>();
        LocalDate targetDate = originalDateTime.toLocalDate();

        // Sort schedules by start time
        List<Schedule> sortedSchedules = daySchedules.stream()
                .sorted(Comparator.comparing(Schedule::getStartDateTime))
                .collect(Collectors.toList());

        // Check slot before first appointment
        if (!sortedSchedules.isEmpty()) {
            LocalDateTime firstStart = sortedSchedules.get(0).getStartDateTime();
            LocalDateTime slotStart = targetDate.atTime(8, 0); // Start from 8 AM
            LocalDateTime slotEnd = slotStart.plusMinutes(requestedSchedule.getDuration());

            if (slotEnd.isBefore(firstStart) || slotEnd.equals(firstStart)) {
                availableSlots.add(new AvailableSlot(slotStart, slotEnd));
            }
        }

        // Check slots between appointments
        for (int i = 0; i < sortedSchedules.size() - 1; i++) {
            Schedule current = sortedSchedules.get(i);
            Schedule next = sortedSchedules.get(i + 1);

            LocalDateTime slotStart = current.getEndDateTime();
            LocalDateTime slotEnd = slotStart.plusMinutes(requestedSchedule.getDuration());

            if (slotEnd.isBefore(next.getStartDateTime()) || slotEnd.equals(next.getStartDateTime())) {
                availableSlots.add(new AvailableSlot(slotStart, slotEnd));
            }
        }

        // Check slot after last appointment
        if (!sortedSchedules.isEmpty()) {
            Schedule lastSchedule = sortedSchedules.get(sortedSchedules.size() - 1);
            LocalDateTime slotStart = lastSchedule.getEndDateTime();
            LocalDateTime slotEnd = slotStart.plusMinutes(requestedSchedule.getDuration());
            LocalDateTime dayEnd = targetDate.atTime(22, 0); // End at 10 PM

            if (slotEnd.isBefore(dayEnd) || slotEnd.equals(dayEnd)) {
                availableSlots.add(new AvailableSlot(slotStart, slotEnd));
            }
        }

        if (availableSlots.isEmpty()) {
            return ScheduleResult.error("No available slots for the requested date");
        }

        return ScheduleResult.availableSlots(availableSlots,
                "Requested time is not available. Here are available slots:");
    }

    // Inner classes for result handling
    public static class ScheduleResult {
        private final boolean success;
        private final Schedule schedule;
        private final Set<AvailableSlot> availableSlots;
        private final String message;

        private ScheduleResult(boolean success, Schedule schedule, Set<AvailableSlot> availableSlots, String message) {
            this.success = success;
            this.schedule = schedule;
            this.availableSlots = availableSlots;
            this.message = message;
        }

        public static ScheduleResult success(Schedule schedule, String message) {
            return new ScheduleResult(true, schedule, null, message);
        }

        public static ScheduleResult error(String message) {
            return new ScheduleResult(false, null, null, message);
        }

        public static ScheduleResult availableSlots(Set<AvailableSlot> slots, String message) {
            return new ScheduleResult(false, null, slots, message);
        }

        // Getters
        public boolean isSuccess() { return success; }
        public Schedule getSchedule() { return schedule; }
        public Set<AvailableSlot> getAvailableSlots() { return availableSlots; }
        public String getMessage() { return message; }
    }

    public static class AvailableSlot {
        private final LocalDateTime startDateTime;
        private final LocalDateTime endDateTime;

        public AvailableSlot(LocalDateTime startDateTime, LocalDateTime endDateTime) {
            this.startDateTime = startDateTime;
            this.endDateTime = endDateTime;
        }

        public LocalDateTime getStartDateTime() { return startDateTime; }
        public LocalDateTime getEndDateTime() { return endDateTime; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof AvailableSlot)) return false;
            AvailableSlot that = (AvailableSlot) o;
            return Objects.equals(startDateTime, that.startDateTime) &&
                    Objects.equals(endDateTime, that.endDateTime);
        }

        @Override
        public int hashCode() {
            return Objects.hash(startDateTime, endDateTime);
        }
    }
}