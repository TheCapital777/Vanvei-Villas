"use client";

import { calculateNights, formatDateShort } from "@/lib/utils/dates";
import { formatPrice } from "@/lib/utils/booking";

interface BookingSummaryProps {
  apartmentName: string;
  checkIn: string;
  checkOut: string;
  pricePerNight: number;
  numGuests: number;
}

export default function BookingSummary({
  apartmentName,
  checkIn,
  checkOut,
  pricePerNight,
  numGuests,
}: BookingSummaryProps) {
  const nights = calculateNights(checkIn, checkOut);
  const total = nights * pricePerNight;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-white/70">Booking Summary</h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-white/50">
          <span>Apartment</span>
          <span className="text-white font-medium">{apartmentName}</span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>Check-in</span>
          <span className="text-white">{formatDateShort(checkIn)}</span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>Check-out</span>
          <span className="text-white">{formatDateShort(checkOut)}</span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>Guests</span>
          <span className="text-white">{numGuests}</span>
        </div>

        <div className="border-t border-white/10 pt-2 mt-2">
          <div className="flex justify-between text-white/50">
            <span>
              {formatPrice(pricePerNight)} x {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span className="text-white">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-bold text-white">Total</span>
            <span className="font-bold text-[var(--color-gold)] text-lg">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
