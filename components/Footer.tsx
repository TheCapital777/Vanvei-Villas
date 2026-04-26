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
                Premium villas in Dar es Salaam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <a
              href="#apartments"
              className="text-white/50 hover:text-[var(--color-gold)] transition-colors duration-500"
            >
              Villas
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

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/30">
          <p>&copy; {new Date().getFullYear()} Vanvei Villas. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="tel:+255710739543" className="hover:text-[var(--color-gold)] transition-colors">+255 710 739 543</a>
            <a href="tel:+255754274616" className="hover:text-[var(--color-gold)] transition-colors">+255 754 274 616</a>
            <a href="https://vanveivillas.com" className="hover:text-[var(--color-gold)] transition-colors">vanveivillas.com</a>
            <a
              href="https://maps.app.goo.gl/EARVVnYTM9jhLWZS7"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-gold)] transition-colors"
              aria-label="Location"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/vanvei.villas/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-gold)] transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
