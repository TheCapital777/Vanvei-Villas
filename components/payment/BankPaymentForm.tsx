"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BANK_PROVIDERS } from "@/lib/azampay/config";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { BankProvider } from "@/lib/types/database";

interface BankPaymentFormProps {
  amount: number;
  onSubmit: (accountNumber: string, provider: BankProvider, otp: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function BankPaymentForm({
  amount,
  onSubmit,
  isSubmitting,
}: BankPaymentFormProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<BankProvider | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!selectedProvider) {
      setError("Please select your bank.");
      return;
    }

    if (!accountNumber || accountNumber.length < 5) {
      setError("Please enter a valid account number.");
      return;
    }

    if (!otp || otp.length < 4) {
      setError("Please enter the OTP from your bank.");
      return;
    }

    await onSubmit(accountNumber, selectedProvider, otp);
  };

  const formatAmount = (amt: number) => {
    return `TZS ${amt.toLocaleString()}`;
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300 text-sm";

  return (
    <div className="space-y-4">
      {/* Bank selection */}
      <div>
        <p className="text-xs font-medium text-white/50 mb-2">Select Bank</p>
        <div className="grid grid-cols-2 gap-2">
          {BANK_PROVIDERS.map((bank) => {
            const isSelected = selectedProvider === bank.id;
            return (
              <motion.button
                key={bank.id}
                onClick={() => setSelectedProvider(bank.id)}
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
                <span className="text-lg block mb-1">{bank.icon}</span>
                <span className={`text-xs font-medium ${isSelected ? "text-[var(--color-gold)]" : "text-white/70"}`}>
                  {bank.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Account number */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1">
          Account Number
        </label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter your bank account number"
          className={inputClasses}
        />
      </div>

      {/* OTP */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1">
          OTP (One-Time Password)
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP from your bank"
          className={inputClasses}
          maxLength={8}
        />
        <p className="text-[10px] text-white/30 mt-1">
          Request OTP from your bank app or USSD
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
        disabled={isSubmitting || !selectedProvider || !accountNumber || !otp}
        className="w-full bg-[var(--color-gold)] text-black font-bold py-3.5 rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Processing...</span>
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </div>
  );
}
