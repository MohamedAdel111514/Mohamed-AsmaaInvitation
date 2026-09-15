import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
// The stylesheet is handled by Next.js at build time; suppress editor resolution
// errors when CSS type declarations are not available in the current environment.
// @ts-expect-error CSS side-effect imports are supported by Next.js.
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const groom = process.env.NEXT_PUBLIC_GROOM_NAME || "Groom";
const bride = process.env.NEXT_PUBLIC_BRIDE_NAME || "Bride";

export const metadata: Metadata = {
  title: `${groom} & ${bride} — Wedding Invitation`,
  description: `Join us as we celebrate the wedding of ${groom} and ${bride}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body bg-ivory text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
