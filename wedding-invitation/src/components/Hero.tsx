"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const groom = process.env.NEXT_PUBLIC_GROOM_NAME || "Groom";
const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || "Bride";
const dateISO = process.env.NEXT_PUBLIC_WEDDING_DATE || "2026-11-10T19:00:00+02:00";

const weddingDate = new Date(dateISO).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const photoVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, delay: 0.2 + i * 0.2, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ArchPhoto({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={photoVariants}
      className="relative w-[38vw] max-w-[190px] aspect-[3/4] rounded-t-[100px] overflow-hidden
                 border border-gold/40 shadow-[0_18px_40px_-18px_rgba(47,59,46,0.35)]"
    >
      <Image src={src} alt={alt} fill sizes="190px" className="object-cover" priority />
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-6 text-sm tracking-wide text-sage font-body"
      >
        Together with their families
      </motion.p>

      <div className="flex items-end justify-center gap-4">
        <ArchPhoto src="/images/groom.jpg" alt={groom} index={0} />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-8 font-display text-3xl text-gold"
        >
          &amp;
        </motion.span>
        <ArchPhoto src="/images/bride.jpg" alt={bride} index={1} />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 font-display text-5xl sm:text-6xl leading-tight text-ink"
      >
        {groom} <span className="text-gold">&amp;</span> {bride}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="mt-4 max-w-prose text-base sm:text-lg text-ink/80 font-light"
      >
        We are getting married, and we would be so happy to have you with us
        as we begin this new chapter, hand in hand.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="mt-6 font-display text-2xl text-sage"
      >
        {weddingDate}
      </motion.p>

      <motion.a
        href="#details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="mt-12 text-sm tracking-wide text-ink/60 hover:text-sage transition-colors"
      >
        Scroll to see the details ↓
      </motion.a>
    </section>
  );
}
