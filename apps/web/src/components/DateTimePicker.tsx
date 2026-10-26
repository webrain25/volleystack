import type { ChangeEvent } from 'react';
import { TimePicker } from './TimePicker';

interface DateTimePickerProps {
  value?: string; // Formato ISO o "YYYY-MM-DDTHH:mm"
  onChange: (value: string) => void;
  className?: string;
}

export function DateTimePicker({ value, onChange, className = '' }: DateTimePickerProps) {
  // Parsing date and time from value
  let datePart = '';
  let timePart = '20:00';

  if (value) {
    if (value.includes('T')) {
      const [d, t] = value.split('T');
      datePart = d;
      timePart = t ? t.slice(0, 5) : '20:00';
    } else {
      datePart = value.slice(0, 10);
    }
  } else {
    // Default to today
    const now = new Date();
    datePart = now.toISOString().slice(0, 10);
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    datePart = newDate;
    if (newDate) {
      onChange(`${newDate}T${timePart || '20:00'}`);
    } else {
      onChange('');
    }
  };

  const handleTimeChange = (newTime: string) => {
    timePart = newTime;
    const dateToUse = datePart || new Date().toISOString().slice(0, 10);
    onChange(`${dateToUse}T${newTime}`);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${className}`}>
      <div>
        <input
          type="date"
          value={datePart}
          onChange={handleDateChange}
          className="saas-input dark:[color-scheme:dark]"
        />
      </div>
      <div>
        <TimePicker value={timePart} onChange={handleTimeChange} />
      </div>
    </div>
  );
}
