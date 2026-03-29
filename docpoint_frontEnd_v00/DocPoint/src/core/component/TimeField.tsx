import {
  TimeField as AriaTimeField,
} from 'react-aria-components';
import {DateInput, DateSegment} from './DatePicker';
import type { TimeValue } from 'react-aria-components';

interface TimeFieldProps{
  onChange: (value: TimeValue | null) => void;
  additionalClasses? : string;
}

export function TimeField({onChange, additionalClasses}:TimeFieldProps) {
  return (
    <AriaTimeField className={ additionalClasses? `${additionalClasses}` :"time-field"} onChange={onChange}>
      <DateInput className="time-input">
        {(segment) => <DateSegment segment={segment} className="time-segment" />}
      </DateInput>
    </AriaTimeField>
  );
}


export default TimeField;