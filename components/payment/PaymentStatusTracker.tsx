"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { checkPaymentStatus } from "@/actions/payment";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { PaymentStatus } from "@/lib/types/database";

interface PaymentStatusTrackerProps {
  paymentId: string;
  bookingId: string;
  provider: string;
  message: string;
}

export default function PaymentStatusTracker({
  paymentId,
  bookingId,
  provider,
  message,
}: PaymentStatusTrackerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState("");

  const MAX_POLLS = 60; // Poll for up to 5 minutes (every 5 seconds)

  const pollStatus = useCallback(async () => {
    try {
      const result = await checkPaymentStatus(paymentId);
      if (result.success && result.status) {
        setStatus(result.status as PaymentStatus);

        if (result.status === "completed") {
          // Payment confirmed — redirect to booking confirmation
          setTimeout(() => {
            router.push(`/booking/${bookingId}`);
          }, 2000);
          return true; // stop polling
        }

        if (result.status === "failed") {
          setError(result.failureReason || "Payment failed.");
          return true; // stop polling
        }
      }
    } catch {
      // silently continue polling
    }
    return false;
  }, [paymentId, bookingId, router]);

  useEffect(() => {
    if (status === "completed" || status === "failed" || pollCount >= MAX_POLLS) {
      return;
    }

    const timer = setTimeout(async () => {
      const done = await pollStatus();
      if (!done) {
        setPollCount((c) => c + 1);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pollCount, status, pollStatus]);

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
      case "initiated":
        return {
          icon: <LoadingSpinner size="lg" />,
          title: "Waiting for Payment",
          description: message,
          color: "text-[var(--color-gold)]",
        };
      case "completed":
        return {
          icon: (
            <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          ),
          title: "Payment Confirmed!",
          description: "Your booking has been confirmed. Redirecting...",
          color: "text-green-400",
        };
      case "failed":
        return {
          icon: (
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          ),
          title: "Payment Failed",
          description: error || "Something went wrong with your payment.",
          color: "text-red-400",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center space-y-4 py-6"
    >
      <div className="flex justify-center">{config.icon}</div>

      <div>
        <h3 className={`font-bold text-lg ${config.color}`}>{config.title}</h3>
        <p className="text-white/50 text-sm mt-1">{config.description}</p>
      </div>

      {(status === "pending" || status === "initiated") && (
        <div className="space-y-2">
          <p className="text-xs text-white/30">
            via {provider}
          </p>

          {/* Progress dots animation */}
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            ))}
          </div>

          {pollCount >= MAX_POLLS && (
            <p className="text-xs text-white/40 mt-4">
              Taking longer than expected. Check your phone for the payment prompt.
            </p>
          )}
        </div>
      )}

      {status === "failed" && (
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-gold-dark)] transition-colors"
        >
          Try again
        </button>
      )}
    </motion.div>
  );
}
