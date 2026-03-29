// logic/service/schedulingService.ts
import CreateAppointment from '../../data/CreateAppointmentRepo';
import { SchedulingModel } from '../model/SchedulingModel';
import { validate } from 'class-validator'; // or zod if frontend

export  class SchedulingService {
  // Create a new schedule
   async createSchedule(schedule: SchedulingModel)  {

    try {
        // 1️⃣ Validate input
        const errors = await validate(schedule);
        if (errors.length > 0) {
            // Map class-validator errors to readable messages
                const errorMessages = errors.flatMap((err) =>
                Object.values(err.constraints || {})
            )   ;
            // Throw all messages as an array in the Error object
            throw new Error(errorMessages.join('; '));
        }


        // 2️⃣ Apply business rules (example)
        if (schedule.duration <= "0") {
            throw new Error("Duration must be greater than 0");
        }

        // 3️⃣ Call repository to store the schedule
        // const result = await schedulingRepository.save(schedule);
        const response = await CreateAppointment(schedule);

        // 4️⃣ Return the result to UI
        return {
            success: response.success,
            message: response.message,
            data: schedule
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return {
                success: false,
                message: err.message,
                data: null
            }
        } else {
            return {
                success: false,
                message: "An unknown error occurred",
                data: null
            }
        }
    }
    
  }

// TODO MOVE TO API
  

  // Optional: fetch schedules
   async getSchedules() {
    // return schedulingRepository.getAll();
  }
}

export const schedulingService = new SchedulingService();