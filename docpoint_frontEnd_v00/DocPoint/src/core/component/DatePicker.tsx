import {
  Popover as AriaPopover,
  DatePicker as AriaDatePicker,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Button,
  Calendar as AriaCalendar,
  Heading,
  CalendarGrid,
  CalendarCell,
  Group
} from "react-aria-components";
import type { DateSegmentProps , DateInputProps, DateValue} from "react-aria-components";

interface DatePicker {
  onChange : (value: DateValue | null) => void;
  additionalClasses ?: string;
}


function DatePicker({onChange, additionalClasses}:DatePicker) {
  return (
    <AriaDatePicker className={additionalClasses? additionalClasses : "date-picker"} onChange={onChange} >
      <Group className="date-group">
        <DateInput className="date-input">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <Button className="field-Button">
            D
        </Button>
      </Group>
      <Popover>
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
}
function DateInput(props: DateInputProps) {
  return <AriaDateInput {...props} className="react-aria-DateInput inset" />;
}


function DateSegment(props: DateSegmentProps) {
  return <AriaDateSegment {...props} className="date-segment" />;
}

interface PopoverProps  {
  children: React.ReactNode;
  hideArrow?: boolean;
}

function Popover({ children, ...props }: PopoverProps) {
  return <AriaPopover {...props} placement="bottom" className="popover">{children}</AriaPopover>;
}


function Calendar () {
  return (
    <AriaCalendar className="calendar">
        <header className="calendar-header">
            <Button slot="previous" className="calendar-nav-btn">
                L
            </Button>
            <Heading className="calendar-heading"/>
            <Button slot="next" className="calendar-nav-btn">
                R
            </Button>
        </header>
        <CalendarGrid className="calendar-grid">
            {(date)=> <CalendarCell date={date} className="calendar-cell"/>}
        </CalendarGrid>
    </AriaCalendar>
);
}

export  {DatePicker,DateInput,DateSegment};