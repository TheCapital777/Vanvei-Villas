"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LUXURY_EASE } from "@/hooks/animationConfig";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/actions/auth";

export default function UserMenu() {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "G";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 flex items-center justify-center text-[var(--color-gold)] text-xs font-bold hover:bg-[var(--color-gold)]/30 transition-all duration-300"
      >
        {initials}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: LUXURY_EASE }}
            className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white truncate">
                {profile?.full_name || "Guest"}
              </p>
              <p className="text-xs text-white/40 truncate">
                {profile?.role === "admin" ? "Admin" : "Guest"}
              </p>
            </div>

            <div className="py-1">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
