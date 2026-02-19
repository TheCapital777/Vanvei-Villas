"use client";

import type { BookingStatus } from "@/lib/types/database";

const statusConfig: Record<BookingStatus, { label: string; classes: string }> = {
  pending: {
    label: "Pending",
    classes: "border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold)]/10",
  },
  confirmed: {
    label: "Confirmed",
    classes: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
  },
  cancelled: {
    label: "Cancelled",
    classes: "border-red-500 text-red-400 bg-red-500/10",
  },
};

export default function BookingStatusBadge({
  status,
}: {
  status: BookingStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
