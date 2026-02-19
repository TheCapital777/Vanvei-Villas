"use client";

import { motion } from "motion/react";
import {
  LUXURY_EASE,
  fadeLeftVariant,
  fadeRightVariant,
  staggerContainer,
  fadeUpChild,
} from "@/hooks/animationConfig";
import CounterNumber from "@/components/animations/CounterNumber";
import FloorPlanReveal from "@/components/animations/FloorPlanReveal";

const features = [
  "Fully furnished & move-in ready",
  "24/7 security & power backup",
  "Personal concierge services",
  "Direct booking — best rates guaranteed",
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text — fades in from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeLeftVariant}
          >
            <p className="text-[var(--color-gold)] text-sm font-bold tracking-widest uppercase mb-3">
              About Us
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              A New Standard of Living in Dar es Salaam
            </h2>
            <p className="text-white/50 leading-relaxed mb-4">
              Vanvei Villas is a premium apartment brand located in Tabata
              Kinyerezi, one of Dar es Salaam&apos;s most connected and
              fast-growing neighborhoods. We offer modern, fully-furnished
              apartments designed for comfort, style, and convenience.
            </p>
            <p className="text-white/50 leading-relaxed mb-8">
              Whether you&apos;re visiting Tanzania for business, leisure, or an
              extended stay, Vanvei Villas provides a home-away-from-home
              experience with premium amenities, personal concierge services,
              and the flexibility to book directly — no middlemen, no hidden
              fees.
            </p>

            {/* Feature list with stagger */}
            <motion.ul
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUpChild}
                  className="flex items-center gap-3 text-white/80"
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-[var(--color-gold)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right column — floor plan + placeholder */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeRightVariant}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm h-auto min-h-96 md:min-h-[520px] flex flex-col items-center justify-center relative overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/5 to-transparent" />
            <div className="relative w-full">
              <FloorPlanReveal />
              <p className="text-center text-white/25 text-xs mt-4 tracking-widest uppercase">
                Sample Floor Plan
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats counters row */}
        <motion.div
          className="mt-20 grid grid-cols-3 gap-8 py-12 border-t border-b border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        >
          <CounterNumber end={500} suffix="+" label="Happy Guests" />
          <CounterNumber
            end={4.9}
            decimals={1}
            label="Average Rating"
            duration={2000}
          />
          <CounterNumber end={3} label="Apartment Types" duration={1500} />
        </motion.div>
      </div>
    </section>
  );
}
