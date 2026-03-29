export  interface ScheduleViewModel {
  Date: string;
  Time: string;
  TimeInMinutes: number;
  Patient: string;
  Type: string;
  Fees: string;
  Notes: string;
  Duration: number;
}

export type ScheduleViewModelList = ScheduleViewModel[];