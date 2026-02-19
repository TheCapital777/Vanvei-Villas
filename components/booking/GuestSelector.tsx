"use client";

interface GuestSelectorProps {
  value: number;
  maxGuests: number;
  onChange: (count: number) => void;
}

export default function GuestSelector({
  value,
  maxGuests,
  onChange,
}: GuestSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        Guests
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <span className="text-lg font-bold text-white w-8 text-center">
          {value}
        </span>

        <button
          type="button"
          onClick={() => onChange(Math.min(maxGuests, value + 1))}
          disabled={value >= maxGuests}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <span className="text-xs text-white/30 ml-1">
          max {maxGuests}
        </span>
      </div>
    </div>
  );
}
