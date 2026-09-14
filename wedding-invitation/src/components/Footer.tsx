import SectionReveal from "./SectionReveal";

const groom = process.env.NEXT_PUBLIC_GROOM_NAME || "Groom";
const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || "Bride";
const dateISO = process.env.NEXT_PUBLIC_WEDDING_DATE || "2026-11-10T19:00:00+02:00";
const weddingDate = new Date(dateISO).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Footer() {
  return (
    <footer className="px-6 py-20 text-center bg-ink text-ivory">
      <SectionReveal>
        <p className="mx-auto max-w-prose font-display text-2xl leading-relaxed">
          Your presence would mean the world to us, on the day our story becomes one.
        </p>
        <p className="mt-8 font-display text-xl text-gold">
          {groom} &amp; {bride}
        </p>
        <p className="mt-1 text-sm text-ivory/60">{weddingDate}</p>
      </SectionReveal>
    </footer>
  );
}
