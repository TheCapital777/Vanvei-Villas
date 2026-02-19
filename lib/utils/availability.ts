/**
 * Availability utility functions.
 * Pure functions for date range validation and overlap checks.
 */

/** Check if two date ranges overlap */
export function doRangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

/** Check if a specific date falls within a range (inclusive start, exclusive end) */
export function isDateInRange(
  date: string,
  start: string,
  end: string
): boolean {
  return date >= start && date < end;
}

/** Validate minimum stay requirement */
export function validateMinStay(
  checkIn: string,
  checkOut: string,
  minNights: number
): boolean {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return nights >= minNights;
}

/** Check if a date is available given arrays of booked and blocked date strings */
export function isDateAvailable(
  date: string,
  bookedDates: string[],
  blockedDates: string[]
): boolean {
  return !bookedDates.includes(date) && !blockedDates.includes(date);
}

export type DateStatus = "available" | "booked" | "blocked" | "past" | "today";

/** Get the status of a date */
export function getDateStatus(
  dateStr: string,
  bookedDates: Set<string>,
  blockedDates: Set<string>,
  today: string
): DateStatus {
  if (dateStr < today) return "past";
  if (dateStr === today) return "today";
  if (bookedDates.has(dateStr)) return "booked";
  if (blockedDates.has(dateStr)) return "blocked";
  return "available";
}
