"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  LUXURY_EASE,
  fadeUpVariant,
  fadeLeftVariant,
  fadeRightVariant,
  staggerContainer,
  fadeUpChild,
} from "@/hooks/animationConfig";
import BookingWidget from "./BookingWidget";
import type { APARTMENTS } from "@/lib/constants/apartments";

type ApartmentData = (typeof APARTMENTS)[number];

const amenityIcons: Record<string, string> = {
  "Wi-Fi": "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0",
  "Air Conditioning": "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "Smart TV": "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  Kitchen: "M3 3h18v18H3V3zm3 3v4h12V6H6z",
  "Full Kitchen": "M3 3h18v18H3V3zm3 3v4h12V6H6z",
  "Gourmet Kitchen": "M3 3h18v18H3V3zm3 3v4h12V6H6z",
  Balcony: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4",
  Washer: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  Workspace: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  "Dining Area": "M3 3h18v18H3V3zm3 3v4h12V6H6z",
  "Panoramic Views": "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  "Premium Linens": "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  "Espresso Machine": "M17 8h1a4 4 0 110 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm5-3a2 2 0 114 0",
};

export default function ApartmentDetail({
  apartment,
}: {
  apartment: ApartmentData;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero banner */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${apartment.gradient}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/50" />

        {/* Back button */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
          <Link
            href="/#apartments"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Apartments
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
            >
              <p className="text-[var(--color-gold)] text-sm font-bold tracking-widest uppercase mb-2">
                {apartment.beds} {apartment.beds === 1 ? "Bedroom" : "Bedrooms"} &middot; Up to {apartment.guests} Guests
              </p>
              <h1 className="text-4xl md:text-6xl font-black text-white">
                {apartment.name}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeLeftVariant}
            >
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  About This Apartment
                </h2>
                <p className="text-white/50 leading-relaxed text-lg">
                  {apartment.description}
                </p>
                <p className="text-white/50 leading-relaxed mt-4">
                  Located in the heart of Tabata Kinyerezi, Dar es Salaam, this apartment offers
                  modern comfort with premium amenities. Enjoy direct booking with Vanvei Villas —
                  no middlemen, no hidden fees.
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Amenities
                </h2>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {apartment.amenities.map((amenity) => (
                    <motion.div
                      key={amenity}
                      variants={fadeUpChild}
                      className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[var(--color-gold)]/15 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={amenityIcons[amenity] || "M5 13l4 4L19 7"}
                          />
                        </svg>
                      </div>
                      <span className="text-white/70 text-sm font-medium">
                        {amenity}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-3 gap-6 py-8 border-t border-b border-white/10">
                <div className="text-center">
                  <p className="text-3xl font-black text-white">${apartment.price}</p>
                  <p className="text-white/50 text-sm mt-1">per night</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{apartment.beds}</p>
                  <p className="text-white/50 text-sm mt-1">{apartment.beds === 1 ? "Bedroom" : "Bedrooms"}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{apartment.guests}</p>
                  <p className="text-white/50 text-sm mt-1">Max Guests</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Widget (sticky) */}
          <motion.div
            className="lg:col-span-1"
            initial="hidden"
            animate="visible"
            variants={fadeRightVariant}
          >
            <div className="lg:sticky lg:top-24">
              <BookingWidget apartment={apartment} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
