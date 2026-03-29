export interface ScheduleViewDto {
  datetime: string;
  appointment_type: string;
  duration: number;
  fees: number;
  notes: string;
  phone_number: number;
  phone_number2: number;
  first_name: string;
  last_name: string;
  id: number;
}


export type ScheduleViewDtoList = ScheduleViewDto[];