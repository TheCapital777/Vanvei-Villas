"use client";

import { motion } from "motion/react";
import type { PaymentMethod } from "@/lib/types/database";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const METHODS = [
  {
    id: "mno" as PaymentMethod,
    label: "Mobile Money",
    description: "M-Pesa, Tigo Pesa, Airtel Money, Halopesa",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    id: "bank" as PaymentMethod,
    label: "Bank Payment",
    description: "CRDB Bank, NMB Bank",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
  },
];

export default function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-white/70">Choose Payment Method</p>
      <div className="grid grid-cols-1 gap-3">
        {METHODS.map((method) => {
          const isSelected = selected === method.id;
          return (
            <motion.button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`
                relative w-full text-left p-4 rounded-xl border transition-all duration-300
                ${isSelected
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
                }
              `}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isSelected ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)]" : "bg-white/5 text-white/50"}
                  `}
                >
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isSelected ? "text-[var(--color-gold)]" : "text-white"}`}>
                    {method.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{method.description}</p>
                </div>
                {/* Radio indicator */}
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? "border-[var(--color-gold)]" : "border-white/20"}
                  `}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full bg-[var(--color-gold)]"
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
