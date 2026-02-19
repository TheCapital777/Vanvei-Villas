"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { LUXURY_EASE } from "@/hooks/animationConfig";
import { formatMonthYear, calculateNights } from "@/lib/utils/dates";
import CalendarGrid from "./CalendarGrid";

interface DateRangePickerProps {
  bookedDates: Set<string>;
  blockedDates: Set<string>;
  minNights: number;
  checkIn: string | null;
  checkOut: string | null;
  onDateChange: (checkIn: string | null, checkOut: string | null) => void;
}

export default function DateRangePicker({
  bookedDates,
  blockedDates,
  minNights,
  checkIn,
  checkOut,
  onDateChange,
}: DateRangePickerProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const goToPrevMonth = () => {
    const current = new Date(viewYear, viewMonth - 1, 1);
    // Don't go before current month
    if (current >= new Date(now.getFullYear(), now.getMonth(), 1)) {
      setViewMonth(viewMonth - 1);
      if (viewMonth - 1 < 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      }
    }
  };

  const goToNextMonth = () => {
    if (viewMonth + 1 > 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = useCallback(
    (date: string) => {
      if (!checkIn || (checkIn && checkOut)) {
        // Start new selection
        onDateChange(date, null);
      } else {
        // Selecting end date
        if (date <= checkIn) {
          // If clicking before start, reset
          onDateChange(date, null);
        } else {
          const nights = calculateNights(checkIn, date);
          if (nights < minNights) {
            // Don't allow less than minimum stay
            return;
          }
          onDateChange(checkIn, date);
        }
      }
    },
    [checkIn, checkOut, minNights, onDateChange]
  );

  const isPrevDisabled =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          disabled={isPrevDisabled}
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <motion.p
          key={`${viewYear}-${viewMonth}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: LUXURY_EASE }}
          className="text-sm font-semibold text-white"
        >
          {formatMonthYear(viewYear, viewMonth)}
        </motion.p>

        <button
          onClick={goToNextMonth}
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <CalendarGrid
        year={viewYear}
        month={viewMonth}
        bookedDates={bookedDates}
        blockedDates={blockedDates}
        selectedStart={checkIn}
        selectedEnd={checkOut}
        hoverDate={hoverDate}
        onDateClick={handleDateClick}
        onDateHover={setHoverDate}
        minNights={minNights}
      />

      {/* Selection info */}
      {checkIn && (
        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
          {checkOut ? (
            <p>
              {calculateNights(checkIn, checkOut)} night{calculateNights(checkIn, checkOut) !== 1 ? "s" : ""} selected
            </p>
          ) : (
            <p>Select check-out date (min. {minNights} nights)</p>
          )}
        </div>
      )}
    </div>
  );
}
