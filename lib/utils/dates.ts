/**
 * Date utility functions for the booking system.
 * All dates are handled as ISO strings (YYYY-MM-DD) to avoid timezone issues.
 */

/** Format a Date to YYYY-MM-DD string */
export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Parse a YYYY-MM-DD string to a Date (at midnight local time) */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Get number of nights between two dates */
export function calculateNights(checkIn: string, checkOut: string): number {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** Generate an array of all dates in a range (inclusive of start, exclusive of end) */
export function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = parseDate(start);
  const endDate = parseDate(end);

  while (current < endDate) {
    dates.push(toISODate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/** Get the first day of a month */
export function getFirstOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/** Get the number of days in a month */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Get the day of week the month starts on (0=Sunday) */
export function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Format a date for display: "Mon, Jan 15" */
export function formatDateShort(dateStr: string): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Format a date for display: "January 15, 2026" */
export function formatDateLong(dateStr: string): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format month and year: "February 2026" */
export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

/** Check if a date string is today */
export function isToday(dateStr: string): boolean {
  return dateStr === toISODate(new Date());
}

/** Check if a date string is in the past */
export function isPast(dateStr: string): boolean {
  return dateStr < toISODate(new Date());
}
