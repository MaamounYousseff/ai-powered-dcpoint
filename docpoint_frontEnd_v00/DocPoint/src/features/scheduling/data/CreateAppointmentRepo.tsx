import AclModel from "../../../core/security/AclModel";
import { SchedulingModel } from "../logic/model/SchedulingModel";
import ApiService from "../../../core/network/ApiService";

const CreateAppointment = async (schedule: SchedulingModel): Promise<AclModel> => {

  const payload = {
    datetime: schedule.datetime instanceof Date
      ? schedule.datetime.toISOString().slice(0, 19)
      : schedule.datetime,
    appointment_type: schedule.appointmentType,
    duration: Number(schedule.duration),
    fees: schedule.fees,
    notes: schedule.notes ?? null,
    phone_number: Number(schedule.phoneNumber),
    phone_number2: schedule.phoneNumber2 ? Number(schedule.phoneNumber2) : null,
    first_name: schedule.firstName,
    last_name: schedule.lastName,
  };

  try {
    const response = await ApiService.createAppointment(payload);
    const body = await response.json();

    if (response.ok) {
      return new AclModel(true, "Appointment created successfully", body);
    }

    if (response.status === 422) {
      let message = "Validation error";
      if (body?.detail?.length > 0) {
        body.detail.forEach((error: any) => {
          message += ` ${error.loc?.[1]} is invalid`;
        });
      }
      return new AclModel(false, message, body);
    }

  if (response.status === 400) {
    let message = "Validation error";

    if (typeof body?.detail === "string") {
      message = body.detail;
    } 
    else if (Array.isArray(body?.detail)) {
      message = "";
      body.detail.forEach((error: any) => {
        message += `${error.loc?.[1]} is invalid. `;
      });
    }

    return new AclModel(false, message, null);
  }

    return new AclModel(false, body?.detail || "Unknown error", body);

  } catch (error: any) {
    return new AclModel(false, "Network error: " + error.message);
  }
};

export default CreateAppointment;