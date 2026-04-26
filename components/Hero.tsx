"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import GoldenSweep from "@/components/animations/GoldenSweep";
import { LUXURY_EASE } from "@/hooks/animationConfig";
import { HERO_IMAGES } from "@/lib/constants/hero";

const AmbientParticles = dynamic(
  () => import("@/components/animations/AmbientParticles"),
  { ssr: false }
);

const features = [
  { num: "01", title: "Luxury Living",   desc: "Fully furnished villas"          },
  { num: "02", title: "Direct Booking",  desc: "No middlemen, best rates"        },
  { num: "03", title: "Concierge",       desc: "Personal services on demand"     },
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir]     = useState(1);

  const next = useCallback(() => {
    setDir(1);
    setIndex(i => (i + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    if (HERO_IMAGES.length < 2) return;
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [next]);

  if (!HERO_IMAGES.length) {
    return (
      <div className="w-full h-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <p className="text-white/20 text-sm">Photos coming soon</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 rounded-2xl p-[2px]" style={{
      background: "linear-gradient(135deg, #c8912a, #e8b060, #7a5518, #c8912a)",
      boxShadow: "0 0 40px rgba(200,145,42,0.35), 0 20px 60px rgba(0,0,0,0.6)",
    }}>
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <AnimatePresence custom={dir} mode="sync">
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, scale: 1.06, x: dir * 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, x: dir * -30 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.1, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGES[index]}
              alt="Vanvei Villas"
              fill
              className="object-cover"
              priority={index === 0}
              sizes="45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Gold corner accents inside */}
        <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 rounded-tr-md pointer-events-none" style={{borderColor:"#c8912a"}} />
        <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 rounded-bl-md pointer-events-none" style={{borderColor:"#c8912a"}} />

        {/* Dot indicators */}
        {HERO_IMAGES.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {HERO_IMAGES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                animate={{ width: i === index ? 20 : 5, opacity: i === index ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
                className="h-[4px] rounded-full bg-[var(--color-gold)]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="/images/apartments/vv-20.jpg"
          alt="Vanvei Villas"
          fill
          className="object-cover scale-105"
          priority
          sizes="100vw"
        />
        {/* Dark overlay — heavier than before, no warm tint */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Subtle ambient glow — left side only, doesn't bleed onto text */}
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15" style={{background:"#c8912a"}} />
      </motion.div>

      <AmbientParticles />

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 pt-24 pb-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ── MOBILE: Carousel first, then text. DESKTOP: Text left, Carousel right ── */}

          {/* Carousel — shown first on mobile */}
          <motion.div
            className="relative w-full h-[260px] sm:h-[340px] lg:h-[460px] lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: LUXURY_EASE }}
          >
            <div className="absolute -inset-2 rounded-3xl border border-[var(--color-gold)]/10" />
            <HeroCarousel />
          </motion.div>

          {/* Text */}
          <motion.div
            className="relative lg:order-1 w-full"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <GoldenSweep />

            <motion.p
              className="text-[var(--color-gold)] text-xs font-bold tracking-[0.3em] uppercase mb-3"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: LUXURY_EASE } } }}
            >
              Tabata Kinyerezi · Dar es Salaam
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: LUXURY_EASE } } }}
            >
              A new way
            </motion.h1>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-4"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: LUXURY_EASE } } }}
            >
              of <span className="font-serif italic text-[var(--color-gold)]">Living.</span>
            </motion.h1>

            <motion.p
              className="text-white/60 text-sm sm:text-base md:text-lg max-w-md leading-relaxed"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: LUXURY_EASE } } }}
            >
              Premium furnished villas — fully equipped, full AC, free WiFi
              and secure parking. 10 minutes from the airport.
            </motion.p>

            <motion.div
              className="mt-6"
              variants={{ hidden: { opacity: 0, y: 16, filter: "blur(6px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, delay: 0.35, ease: LUXURY_EASE } } }}
            >
              <a
                href="#apartments"
                className="btn-elegant inline-flex items-center gap-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base"
              >
                <span>Explore Villas</span>
                <span>&rarr;</span>
              </a>
            </motion.div>
          </motion.div>

        </div>

        {/* ── Feature cards — horizontal scroll on mobile, grid on desktop ── */}
        <motion.div
          className="mt-8 lg:mt-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: LUXURY_EASE }}
        >
          <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-none bg-white rounded-2xl p-5 md:p-8">
            {features.map((f) => (
              <div key={f.num} className="min-w-[200px] lg:min-w-0">
                <p className="text-[var(--color-gold)] text-xs font-bold mb-1">No. {f.num}</p>
                <h3 className="text-black text-base font-bold">{f.title}</h3>
                <p className="text-neutral-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
