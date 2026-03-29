import DcLabel from "../../../../core/component/DcLabel";
import { PersonIcon, MobileIcon, CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { DatePicker } from "../../../../core/component/DatePicker";
import TimeField from "../../../../core/component/TimeField";
import type { DateValue, TimeValue } from "react-aria";
import { useSchedulingContext } from "../context/SchedulingProvider";
import DcComboBox from "../../../../core/component/DcComboBox";
import type {
  DcComboBoxOptionProps,
  DcComboBoxProps,
} from "../../../../core/component/DcComboBox";
import { SchedulingModel } from "../../logic/model/SchedulingModel";
import { schedulingService } from "../../logic/service/ScheduleService";
import { useSchedulingResponse } from "../context/SchedulingResponseProvider";
import AclModel from "../../../../core/security/AclModel";
import TextField from '@mui/material/TextField';
import "./SchedulingMain.css";
import '../../../../App.css'
import { useScheduleVisibility } from "../context/SchedulingVisibilityProvider";




function SchedulingMain() {
  const { scheduleValue, fillSchedulingValue } = useSchedulingContext();

  const [schedulingTypes, setSchedulingTypes] = useState<string[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentDurationCache, setAppointmentDurationCache] = useState<
    Record<string, number>
  >({});
  const [fees, setFees] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const [date, setDate] = useState<DateValue | null>(null);
  const [time, setTime] = useState<TimeValue | null>(null);

  const [, setResponse] = useSchedulingResponse();

  const [dcComboBoxValues, setDcComboBoxValues] = useState<DcComboBoxProps>({
    options: [],
    placeHolder: "",
  });


  const {closeSchedulePage} = useScheduleVisibility();

  const handleScheduling = async () => {
    let datetime: Date | undefined;
  
    if (date && time) {
      datetime = new Date(
        date.year,
        date.month - 1,
        date.day,
        time.hour,
        time.minute,
      );
    }
  
    const duration = appointmentDurationCache[appointmentType];
    const scheduleValue = new SchedulingModel();
  
    scheduleValue.firstName = firstName;
    scheduleValue.lastName = lastName;
    scheduleValue.phoneNumber = phoneNumber;
    scheduleValue.phoneNumber2 = phoneNumber2;
    scheduleValue.appointmentType = appointmentType;
  
    if (duration && time) {
      scheduleValue.duration = String(duration);
    }
  
    scheduleValue.datetime = datetime;
    scheduleValue.fees = fees;
    scheduleValue.notes = notes;
  
    fillSchedulingValue(scheduleValue);
  };

  useEffect(() => {
    if (scheduleValue) {
      schedulingService
        .createSchedule(scheduleValue)
        .then((response) => {
          setResponse(response);
        })
        .catch((error) => {
          const acl = new AclModel(false, error.message, null);
          setResponse(acl);
        });
    }
  }, [scheduleValue]);

  useEffect(() => {
    setSchedulingTypes(["surgery", "consultant", "appointment"]);
  }, []);

  useEffect(() => {
    if (schedulingTypes.length === 0) return; // wait until filled

    // Step 2: set the appointment duration cache
    const durationCache: Record<string, number> = {
      surgery: 60,
      consultant: 30,
      appointment: 15,
    };
    setAppointmentDurationCache(durationCache);

    // Step 3: create the combo box values
    setDcComboBoxValues(createComboBoxForAppointmentTypes());
  }, [schedulingTypes]);

  const handleDatePickerChange = (value: DateValue | null) => {
    setDate(value);
  };

  const handleTimeFieldChange = (value: TimeValue | null) => {
    setTime(value);
  };

  function createComboBoxForAppointmentTypes(): DcComboBoxProps {
    const options: DcComboBoxOptionProps[] = schedulingTypes.map(
      (item, index) => ({
        id: index, // using the array index as unique id
        label: item,
        node: <span>{item}</span>,
      }),
    );

    return {
      options,
      placeHolder: "Select Appointment Type",
    };
  }

  return (
    <div className="scheduling-wrapper">
      <main className="scheduling-main">
        {/* ---------------- Patient Information ---------------- */}

        <DcLabel
          value="Patient Information"
          slot={<PersonIcon width={22} height={22}  />}
          additionalClasses="header_2 mb_10"
        />

        <DcLabel value="Patient Name *"  additionalClasses="header_3" />
        <div className="patient-name-row mb_4">
          <TextField
            placeholder="Enter patient First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field mt_2"
            size="small"
            fullWidth
          />

          <TextField
            placeholder="Enter patient Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            size="small"
            fullWidth
            className="mt_2"
          />
        </div>

        <div className="phone-row mb_4">
          <DcLabel value="Phone Number *" additionalClasses="header_3 " />

          <TextField
            placeholder="+96171070479"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            slotProps={{ input: { startAdornment: <MobileIcon /> } }}
            size="small"
            fullWidth
          />
        </div>

        <div className="phone-row mb_4">
          <DcLabel value="Second Phone (Optional)"  additionalClasses="header_3" />

          <TextField
            placeholder="+96171070479"
            value={phoneNumber2}
            onChange={(e) => setPhoneNumber2(e.target.value)}
            slotProps={{ input: { startAdornment: <MobileIcon /> } }}
            size="small"
            fullWidth
            className="mt_2 "
          />
        </div>

        <hr className="section-divider" />

        {/* ---------------- Appointment Details ---------------- */}

        <DcLabel
          value="Appointment Details"
          slot={<CalendarIcon width="22" height="22"/>}
          additionalClasses="header_2 mb_10"
        />

        <DcComboBox
          options={dcComboBoxValues.options}
          placeHolder={dcComboBoxValues.placeHolder}
          onChange={(scheduleType) =>
            scheduleType && setAppointmentType(scheduleType)
          }
        />

        <DcLabel value="Date *"  additionalClasses="header_3 mt_4 mb_2" />
        <DatePicker onChange={handleDatePickerChange} additionalClasses="scheduling-date-picker" />

        <DcLabel value="Time *" additionalClasses="header_3 mt_10 mb_2" />
        <TimeField onChange={handleTimeFieldChange} additionalClasses="scheduling-time-field" />
        <span>{/* future availability message */}</span>

        <DcLabel value="Consulation Fee *" additionalClasses="header_3 mt_4 mb_4"  />

        <TextField
          value={fees}
          onChange={(e) => setFees(Number(e.target.value))}
          size="small"
          fullWidth
        />


        <DcLabel value="Notes (Optional)" additionalClasses="header_3 mb_4 mt_4"  />

        <TextField
          placeholder="Additional notes or secial instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          minRows={3}
          size="small"
          fullWidth
        />

        <div className="schedule-main-btn">
            <button className="btn-schedule" onClick={handleScheduling}>Schedule</button>
            <button className="btn-cancel" onClick={closeSchedulePage}>Cancel</button>
        </div>

      </main>

    </div>
  );
}

export default SchedulingMain;