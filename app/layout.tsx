import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";
export const metadata: Metadata = {
  title: site.title, description: site.description,
  robots: { index: false, follow: false }, // Prototype; enable at approved launch.
  openGraph: { title: site.title, description: site.description, type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
