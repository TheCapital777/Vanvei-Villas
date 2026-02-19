"use client";

import { useMemo } from "react";
import { getDaysInMonth, getStartDayOfWeek, toISODate } from "@/lib/utils/dates";
import { getDateStatus, type DateStatus } from "@/lib/utils/availability";
import CalendarDay from "./CalendarDay";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface CalendarGridProps {
  year: number;
  month: number;
  bookedDates: Set<string>;
  blockedDates: Set<string>;
  selectedStart: string | null;
  selectedEnd: string | null;
  hoverDate: string | null;
  onDateClick: (date: string) => void;
  onDateHover: (date: string | null) => void;
  minNights: number;
}

export default function CalendarGrid({
  year,
  month,
  bookedDates,
  blockedDates,
  selectedStart,
  selectedEnd,
  hoverDate,
  onDateClick,
  onDateHover,
  minNights,
}: CalendarGridProps) {
  const today = toISODate(new Date());
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfWeek(year, month);

  const days = useMemo(() => {
    const result: Array<{ date: string; day: number; status: DateStatus } | null> = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      result.push(null);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const status = getDateStatus(date, bookedDates, blockedDates, today);
      result.push({ date, day: d, status });
    }

    return result;
  }, [year, month, daysInMonth, startDay, bookedDates, blockedDates, today]);

  // Determine range display
  const effectiveEnd = selectedEnd || hoverDate;

  const isInRange = (date: string): boolean => {
    if (!selectedStart || !effectiveEnd) return false;
    return date > selectedStart && date < effectiveEnd;
  };

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-white/30 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} />;
          }

          const isRangeStart = day.date === selectedStart;
          const isRangeEnd = day.date === (selectedEnd || hoverDate);
          const inRange = isInRange(day.date);

          // Disable dates that would violate min stay
          const isDisabled = false;

          return (
            <div
              key={day.date}
              onMouseEnter={() => onDateHover(day.date)}
              onMouseLeave={() => onDateHover(null)}
            >
              <CalendarDay
                date={day.date}
                day={day.day}
                status={day.status}
                isSelected={isRangeStart || (!!selectedEnd && isRangeEnd)}
                isInRange={inRange}
                isRangeStart={isRangeStart}
                isRangeEnd={!!selectedStart && !!effectiveEnd && isRangeEnd && day.date !== selectedStart}
                isDisabled={isDisabled}
                onClick={onDateClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
