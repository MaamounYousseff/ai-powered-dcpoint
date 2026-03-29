// ── helpers ────────────────────────────────────────────────────
const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getDayName(dateStr: string): string {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : DAY_NAMES[d.getDay()];
}


export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const display = hours % 12 || 12;
  return `${display}:${String(mins).padStart(2, '0')} ${ampm}`;
}


//logic



