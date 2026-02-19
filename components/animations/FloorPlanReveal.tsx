"use client";

import { motion } from "motion/react";
import { LUXURY_EASE } from "@/hooks/animationConfig";

export default function FloorPlanReveal() {
  const pathTransition = {
    duration: 2.5,
    ease: LUXURY_EASE,
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full max-w-md mx-auto opacity-30"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer walls */}
        <motion.rect
          x="20" y="20" width="360" height="260" rx="2"
          stroke="#b37212" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ ...pathTransition, delay: 0 }}
        />
        {/* Living room divider */}
        <motion.line
          x1="200" y1="20" x2="200" y2="180"
          stroke="#b37212" strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ ...pathTransition, delay: 0.3 }}
        />
        {/* Bedroom divider */}
        <motion.line
          x1="200" y1="180" x2="380" y2="180"
          stroke="#b37212" strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ ...pathTransition, delay: 0.5 }}
        />
        {/* Kitchen divider */}
        <motion.line
          x1="120" y1="180" x2="200" y2="180"
          stroke="#b37212" strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ ...pathTransition, delay: 0.6 }}
        />
        {/* Bathroom */}
        <motion.rect
          x="20" y="180" width="100" height="100" rx="1"
          stroke="#b37212" strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ ...pathTransition, delay: 0.8 }}
        />
        {/* Door arcs */}
        <motion.path
          d="M200 140 Q220 140 220 160"
          stroke="#b37212" strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ ...pathTransition, delay: 1.0 }}
        />
        <motion.path
          d="M90 180 Q90 200 70 200"
          stroke="#b37212" strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ ...pathTransition, delay: 1.1 }}
        />
        {/* Room labels (fade in after lines) */}
        <motion.text
          x="90" y="110" textAnchor="middle"
          fill="#b37212" fontSize="11" fontFamily="sans-serif"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2.0 }}
        >
          LIVING
        </motion.text>
        <motion.text
          x="290" y="100" textAnchor="middle"
          fill="#b37212" fontSize="11" fontFamily="sans-serif"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          BEDROOM
        </motion.text>
        <motion.text
          x="290" y="230" textAnchor="middle"
          fill="#b37212" fontSize="11" fontFamily="sans-serif"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2.4 }}
        >
          KITCHEN
        </motion.text>
        <motion.text
          x="70" y="240" textAnchor="middle"
          fill="#b37212" fontSize="10" fontFamily="sans-serif"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2.6 }}
        >
          BATH
        </motion.text>
      </svg>
    </motion.div>
  );
}
