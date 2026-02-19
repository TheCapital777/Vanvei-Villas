"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { LUXURY_EASE } from "@/hooks/animationConfig";

export default function Footer() {
  return (
    <footer className="animate-footer-gradient border-t border-white/10 py-12">
      <motion.div
        className="max-w-7xl mx-auto px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: LUXURY_EASE }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Vanvei Villas"
              width={40}
              height={40}
              className="logo-3d"
            />
            <div>
              <p className="text-lg text-white">
                <span className="font-serif italic font-semibold text-xl">Vanvei</span>{" "}
                <span className="font-sans font-bold uppercase text-sm tracking-[0.2em]">Villas</span>
              </p>
              <p className="text-sm text-white/40">
                Premium apartments in Dar es Salaam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <a
              href="#apartments"
              className="text-white/50 hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              Apartments
            </a>
            <a
              href="#about"
              className="text-white/50 hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-white/50 hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Elegant CTA */}
        <div className="text-center mt-10 mb-8">
          <a
            href="#apartments"
            className="btn-elegant inline-block border border-[var(--color-gold)] text-[var(--color-gold)] font-semibold px-10 py-3.5 rounded-full text-sm tracking-wide"
          >
            <span>Book Your Stay</span>
          </a>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/30">
          <p>
            &copy; {new Date().getFullYear()} Vanvei Villas. All rights
            reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
