"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import GoldenSweep from "@/components/animations/GoldenSweep";
import { LUXURY_EASE } from "@/hooks/animationConfig";

const AmbientParticles = dynamic(
  () => import("@/components/animations/AmbientParticles"),
  { ssr: false }
);

const features = [
  { num: "01", title: "Luxury Living", desc: "Fully furnished apartments" },
  { num: "02", title: "Direct Booking", desc: "No middlemen, best rates" },
  { num: "03", title: "Concierge", desc: "Personal services on demand" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Parallax background with Ken Burns */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 animate-ken-burns" />
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-gold)] rounded-full blur-[120px] animate-glow-pulse" />
      </motion.div>

      {/* Floating particles */}
      <AmbientParticles />

      {/* Glass card container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-8 w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-16">
          {/* Vertical text - desktop only */}
          <div
            className="hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2 flex-col gap-3 text-xs tracking-[0.3em] text-white/40 uppercase"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span>Premium</span>
            <span className="text-white/20">,</span>
            <span>Furnished</span>
            <span className="text-white/20">,</span>
            <span>Exclusive</span>
          </div>

          <motion.div
            className="max-w-3xl relative"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {/* Golden sweep overlay on heading area */}
            <GoldenSweep />

            {/* Heading line 1 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: LUXURY_EASE },
                },
              }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight">
                A new way
              </h1>
            </motion.div>

            {/* Heading line 2 with letter-spacing animation */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10, letterSpacing: "0.05em" },
                visible: {
                  opacity: 1,
                  y: 0,
                  letterSpacing: "0em",
                  transition: { duration: 1.2, ease: LUXURY_EASE },
                },
              }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight">
                of <span className="font-serif italic text-[var(--color-gold)]">Living.</span>
              </h1>
            </motion.div>

            {/* Subheading — delayed */}
            <motion.p
              className="text-lg md:text-xl text-white/60 max-w-lg mt-6"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, delay: 0.6, ease: LUXURY_EASE },
                },
              }}
            >
              Premium apartments in Tabata Kinyerezi, Dar es Salaam.
              Book directly with us.
            </motion.p>

            {/* CTA — blur to sharp */}
            <motion.div
              className="mt-8"
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.8, delay: 0.9, ease: LUXURY_EASE },
                },
              }}
            >
              <a
                href="#apartments"
                className="btn-elegant inline-flex items-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-semibold px-8 py-4 rounded-full text-lg"
              >
                <span>Explore Apartments</span>
                <span>&rarr;</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Feature cards row */}
          <motion.div
            className="mt-16 bg-white rounded-2xl p-6 md:p-8 grid md:grid-cols-3 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: LUXURY_EASE }}
          >
            {features.map((f) => (
              <div key={f.num}>
                <p className="text-[var(--color-gold)] text-sm font-bold mb-1">
                  No. {f.num}
                </p>
                <h3 className="text-black text-lg font-bold">{f.title}</h3>
                <p className="text-neutral-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
