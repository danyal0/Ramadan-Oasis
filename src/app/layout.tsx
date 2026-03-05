import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const serifDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif-display",
  weight: ["400", "500", "600"],
});

const sansHumanist = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans-humanist",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "OumNur | Antonia Alberte",
  description:
    "A calm, high-fidelity advisory space for relational intelligence, spiritual reflection, and conscious action.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serifDisplay.variable} ${sansHumanist.variable}`}>{children}</body>
    </html>
  );
}
