import SectionReveal from "./SectionReveal";

const dateISO = process.env.NEXT_PUBLIC_WEDDING_DATE || "2026-11-10T19:00:00+02:00";
const venue = process.env.NEXT_PUBLIC_VENUE_NAME || "Sea Star Hall";
const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "#";

const dateObj = new Date(dateISO);
const weddingDate = dateObj.toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const weddingTime = dateObj.toLocaleTimeString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 21s7-6.7 7-12a7 7 0 1 0-14 0c0 5.3 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

export default function WeddingDetails() {
  return (
    <section id="details" className="px-6 py-24 text-center">
      <SectionReveal>
        <p className="font-display text-sm tracking-wide text-sage mb-2">Save the date</p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-14">The Wedding Day</h2>
      </SectionReveal>

      <div className="mx-auto grid max-w-prose gap-10 sm:grid-cols-2">
        <SectionReveal delay={0.1}>
          <div className="flex flex-col items-center gap-3 text-ink">
            <span className="text-gold"><CalendarIcon /></span>
            <p className="font-display text-xl">{weddingDate}</p>
            <p className="text-sm text-ink/60">Starting at {weddingTime}</p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="flex flex-col items-center gap-3 text-ink">
            <span className="text-gold"><PinIcon /></span>
            <p className="font-display text-xl">{venue}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block rounded-full border border-sage px-6 py-2 text-sm text-sage transition-colors hover:bg-sage hover:text-ivory"
            >
              View Location
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
