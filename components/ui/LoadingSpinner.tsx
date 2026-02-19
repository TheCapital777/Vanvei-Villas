"use client";

export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-[var(--color-gold)]/30 border-t-[var(--color-gold)] animate-spin`}
      style={{ animationDuration: "0.8s", animationTimingFunction: "linear" }}
    />
  );
}
