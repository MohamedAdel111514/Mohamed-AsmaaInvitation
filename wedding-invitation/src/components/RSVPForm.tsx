"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "./SectionReveal";

const EG_PHONE_REGEX = /^(?:\+20|0020|0)?1[0125]\d{8}$/;

type Status = "idle" | "submitting" | "success" | "error";

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState("");

  function validate(): boolean {
    const errors: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) {
      errors.name = "Please enter your full name.";
    }
    const cleanedPhone = phone.replace(/[\s()-]/g, "");
    if (!EG_PHONE_REGEX.test(cleanedPhone)) {
      errors.phone = "Please enter a valid Egyptian phone number (e.g. 010XXXXXXXX).";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setConfirmedName(data.guest?.name || name.trim());
      setStatus("success");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section id="rsvp" className="px-6 py-24 bg-cream/60">
      <SectionReveal className="text-center">
        <p className="font-display text-sm tracking-wide text-sage mb-2">RSVP</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-4">
          Kindly Confirm Your Attendance
        </h2>
        <p className="mx-auto max-w-prose text-ink/70 mb-10">
          We would love to know you&rsquo;re coming — it only takes a moment.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="mx-auto max-w-md">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-sage/30 bg-ivory p-8 text-center shadow-sm"
              >
                <p className="font-display text-2xl text-ink mb-2">
                  Thank you, {confirmedName}!
                </p>
                <p className="text-ink/70">
                  Your attendance has been confirmed. We can&rsquo;t wait to celebrate with you.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-sage/20 bg-ivory p-6 sm:p-8 shadow-sm text-left"
              >
                <div className="mb-5">
                  <label htmlFor="name" className="mb-1.5 block text-sm text-ink/70">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmed Mohamed"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-sage"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  />
                  {fieldErrors.name && (
                    <p id="name-error" className="mt-1.5 text-sm text-red-600">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="mb-1.5 block text-sm text-ink/70">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-sage"
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  />
                  {fieldErrors.phone && (
                    <p id="phone-error" className="mt-1.5 text-sm text-red-600">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-full bg-sage px-6 py-3.5 text-ivory transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Confirming…" : "Confirm Attendance"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </SectionReveal>
    </section>
  );
}
