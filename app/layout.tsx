import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import fs from "node:fs";
import path from "node:path";
import { sitio } from "@/contenido/sitio";
import { BASE_PATH } from "@/lib/obras";
import "./globals.css";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap", weight: ["500", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const tieneOg = fs.existsSync(path.join(process.cwd(), "public", "og.jpg"));

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: `${sitio.nombre} — Ilustrador digital`,
  description: sitio.descripcion,
  alternates: { canonical: `${BASE_PATH}/` },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: sitio.nombre,
    title: `${sitio.nombre} — Ilustrador digital`,
    description: sitio.descripcion,
    url: `${BASE_PATH}/`,
    images: tieneOg ? [{ url: `${BASE_PATH}/og.jpg`, width: 1200, height: 630, alt: sitio.nombre }] : undefined,
  },
  twitter: { card: "summary_large_image", title: `${sitio.nombre} — Ilustrador digital`, description: sitio.descripcion },
};

export const viewport: Viewport = { themeColor: "#0A0C10", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${space.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
