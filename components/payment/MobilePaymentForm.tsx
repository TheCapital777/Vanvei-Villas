"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MNO_PROVIDERS } from "@/lib/azampay/config";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { MNOProvider } from "@/lib/types/database";

interface MobilePaymentFormProps {
  amount: number;
  onSubmit: (phoneNumber: string, provider: MNOProvider) => Promise<void>;
  isSubmitting: boolean;
}

export default function MobilePaymentForm({
  amount,
  onSubmit,
  isSubmitting,
}: MobilePaymentFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<MNOProvider | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    // Validate phone
    const cleaned = phoneNumber.replace(/[\s\-+]/g, "");
    if (cleaned.length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!selectedProvider) {
      setError("Please select a mobile money provider.");
      return;
    }

    await onSubmit(phoneNumber, selectedProvider);
  };

  const formatAmount = (amt: number) => {
    return `TZS ${amt.toLocaleString()}`;
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300 text-sm";

  return (
    <div className="space-y-4">
      {/* Provider selection */}
      <div>
        <p className="text-xs font-medium text-white/50 mb-2">Select Provider</p>
        <div className="grid grid-cols-2 gap-2">
          {MNO_PROVIDERS.map((provider) => {
            const isSelected = selectedProvider === provider.id;
            return (
              <motion.button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`
                  p-3 rounded-xl border text-center transition-all duration-300
                  ${isSelected
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                  }
                `}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="text-lg block mb-1">{provider.icon}</span>
                <span className={`text-xs font-medium ${isSelected ? "text-[var(--color-gold)]" : "text-white/70"}`}>
                  {provider.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Phone number */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
            +255
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="7XX XXX XXX"
            className={`${inputClasses} pl-14`}
            maxLength={15}
          />
        </div>
        <p className="text-[10px] text-white/30 mt-1">
          A USSD prompt will be sent to this number
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Amount display */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
        <p className="text-xs text-white/40">Amount to pay</p>
        <p className="text-xl font-black text-[var(--color-gold)] mt-1">
          {formatAmount(amount)}
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedProvider || !phoneNumber}
        className="w-full bg-[var(--color-gold)] text-black font-bold py-3.5 rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Sending request...</span>
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </div>
  );
}
