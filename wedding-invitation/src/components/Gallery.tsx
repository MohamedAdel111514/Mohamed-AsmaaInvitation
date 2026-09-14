"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SectionReveal from "./SectionReveal";

const photos = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24">
      <SectionReveal className="text-center">
        <p className="font-display text-sm tracking-wide text-sage mb-2">Moments</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-12">Our Gallery</h2>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:gap-4">
          {photos.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
            >
              <Image
                src={src}
                alt={`Wedding photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 45vw, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
            </button>
          ))}
        </div>
      </SectionReveal>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            onClick={() => setActiveIndex(null)}
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute right-5 top-5 text-2xl text-ivory/80 hover:text-ivory"
              aria-label="Close gallery"
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative h-[70vh] w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[activeIndex]}
                alt={`Wedding photo ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-3xl text-ivory/70 hover:text-ivory"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((activeIndex + 1) % photos.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl text-ivory/70 hover:text-ivory"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
