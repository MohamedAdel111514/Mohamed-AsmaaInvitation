import SectionReveal from "./SectionReveal";

const venue = process.env.NEXT_PUBLIC_VENUE_NAME || "Sea Rena Hall";
const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "#";

export default function LocationSection() {
  return (
    <section className="px-6 py-24 text-center">
      <SectionReveal>
        <p className="font-display text-sm tracking-wide text-sage mb-2">Getting there</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-6">{venue}</h2>
        <p className="mx-auto max-w-prose text-ink/70 mb-8">
          Tap below to open the venue in Google Maps and plan your journey ahead of time.
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-ivory transition-colors hover:bg-sage"
        >
          Open in Google Maps
        </a>
      </SectionReveal>
    </section>
  );
}
