"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface CounterNumberProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  label: string;
}

export default function CounterNumber({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2500,
  label,
}: CounterNumberProps) {
  const { value, ref } = useCountUp(end, duration, decimals);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-black text-white mb-2">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="text-white/50 text-sm">{label}</p>
    </div>
  );
}
