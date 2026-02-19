"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { signUp } from "@/actions/auth";
import { fadeUpVariant } from "@/hooks/animationConfig";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signUp({ fullName, email, password });

    if (result.success) {
      setSuccess("Account created! Check your email to verify your account.");
      setTimeout(() => router.push("/auth/login"), 3000);
    } else {
      setError(result.error || "Signup failed");
    }
    setIsSubmitting(false);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-transparent transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-white/50">Join Vanvei Villas for the best booking experience</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} className={inputClasses} />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-elegant w-full border border-[var(--color-gold)] text-[var(--color-gold)] font-bold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? <LoadingSpinner size="sm" /> : <span>Create Account</span>}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--color-gold)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-white/30 text-sm hover:text-white/50 transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
