"use client";

import { motion } from "motion/react";
import {
  LUXURY_EASE,
  fadeLeftVariant,
  fadeRightVariant,
  staggerContainer,
  fadeUpChild,
} from "@/hooks/animationConfig";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        >
          <p className="text-[var(--color-gold)] text-sm font-bold tracking-widest uppercase mb-3">
            Get in Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Contact Us
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact info — slides from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeLeftVariant}
          >
            <h3 className="text-xl font-bold text-white mb-8">
              Reach Out Anytime
            </h3>
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUpChild} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-gold)]/15 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[var(--color-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Address</p>
                  <p className="text-white/50 text-sm">
                    Tabata Kinyerezi, Dar es Salaam, Tanzania
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUpChild} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-gold)]/15 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[var(--color-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p className="text-white/50 text-sm">+255 XXX XXX XXX</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUpChild} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--color-gold)]/15 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[var(--color-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p className="text-white/50 text-sm">info@vanveivillas.com</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact form — slides from right */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeRightVariant}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8"
          >
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent resize-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="btn-elegant w-full border border-[var(--color-gold)] text-[var(--color-gold)] font-bold py-3.5 rounded-full"
              >
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
