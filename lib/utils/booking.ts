/**
 * Booking utility functions.
 * Price calculation, validation helpers.
 */

import { calculateNights } from "./dates";

/** Calculate total price for a booking */
export function calculateTotalPrice(
  checkIn: string,
  checkOut: string,
  pricePerNight: number
): number {
  const nights = calculateNights(checkIn, checkOut);
  return nights * pricePerNight;
}

/** Format price for display (TZS - Tanzanian Shilling) */
export function formatPrice(amount: number): string {
  return `TZS ${amount.toLocaleString()}`;
}

/** Validate guest count */
export function validateGuestCount(
  numGuests: number,
  maxGuests: number
): boolean {
  return numGuests >= 1 && numGuests <= maxGuests;
}

/** Validate booking dates */
export function validateBookingDates(
  checkIn: string,
  checkOut: string,
  minNights: number
): { valid: boolean; error?: string } {
  const today = new Date().toISOString().split("T")[0];

  if (checkIn < today) {
    return { valid: false, error: "Check-in date cannot be in the past" };
  }

  if (checkOut <= checkIn) {
    return { valid: false, error: "Check-out must be after check-in" };
  }

  const nights = calculateNights(checkIn, checkOut);
  if (nights < minNights) {
    return {
      valid: false,
      error: `Minimum stay is ${minNights} nights`,
    };
  }

  return { valid: true };
}
