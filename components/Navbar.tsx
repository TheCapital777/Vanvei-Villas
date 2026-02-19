"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/auth/UserMenu";
import AuthModal from "@/components/auth/AuthModal";

const navLinks = [
  { label: "Apartments", href: "#apartments", id: "apartments" },
  { label: "About", href: "#about", id: "about" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const activeSection = useActiveSection();
  const { isAuthenticated, isLoading } = useAuth();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderColor: scrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18">
          <a href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Vanvei Villas" width={46} height={46} className="logo-3d" />
            <span className="text-lg tracking-wide text-white">
              <span className="font-serif italic font-semibold text-xl">Vanvei</span>{" "}
              <span className="font-sans font-bold uppercase text-sm tracking-[0.2em]">Villas</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-500 ${
                  activeSection === link.id
                    ? "text-[var(--color-gold)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="h-0.5 bg-[var(--color-gold)] mt-1 rounded-full"
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                )}
              </a>
            ))}
            <a
              href="#apartments"
              className="btn-elegant border border-[var(--color-gold)] text-[var(--color-gold)] text-sm font-semibold px-6 py-2.5 rounded-full"
            >
              <span>Book Now</span>
            </a>

            {/* Auth button / User menu */}
            {!isLoading && (
              isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-500"
                >
                  Sign In
                </button>
              )
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 pb-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm font-medium tracking-wide transition-colors duration-500 ${
                  activeSection === link.id ? "text-[var(--color-gold)]" : "text-white/70"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#apartments"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 text-center bg-[var(--color-gold)] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--color-gold-dark)] transition-colors"
            >
              Book Now
            </a>
            {!isLoading && !isAuthenticated && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setAuthModalOpen(true);
                }}
                className="block w-full mt-3 text-center text-white/70 text-sm font-medium py-2.5"
              >
                Sign In
              </button>
            )}
            {!isLoading && isAuthenticated && (
              <div className="mt-3 flex justify-center">
                <UserMenu />
              </div>
            )}
          </motion.div>
        )}
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
