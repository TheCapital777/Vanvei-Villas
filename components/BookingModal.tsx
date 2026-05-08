"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { APARTMENTS, type Apartment } from "@/lib/constants/apartments";
import BookingWidget from "@/app/apartments/[slug]/BookingWidget";

type ApartmentData = Apartment;

interface BookingModalProps {
  apartment: ApartmentData | null;
  onClose: () => void;
}

export default function BookingModal({ apartment, onClose }: BookingModalProps) {
  // Pre-compute thumbnail for TypeScript narrowing
  const thumb: string | null = apartment
    ? (apartment.cover ?? apartment.images[0] ?? null)
    : null;

  // Lock scroll when open
  useEffect(() => {
    if (apartment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [apartment]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {apartment && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet — slides up from bottom on mobile, centered on desktop */}
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[70] md:inset-0 md:flex md:items-center md:justify-center md:p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full md:max-w-lg bg-[#0f0f0f] md:rounded-2xl rounded-t-3xl border border-white/10 shadow-2xl flex flex-col max-h-[92vh] md:max-h-[88vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10 flex-shrink-0">
                {/* Villa thumbnail */}
                {thumb && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <Image
                      src={thumb}
                      alt={apartment?.name ?? ""}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--color-gold)] text-[10px] font-bold tracking-widest uppercase">
                    {apartment.beds} {apartment.beds === 1 ? "Bedroom" : "Bedrooms"} · Up to {apartment.guests} guests
                  </p>
                  <h2 className="text-white font-bold text-lg leading-tight truncate">{apartment.name}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable booking widget */}
              <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>
                <BookingWidget apartment={apartment} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
