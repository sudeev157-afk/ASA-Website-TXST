import type { Metadata } from "next";
import { Fraunces, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import MotionProvider from "./Components/MotionProvider";
import "./globals.css";

/* Three voices, self-hosted at build time by next/font — no third-party
   request, no layout shift, and it works under `output: "export"`. */

/* Display. WONK gives the angled terminals that carry the personality;
   opsz keeps it sharp rather than merely heavier as it scales up. */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

/* Body and UI. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

/* Data, eyebrows and every figure — tabular numerals, and it names the
   subject without needing an icon. Not a variable font, so weights are
   listed explicitly. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "ASA - Association for Statistics and Analytics | Texas State University",
  description:
    "The Association for Statistics and Analytics at Texas State University. A student organization for anyone interested in statistics, analytics, research, and working with data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${plexMono.variable}`}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
