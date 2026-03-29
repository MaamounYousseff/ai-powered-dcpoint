import ApiService from "../../../core/network/ApiService";
import AclModel from "../../../core/security/AclModel";
import type { ScheduleViewDtoList } from "./ScheduleViewDto";


export async function getScheduleViewListByFilters(startDate: string, endDate: string, typeFilter: string): Promise<AclModel> {
  try {
    const response = await ApiService.fetchAppointmentsByDateRange(startDate, endDate, typeFilter);
    const data: ScheduleViewDtoList = await response.json();

    return new AclModel(
      response.ok,
      "Appointments fetched successfully",
      data
    );
  } catch (error: any) {
    return new AclModel(
      false,
      error.message || "Failed to fetch appointments by date range"
    );
  }
}