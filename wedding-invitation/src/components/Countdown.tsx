"use client";

import { useEffect, useState } from "react";
import SectionReveal from "./SectionReveal";

const dateISO = process.env.NEXT_PUBLIC_WEDDING_DATE || "2026-11-10T19:00:00+02:00";

function getTimeLeft() {
  const diff = new Date(dateISO).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = timeLeft
    ? [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ]
    : [];

  return (
    <section className="px-6 py-24 text-center bg-cream/60">
      <SectionReveal>
        <p className="font-display text-sm tracking-wide text-sage mb-2">Counting down</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-12">
          Until We Say &ldquo;I Do&rdquo;
        </h2>
      </SectionReveal>

      {!mounted ? (
        <div className="h-24" aria-hidden />
      ) : timeLeft ? (
        <SectionReveal delay={0.1}>
          <div className="mx-auto flex max-w-md justify-center gap-4 sm:gap-8">
            {units.map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <span className="font-display text-4xl sm:text-5xl text-gold tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="mt-2 text-xs sm:text-sm text-ink/60">{unit.label}</span>
              </div>
            ))}
          </div>
        </SectionReveal>
      ) : (
        <SectionReveal delay={0.1}>
          <p className="font-display text-2xl text-sage">
            Today is the day — see you at the celebration! 🎉
          </p>
        </SectionReveal>
      )}
    </section>
  );
}
