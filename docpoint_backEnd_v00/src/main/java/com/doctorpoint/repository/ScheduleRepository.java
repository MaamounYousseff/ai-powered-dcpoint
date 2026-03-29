package com.doctorpoint.repository;

import com.doctorpoint.domain.Schedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends MongoRepository<Schedule, String> {

    @Query("{'startDateTime': {$gte: ?0, $lt: ?1}}")
    List<Schedule> findByStartDateTimeBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Query("{'startDateTime': {$gte: ?0, $lte: ?1}}")
    List<Schedule> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'type': ?0}")
    List<Schedule> findByType(String type);

    @Query("{'fees': {$gte: ?0, $lte: ?1}}")
    List<Schedule> findByFeesRange(Double minFees, Double maxFees);

    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}]}")
    List<Schedule> findByPatientName(String patientName);

    @Query("{'$or': [{'phoneNumber': ?0}, {'phoneNumber2': ?0}]}")
    List<Schedule> findByPhoneNumber(String phoneNumber);
}