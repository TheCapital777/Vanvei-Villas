"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { LUXURY_EASE } from "@/hooks/animationConfig";
import { signIn, signUp } from "@/actions/auth";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = "login",
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setError("");
    setSuccess("");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  const switchTab = (newTab: "login" | "signup") => {
    setTab(newTab);
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signIn({ email, password });

    if (result.success) {
      resetForm();
      onSuccess?.();
      onClose();
    } else {
      setError(result.error || "Login failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signUp({ fullName, email, password });

    if (result.success) {
      setSuccess("Account created! Check your email to verify, then sign in.");
      setTimeout(() => {
        switchTab("login");
      }, 3000);
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Tab Switcher */}
      <div className="flex mb-6 bg-white/5 rounded-xl p-1">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              tab === t
                ? "bg-[var(--color-gold)] text-black"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {t === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      {/* Error / Success messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: LUXURY_EASE }}
          className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: LUXURY_EASE }}
          className="mb-4 p-3 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm"
        >
          {success}
        </motion.div>
      )}

      {/* Login Form */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              minLength={6}
              className={inputClasses}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-elegant w-full border border-[var(--color-gold)] text-[var(--color-gold)] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      )}

      {/* Signup Form */}
      {tab === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              minLength={6}
              className={inputClasses}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-elegant w-full border border-[var(--color-gold)] text-[var(--color-gold)] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}
