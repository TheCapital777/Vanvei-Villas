"use client";

import type { DateStatus } from "@/lib/utils/availability";

interface CalendarDayProps {
  date: string;
  day: number;
  status: DateStatus;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
  onClick: (date: string) => void;
}

export default function CalendarDay({
  date,
  day,
  status,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isDisabled,
  onClick,
}: CalendarDayProps) {
  const isUnavailable = status === "booked" || status === "blocked" || status === "past";

  const baseClasses = "relative w-full aspect-square flex items-center justify-center text-sm font-medium transition-all duration-200 rounded-lg";

  let stateClasses = "";

  if (isRangeStart || isRangeEnd) {
    stateClasses = "bg-[var(--color-gold)] text-black font-bold";
  } else if (isInRange) {
    stateClasses = "bg-[var(--color-gold)]/15 text-[var(--color-gold)]";
  } else if (isSelected) {
    stateClasses = "bg-[var(--color-gold)] text-black font-bold";
  } else if (status === "today") {
    stateClasses = "ring-1 ring-[var(--color-gold)]/40 text-white";
  } else if (isUnavailable) {
    stateClasses = "text-white/15 cursor-not-allowed";
  } else {
    stateClasses = "text-white/60 hover:bg-white/10 hover:text-white cursor-pointer";
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (!isDisabled && !isUnavailable) {
          onClick(date);
        }
      }}
      disabled={isDisabled || isUnavailable}
      className={`${baseClasses} ${stateClasses}`}
      title={
        status === "booked" ? "Booked" :
        status === "blocked" ? "Unavailable" :
        status === "past" ? "Past date" :
        undefined
      }
    >
      {day}
      {status === "booked" && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400/50" />
      )}
    </button>
  );
}
