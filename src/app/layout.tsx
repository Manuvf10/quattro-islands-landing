import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans, Cormorant_Garamond, Allura } from "next/font/google";

const body = Open_Sans({
  subsets: ["latin"],
  variable: "--ff-body",
  weight: ["400", "600", "700"],
  display: "swap",
});
const head = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--ff-head",
  weight: ["600", "700"],
  display: "swap",
});
const script = Allura({
  subsets: ["latin"],
  variable: "--ff-script",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quattro Islands · La Font (Alicante)",
  description:
    "Cuatro villas con piscina privada en La Font, Campello (Alicante). Diseño mediterráneo y calidades premium.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${body.variable} ${head.variable} ${script.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
