import ScheduleCard from "./ScheduleCard";
import type { ScheduleViewModelList } from "../../logic/ScheduleViewModel";

interface ScheduleViewCardSMProps {
    appointmentsList: ScheduleViewModelList;
    additionalClasses?: string
}
export default function ScheduleViewCardSM({appointmentsList, additionalClasses}: ScheduleViewCardSMProps) {
  
  return (
    <div className={additionalClasses && additionalClasses}>
      {appointmentsList?.map((row) => (
        <ScheduleCard
          key={row.Patient}
          Date={row.Date}
          Time={row.Time}
          TimeInMinutes={row.TimeInMinutes}
          PatientName={row.Patient}
          Type={row.Type}
          Fees={row.Fees}
          Notes={row.Notes}
          Duration={row.Duration}
        />
      ))}
    </div>
  );
}
