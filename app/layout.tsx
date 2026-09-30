import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";
const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body-loaded", display: "swap" });
const displayFont = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display-loaded", display: "swap" });

export const metadata: Metadata = {
  title: site.title, description: site.description,
  robots: { index: false, follow: false }, // Prototype; enable at approved launch.
  openGraph: { title: site.title, description: site.description, type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
