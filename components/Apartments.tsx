"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LUXURY_EASE,
  staggerContainer,
  fadeUpChild,
} from "@/hooks/animationConfig";
import { APARTMENTS, type Apartment } from "@/lib/constants/apartments";
import { formatPrice } from "@/lib/utils/booking";

function ApartmentCard({ apt }: { apt: Apartment }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Show cover at rest; cycle through images on hover
  const displaySrc: string | null =
    !hovered && apt.cover
      ? apt.cover
      : apt.images.length > 0
      ? apt.images[imgIndex]
      : null;

  useEffect(() => {
    if (hovered && apt.images.length > 0) {
      timerRef.current = setInterval(() => {
        setImgIndex((i) => (i + 1) % apt.images.length);
      }, 2800);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setImgIndex(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hovered, apt.images.length]);

  return (
    <motion.div
      variants={fadeUpChild}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(200, 168, 78, 0.12)" }}
      transition={{ duration: 0.4, ease: LUXURY_EASE }}
      className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-[var(--color-gold)]/30 transition-colors duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="h-56 overflow-hidden relative bg-[#161616]">
        {!displaySrc ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-sm">Photos coming soon</span>
          </div>
        ) : (
        <AnimatePresence mode="sync">
          <motion.div
            key={displaySrc}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.1, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={displaySrc}
              alt={apt.name}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Dot indicators on hover */}
        {apt.images.length > 0 && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {apt.images.map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full transition-all duration-300"
              style={{
                background: i === imgIndex ? "var(--color-gold)" : "rgba(255,255,255,0.4)",
                width: i === imgIndex ? "12px" : "4px",
              }}
            />
          ))}
        </div>}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{apt.name}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-5">
          {apt.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-white/40 mb-6">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
            {apt.beds} {apt.beds === 1 ? "Bedroom" : "Bedrooms"}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Up to {apt.guests} Guests
          </span>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-white/10">
          <p className="text-2xl font-bold text-white">
            {formatPrice(apt.price)}
            <span className="text-sm font-normal text-white/40"> / night</span>
          </p>
          <Link
            href={`/apartments/${apt.slug}#booking`}
            className="bg-[var(--color-gold)] text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-300 tracking-wide uppercase"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Apartments() {
  return (
    <section id="apartments" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        >
          <p className="text-[var(--color-gold)] text-sm font-bold tracking-widest uppercase mb-3">
            Our Villas
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Find Your Perfect Stay
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {APARTMENTS.map((apt) => (
            <ApartmentCard key={apt.slug} apt={apt} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
