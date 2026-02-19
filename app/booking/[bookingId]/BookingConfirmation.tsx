"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  staggerContainer,
  fadeUpChild,
} from "@/hooks/animationConfig";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";
import { formatDateLong } from "@/lib/utils/dates";
import { formatPrice } from "@/lib/utils/booking";
import type { Booking, BookingStatus } from "@/lib/types/database";

interface BookingConfirmationProps {
  booking: Booking;
  apartmentName: string;
  paymentStatus?: string | null;
  paymentProvider?: string | null;
  paidAt?: string | null;
}

export default function BookingConfirmation({
  booking,
  apartmentName,
  paymentStatus,
  paymentProvider,
  paidAt,
}: BookingConfirmationProps) {
  const nights = Math.round(
    (new Date(booking.check_out).getTime() -
      new Date(booking.check_in).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const isConfirmed = booking.status === "confirmed";
  const isPending = booking.status === "pending";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-24">
      <motion.div
        className="w-full max-w-lg"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Success / Pending icon */}
        <motion.div
          variants={fadeUpChild}
          className="text-center mb-8"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isConfirmed
                ? "bg-green-500/20 border border-green-500/30"
                : "bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30"
            }`}
          >
            {isConfirmed ? (
              <svg
                className="w-8 h-8 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-[var(--color-gold)]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isConfirmed ? "Booking Confirmed!" : "Booking Submitted"}
          </h1>
          <p className="text-white/50">
            {isConfirmed
              ? "Your payment was received. Your stay is locked in."
              : "Your booking is pending payment confirmation."}
          </p>
        </motion.div>

        {/* Booking card */}
        <motion.div
          variants={fadeUpChild}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">
                Booking Reference
              </p>
              <p className="text-white font-mono text-sm">
                {booking.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <BookingStatusBadge status={booking.status as BookingStatus} />
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Apartment</span>
              <span className="text-white font-semibold text-sm">
                {apartmentName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Check-in</span>
              <span className="text-white text-sm">
                {formatDateLong(booking.check_in)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Check-out</span>
              <span className="text-white text-sm">
                {formatDateLong(booking.check_out)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Duration</span>
              <span className="text-white text-sm">
                {nights} night{nights !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Guests</span>
              <span className="text-white text-sm">{booking.num_guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Guest Name</span>
              <span className="text-white text-sm">{booking.guest_name}</span>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-[var(--color-gold)] text-xl">
                  {formatPrice(booking.total_price)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="px-6 pb-6">
            {isConfirmed && paymentProvider && (
              <div className="rounded-xl bg-green-500/5 border border-green-500/10 p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-green-400/70">Payment Status</span>
                  <span className="text-green-400 font-semibold">Paid</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400/70">Provider</span>
                  <span className="text-green-400">{paymentProvider}</span>
                </div>
                {paidAt && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400/70">Paid On</span>
                    <span className="text-green-400">
                      {new Date(paidAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {isPending && (
              <div className="rounded-xl bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/10 p-4">
                <p className="text-xs text-[var(--color-gold)]/70">
                  Your booking is pending payment. Complete payment via mobile
                  money (M-Pesa, Tigo Pesa, Airtel Money) or bank transfer
                  (CRDB, NMB) to confirm your reservation.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeUpChild}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <Link
            href="/"
            className="btn-elegant inline-flex items-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-semibold px-8 py-3 rounded-full"
          >
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
